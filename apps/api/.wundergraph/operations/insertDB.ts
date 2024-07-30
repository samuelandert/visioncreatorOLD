import { createOperation, z } from '../generated/wundergraph.factory';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

const propertySchema = {
    type: "object",
    properties: {
        type: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        minimum: { type: "number" },
        maximum: { type: "number" },
        pattern: { type: "string" },
        properties: { $ref: "#/definitions/properties" }
    },
    required: ["type", "title", "description"],
    additionalProperties: false
};

const metaSchema = {
    "$id": "https://alpha.ipfs.homin.io/QmXyYRsduQgtVyDdU1pBv7YPw1uphRACMp6YdEueaTaPLs",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "Meta Schema",
    "description": "A schema for defining other schemas",
    "definitions": {
        "properties": {
            "type": "object",
            "additionalProperties": propertySchema
        }
    },
    "properties": {
        "$id": {
            "type": "string",
            "format": "uri",
            "description": "The unique identifier for this schema"
        },
        "$schema": {
            "type": "string",
            "format": "uri",
            "description": "The JSON Schema version being used"
        },
        "author": {
            "type": "string",
            "description": "The author of the schema"
        },
        "prev": {
            "type": ["string", "null"],
            "format": "uri",
            "description": "The previous version of this schema, if any"
        },
        "version": {
            "type": "integer",
            "minimum": 0,
            "description": "The version number of this schema"
        },
        "title": {
            "type": "string",
            "description": "The title of the schema"
        },
        "description": {
            "type": "string",
            "description": "A description of the schema"
        },
        "properties": { "$ref": "#/definitions/properties" }
    },
    "required": ["$schema", "$id", "prev", "author", "version", "title", "description", "properties"],
    "additionalProperties": false
};

function generateRandomObject() {
    return {
        $schema: "http://json-schema.org/draft-07/schema#",
        author: "HominioAlpha",
        prev: null,
        version: 0,
        title: `Schema${Math.floor(Math.random() * 10000)}`,
        description: `Random schema ${Math.random()}`,
        properties: {
            randomInteger: {
                type: "integer",
                title: "Random Integer",
                description: "A randomly generated integer",
                minimum: 0,
                maximum: 99
            },
            randomBoolean: {
                type: "boolean",
                title: "Random Boolean",
                description: "A randomly generated boolean value"
            },
            randomString: {
                type: "string",
                title: "Random String",
                description: "A randomly generated string",
                pattern: "^RandomString[0-9]{1,3}$"
            },
            nestedObject: {
                type: "object",
                title: "Nested Object",
                description: "A nested object example",
                properties: {
                    nestedProperty: {
                        type: "string",
                        title: "Nested Property",
                        description: "A property inside the nested object"
                    }
                }
            }
        }
    };
}

export default createOperation.mutation({
    input: z.object({}),
    handler: async ({ input, context, operations }) => {
        try {
            const randomObject = generateRandomObject();

            const calcCIDResult = await operations.mutate({
                operationName: 'calculateCID',
                input: { json: randomObject },
            });

            if (!calcCIDResult.data?.success) {
                return {
                    success: false,
                    error: 'Failed to calculate CID',
                    details: calcCIDResult.data?.error || 'Unknown error'
                };
            }

            const objectWithId = calcCIDResult.data.json;

            const validate = ajv.compile(metaSchema);
            const valid = validate(objectWithId);

            if (!valid) {
                return {
                    success: false,
                    error: 'Validation error',
                    details: ajv.errorsText(validate.errors),
                    generatedObject: objectWithId
                };
            }

            const { data, error } = await context.supabase
                .from('db')
                .insert({ json: objectWithId })
                .select();

            if (error) {
                return {
                    success: false,
                    error: 'Database insert error',
                    details: error.message
                };
            }

            return {
                success: true,
                insertedData: data[0]
            };
        } catch (error) {
            console.error('Unexpected error in insertDB:', error);
            return {
                success: false,
                error: 'Unexpected error',
                details: error.message
            };
        }
    },
});
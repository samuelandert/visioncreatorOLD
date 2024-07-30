import { createOperation, z } from '../generated/wundergraph.factory';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

const metaSchema = {
    "$id": "https://alpha.ipfs.homin.io/QmXyYRsduQgtVyDdU1pBv7YPw1uphRACMp6YdEueaTaPLs",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "Meta Schema",
    "description": "A schema for defining other schemas",
    "definitions": {
        "properties": {
            "type": "object",
            "additionalProperties": {
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
            }
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

async function insertSchema(context, operations, schema, isMetaSchema = false) {
    const calcCIDResult = await operations.mutate({
        operationName: 'calculateCID',
        input: { json: schema },
    });

    if (!calcCIDResult.data?.success) {
        throw new Error('Failed to calculate CID: ' + (calcCIDResult.data?.error || 'Unknown error'));
    }

    const schemaWithId = calcCIDResult.data.json;

    if (!isMetaSchema) {
        const validate = ajv.compile(metaSchema);
        const valid = validate(schemaWithId);

        if (!valid) {
            throw new Error('Validation error: ' + ajv.errorsText(validate.errors));
        }
    } else {
        // For metaSchema, we'll just validate it as a valid JSON Schema
        try {
            ajv.compile(schemaWithId);
        } catch (error) {
            throw new Error('Invalid JSON Schema: ' + error.message);
        }
    }

    const { data, error } = await context.supabase
        .from('db')
        .insert({ json: schemaWithId })
        .select();

    if (error) {
        throw new Error('Database insert error: ' + error.message);
    }

    return data[0];
}

export default createOperation.mutation({
    input: z.object({}),
    handler: async ({ input, context, operations }) => {
        try {
            // Check if the database is empty
            const { count, error: countError } = await context.supabase
                .from('db')
                .select('*', { count: 'exact', head: true });

            if (countError) {
                throw new Error('Failed to check database: ' + countError.message);
            }

            let insertedData;

            if (count === 0) {
                // If the database is empty, insert the metaSchema
                insertedData = await insertSchema(context, operations, metaSchema, true);
            } else {
                // Otherwise, insert a random schema
                const randomObject = generateRandomObject();
                insertedData = await insertSchema(context, operations, randomObject);
            }

            return {
                success: true,
                insertedData
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
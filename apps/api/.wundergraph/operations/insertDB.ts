import { createOperation, z } from '../generated/wundergraph.factory';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

const metaSchema = {
    "$id": "https://alpha.ipfs.homin.io/QmXyYRsduQgtVyDdU1pBv7YPw1uphRACMp6YdEueaTaPLs",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "$id": { "type": "string", "format": "uri" },
        "$schema": { "type": "string", "format": "uri" },
        "author": { "type": "string" },
        "prev": { "type": ["string", "null"], "format": "uri" },
        "version": { "type": "integer" },
        "title": { "type": "string" },
        "description": { "type": "string" }
    },
    "required": ["$schema", "$id", "prev", "author", "version", "title", "description"],
    "additionalProperties": false
};

function generateRandomObject() {
    return {
        $schema: "http://json-schema.org/draft-07/schema#",
        author: "HominioAlpha",
        prev: null,
        version: 0,
        title: `Schema${Math.floor(Math.random() * 10000)}`,
        description: `Random schema ${Math.random()}`
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
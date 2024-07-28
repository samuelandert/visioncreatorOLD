import { createOperation, z } from '../generated/wundergraph.factory';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
ajv.addKeyword('x-schema-metadata');
addFormats(ajv);

const defaultSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "required": ["uuid", "timestamp", "name"],
    "properties": {
        "uuid": { "type": "string", "format": "uuid" },
        "$schema": { "type": "string" },
        "age": { "type": "integer", "maximum": 120, "minimum": 18 },
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "timestamp": { "type": "string", "format": "date-time" }
    },
    "additionalProperties": false,
    "x-schema-metadata": {
        "author": "0x000000000000000000000000000000000000001",
        "name": "User",
        "version": "1"
    }
}

const schemaUri = `${defaultSchema['x-schema-metadata'].author}/${defaultSchema['x-schema-metadata'].version}/${defaultSchema['x-schema-metadata'].name}`;

function generateRandomJson() {
    const baseJson: any = {
        $schema: schemaUri,
        uuid: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        name: `User${Math.floor(Math.random() * 100)}`,
        age: Math.floor(Math.random() * (120 - 18 + 1)) + 18,
        email: `user${Math.floor(Math.random() * 100)}@example.com`
    };

    // Sort the properties to ensure $schema and uuid are at the top
    return Object.keys(baseJson)
        .sort((a, b) => {
            if (a === '$schema') return -1;
            if (b === '$schema') return 1;
            if (a === 'uuid') return -1;
            if (b === 'uuid') return 1;
            return 0;
        })
        .reduce((obj, key) => {
            obj[key] = baseJson[key];
            return obj;
        }, {} as any);
}

export default createOperation.mutation({
    handler: async ({ context }) => {
        try {
            const randomJson = generateRandomJson();

            // Log the generated JSON object
            console.log('Generated JSON object:', JSON.stringify(randomJson, null, 2));

            // Validate the generated JSON against the default schema
            const validate = ajv.compile(defaultSchema);
            const valid = validate(randomJson);

            if (!valid) {
                return {
                    success: false,
                    error: 'Validation error',
                    details: ajv.errorsText(validate.errors),
                    generatedJson: randomJson
                };
            }

            // If validation passes, insert the data
            const { data, error } = await context.supabase
                .from('db')
                .insert({ json: randomJson })
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
            return {
                success: false,
                error: 'Unexpected error',
                details: error.message
            };
        }
    },
});
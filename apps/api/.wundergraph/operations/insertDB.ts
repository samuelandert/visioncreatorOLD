import { createOperation, z } from '../generated/wundergraph.factory';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
ajv.addKeyword('x-schema-metadata');
addFormats(ajv);

const schemas = [
    {
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
    },
    {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "required": ["uuid", "timestamp", "name", "price"],
        "properties": {
            "uuid": { "type": "string", "format": "uuid" },
            "$schema": { "type": "string" },
            "name": { "type": "string" },
            "price": { "type": "number", "minimum": 0 },
            "category": { "type": "string" },
            "inStock": { "type": "boolean" },
            "timestamp": { "type": "string", "format": "date-time" }
        },
        "additionalProperties": false,
        "x-schema-metadata": {
            "author": "0x000000000000000000000000000000000000001",
            "name": "Product",
            "version": "1"
        }
    },
    {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "required": ["uuid", "timestamp", "orderNumber", "totalAmount"],
        "properties": {
            "uuid": { "type": "string", "format": "uuid" },
            "$schema": { "type": "string" },
            "orderNumber": { "type": "string" },
            "totalAmount": { "type": "number", "minimum": 0 },
            "customerName": { "type": "string" },
            "items": { "type": "integer", "minimum": 1 },
            "timestamp": { "type": "string", "format": "date-time" }
        },
        "additionalProperties": false,
        "x-schema-metadata": {
            "author": "0x000000000000000000000000000000000000001",
            "name": "Order",
            "version": "1"
        }
    }
];
function generateRandomJson(forceValid = true) {
    const schema = schemas[Math.floor(Math.random() * schemas.length)];
    const { author, version, name } = schema['x-schema-metadata'];
    const schemaUri = `${author}/${version}/${name}`;

    const baseJson: any = {
        $schema: schemaUri,
        uuid: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
    };

    switch (name) {
        case 'User':
            baseJson.name = `User${Math.floor(Math.random() * 1000)}`;
            baseJson.age = Math.floor(Math.random() * (120 - 18 + 1)) + 18;
            baseJson.email = `user${Math.floor(Math.random() * 1000)}@example.com`;
            break;
        case 'Product':
            baseJson.name = `Product${Math.floor(Math.random() * 1000)}`;
            baseJson.price = +(Math.random() * 1000).toFixed(2);
            baseJson.category = ['Electronics', 'Clothing', 'Food', 'Books'][Math.floor(Math.random() * 4)];
            baseJson.inStock = Math.random() > 0.5;
            break;
        case 'Order':
            baseJson.orderNumber = `ORD-${Math.floor(Math.random() * 10000)}`;
            baseJson.totalAmount = +(Math.random() * 5000).toFixed(2);
            baseJson.customerName = `Customer${Math.floor(Math.random() * 1000)}`;
            baseJson.items = Math.floor(Math.random() * 10) + 1;
            break;
    }

    if (!forceValid && Math.random() < 0.5) { // Increased chance of invalid object
        // 50% chance to generate an invalid object when forceValid is false
        const invalidOptions = [
            () => { delete baseJson.uuid; },
            () => { baseJson.timestamp = "invalid-date"; },
            () => { baseJson.additionalProperty = "This should not be here"; },
            () => {
                if (name === 'User') {
                    baseJson.age = Math.random() > 0.5 ? 17 : 121;
                } else if (name === 'Product') {
                    baseJson.price = -1;
                } else if (name === 'Order') {
                    baseJson.totalAmount = -1;
                }
            },
        ];
        invalidOptions[Math.floor(Math.random() * invalidOptions.length)]();
    }

    // Sort to ensure $schema and uuid are at the top
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
            const randomJson = generateRandomJson(Math.random() > 0.5);

            // Log the generated JSON object
            console.log('Generated JSON object:', JSON.stringify(randomJson, null, 2));

            // Find the corresponding schema using the custom URI
            const [author, version, name] = randomJson.$schema.split('/');
            const schema = schemas.find(s =>
                s['x-schema-metadata'].author === author &&
                s['x-schema-metadata'].version === version &&
                s['x-schema-metadata'].name === name
            );

            if (!schema) {
                return {
                    success: false,
                    error: 'Schema not found',
                    details: `No schema found for URI: ${randomJson.$schema}`,
                    generatedJson: randomJson
                };
            }

            // Validate the generated JSON against the corresponding schema
            const validate = ajv.compile(schema);
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
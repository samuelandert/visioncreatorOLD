import { createOperation, z } from '../generated/wundergraph.factory';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
ajv.addKeyword('oContext');
addFormats(ajv);

function generateRandomJson(schemas, forceValid = true) {
    const schema = schemas[Math.floor(Math.random() * schemas.length)].json;
    const { author, version, name } = schema.oContext;
    const schemaUri = `${author}/${version}/${name}`;

    const baseJson: any = {
        $schema: schemaUri,
        timestamp: new Date().toISOString()
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
    if (!forceValid && Math.random() < 0.5) {
        const invalidOptions = [
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

    return Object.keys(baseJson)
        .sort((a, b) => {
            if (a === '$schema') return -1;
            if (b === '$schema') return 1;
            return 0;
        })
        .reduce((obj, key) => {
            obj[key] = baseJson[key];
            return obj;
        }, {} as any);
}

export default createOperation.mutation({
    handler: async ({ context, operations }) => {
        try {
            const randomSchemaType = ['User', 'Product', 'Order'][Math.floor(Math.random() * 3)];

            const { data: schemasData, error: schemasError } = await operations.query({
                operationName: 'querySchemas',
                input: { name: randomSchemaType },
            });

            if (schemasError) {
                console.error('Error fetching schemas:', schemasError);
                throw new Error(`Failed to fetch schemas: ${schemasError.message}`);
            }

            const fetchedSchemas = schemasData.schemas;

            if (!fetchedSchemas || fetchedSchemas.length === 0) {
                throw new Error('No schemas available');
            }

            const randomJson = generateRandomJson(fetchedSchemas, Math.random() > 0.5);

            const [author, version, name] = randomJson.$schema.split('/');
            const schema = fetchedSchemas.find(s =>
                s.json.oContext.author === author &&
                s.json.oContext.version === version &&
                s.json.oContext.name === name
            );


            if (!schema) {
                return {
                    success: false,
                    error: 'Schema not found',
                    details: `No schema found for URI: ${randomJson.$schema}`,
                    generatedJson: randomJson
                };
            }

            const validate = ajv.compile(schema.json);
            const valid = validate(randomJson);

            if (!valid) {
                return {
                    success: false,
                    error: 'Validation error',
                    details: ajv.errorsText(validate.errors),
                    generatedJson: randomJson
                };
            }

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
            console.error('Unexpected error in insertDB:', error);
            return {
                success: false,
                error: 'Unexpected error',
                details: error.message
            };
        }
    },
});
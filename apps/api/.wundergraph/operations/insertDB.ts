import { createOperation, z } from '../generated/wundergraph.factory';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
ajv.addKeyword('oContext');
addFormats(ajv);

function generateRandomJson(schema, cid) {
    const { author, version, name } = schema.oContext;
    const schemaUri = `${author}/${name}/${version}/${cid}`;

    const baseJson: any = {
        $schema: schemaUri,
        oContext: {
            author: schema.oContext.author,
            version: 1,
            prev: null,
            timestamp: new Date().toISOString(),
        }
    };

    Object.entries(schema.properties).forEach(([key, value]: [string, any]) => {
        if (key !== 'oContext' && key !== '$schema' && key !== 'timestamp') {
            if (value.enum) {
                baseJson[key] = value.enum[Math.floor(Math.random() * value.enum.length)];
            } else {
                switch (value.type) {
                    case 'integer':
                        baseJson[key] = Math.floor(Math.random() * 100);
                        break;
                    case 'number':
                        baseJson[key] = Math.random() * 100;
                        break;
                    case 'boolean':
                        baseJson[key] = Math.random() > 0.5;
                        break;
                    case 'string':
                        if (value.pattern) {
                            baseJson[key] = generatePatternString(value.pattern);
                        } else if (value.format === 'email') {
                            baseJson[key] = `user${Math.floor(Math.random() * 1000)}@example.com`;
                        } else {
                            baseJson[key] = `${key}-${Math.random()}`;
                        }
                        break;
                    default:
                        baseJson[key] = `${key}-${Math.random()}`;
                }
            }
        }
    });

    console.log('Generated JSON:', baseJson);
    return baseJson;
}

function generatePatternString(pattern) {
    if (pattern === '^ORD-\\d{1,5}$') {
        return `ORD-${Math.floor(Math.random() * 99999 + 1).toString().padStart(5, '0')}`;
    }
    // Add more pattern handling as needed
    return `pattern-${Math.random()}`;
} export default createOperation.mutation({
    input: z.object({
        schema: z.any(),
        cid: z.string()
    }),
    handler: async ({ input, context, operations }) => {
        try {
            const { schema, cid } = input;

            // Fetch the schema based on the CID
            const { data: schemaData, error: schemaError } = await context.supabase
                .from('schemas')
                .select('json')
                .eq('cid', cid)
                .single();

            if (schemaError) {
                return {
                    success: false,
                    error: `Failed to fetch schema: ${schemaError.message}`,
                };
            }

            const fetchedSchema = schemaData.json;

            const randomJson = generateRandomJson(fetchedSchema, cid);


            const calcCIDResult = await operations.mutate({
                operationName: 'calculateCID',
                input: {
                    json: randomJson
                },
            });

            if (!calcCIDResult.data?.success) {
                return {
                    success: false,
                    error: 'Failed to calculate CID',
                    details: calcCIDResult.data?.error || 'Unknown error'
                };
            }

            const jsonWithId = calcCIDResult.data.json;

            const validate = ajv.compile(fetchedSchema);
            const valid = validate(jsonWithId);

            if (!valid) {
                return {
                    success: false,
                    error: 'Validation error',
                    details: ajv.errorsText(validate.errors),
                    generatedJson: jsonWithId
                };
            }

            const { data, error } = await context.supabase
                .from('db')
                .insert({ json: jsonWithId })
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
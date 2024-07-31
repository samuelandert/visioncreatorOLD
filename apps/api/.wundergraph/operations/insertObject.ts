import { createOperation, z } from '../generated/wundergraph.factory';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
    schemaId: '$id',
    strict: false,
    validateSchema: false,
    addUsedSchema: false
});
addFormats(ajv);

export default createOperation.mutation({
    input: z.object({
        object: z.any()
    }),
    handler: async ({ input, context, operations }) => {
        try {
            console.log('Step 1: Received input object:', JSON.stringify(input.object, null, 2));

            if (!input.object.$schema) {
                throw new Error('Object must have a $schema property');
            }
            console.log('Step 2: Validated $schema property exists:', input.object.$schema);

            // Fetch the schema
            console.log('Step 3: Fetching schema from database...');
            const { data: schemaData, error: schemaError } = await context.supabase
                .from('db')
                .select('json')
                .eq('json->>$id', input.object.$schema)
                .single();

            if (schemaError) {
                throw new Error('Failed to fetch schema: ' + schemaError.message);
            }
            console.log('Step 4: Schema fetched successfully:', JSON.stringify(schemaData.json, null, 2));

            const schema = schemaData.json;

            // Calculate CID for the object
            console.log('Step 5: Calculating CID for the object...');
            const calcCIDResult = await operations.mutate({
                operationName: 'calculateCID',
                input: { json: input.object },
            });

            if (!calcCIDResult.data?.success) {
                throw new Error('Failed to calculate CID: ' + (calcCIDResult.data?.error || 'Unknown error'));
            }
            console.log('Step 6: CID calculated successfully:', calcCIDResult.data.json.$id);

            const objectWithId = {
                ...calcCIDResult.data.json,
                $id: calcCIDResult.data.json.$id,
                $schema: input.object.$schema
            };
            console.log('Step 7: Created object with ID:', JSON.stringify(objectWithId, null, 2));

            // Validate the object against the schema
            console.log('Step 8: Validating object against schema...');
            const validate = ajv.compile(schema);
            const valid = validate(objectWithId);

            if (!valid) {
                console.error('Validation errors:', ajv.errorsText(validate.errors));
                throw new Error('Validation error: ' + ajv.errorsText(validate.errors));
            }
            console.log('Step 9: Object validated successfully against schema');

            // Insert the object into the database
            console.log('Step 10: Inserting object into database...');
            const { data, error } = await context.supabase
                .from('db')
                .insert({ json: objectWithId })
                .select();

            if (error) {
                throw new Error('Database insert error: ' + error.message);
            }
            console.log('Step 11: Object inserted successfully:', JSON.stringify(data[0], null, 2));

            return {
                success: true,
                insertedData: data[0]
            };
        } catch (error) {
            console.error('Unexpected error in insertObject:', error);
            return {
                success: false,
                error: 'Unexpected error',
                details: error.message
            };
        }
    },
});
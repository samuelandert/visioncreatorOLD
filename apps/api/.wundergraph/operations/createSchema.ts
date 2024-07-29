import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        schema: z.object({
            type: z.string(),
            $schema: z.string(),
            oContext: z.object({
                name: z.string(),
                prev: z.string().nullable(),
                author: z.string(),
                version: z.string(),
            }),
            required: z.array(z.string()),
            properties: z.record(z.any()),
            additionalProperties: z.boolean().optional(),
        }).passthrough(),
        update: z.string().optional(),
    }),
    handler: async ({ input, context }) => {
        const author = 'homin.io'; // Hardcoded author

        let newSchema = input.schema;
        let oContext = newSchema.oContext || {};

        if (input.update) {
            // Check if the referenced schema exists
            const { data: existingSchema } = await context.supabase
                .from('schemas')
                .select('json')
                .eq('cid', input.update.split('/')[3])
                .single();

            if (existingSchema) {
                const [updateAuthor, updateName, updateVersion] = input.update.split('/');
                oContext = {
                    ...oContext,
                    author,
                    name: updateName,
                    version: (parseInt(updateVersion) + 1).toString(),
                    prev: input.update,
                };
            } else {
                // If update reference is invalid, create a new schema
                oContext = {
                    ...oContext,
                    author,
                    name: oContext.name || 'Unnamed Schema',
                    version: '1',
                    prev: null,
                };
            }
        } else {
            // Create a new schema
            oContext = {
                ...oContext,
                author,
                name: oContext.name || 'Unnamed Schema',
                version: '1',
                prev: null,
            };
        }

        newSchema.oContext = oContext;

        // Ensure all required fields are present in the properties
        newSchema.required.forEach(field => {
            if (!newSchema.properties[field]) {
                newSchema.properties[field] = { type: 'string' }; // Default to string type
            }
        });

        const { data, error } = await context.supabase
            .from('schemas')
            .insert({ json: newSchema })
            .select();

        if (error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: true,
            insertedData: data,
        };
    },
});
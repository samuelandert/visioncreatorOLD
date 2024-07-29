import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.query({
    input: z.object({
        name: z.string().optional(),
        author: z.string().optional(),
        version: z.string().optional(),
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, context }) => {
        let query = context.supabase
            .from('schemas')
            .select('*')
            .order('created_at', { ascending: false });

        if (input.name) {
            query = query.contains('jsonschema', { oContext: { name: input.name } });
        }
        if (input.author) {
            query = query.contains('jsonschema', { oContext: { author: input.author } });
        }
        if (input.version) {
            query = query.contains('jsonschema', { oContext: { version: input.version } });
        }

        try {
            const { data, error } = await query;

            if (error) {
                console.error('Supabase error:', error);
                throw new Error(`Failed to fetch data from schemas: ${error.message}`);
            }

            const parsedData = data.map(schema => ({
                ...schema,
                jsonschema: typeof schema.jsonschema === 'string' ? JSON.parse(schema.jsonschema) : schema.jsonschema
            }));

            return { schemas: parsedData };
        } catch (error) {
            console.error('Error in querySchemas:', error);
            throw error;
        }
    },
});
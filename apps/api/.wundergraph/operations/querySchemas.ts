import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.query({
    input: z.object({
        name: z.string().optional(),
        author: z.string().optional(),
        version: z.string().optional(),
        cid: z.string().optional(),
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, context }) => {
        let query = context.supabase
            .from('schemas')
            .select('*')

        if (input.name) {
            query = query.contains('json', { oContext: { name: input.name } });
        }
        if (input.author) {
            query = query.contains('json', { oContext: { author: input.author } });
        }
        if (input.version) {
            query = query.contains('json', { oContext: { version: input.version } });
        }
        if (input.cid) {
            query = query.eq('cid', input.cid);
        }

        try {
            const { data, error } = await query;

            if (error) {
                console.error('Supabase error:', error);
                throw new Error(`Failed to fetch data from schemas: ${error.message}`);
            }

            const parsedData = data.map(schema => ({
                ...schema,
                json: typeof schema.json === 'string' ? JSON.parse(schema.json) : schema.json
            }));

            return { schemas: parsedData };
        } catch (error) {
            console.error('Error in querySchemas:', error);
            throw error;
        }
    },
});
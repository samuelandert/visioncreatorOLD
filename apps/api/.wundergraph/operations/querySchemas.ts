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

        if (input.name || input.author || input.version) {
            query = query.filter('jsonschema', 'jsonb', obj => {
                let filter = obj.cast('x-schema-metadata', 'jsonb');
                if (input.name) {
                    filter = filter.contains({ name: input.name });
                }
                if (input.author) {
                    filter = filter.contains({ author: input.author });
                }
                if (input.version) {
                    filter = filter.contains({ version: input.version });
                }
                return filter;
            });
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching data from schemas:', error);
            throw new Error('Failed to fetch data from schemas');
        }

        const parsedData = data.map(schema => ({
            ...schema,
            jsonschema: typeof schema.jsonschema === 'string' ? JSON.parse(schema.jsonschema) : schema.jsonschema
        }));

        return { schemas: parsedData };
    },
});
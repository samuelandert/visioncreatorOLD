import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.query({
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context }) => {
        const { data, error } = await context.supabase
            .from('schemas')
            .select('*')
            .order('created_at', { ascending: false });

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
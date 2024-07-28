import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.query({
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context }) => {
        const { data, error } = await context.supabase
            .from('db')
            .select('*');

        if (error) {
            console.error('Error fetching data from db:', error);
            throw new Error('Failed to fetch data from db');
        }

        const parsedData = data.map(item => ({
            ...item,
            json: typeof item.json === 'string' ? JSON.parse(item.json) : item.json
        }));

        return { db: parsedData };
    },
});
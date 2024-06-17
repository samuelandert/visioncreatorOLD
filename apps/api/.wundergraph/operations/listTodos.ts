import { createOperation } from '../generated/wundergraph.factory';

export default createOperation.query({
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated', 'admin'],
    },
    handler: async ({ context }) => {
        try {
            const response = await context.nango.proxy({
                method: 'GET',
                baseUrlOverride: 'https://coda.io/apis/v1',
                endpoint: '/docs/483UGKTHtC/tables/grid-TTCsTZy5zs/rows',
                connectionId: 'codavc',
                providerConfigKey: 'coda'
            });
            const todos = response.data;
            return todos;
        } catch (error) {
            console.error('Failed to fetch todos from Nango:', error);
            throw new Error('Failed to fetch todos');
        }
    },
});

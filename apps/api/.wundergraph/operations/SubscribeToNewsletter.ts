import { z, createOperation } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        email: z.string().email()
    }),
    handler: async ({ context, input }) => {
        console.log("----------------------------------------------------------------", input.email)
        try {
            const response = await context.nango.proxy({
                method: 'POST',
                endpoint: '/subscribers',
                connectionId: 'listmonk-vc',
                providerConfigKey: 'listmonk',
                data: {
                    "lists": [3],
                    "email": input.email
                }
            });
            console.log("--------------------", response.data.data)
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch subscribers from Nango:', error);
            throw new Error('Failed to fetch todos');
        }
    },
});
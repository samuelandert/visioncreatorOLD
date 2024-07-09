import { z, createOperation, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        id: z.string().uuid(),
        email: z.string().email()
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context, input, user }) => {
        if (input.id !== user?.customClaims?.id) {
            console.error('Authorization Error: User ID does not match.');
            throw new AuthorizationError({ message: 'User ID does not match.' });
        }
        try {
            const checkResponse = await context.nango.proxy({
                method: 'GET',
                endpoint: `/subscribers?query=email='${input.email}'`,
                connectionId: 'listmonk-vc',
                providerConfigKey: 'listmonk',
            });

            const subscribers = checkResponse.data.data.results;

            if (subscribers.length > 0) {
                // Subscriber exists, delete them
                const deleteResponse = await context.nango.proxy({
                    method: 'POST',
                    endpoint: '/subscribers/query/delete',
                    connectionId: 'listmonk-vc',
                    providerConfigKey: 'listmonk',
                    data: `query=email='${input.email}'`,
                });
                return { action: 'deleted', success: deleteResponse.data.data };
            } else {
                // Subscriber doesn't exist, add them
                const addResponse = await context.nango.proxy({
                    method: 'POST',
                    endpoint: '/subscribers',
                    connectionId: 'listmonk-vc',
                    providerConfigKey: 'listmonk',
                    data: {
                        "lists": [3],
                        "email": input.email
                    }
                });
                return { action: 'added', success: addResponse.data.data };
            }
        } catch (error) {
            console.error('Failed to toggle newsletter subscription:', error);
            throw new Error('Failed to toggle newsletter subscription');
        }
    },
});
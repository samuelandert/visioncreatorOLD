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
        // Fetch user's name from Supabase
        const { data: profile, error: profileError } = await context.supabase
            .from('profiles')
            .select('full_name')
            .eq('id', input.id)
            .single();

        if (profileError) {
            console.error('Error fetching user profile:', profileError);
            throw new Error('Failed to fetch user profile');
        }

        const userName = profile.full_name || '';

        try {
            const checkResponse = await context.nango.proxy({
                method: 'GET',
                endpoint: '/subscribers',
                connectionId: 'listmonk-vc',
                providerConfigKey: 'listmonk',
                params: {
                    query: `subscribers.email='${input.email}'`,
                    page: '1',
                    per_page: '1'
                }
            });

            const subscribers = checkResponse.data.data.results;

            if (subscribers.length === 0) {
                // No subscriber, create new at list [3]
                const addResponse = await context.nango.proxy({
                    method: 'POST',
                    endpoint: '/subscribers',
                    connectionId: 'listmonk-vc',
                    providerConfigKey: 'listmonk',
                    data: {
                        email: input.email,
                        name: userName,
                        status: 'enabled',
                        lists: [3],
                    }
                });
                return { action: 'added', success: addResponse.data.data };
            } else {
                const subscriber = subscribers[0];
                if (subscriber.status === 'blocklisted') {
                    // Subscriber blocklisted, remove block and add to list [3]
                    const unblockResponse = await context.nango.proxy({
                        method: 'PUT',
                        endpoint: `/subscribers/${subscriber.id}`,
                        connectionId: 'listmonk-vc',
                        providerConfigKey: 'listmonk',
                        data: {
                            email: input.email,
                            name: userName,
                            status: 'enabled',
                        }
                    });

                    // Add to list [3]
                    const addToListResponse = await context.nango.proxy({
                        method: 'PUT',
                        endpoint: '/subscribers/lists',
                        connectionId: 'listmonk-vc',
                        providerConfigKey: 'listmonk',
                        data: {
                            ids: [subscriber.id],
                            action: 'add',
                            target_list_ids: [3],
                            status: 'confirmed'
                        }
                    });

                    return { action: 'unblocked', success: unblockResponse.data.data && addToListResponse.data };
                } else {
                    // Subscribed but not blocklisted, blocklist
                    const blockResponse = await context.nango.proxy({
                        method: 'PUT',
                        endpoint: `/subscribers/${subscriber.id}/blocklist`,
                        connectionId: 'listmonk-vc',
                        providerConfigKey: 'listmonk'
                    });
                    return { action: 'blocklisted', success: blockResponse.data.data };
                }
            }
        } catch (error) {
            console.error('Failed to toggle newsletter subscription:', error);
            throw new Error('Failed to toggle newsletter subscription');
        }
    },
});
import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.query({
    input: z.object({
        id: z.string(),
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
        const { data: profiles, error } = await context.supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', input.id)
            .single();

        if (error) {
            console.error('Error fetching user details:', error);
            throw new Error('Failed to fetch user details');
        }

        return {
            id: profiles.id,
            full_name: profiles.full_name,
        };
    },
});
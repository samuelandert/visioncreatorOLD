import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        id: z.string(),
        full_name: z.string(),
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
        console.log('Authorization successful');

        const { data, error } = await context.supabase
            .from('profiles')
            .update({ full_name: input.full_name, active: true })
            .eq('id', input.id)
            .select();

        if (error) {
            console.error(`Error: ${error.message}`);
            return { success: false, error: error.message };
        }

        if (data.length === 0) {
            console.log('No user found with the specified ID, or no changes were made.');
            return { success: false, error: 'No user found or no changes made.' };
        }

        console.log('Name and active status updated successfully!');
        return { success: true, data };
    }
});
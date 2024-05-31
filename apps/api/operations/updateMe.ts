import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        userid: z.string(),
        fullName: z.string(),
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context, input, user }) => {
        if (input.userid !== user?.customClaims?.id) {
            console.error('Authorization Error: User ID does not match.');
            throw new AuthorizationError({ message: 'User ID does not match.' });
        }
        console.log('Authorization successful');

        const { data, error } = await context.supabase
            .from('profiles')
            .update({ full_name: input.fullName })
            .eq('id', input.userid)
            .select();

        if (error) {
            console.error(`Error: ${error.message}`);
            return { success: false, error: error.message };
        }

        if (data.length === 0) {
            console.log('No user found with the specified ID, or no changes were made.');
            return { success: false, error: 'No user found or no changes made.' };
        }

        console.log('Name updated successfully!');
        return { success: true, data };
    }
});

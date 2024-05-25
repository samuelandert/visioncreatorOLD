import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        userid: z.string(),
        fullName: z.string(),
    }),
    handler: async ({ context, input, user }) => {
        if (input.userid !== user?.customClaims?.id) {
            console.error('Authorization Error: User ID does not match.');
            throw new AuthorizationError({ message: 'User ID does not match.' });
        }

        const { error } = await context.supabase
            .from('profiles')
            .update({ full_name: input.fullName })
            .eq('id', input.userid);

        if (error) {
            console.error('Error updating user full name:', error);
            throw new Error('Failed to update user full name');
        }

        return { success: true };
    }
});
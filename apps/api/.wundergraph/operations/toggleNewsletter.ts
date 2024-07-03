import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        id: z.string(),
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context, input, user }) => {

        console.log("this got called");
        if (input.id !== user?.customClaims?.id) {
            console.error('Authorization Error: User ID does not match.');
            throw new AuthorizationError({ message: 'User ID does not match.' });
        }

        const { error: updateError } = await context.supabase
            .from('profiles')
            .update({ newsletter: false })
            .eq('id', input.id);

        if (updateError) {
            console.error('Error updating profile:', updateError);
            throw new Error('Failed to update profile');
        }

        console.log(`Newsletter status successfully toggled to false for user ID: ${input.id}`);

        return {
            message: 'Newsletter status updated successfully',
        };
    },
});
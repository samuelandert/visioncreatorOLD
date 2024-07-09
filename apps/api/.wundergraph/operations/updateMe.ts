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
            throw new AuthorizationError({ message: 'User ID does not match.' });
        }

        const retryCount = 3;
        let attempt = 0;
        let success = false;
        let data, error;

        while (attempt < retryCount && !success) {
            attempt++;
            try {
                const { data: updateData, error: updateError } = await context.supabase
                    .from('profiles')
                    .update({ full_name: input.full_name, active: true })
                    .eq('id', input.id)
                    .select()
                    .single();

                if (updateError) {
                    console.error(`Attempt ${attempt} - Error: ${updateError.message}`);
                    error = updateError;
                } else {
                    data = updateData;
                    success = true;
                }
            } catch (err) {
                console.error(`Attempt ${attempt} - Unexpected error: ${err.message}`);
                error = err;
            }

            if (!success && attempt < retryCount) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (!success) {
            return {
                success: false,
                message: error.message || 'Failed to update user after multiple attempts.'
            };
        }

        if (!data) {
            return {
                success: false,
                message: 'No user found or no changes made.'
            };
        }

        console.log('Name and active status updated successfully!');
        return {
            success: true,
            message: `Your profile has been successfully updated to ${input.full_name}!`,
            data
        };
    }
});
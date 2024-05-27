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

        console.log("------USERID-----------", input.userid)

        console.log('Authorization successful');

        const { data, error } = await context.supabase
            .from('profiles')
            .update({ full_name: input.fullName })
            .eq('id', input.userid)
            .select('full_name, id');

        if (error) {
            console.error('Error updating user full name:', error);
            console.error('Detailed error info:', JSON.stringify(error, null, 2));
            throw new Error(`Failed to update user full name: ${error.message}`);
        }

        if (data === null || data.length === 0) {
            console.error('No data returned from update operation, possible no match for ID');
            throw new Error('No data returned from update operation, check ID validity');
        }

        console.log('Update successful, user full name updated:', data);
        return { success: true, data };
    }
});
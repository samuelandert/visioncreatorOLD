import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        userid: z.string(),
        file: z.instanceof(File),
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, context, user }) => {
        if (input.userid !== user?.customClaims?.id) {
            console.error('Authorization Error: User ID does not match.');
            throw new AuthorizationError({ message: 'User ID does not match.' });
        }
        const filePath = `${input.file.name}`;
        const { data, error } = await context.supabase.storage
            .from('avatars')
            .upload(filePath, input.file);

        if (error) {
            console.error(`Upload error: ${error.message}`);
            return { success: false, error: error.message };
        }

        console.log('Profile image uploaded successfully!');
        return { success: true, data: { path: data.Key } };
    }
});
import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.query({
  input: z.object({
    userid: z.string(),
  }),
  handler: async ({ context, input, user }) => {
    if (input.userid !== user?.customClaims?.id) {
      console.error('Authorization Error: User ID does not match.');
      throw new AuthorizationError({ message: 'User ID does not match.' });
    }

    const { data: profiles, error } = await context.supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', input.userid)
      .single();

    if (error) {
      console.error('Error fetching user details:', error);
      throw new Error('Failed to fetch user details');
    }

    return {
      id: profiles.id,
      username: profiles.username,
      fullName: profiles.full_name,
      avatarUrl: profiles.avatar_url
    };
  },
});
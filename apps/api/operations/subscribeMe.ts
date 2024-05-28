import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.subscription({
    input: z.object({
        userid: z.string(),
    }),
    handler: async function* ({ context, input, user }) {

        let latestPayload;

        if (input.userid !== user?.customClaims?.id) {
            console.error('Authorization Error: User ID does not match.');
            throw new AuthorizationError({ message: 'User ID does not match.' });
        }

        const initialData = await context.supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.customClaims?.id)
            .single();

        if (initialData.data) {
            yield initialData.data;
        } else if (initialData.error) {
            console.error('Error fetching initial data:', initialData.error);
            throw new Error('Failed to fetch initial data');
        }

        const profiles = context.supabase.channel('custom-all-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
                latestPayload = payload.new;
            })
            .subscribe();

        try {
            while (true) {
                if (latestPayload) {
                    yield latestPayload;
                    latestPayload = null;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } finally {
            profiles.unsubscribe();
        }
    },
});
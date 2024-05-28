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

        // Subscribe to the channel and handle incoming data
        const profiles = context.supabase.channel('custom-all-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
                console.log('Change received!', payload);
                // Instead of yielding here, store the data temporarily
                latestPayload = payload.new; // Assuming payload.new contains the new data
            })
            .subscribe();

        try {
            // Yield the latest payload in a loop
            while (true) {
                if (latestPayload) {
                    yield { data: latestPayload };
                    latestPayload = null; // Reset after yielding
                }
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for new data
            }
        } finally {
            profiles.unsubscribe();
        }
    },
});
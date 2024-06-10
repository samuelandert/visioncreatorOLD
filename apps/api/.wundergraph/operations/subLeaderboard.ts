import { createOperation } from '../generated/wundergraph.factory';

export default createOperation.subscription({
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async function* ({ context }) {

        let profilesData = [];

        // Fetch initial data
        const initialData = await context.supabase
            .from('profiles')
            .select('id, full_name');

        if (initialData.data) {
            profilesData = initialData.data.map(profile => ({
                id: profile.id,
                name: profile.full_name
            }));
            yield profilesData;
        } else if (initialData.error) {
            console.error('Error fetching initial data:', initialData.error);
            throw new Error('Failed to fetch initial data');
        }

        // Setup subscription
        const profiles = context.supabase.channel('custom-all-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
                const index = profilesData.findIndex(p => p.id === payload.new.id);
                if (index !== -1) {
                    profilesData[index] = {
                        id: payload.new.id,
                        name: payload.new.full_name
                    };
                } else {
                    profilesData.push({
                        id: payload.new.id,
                        name: payload.new.full_name
                    });
                }
            })
            .subscribe();

        // Continuously yield the latest data
        try {
            while (true) {
                yield profilesData;
                await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the timeout as needed
            }
        } finally {
            profiles.unsubscribe();
        }
    },
});
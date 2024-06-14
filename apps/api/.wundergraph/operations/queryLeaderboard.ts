import { createOperation } from '../generated/wundergraph.factory';

export default createOperation.query({
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context }) => {
        // Fetch initial data
        const initialData = await context.supabase
            .from('profiles')
            .select('id, full_name, suminvites')
            .eq('active', true);

        if (initialData.error) {
            console.error('Error fetching leaderboard data:', initialData.error);
            throw new Error('Failed to fetch leaderboard data');
        }
        let profilesData = initialData.data.map(profile => ({
            id: profile.id,
            name: profile.full_name,
            suminvites: profile.suminvites
        }));

        profilesData.sort((a, b) => b.suminvites - a.suminvites);
        return profilesData;
    },
});
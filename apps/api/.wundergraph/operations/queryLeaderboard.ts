import { createOperation } from '../generated/wundergraph.factory';

export default createOperation.query({
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context }) => {
        const initialData = await context.supabase
            .from('profiles')
            .select('id, full_name, suminvites, created_at')
            .eq('active', true);

        if (initialData.error) {
            console.error('Error fetching leaderboard data:', initialData.error);
            throw new Error('Failed to fetch leaderboard data');
        }
        let profilesData = initialData.data.map(profile => ({
            id: profile.id,
            name: profile.full_name,
            suminvites: profile.suminvites,
            createdAt: profile.created_at
        }));

        // Sort by suminvites first, then by created_at
        profilesData.sort((a, b) => {
            if (b.suminvites !== a.suminvites) {
                return b.suminvites - a.suminvites;
            } else {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });
        return profilesData;
    },
});
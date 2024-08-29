import { createOperation, z, AuthorizationError } from '../generated/wundergraph.factory';

export default createOperation.query({
    input: z.object({
        id: z.string(),
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, user, operations }) => {
        if (input.id !== user?.customClaims?.id) {
            console.error('Authorization Error: User ID does not match.');
            throw new AuthorizationError({ message: 'User ID does not match.' });
        }
        // Query Leaderboard
        const { data: leaderboardData, error: leaderboardError } = await operations.query({
            operationName: 'queryLeaderboard',
        });

        if (leaderboardError) {
            console.error('Error fetching leaderboard data:', leaderboardError);
            throw new Error('Failed to fetch leaderboard data');
        }

        // Calculate user rank and streaming potential
        const userRank = leaderboardData.profiles.findIndex((entry) => entry.id === input.id) + 1 || null;
        const userEntry = leaderboardData.profiles.find((entry) => entry.id === input.id);
        const streamPotential = userEntry ? userEntry.suminvites * 5 : 0;
        const suminvites = userEntry ? userEntry.suminvites : 0;

        return {
            userRank,
            streamPotential,
            suminvites,
        };
    },
});
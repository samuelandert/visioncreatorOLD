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

        // Query Me
        const { data: meData, error: meError } = await operations.query({
            operationName: 'queryMe',
            input: { id: input.id },
        });

        if (meError) {
            console.error('Error fetching user details:', meError);
            throw new Error('Failed to fetch user details');
        }

        // Query User Stats
        const { data: userStatsData, error: userStatsError } = await operations.query({
            operationName: 'queryUserStats',
            input: { id: input.id },
        });

        if (userStatsError) {
            console.error('Error fetching user stats:', userStatsError);
            throw new Error('Failed to fetch user stats');
        }

        // Query Leaderboard
        const { data: leaderboardData, error: leaderboardError } = await operations.query({
            operationName: 'queryLeaderboard',
        });

        if (leaderboardError) {
            console.error('Error fetching leaderboard data:', leaderboardError);
            throw new Error('Failed to fetch leaderboard data');
        }

        return {
            me: {
                id: meData.id,
                full_name: meData.full_name,
            },
            description: "wonderful to have you around",
            stats: [
                {
                    label: "Waiting Position",
                    value: userStatsData.userRank
                },
                {
                    label: "Streaming Potential",
                    value: userStatsData.streamPotential
                }
            ],
        };
    },
});
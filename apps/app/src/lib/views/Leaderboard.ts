// apps/app/src/lib/views/Leaderboard.ts
export const view = {
    id: 'LeaderboardContainer',
    layout: {
        areas: `
            "main"
        `
    },
    children: [
        {
            id: 'Leaderboard',
            component: 'Leaderboard',
            slot: 'main',
            queries: [
                { operation: 'queryLeaderboard', input: {} }
            ]
        }
    ]
};
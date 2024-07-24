export const view = {
    id: 'ProfileContainer',
    layout: {
        areas: `
            "main"
        `
    },
    children: [
        {
            id: 'Profile',
            component: 'Profile',
            slot: 'main',
            queries: [
                { operation: 'queryMe', input: { id: 'authID' } },
                { operation: 'queryLeaderboard', input: {} }
            ]
        }
    ]
};
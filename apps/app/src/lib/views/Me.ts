export const view = {
    id: 'MePageContainer',
    layout: {
        areas: `
            "profile"
            "invite"
            "leaderboard"
        `,
        rows: 'auto auto auto',
        gap: '1rem',
        overflow: 'auto',
        style: 'p-4 max-w-6xl mx-auto'
    },
    children: [
        {
            id: 'Profile',
            component: 'Profile',
            slot: 'profile',
            queries: [
                { operation: 'queryComposer', input: { id: 'authID' } }
            ]
        },
        {
            id: 'InviteCard',
            component: 'InviteCard',
            slot: 'invite',
        },
        {
            id: 'Leaderboard',
            component: 'Leaderboard',
            slot: 'leaderboard',
            layout: {
                style: 'min-h-[500px]',
            },
            queries: [
                { operation: 'queryLeaderboard' }
            ]
        }
    ]
}
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
            query: {
                operation: 'queryComposer',
                input: {
                    id: 'authID',
                    map: {
                        title: {
                            query: "queryMe",
                            input: { id: 'authID' },
                            field: "full_name"
                        },
                        description: "wonderful to have you around",
                        stats: [
                            {
                                label: "Waiting Position",
                                value: {
                                    query: "queryUserStats",
                                    input: { id: 'authID' },
                                    field: "userRank"
                                }
                            },
                            {
                                label: "Streaming Potential",
                                value: {
                                    query: "queryUserStats",
                                    input: { id: 'authID' },
                                    field: "streamPotential"
                                }
                            }
                        ]
                    }
                },
            }
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
            query: {
                operation: 'queryComposer',
                input: {
                    id: 'authID',
                    map: {
                        leaderboard: {
                            query: 'queryLeaderboard',
                            field: 'profiles'
                        }
                    }
                }
            }
        }
    ]
}
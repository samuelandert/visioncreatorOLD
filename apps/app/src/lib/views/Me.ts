export const view = {
    id: 'MePageContainer',
    layout: {
        areas: `
            "row1"
            "row2"
            "row3"
        `,
        rows: 'auto auto 1fr',
        gap: '1rem',
        overflow: 'auto',
        style: 'p-4 max-w-6xl mx-auto'
    },
    children: [
        {
            id: 'Profile',
            component: 'Profile',
            slot: 'row1',
            map: {
                name: "Profile",
                title: {
                    query: "queryMe",
                    input: { id: 'authID' },
                    prop: "full_name"
                },
                description: "wonderful to have you around",
                invites: {
                    query: "queryUserStats",
                    input: { id: 'authID' },
                    prop: "suminvites"
                },
                waitingPosition: {
                    query: "queryUserStats",
                    input: { id: 'authID' },
                    prop: "userRank"
                }
            }
        },
        {
            id: 'InviteCard',
            slot: "row2",
            component: 'InviteCard',
        },
        {
            id: 'Leaderboard',
            component: 'Leaderboard',
            slot: "row3",
            map: {
                list: {
                    query: 'queryLeaderboard',
                    prop: 'profiles',
                    mapProps: {
                        primaryText: "prop.name",
                        identifier: "prop.id",
                        numericValue: "prop.suminvites"
                    }
                },
                stats: [
                    {
                        label: "Inspirations",
                        value: "prop.suminvites"
                    },
                    {
                        label: "Rank",
                        value: "prop.rank"
                    }
                ]
            }
        }
    ]
}
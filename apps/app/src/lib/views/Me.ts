export const view = {
    id: 'MePageContainer',
    layout: {
        areas: `
            "main aside"
        `,
        columns: '2fr 1fr',
        gap: '1rem',
        overflow: 'auto',

    },
    children: [
        {
            id: 'MainContent',
            slot: 'main',
            layout: {
                areas: `
                    "profile"
                    "invite"
                    "leaderboard"
                `,
                rows: 'auto auto auto',
                gap: '1rem',
                style: 'p-4 max-w-6xl mx-auto',
                overflow: 'auto',
            },
            children: [
                {
                    id: 'Profile',
                    component: 'Profile',
                    slot: 'profile',
                    map: {
                        title: {
                            query: "queryMe",
                            input: { id: 'authID' },
                            prop: "full_name"
                        },
                        description: "wonderful to have you around",
                        stats: [
                            {
                                label: "Waiting Position",
                                value: {
                                    query: "queryUserStats",
                                    input: { id: 'authID' },
                                    prop: "userRank"
                                }
                            },
                            {
                                label: "Streaming Potential",
                                value: {
                                    query: "queryUserStats",
                                    input: { id: 'authID' },
                                    prop: "streamPotential"
                                }
                            }
                        ]
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
                        style: 'min-h-[200px]',
                    },
                    map: {
                        list: {
                            query: 'queryLeaderboard',
                            prop: 'profiles',
                            mapProps: {
                                primaryText: "prop.name",
                                identifier: "prop.id",
                                numericValue: "prop.suminvites"
                            }
                        }
                    }
                }
            ]
        },
        {
            id: 'PlayingArea',
            component: 'Countries',
            slot: 'aside',
            layout: {
                style: 'max-h-screen'
            },
            map: {
                grid: {
                    query: 'Countries',
                    input: {
                        filter: {
                            code: {
                                in: ['ES', 'FR', 'DE', 'GB']
                            }
                        }
                    },
                    prop: "countries_countries",
                    mapProps: {
                        primaryText: 'prop.name',
                        identifier: 'prop.code',
                        label1: 'Capital',
                        value1: 'prop.capital',
                        label2: 'Currency',
                        value2: 'prop.currencies',
                        label3: 'Phone Code',
                        value3: 'prop.phone',
                        label4: 'Country Code',
                        value4: 'prop.code'
                    }
                }
            }
        }
    ]
}
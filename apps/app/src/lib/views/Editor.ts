export const view = {
    id: 'EditorPageContainer',
    layout: {
        areas: `
            "aside main"
        `,
        columns: '300px 1fr',
        style: 'h-screen',
        overflow: "hidden"
    },
    children: [
        {
            id: 'LeftAside',
            slot: 'aside',
            layout: {
                style: 'h-full bg-surface-200-700-token'
            },
        },
        {
            id: 'MainArea',
            slot: 'main',
            layout: {
                areas: `
                    "q1 q2"
                    "q3 q4"
                `,
                columns: '1fr 1fr',
                rows: '1fr 1fr',
                style: 'h-screen gap-4 p-4',
                overflow: 'hidden'
            },
            children: [
                {
                    id: 'Quadrant1',
                    slot: 'q1',
                    component: 'Grid',
                    layout: {
                        scale: "sm",
                        overflow: 'auto'
                    },
                    map: {
                        grid: {
                            query: 'Countries',
                            input: {
                                filter: {
                                    code: {
                                        in: ['ES', 'FR', 'DE', 'GB', 'CR', 'SA', 'IN']
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
                },
                {
                    id: 'Quadrant2',
                    slot: 'q2',
                    component: 'Grid',
                    layout: {
                        scale: "md",
                        overflow: 'auto'
                    },
                    map: {
                        grid: {
                            query: 'Countries',
                            input: {
                                filter: {
                                    code: {
                                        in: ['ES', 'FR', 'DE', 'GB', 'CR', 'SA', 'IN']
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
                },
                {
                    id: 'Quadrant3',
                    slot: 'q3',
                    component: 'Grid',
                    layout: {
                        scale: "lg",
                        overflow: 'auto'
                    },
                    map: {
                        grid: {
                            query: 'Countries',
                            input: {
                                filter: {
                                    code: {
                                        in: ['ES', 'FR', 'DE', 'GB', 'CR', 'SA', 'IN']
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
                },
                {
                    id: 'Quadrant4',
                    slot: 'q4',
                    component: 'Grid',
                    layout: {
                        scale: "xl",
                        overflow: 'auto'
                    },
                    map: {
                        grid: {
                            query: 'Countries',
                            input: {
                                filter: {
                                    code: {
                                        in: ['ES', 'FR', 'DE', 'GB', 'CR', 'SA', 'IN']
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
    ]
}
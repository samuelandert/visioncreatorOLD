export const view = {
    id: 'HelloEarth',
    layout: {
        areas: `
			"main"
		`
    },
    children: [
        {
            id: 'xyz1',
            component: 'Logger',
            slot: 'main',
        }
    ]
}
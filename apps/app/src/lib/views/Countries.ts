export const view = {
    id: 'Test',
    layout: {
        areas: `
			"main"
		`
    },
    children: [
        {
            id: 'Countries',
            component: 'Countries',
            slot: 'main',
            queries: [{ operation: 'Countries', input: { filter: { code: { eq: 'DE' } } } }],
        }
    ]
}
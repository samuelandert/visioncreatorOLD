<script lang="ts">
	let view = {
		id: 'TestLayout',
		layout: {
			areas: `
                "left right"
            `,
			rows: '1fr',
			columns: '1fr 1fr',
			overflow: 'hidden'
		},
		children: [
			{
				id: 'Schemas',
				component: 'Schemas',
				slot: 'left',
				map: {
					schemas: {
						query: 'querySchemas',
						prop: 'schemas'
					}
				}
			},
			{
				id: 'HominiDB',
				component: 'HominiDB',
				slot: 'right',
				layout: {
					overflow: 'scroll'
				},
				map: {
					db: {
						query: 'queryDB',
						prop: 'db'
					},
					schemas: {
						query: 'querySchemas',
						prop: 'schemas'
					}
				}
			}
		]
	};
</script>

<ComposeView {view} />

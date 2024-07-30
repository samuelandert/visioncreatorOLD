<script lang="ts">
	let view = {
		id: 'TestLayout',
		layout: {
			areas: `
                "right"
            `,
			rows: '1fr',
			columns: '1fr',
			overflow: 'hidden'
		},
		children: [
			// {
			// 	id: 'Schemas',
			// 	component: 'Schemas',
			// 	slot: 'left',
			// 	map: {
			// 		schemas: {
			// 			query: 'querySchemas',
			// 			prop: 'schemas'
			// 		}
			// 	}
			// },
			{
				id: 'HominioDB',
				component: 'HominioDB',
				slot: 'right',
				layout: {
					overflow: 'scroll'
				},
				map: {
					db: {
						query: 'queryDB',
						prop: 'db'
					}
				}
			}
		]
	};
</script>

<ComposeView {view} />

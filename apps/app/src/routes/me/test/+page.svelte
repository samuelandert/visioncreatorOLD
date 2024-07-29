<script lang="ts">
	let view = {
		id: 'TestLayout',
		layout: {
			areas: `
                "area"
            `,
			rows: '1fr',
			columns: '1fr',
			oveflow: 'hidden'
		},
		children: [
			{
				id: 'Test',
				component: 'Test',
				slot: 'area',
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

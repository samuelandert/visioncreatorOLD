import { configureWunderGraphServer } from '@wundergraph/sdk/server';

export default configureWunderGraphServer(() => ({
	hooks: {
		queries: {
			Countries: {
				preResolve: async ({ operations }) => { },
			},
		},
		authentication: {
			mutatingPostAuthentication: async ({ user }) => {
				if (user.roles === null) {
					if (user.customClaims.roles) {
						user.roles = Object.values(user.customClaims.roles)
					}
				}
				return {
					user,
					status: 'ok',
				};
			},
		},
		mutations: {},
	},
	logger: {
		level: 'debug',
	}
}));

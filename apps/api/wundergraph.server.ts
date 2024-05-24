import { configureWunderGraphServer } from '@wundergraph/sdk/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
const supabase = createClient(supabaseUrl, supabaseKey);

class MyContext {
	supabase = supabase;
}

declare module '@wundergraph/sdk/server' {
	export interface CustomContext {
		request: MyContext;
	}
}

export default configureWunderGraphServer(() => ({
	hooks: {
		queries: {
			Countries: {
				preResolve: async ({ operations, context }) => {
					// Example usage of context
					console.log(context.supabase);
				},
			},
		},
		authentication: {
			mutatingPostAuthentication: async ({ user }) => {
				if (user.roles === null) {
					if (user.customClaims.roles) {
						user.roles = Object.values(user.customClaims.roles);
					}
				}
				return {
					user,
					status: 'ok',
				};
			},
		},
	},
	context: {
		request: {
			create: async () => {
				return new MyContext();
			},
			release: async (ctx) => {
				// Cleanup if necessary
			},
		},
	},
	logger: {
		level: 'debug',
	}
}));
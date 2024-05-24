import { configureWunderGraphServer } from '@wundergraph/sdk/server';
import { createClient } from '@supabase/supabase-js';

class MyContext {
	supabase: ReturnType<typeof createClient>;

	constructor() {
		const supabaseUrl = process.env.SUPABASE_URL;
		const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
		if (!supabaseUrl || !supabaseKey) {
			throw new Error("Supabase URL and Key must be provided.");
		}
		this.supabase = createClient(supabaseUrl, supabaseKey);
	}
}

declare module '@wundergraph/sdk/server' {
	export interface CustomContext {
		request: MyContext;
	}
}

export default configureWunderGraphServer(() => ({
	hooks: {
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
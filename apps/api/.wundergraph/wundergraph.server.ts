import { configureWunderGraphServer } from '@wundergraph/sdk/server';
import { createClient } from '@supabase/supabase-js';
import { Nango } from '@nangohq/node';

class MyContext {
	supabase: ReturnType<typeof createClient>;
	nango: Nango;

	constructor() {
		const supabaseUrl = process.env.LOCAL_SUPABASE_URL;
		const supabaseKey = process.env.LOCAL_SUPABASE_SERVICE_ROLE;
		const nangoHost = process.env.NANGO_HOST;
		const nangoSecretKey = process.env.NANGO_SECRET_KEY;

		if (!supabaseUrl || !supabaseKey || !nangoHost || !nangoSecretKey) {
			throw new Error("Supabase URL, Key, Nango Host, and Secret Key must be provided.");
		}

		this.supabase = createClient(supabaseUrl, supabaseKey);
		this.nango = new Nango({
			host: nangoHost,
			secretKey: nangoSecretKey
		});
	}

	async cleanup() {
		await this.supabase.removeAllChannels();
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
				await ctx.cleanup();
			},
		},
	},
	logger: {
		level: 'debug',
	}
}));
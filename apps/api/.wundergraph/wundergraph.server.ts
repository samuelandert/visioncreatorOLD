import { configureWunderGraphServer } from '@wundergraph/sdk/server';
import { createClient } from '@supabase/supabase-js';
import { Nango } from '@nangohq/node';
import gocardless from 'gocardless-nodejs';
import { Environments } from 'gocardless-nodejs/constants';

class MyContext {
	supabase: ReturnType<typeof createClient>;
	nango: Nango;
	gocardless: ReturnType<typeof gocardless>;

	constructor() {
		const supabaseUrl = process.env.SUPABASE_URL;
		const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
		const nangoHost = process.env.NANGO_HOST;
		const nangoSecretKey = process.env.NANGO_SECRET_KEY;
		const gocardlessAccessToken = process.env.SECRET_GOCARDLESS_ACCESS_TOKEN;

		if (!supabaseUrl || !supabaseKey || !nangoHost || !nangoSecretKey || !gocardlessAccessToken) {
			throw new Error("Supabase URL, Key, Nango Host, Secret Key, and GoCardless Access Token must be provided.");
		}

		this.supabase = createClient(supabaseUrl, supabaseKey);
		this.nango = new Nango({
			host: nangoHost,
			secretKey: nangoSecretKey
		});
		this.gocardless = gocardless(
			gocardlessAccessToken,
			Environments.Sandbox
		);
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
		},
	},
	logger: {
		level: 'debug',
	}
}));
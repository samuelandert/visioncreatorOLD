// src/hooks.server.ts
import { env } from '$env/dynamic/public'
import { createServerClient } from '@supabase/ssr'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            get: (key) => event.cookies.get(key),
            set: (key, value, options) => {
                event.cookies.set(key, value, { ...options, path: '/' })
            },
            remove: (key, options) => {
                event.cookies.delete(key, { ...options, path: '/' })
            },
        },
    });

    event.locals.safeGetSession = async () => {
        const { data: { user }, error } = await event.locals.supabase.auth.getUser();
        if (error) {
            return { session: null, user: null };
        }

        const { data: { session } } = await event.locals.supabase.auth.getSession();
        return { session, user };
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name: string) {
            return name === 'content-range' || name === 'x-supabase-api-version';
        },
    });
}
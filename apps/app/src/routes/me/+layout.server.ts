import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    // Redirect to the home page if no session is found
    if (!session) {
        throw redirect(303, '/');
    }
    // Continue rendering the route if the session exists
    return {};
};
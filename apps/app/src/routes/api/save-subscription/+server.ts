import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const subscription = await request.json();

    // TODO: Save the subscription to your database
    console.log('Received subscription:', subscription);

    return json({ success: true });
};
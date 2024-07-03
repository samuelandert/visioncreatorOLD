import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const getAuthString = (): string => {
    const authString = `${env.SECRET_LISTMONK_USER}:${env.SECRET_LISTMONK_PASSWORD}`;
    return btoa(authString);
};

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();
        console.log('Unsubscribe request received for email:', email); // Log the email

        const encodedAuthString = getAuthString();

        const response = await fetch(`https://listmonk.visioncreator.works/api/subscribers?query=${email}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${encodedAuthString}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Listmonk API error:', errorText);
            return new Response(JSON.stringify({ error: 'Failed to unsubscribe' }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'Successfully unsubscribed!' }), { status: 200 });
    } catch (error) {
        console.error('Unsubscription error:', error);
        return new Response(JSON.stringify({ error: 'Failed to unsubscribe. Please try again later.' }), { status: 500 });
    }
};
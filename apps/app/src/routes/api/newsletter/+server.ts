import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, name } = await request.json();

        const authString = `${env.SECRET_LISTMONK_USER}:${env.SECRET_LISTMONK_PASSWORD}`;
        const encodedAuthString = btoa(authString);

        const response = await fetch('https://listmonk.visioncreator.works/api/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${encodedAuthString}`
            },
            body: JSON.stringify({
                email: email,
                name: name,
                status: "enabled",
                lists: [3]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Listmonk API error:', errorText);
            return new Response(JSON.stringify({ error: 'Failed to subscribe' }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'Successfully subscribed!' }), { status: 200 });
    } catch (error) {
        console.error('Subscription error:', error);
        return new Response(JSON.stringify({ error: 'Failed to subscribe. Please try again later.' }), { status: 500 });
    }
};
import { json } from '@sveltejs/kit';
import { gocardlessClient } from '$lib/gocardless';

export async function POST({ request }) {
    try {
        const { customerId } = await request.json();

        const billingRequest = await gocardlessClient.billingRequests.create({
            mandate_request: {
                currency: "EUR",
            },
            links: {
                customer: customerId
            },
        });

        const billingRequestFlow = await gocardlessClient.billingRequestFlows.create({
            redirect_uri: "http://127.0.0.1:3000/me/viewer?c=Success",
            exit_uri: "http://127.0.0.1:3000/me/viewer?c=Error",
            links: {
                billing_request: billingRequest.id,
            },
        });

        return json({
            flowId: billingRequestFlow.id,
            billingRequestFlow: billingRequestFlow
        });
    } catch (error) {
        console.error('Error creating billing request flow:', error);
        return json({ error: 'Failed to create billing request flow' }, { status: 500 });
    }
}
import { json } from '@sveltejs/kit';
import { gocardlessClient } from '$lib/gocardless';

export async function POST() {
    try {
        const billingRequest = await gocardlessClient.billingRequests.create({
            mandate_request: {
                verify: 'recommended',
                currency: 'EUR',
                description: 'Visioncreator Membership'
            }
        });

        const billingRequestFlow = await gocardlessClient.billingRequestFlows.create({
            redirect_uri: "http://127.0.0.1:3000/me/viewer?c=GoCardless",
            exit_uri: "http://127.0.0.1:3000/me/viewer?c=GoCardless",
            links: {
                billing_request: billingRequest.id,
            },
            prefilled_customer: {
                given_name: 'Chielo',
                family_name: 'Jai',
                email: 'chielo.jai@vc.earth',
                address_line1: '123 Main St',
                city: 'Earth',
                postal_code: '12345',
                country_code: 'DE'
            },
            lock_currency: true,
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

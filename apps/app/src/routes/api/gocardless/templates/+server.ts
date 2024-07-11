import { json } from '@sveltejs/kit';
import { gocardlessClient } from '$lib/gocardless';

export async function GET() {
    try {
        const templatesResponse = await gocardlessClient.billingRequestTemplates.list();

        console.log('GoCardless API Response:', JSON.stringify(templatesResponse, null, 2));

        if (!templatesResponse || !Array.isArray(templatesResponse.billing_request_templates)) {
            console.error('Unexpected response format:', templatesResponse);
            return json({ error: 'Unexpected response format from GoCardless API' }, { status: 500 });
        }

        return json(templatesResponse.billing_request_templates);
    } catch (error) {
        console.error('Error fetching billing request templates:', error);
        return json({ error: 'Failed to fetch billing request templates', details: error.message }, { status: 500 });
    }
}

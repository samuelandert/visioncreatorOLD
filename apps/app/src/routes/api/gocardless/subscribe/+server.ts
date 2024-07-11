import { json } from '@sveltejs/kit';
import { gocardlessClient } from '$lib/gocardless';

export async function POST({ request }) {
    try {
        const { mandateId, templateId } = await request.json();

        if (!mandateId || !templateId) {
            return json({ error: 'Mandate ID and Template ID are required' }, { status: 400 });
        }

        // Fetch all billing request templates
        const templatesResponse = await gocardlessClient.billingRequestTemplates.list();

        if (!templatesResponse.billing_request_templates || templatesResponse.billing_request_templates.length === 0) {
            return json({ error: 'No billing request templates found' }, { status: 404 });
        }

        // Find the matching template
        const template = templatesResponse.billing_request_templates.find(t => t.id === templateId);

        if (!template) {
            return json({ error: 'Billing request template not found' }, { status: 404 });
        }

        // Create a subscription
        const subscription = await gocardlessClient.subscriptions.create({
            amount: template.payment_request_amount,
            currency: template.payment_request_currency,
            name: template.name,
            metadata: {
                template_id: templateId
            },
            links: {
                mandate: mandateId
            }
        });

        return json({ success: true, subscription });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return json({ error: 'Failed to create subscription', details: error.message }, { status: 500 });
    }
}
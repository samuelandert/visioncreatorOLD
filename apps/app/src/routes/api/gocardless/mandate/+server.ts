import { json } from '@sveltejs/kit';
import { gocardlessClient } from '$lib/gocardless';

export async function POST({ request }) {
    try {
        const billingRequest = await gocardlessClient.billingRequests.create({
            mandate_request: {
                verify: 'recommended',
                currency: 'EUR',
                description: 'Visioncreator Membership'
            }
        });

        const billingRequestFlow = await gocardlessClient.billingRequestFlows.create({
            redirect_uri: "http://127.0.0.1:3000/api/gocardless/mandate?success=true",
            exit_uri: "http://127.0.0.1:3000/api/gocardless/mandate?success=false",
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

export async function GET({ url }) {
    const flowId = url.searchParams.get('flow_id');
    const success = url.searchParams.get('success') === 'true';

    if (success) {
        try {
            // Use the correct method to get the billing request flow
            const billingRequestFlow = await gocardlessClient.billingRequestFlows.find(flowId);

            if (!billingRequestFlow || !billingRequestFlow.links || !billingRequestFlow.links.billing_request) {
                throw new Error('Invalid billing request flow');
            }

            const billingRequest = await gocardlessClient.billingRequests.get(billingRequestFlow.links.billing_request);

            if (!billingRequest || !billingRequest.links || !billingRequest.links.mandate) {
                throw new Error('Mandate not created');
            }

            const mandateId = billingRequest.links.mandate;
            const templateId = 'BRT00007Y68WKQJ'; // Hardcoded template ID

            // Fetch the template
            const templatesResponse = await gocardlessClient.billingRequestTemplates.list();
            const template = templatesResponse.billing_request_templates.find(t => t.id === templateId);

            if (!template) {
                throw new Error(`Billing request template not found for ID: ${templateId}`);
            }

            // Create a subscription
            const subscription = await gocardlessClient.subscriptions.create({
                amount: template.payment_request_amount,
                currency: template.payment_request_currency,
                name: template.name,
                interval_unit: 'monthly', // Adjust as needed
                metadata: {
                    template_id: templateId
                },
                links: {
                    mandate: mandateId
                }
            });

            return json({ success: true, subscription });
        } catch (error) {
            console.error('Error processing successful mandate:', error);
            return json({ error: error.message || 'Failed to process successful mandate' }, { status: 500 });
        }
    } else {
        return json({ error: 'Mandate creation failed or was cancelled' }, { status: 400 });
    }
}
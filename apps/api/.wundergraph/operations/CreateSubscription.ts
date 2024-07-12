import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        mandateId: z.string(),
        templateId: z.string()
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, context }) => {
        try {
            const { mandateId, templateId } = input;

            // Fetch all billing request templates
            const templatesResponse = await context.gocardless.billingRequestTemplates.list();

            if (!templatesResponse.billing_request_templates || templatesResponse.billing_request_templates.length === 0) {
                throw new Error('No billing request templates found');
            }

            // Find the matching template
            const template = templatesResponse.billing_request_templates.find(t => t.id === templateId);

            if (!template) {
                throw new Error('Billing request template not found');
            }

            // Create a subscription
            const subscription = await context.gocardless.subscriptions.create({
                amount: 3966,
                currency: template.mandate_request_currency,
                name: template.name,
                interval_unit: 'monthly',
                metadata: {
                    template_id: templateId
                },
                links: {
                    mandate: mandateId
                }
            });

            return {
                success: true,
                subscription
            };
        } catch (error) {
            console.error('Error creating subscription:', error);
            return {
                success: false,
                message: 'Failed to create subscription',
                error: error.message
            };
        }
    }
});
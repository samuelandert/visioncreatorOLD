import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        customer: z.object({
            given_name: z.string(),
            family_name: z.string(),
            email: z.string().email(),
            address_line1: z.string(),
            city: z.string(),
            postal_code: z.string(),
        })
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, context }) => {
        try {
            const billingRequest = await context.gocardless.billingRequests.create({
                mandate_request: {
                    verify: 'recommended',
                    currency: 'EUR',
                    description: 'Visioncreator Membership'
                }
            });

            const billingRequestFlow = await context.gocardless.billingRequestFlows.create({
                redirect_uri: "http://127.0.0.1:3000/me/viewer?c=GoCardless",
                exit_uri: "http://127.0.0.1:3000/me/viewer?c=GoCardless",
                links: {
                    billing_request: billingRequest.id,
                },
                prefilled_customer: {
                    ...input.customer,
                    country_code: 'DE'
                },
                lock_currency: true,
            });

            return {
                data: {
                    flowId: billingRequestFlow.id,
                    billingRequestFlow: billingRequestFlow
                }
            };
        } catch (error) {
            console.error('Error creating billing request flow:', error);
            throw new Error('Failed to create billing request flow');
        }
    }
});
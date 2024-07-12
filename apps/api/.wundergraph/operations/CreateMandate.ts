import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        // Add any input fields if needed
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context }) => {
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
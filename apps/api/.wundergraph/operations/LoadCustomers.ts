import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.query({
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context }) => {
        try {
            const customersResponse = await context.gocardless.customers.list();

            if (!customersResponse.customers || !Array.isArray(customersResponse.customers)) {
                throw new Error('Unexpected response format from GoCardless API');
            }

            const customersWithMandates = await Promise.all(customersResponse.customers.map(async (customer) => {
                const mandatesResponse = await context.gocardless.mandates.list({ customer: customer.id });

                const activeMandates = mandatesResponse.mandates.filter(mandate =>
                    ['pending_customer_approval', 'pending_submission', 'submitted', 'active'].includes(mandate.status)
                );

                return {
                    ...customer,
                    hasActiveMandates: activeMandates.length > 0,
                    mandateId: activeMandates.length > 0 ? activeMandates[0].id : null
                };
            }));

            return {
                success: true,
                customers: customersWithMandates
            };
        } catch (error) {
            console.error('Error fetching customers:', error);
            return {
                success: false,
                message: 'Failed to fetch customers',
                error: error.message
            };
        }
    }
});
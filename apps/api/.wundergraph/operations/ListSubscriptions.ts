import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.query({
    input: z.object({
        customerId: z.string(),
    }),
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ input, context }) => {
        try {
            const subscriptionsData = await context.gocardless.subscriptions.list({
                customer: input.customerId,
                limit: 100
            });

            if (!subscriptionsData || !subscriptionsData.subscriptions) {
                return {
                    success: true,
                    subscriptions: []
                };
            }

            const formattedSubscriptions = subscriptionsData.subscriptions.map(subscription => ({
                id: subscription.id,
                status: subscription.status,
                amount: subscription.amount,
                currency: subscription.currency,
                name: subscription.name,
                start_date: subscription.start_date,
                end_date: subscription.end_date,
                interval: subscription.interval,
                interval_unit: subscription.interval_unit
            }));

            return {
                success: true,
                subscriptions: formattedSubscriptions
            };
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            return {
                success: false,
                message: 'Failed to fetch subscriptions',
                error: error.message
            };
        }
    }
});
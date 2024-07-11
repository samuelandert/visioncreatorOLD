import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { gocardlessClient } from '$lib/gocardless';

export const GET: RequestHandler = async ({ url }) => {
    const customerId = url.searchParams.get('customerId');

    console.log('Fetching subscriptions for customer ID:', customerId);

    if (!customerId) {
        console.log('Customer ID is missing');
        return json({ error: 'Customer ID is required' }, { status: 400 });
    }

    try {
        const subscriptionsData = await gocardlessClient.subscriptions.list({
            customer: customerId,
            limit: 100
        });

        console.log('Raw subscriptions data:', JSON.stringify(subscriptionsData, null, 2));

        if (!subscriptionsData || !subscriptionsData.subscriptions) {
            console.log('No subscriptions found');
            return json([]);
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

        console.log('Formatted subscriptions:', JSON.stringify(formattedSubscriptions, null, 2));

        return json(formattedSubscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }
};
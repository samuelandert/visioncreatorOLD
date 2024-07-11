import { json } from '@sveltejs/kit';
import { gocardlessClient } from '$lib/gocardless';
export async function GET() {
    try {
        const customersResponse = await gocardlessClient.customers.list();

        if (!customersResponse.customers || !Array.isArray(customersResponse.customers)) {
            console.error('Unexpected response format:', customersResponse);
            return json({ error: 'Unexpected response format from GoCardless API' }, { status: 500 });
        }

        const customersWithMandates = await Promise.all(customersResponse.customers.map(async (customer) => {
            const mandatesResponse = await gocardlessClient.mandates.list({ customer: customer.id });

            const activeMandates = mandatesResponse.mandates.filter(mandate =>
                ['pending_customer_approval', 'pending_submission', 'submitted', 'active'].includes(mandate.status)
            );

            return {
                ...customer,
                hasActiveMandates: activeMandates.length > 0,
                mandateId: activeMandates.length > 0 ? activeMandates[0].id : null
            };
        }));

        return json(customersWithMandates);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return json({ error: 'Failed to fetch customers', details: error.message }, { status: 500 });
    }
}
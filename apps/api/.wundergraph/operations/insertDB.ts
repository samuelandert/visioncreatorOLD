import { createOperation, z } from '../generated/wundergraph.factory';

function generateRandomJson() {
    const types = ['user', 'product', 'order', 'event'];
    const type = types[Math.floor(Math.random() * types.length)];

    const baseJson = {
        id: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
        type: type
    };

    switch (type) {
        case 'user':
            return {
                ...baseJson,
                name: `User${Math.floor(Math.random() * 100)}`,
                email: `user${Math.floor(Math.random() * 100)}@example.com`,
                age: Math.floor(Math.random() * 80) + 18
            };
        case 'product':
            return {
                ...baseJson,
                name: `Product${Math.floor(Math.random() * 100)}`,
                price: +(Math.random() * 1000).toFixed(2),
                inStock: Math.random() > 0.5
            };
        case 'order':
            return {
                ...baseJson,
                orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
                total: +(Math.random() * 5000).toFixed(2),
                items: Math.floor(Math.random() * 10) + 1
            };
        case 'event':
            return {
                ...baseJson,
                name: `Event${Math.floor(Math.random() * 100)}`,
                date: new Date(Date.now() + Math.random() * 10000000000).toISOString(),
                attendees: Math.floor(Math.random() * 1000)
            };
    }
}

export default createOperation.mutation({
    requireAuthentication: true,
    rbac: {
        requireMatchAll: ['authenticated'],
    },
    handler: async ({ context }) => {
        const randomJson = generateRandomJson();

        const { data, error } = await context.supabase
            .from('db')
            .insert({ json: randomJson })
            .select();

        if (error) {
            console.error('Error inserting data into db:', error);
            throw new Error('Failed to insert data into db');
        }

        return { insertedData: data[0] };
    },
});
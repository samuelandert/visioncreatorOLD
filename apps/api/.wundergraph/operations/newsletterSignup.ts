import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        email: z.string().email()
    }),
    handler: async ({ input, context }) => {
        const response = await context.nango.action('listmonk-integration', 'subscribe', {
            email: input.email
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Listmonk API error:', errorText);
            throw new Error('Failed to subscribe');
        }

        return {
            message: 'Successfully subscribed!'
        };
    }
});
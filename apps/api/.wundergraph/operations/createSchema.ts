import { createOperation, z } from '../generated/wundergraph.factory';

export default createOperation.mutation({
    input: z.object({
        schema: z.object({}).passthrough(),
    }),
    handler: async ({ input, context }) => {

        const { data, error } = await context.supabase
            .from('schemas')
            .insert({ json: input.schema })
            .select();

        if (error) {
            return {
                success: false,
                error: error.message,
            };
        }

        return {
            success: true,
            insertedData: data,
        };
    },
});
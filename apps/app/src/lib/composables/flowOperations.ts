import { client } from '$lib/wundergraph';
import { emitEvent } from '$lib/stores';

interface SubmitFormParams {
    operation: string;
    input: Record<string, any>;
    eventType?: string;
}

export async function submitForm({ operation, input, eventType }: SubmitFormParams) {
    console.log(`Form submitted for operation: ${operation}`, input);

    try {
        const result = await client.mutate({
            operationName: operation,
            input: input
        });

        if (!result.data || !result.data.success) {
            throw new Error(result.data?.message || `An error occurred during ${operation}`);
        }

        console.log(`${operation} result:`, result);

        if (eventType) {
            emitEvent({ type: eventType, payload: result });
        }

        return {
            success: true,
            message: result.data.message || `${operation} completed successfully`,
            data: result.data
        };
    } catch (error) {
        console.error(`Error during ${operation}:`, error);
        throw error;
    }
}
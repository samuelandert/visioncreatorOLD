// apps/app/src/lib/composables/flowOperations.ts
import { client } from '$lib/wundergraph';
import { get } from 'svelte/store';
import { Me } from '$lib/stores';
import { eventBus } from '$lib/composables/eventBus';

interface SubmitFormParams {
    operation: string;
    input: Record<string, any>;
}

export async function submitForm({ operation, input }: SubmitFormParams) {
    console.log(`Form submitted for operation: ${operation}`, input);

    try {
        // Get the current user ID from the Me store
        const currentUser = get(Me);
        const userId = currentUser.id;

        if (!userId) {
            throw new Error('User ID not found. Please ensure you are logged in.');
        }

        // Merge the user ID with the input
        const fullInput = {
            ...input,
            id: userId
        };

        const result = await client.mutate({
            operationName: operation,
            input: fullInput
        });

        if (!result.data || !result.data.success) {
            throw new Error(result.data?.message || `An error occurred during ${operation}`);
        }

        console.log(`${operation} result:`, result);

        // Emit the event after successful operation
        console.log(`Emitting event: ${operation}`);
        eventBus.emit(operation);

        return {
            success: true,
            message: result.data.message || `${operation} completed successfully`,
            data: result.data
        };
    } catch (error) {
        console.error(`Error during ${operation}:`, error);
        return {
            success: false,
            message: error.message || `An error occurred during ${operation}`,
            error: error
        };
    }
}
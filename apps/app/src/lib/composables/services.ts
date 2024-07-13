// coreServices.ts
import { client } from '$lib/wundergraph';
import { getComposerStore } from './composerStores';
import { get } from 'svelte/store';
import { Me, emitEvent } from '$lib/stores';

export const coreServices = {
    mutateStore: (storeID: string, value: any) => {
        const store = getComposerStore(storeID);
        store.update(storeData => {
            storeData.store = { ...storeData.store, ...value };
            return storeData;
        });
    },
    subscribeData: (storeID: string) => {
        const store = getComposerStore(storeID);
        return store;
    },
    testAlert: () => {
        alert("core service alert")
    },
    submitUserForm: async (formData: any) => {
        console.log("User form submitted with data:", formData);
        const userId = get(Me).id;

        if (!userId) {
            throw new Error("User ID not found in Me store");
        }

        try {
            const result = await client.mutate({
                operationName: "updateMe",
                input: {
                    id: userId,
                    full_name: formData.full_name
                }
            });

            if (!result.data.success) {
                throw new Error(result.data.message || 'An error occurred while updating user');
            }

            console.log("Update result:", result);
            emitEvent({ type: 'updateMe', payload: result });

            return {
                success: true,
                message: result.data.message || 'User updated successfully'
            };
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },
    submitCustomerForm: async (formData: any) => {
        console.log("Customer form submitted with data:", formData);
    }
};
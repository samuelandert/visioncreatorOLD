// coreServices.ts
import { client } from '$lib/wundergraph';
import { getComposerStore } from './composerStores';
import { get } from 'svelte/store';
import { Me } from '$lib/stores';

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
    submitForm: async (formData: any) => {
        console.log("Form submitted with data:", formData);
        const userId = get(Me).id;

        if (!userId) {
            console.error("User ID not found in Me store");
            return;
        }

        try {
            const result = await client.mutate({
                operationName: "updateMe",
                input: {
                    id: userId,
                    full_name: formData.full_name
                }
            });
            console.log("Update result:", result);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }
};
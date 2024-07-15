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
    }
};
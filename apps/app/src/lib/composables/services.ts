// coreServices.ts
import { getComposerStore } from './composerStores';

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
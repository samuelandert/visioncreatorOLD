import { eventBus } from './eventBus';
import { getComposerStore } from '$lib/composables/composerStores';
import { get } from 'svelte/store';
import { eventConfig } from './eventConfig';

export function setupEventMapper() {
    console.log('Setting up event mapper');

    eventConfig.events.forEach(eventObj => {
        const [eventName, queriesToRefetch] = Object.entries(eventObj)[0];

        eventBus.on(eventName, (componentId) => {
            console.log(`'${eventName}' event received for component: ${componentId}`);

            // Get the specific store for the component
            const store = getComposerStore(componentId);

            if (store) {
                const storeValue = get(store);
                console.log(`Checking store for component: ${componentId}`, storeValue);

                if (storeValue && storeValue.queries) {
                    queriesToRefetch.forEach(queryName => {
                        if (storeValue.queries[queryName] && typeof storeValue.queries[queryName].refetch === 'function') {
                            console.log(`Refetching ${queryName} for component: ${componentId}`);
                            storeValue.queries[queryName].refetch();
                        }
                    });
                }
            } else {
                console.log(`No store found for component: ${componentId}`);
            }
        });
    });
}
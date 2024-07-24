import { eventBus } from './eventBus';
import { getComposerStore } from '$lib/composables/composerStores';
import { get } from 'svelte/store';
import { eventConfig } from './eventConfig';

export function setupEventMapper() {

    eventConfig.events.forEach(eventObj => {
        const [eventName, config] = Object.entries(eventObj)[0];

        eventBus.on(eventName, (componentId) => {

            // Handle refetch
            if (config.refetch) {
                const store = getComposerStore(componentId);
                if (store) {
                    const storeValue = get(store);

                    if (storeValue && storeValue.queries) {
                        config.refetch.forEach(queryName => {
                            if (storeValue.queries[queryName] && typeof storeValue.queries[queryName].refetch === 'function') {
                                storeValue.queries[queryName].refetch();
                            }
                        });
                    }
                } else {
                    console.log(`No store found for component: ${componentId}`);
                }
            }

            // Handle triggers
            if (config.trigger) {
                config.trigger.forEach(triggerAction => {
                    eventBus.emit(triggerAction);
                });
            }
        });
    });
}
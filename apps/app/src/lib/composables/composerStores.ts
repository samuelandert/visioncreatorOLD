import { writable } from 'svelte/store';

const composerStores = new Map();

// Create or retrieve a composer store
export function createComposerStore(composerId: string, initialState = {}) {
    if (!composerStores.has(composerId)) {
        composerStores.set(composerId, writable(initialState));
    }
    return composerStores.get(composerId);
}

// Get composer store or create a default empty one if not exists
export function getComposerStore(composerId: string) {
    return composerStores.get(composerId) || createComposerStore(composerId);
}
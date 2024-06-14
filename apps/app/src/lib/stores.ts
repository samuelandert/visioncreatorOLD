import { writable } from 'svelte/store';
import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';

interface FutureMe {
    name: string;
    visionid: string,
}

const defaultFutureMe: FutureMe = { name: '', visionid: '' };

export const futureMe = persist(writable<FutureMe>(defaultFutureMe), createLocalStorage(), 'futureMe');
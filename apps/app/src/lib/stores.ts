// create persisted stores here. 
import { writable } from 'svelte/store';
import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';

interface FutureMe {
    name: string;
}

const defaultFutureMe: FutureMe = { name: '' };

export const futureMe = persist(writable<FutureMe>(defaultFutureMe), createLocalStorage(), 'futureMe');
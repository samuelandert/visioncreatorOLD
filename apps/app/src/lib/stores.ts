// create persisted stores here. 
import { writable } from 'svelte/store';
import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';

interface FutureMe {
    name: string;
    visionid: string
}

const defaultFutureMe: FutureMe = { name: '', visionid: "d43636b3-9849-4b52-8b85-8f30657b8f8f" };

export const futureMe = persist(writable<FutureMe>(defaultFutureMe), createLocalStorage(), 'futureMe');
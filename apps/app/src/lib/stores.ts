import { writable } from 'svelte/store';
import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';

type EventType = 'updateMe' | 'otherEventType';

interface FutureMe {
    name: string;
    visionid: string,
}

interface Me {
    id: string;
}

interface Event {
    type: EventType;
    payload: any;
}

export function emitEvent(event: Event) {
    eventStream.update(events => [...events, event]);
}

const defaultFutureMe: FutureMe = { name: '', visionid: '' };
const defaultMe: Me = { id: '' };

export const eventStream = writable<Event[]>([]);

export const futureMe = persist(writable<FutureMe>(defaultFutureMe), createLocalStorage(), 'futureMe');
export const Me = persist(writable<Me>(defaultMe), createLocalStorage(), 'Me');
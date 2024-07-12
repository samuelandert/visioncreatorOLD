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

type LogType = 'success' | 'error' | 'default';

interface LogEntry {
    type: LogType;
    message: string;
    date: string;
    file: string;
}
function getFilePath(importMetaUrl: string): string {
    try {
        const url = new URL(importMetaUrl);
        return url.pathname.split('/src/')[1] || '';
    } catch (error) {
        // If URL parsing fails, return the original string or a fallback
        return importMetaUrl || 'unknown';
    }
}

const createLogger = () => {
    const { subscribe, update } = persist(
        writable<LogEntry[]>([]),
        createLocalStorage(),
        'customLogger'
    );

    return {
        subscribe,
        log: (type: LogType, message: string, file: string) => {
            update(logs => [
                ...logs,
                {
                    type,
                    message,
                    date: new Date().toISOString(),
                    file
                }
            ]);
        },
        clear: () => update(() => [])
    };
};

export const log = createLogger();
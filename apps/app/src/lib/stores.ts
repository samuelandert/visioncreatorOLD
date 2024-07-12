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


type LogType = 'success' | 'error' | 'info' | 'default';

interface LogEntry {
    type: LogType;
    message: string;
    date: string;
    file: string;
}

interface LogFunction {
    (type: LogType, message: string): void;
    subscribe: (run: (value: LogEntry[]) => void) => () => void;
    clear: () => void;
}
function getFilePath(): string {
    const stack = new Error().stack;
    const stackLines = stack?.split('\n') || [];
    for (let i = 2; i < stackLines.length; i++) {
        const line = stackLines[i];
        if (line.includes('/src/') && !line.includes('/src/lib/stores.ts')) {
            const match = line.match(/\((.*):\d+:\d+\)$/);
            if (match && match[1]) {
                const fullPath = match[1];
                const srcIndex = fullPath.indexOf('/src/');
                if (srcIndex !== -1) {
                    let path = fullPath.slice(srcIndex + 5); // +5 to remove '/src/'
                    // Remove ?t= and everything after it
                    const queryIndex = path.indexOf('?t=');
                    if (queryIndex !== -1) {
                        path = path.slice(0, queryIndex);
                    }
                    return path;
                }
            }
        }
    }
    return 'unknown';
}

const createLogger = (): LogFunction => {
    const { subscribe, update } = persist(
        writable<LogEntry[]>([]),
        createLocalStorage(),
        'customLogger'
    );

    const logFunction = (type: LogType, message: string) => {
        const file = getFilePath();
        update(logs => {
            const newLogs = [
                ...logs,
                {
                    type,
                    message,
                    date: new Date().toISOString(),
                    file
                }
            ];
            return newLogs;
        });
    };

    logFunction.subscribe = subscribe;
    logFunction.clear = () => update(() => []);

    return logFunction;
};

export const log = createLogger();
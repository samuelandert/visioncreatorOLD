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


interface Logger {
    subscribe: (run: (value: LogEntry[]) => void) => () => void;
    log: (type: LogType, message: string) => void;
    clear: () => void;
}

function getFilePath(): string {
    const stack = new Error().stack;
    const stackLines = stack?.split('\n') || [];
    for (let i = 3; i < stackLines.length; i++) {
        const match = stackLines[i].match(/\s+at\s+.+\s+\((.+)\)/);
        if (match && match[1]) {
            const fullPath = match[1];
            const srcIndex = fullPath.indexOf('/src/');
            if (srcIndex !== -1) {
                let path = fullPath.slice(srcIndex + 1);
                // Remove ?t= and everything after it
                const queryIndex = path.indexOf('?t=');
                if (queryIndex !== -1) {
                    path = path.slice(0, queryIndex);
                }
                return path;
            }
        }
    }
    return 'unknown';
}

const createLogger = (): Logger => {
    const { subscribe, update } = persist(
        writable<LogEntry[]>([]),
        createLocalStorage(),
        'customLogger'
    );

    const log = (type: LogType, message: string) => {
        const file = getFilePath();
        console.log(`Logging: ${type} - ${message} - ${file}`); // Debug line
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
            console.log('Updated logs:', newLogs); // Debug line
            return newLogs;
        });
    };

    return {
        subscribe,
        log,
        clear: () => update(() => [])
    };
};

export const log: Logger = createLogger();

// Debug line
console.log('Logger created:', log);
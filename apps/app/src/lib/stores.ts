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
    json?: any; // Add this line
}

interface LogFunction {
    (type: LogType, message: string, json?: any): void; // Update this line
    subscribe: (run: (value: LogEntry[]) => void) => () => void;
    clear: () => void;
}

function getFilePath(): string {
    if (import.meta.env.DEV) {
        const stack = new Error().stack;
        const stackLines = stack?.split('\n') || [];
        for (let i = 2; i < stackLines.length; i++) {
            const line = stackLines[i];
            if (line.includes(import.meta.env.BASE_PATH) && !line.includes('/src/lib/stores.ts')) {
                const match = line.match(/\((.*):\d+:\d+\)$/);
                if (match && match[1]) {
                    const fullPath = match[1];
                    const basePathIndex = fullPath.indexOf(import.meta.env.BASE_PATH);
                    if (basePathIndex !== -1) {
                        let path = fullPath.slice(basePathIndex + import.meta.env.BASE_PATH.length);
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
    }

    // Fallback for production or if stack trace is unavailable
    try {
        throw new Error();
    } catch (error) {
        if (error instanceof Error && error.stack) {
            const stackLines = error.stack.split('\n');
            for (const line of stackLines) {
                if (line.includes('at ') && !line.includes('/stores.ts')) {
                    const match = line.match(/at (?:.*\()?(.+?)(?::\d+:\d+)?(?:\))?$/);
                    if (match && match[1]) {
                        return match[1].split('/').slice(-2).join('/');
                    }
                }
            }
        }
    }

    return 'unknown';
}

const createLogger = (): LogFunction => {
    const { subscribe, update } = writable<LogEntry[]>([]);

    const logFunction = (type: LogType, message: string, json?: any) => {
        const file = getFilePath();
        update(logs => {
            const newLogs = [
                ...logs,
                {
                    type,
                    message,
                    date: new Date().toISOString(),
                    file,
                    json
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
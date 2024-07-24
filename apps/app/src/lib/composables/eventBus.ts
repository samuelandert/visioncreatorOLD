// apps/app/src/lib/eventBus.ts
type EventCallback = (...args: any[]) => void;

class EventBus {
    private events: { [key: string]: EventCallback[] } = {};

    on(event: string, callback: EventCallback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event: string, callback: EventCallback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    emit(event: string, ...args: any[]) {
        console.log(`EventBus: Emitting event '${event}' with args:`, args);
        if (!this.events[event]) {
            console.log(`EventBus: No listeners for event '${event}'`);
            return;
        }
        this.events[event].forEach(callback => callback(...args));
    }
}

export const eventBus = new EventBus();
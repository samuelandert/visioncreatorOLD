import { registerSW } from 'virtual:pwa-register';

export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        registerSW({
            onNeedRefresh() {
                // Show a prompt to the user to refresh the app
                console.log('New content available, please refresh');
            },
            onOfflineReady() {
                // Show a ready to work offline to the user
                console.log('App ready to work offline');
            },
            onRegistered(r) {
                console.log('Service worker has been registered');
            },
            onRegisterError(error) {
                console.error('Error during service worker registration:', error);
            },
        });
    }
}
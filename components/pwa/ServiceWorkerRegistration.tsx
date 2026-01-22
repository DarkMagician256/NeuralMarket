'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegistration Component
 * Registers the PWA service worker for offline support
 */
export function ServiceWorkerRegistration() {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            // Only register in production
            if (process.env.NODE_ENV === 'production') {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('[PWA] Service Worker registered:', registration.scope);
                    })
                    .catch((error) => {
                        console.error('[PWA] Service Worker registration failed:', error);
                    });
            }
        }
    }, []);

    return null;
}

export default ServiceWorkerRegistration;

/**
 * Test Setup for Vitest
 * 
 * This file runs before all tests and sets up:
 * - Global mocks for browser APIs
 * - Solana wallet adapter mocks
 * - Environment variables for testing
 */

import { vi, afterEach, afterAll } from 'vitest';

// Mock environment variables for tests
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID = 'A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F';
process.env.NEXT_PUBLIC_SOLANA_CLUSTER = 'devnet';
process.env.NEXT_PUBLIC_RPC_URL = 'https://api.devnet.solana.com';

// Mock window.matchMedia for React components
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();

// Clean up after each test
afterEach(() => {
    vi.clearAllMocks();
});

// Reset all mocks after all tests
afterAll(() => {
    vi.resetAllMocks();
});

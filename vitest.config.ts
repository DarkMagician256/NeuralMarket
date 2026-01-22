import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
        },
    },
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        include: [
            'tests/hooks/**/*.test.ts',
            'tests/hooks/**/*.test.tsx',
            'tests/utils/**/*.test.ts',
        ],
        // Exclude mocha-based tests (they use ts-mocha separately)
        exclude: [
            'node_modules',
            'anchor',
            'neural-agent',
            '.next',
            'tests/integration/**',
            'tests/neural_vault.test.ts',
            'tests/qa_integrity.test.ts',
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules',
                'anchor',
                '.next',
                '**/*.d.ts',
            ],
        },
    },
});

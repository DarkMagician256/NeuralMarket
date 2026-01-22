/**
 * Utility Functions Tests
 * 
 * Tests for utility functions and helpers
 */

import { describe, it, expect } from 'vitest';

describe('Solana Utils', () => {
    it('should convert lamports to SOL', () => {
        const lamports = 1_000_000_000;
        const sol = lamports / 1_000_000_000;
        expect(sol).toBe(1);
    });

    it('should convert SOL to lamports', () => {
        const sol = 2.5;
        const lamports = Math.floor(sol * 1_000_000_000);
        expect(lamports).toBe(2_500_000_000);
    });

    it('should format large numbers with K suffix', () => {
        const formatNumber = (num: number) => {
            if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
            if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
            return num.toString();
        };

        expect(formatNumber(5000)).toBe('5K');
        expect(formatNumber(1500000)).toBe('1.5M');
        expect(formatNumber(500)).toBe('500');
    });

    it('should truncate wallet address', () => {
        const truncateAddress = (address: string, chars = 4) => {
            return `${address.slice(0, chars)}...${address.slice(-chars)}`;
        };

        const address = 'A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F';
        expect(truncateAddress(address)).toBe('A7Fn...NK2F');
    });
});

describe('Date Utils', () => {
    it('should format relative time - seconds', () => {
        const getRelativeTime = (timestamp: number) => {
            const diff = Date.now() - timestamp;
            const seconds = Math.floor(diff / 1000);
            if (seconds < 60) return `${seconds}s ago`;
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            return `${days}d ago`;
        };

        const now = Date.now();
        expect(getRelativeTime(now - 30000)).toBe('30s ago');
        expect(getRelativeTime(now - 300000)).toBe('5m ago');
        expect(getRelativeTime(now - 7200000)).toBe('2h ago');
    });

    it('should format date for display', () => {
        const formatDate = (date: Date) => {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        };

        const date = new Date('2026-01-22T12:00:00');
        const formatted = formatDate(date);
        expect(formatted).toContain('Jan');
        expect(formatted).toContain('2026');
    });
});

describe('Validation Utils', () => {
    it('should validate Solana public key format', () => {
        const isValidPublicKey = (key: string) => {
            // Base58 characters and length check
            const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
            return base58Regex.test(key);
        };

        expect(isValidPublicKey('A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F')).toBe(true);
        expect(isValidPublicKey('invalid-key')).toBe(false);
        expect(isValidPublicKey('')).toBe(false);
    });

    it('should validate amount is positive', () => {
        const isValidAmount = (amount: number) => amount > 0 && isFinite(amount);

        expect(isValidAmount(100)).toBe(true);
        expect(isValidAmount(0.001)).toBe(true);
        expect(isValidAmount(0)).toBe(false);
        expect(isValidAmount(-50)).toBe(false);
    });

    it('should validate ticker format', () => {
        const isValidTicker = (ticker: string) => {
            return /^[A-Z0-9_-]{2,32}$/.test(ticker);
        };

        expect(isValidTicker('FED_RATES_MAR24')).toBe(true);
        expect(isValidTicker('BTCUSD')).toBe(true);
        expect(isValidTicker('a')).toBe(false);
    });
});

describe('Math Utils', () => {
    it('should calculate percentage change', () => {
        const percentChange = (oldVal: number, newVal: number) => {
            return ((newVal - oldVal) / oldVal) * 100;
        };

        expect(percentChange(100, 150)).toBe(50);
        expect(percentChange(200, 150)).toBe(-25);
    });

    it('should clamp value between min and max', () => {
        const clamp = (value: number, min: number, max: number) => {
            return Math.min(Math.max(value, min), max);
        };

        expect(clamp(50, 0, 100)).toBe(50);
        expect(clamp(-10, 0, 100)).toBe(0);
        expect(clamp(150, 0, 100)).toBe(100);
    });

    it('should round to decimal places', () => {
        const roundTo = (num: number, decimals: number) => {
            return Math.round(num * 10 ** decimals) / 10 ** decimals;
        };

        expect(roundTo(3.14159, 2)).toBe(3.14);
        expect(roundTo(2.5555, 3)).toBe(2.556);
    });
});

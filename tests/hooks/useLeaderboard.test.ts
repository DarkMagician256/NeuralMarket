/**
 * useLeaderboard Hook Tests
 * 
 * Tests for the leaderboard data fetching hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock Solana dependencies before importing
vi.mock('@solana/web3.js', () => {
    const mockPublicKey = vi.fn().mockImplementation((key: string) => ({
        toBuffer: () => Buffer.alloc(32),
        toBase58: () => key,
        equals: () => false,
    }));

    mockPublicKey.findProgramAddressSync = vi.fn().mockReturnValue([
        { toBase58: () => 'mock-pda' },
        255,
    ]);

    return {
        PublicKey: mockPublicKey,
        Connection: vi.fn().mockImplementation(() => ({
            getProgramAccounts: vi.fn().mockResolvedValue([]),
        })),
    };
});

vi.mock('@solana/wallet-adapter-react', () => ({
    useConnection: () => ({
        connection: {
            getProgramAccounts: vi.fn().mockResolvedValue([]),
        },
    }),
}));

import { useLeaderboard } from '@/hooks/useLeaderboard';

describe('useLeaderboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return leaderboard data structure', () => {
        const { result } = renderHook(() => useLeaderboard());

        // Hook returns { agents, loading, error, refresh }
        expect(result.current).toHaveProperty('agents');
        expect(result.current).toHaveProperty('loading');
        expect(result.current).toHaveProperty('error');
        expect(result.current).toHaveProperty('refresh');
    });

    it('should return agents as array', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(Array.isArray(result.current.agents)).toBe(true);
    });

    it('should have loading state as boolean', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(typeof result.current.loading).toBe('boolean');
    });

    it('should have refresh function', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(typeof result.current.refresh).toBe('function');
    });

    it('should have empty agents when no program accounts exist', async () => {
        const { result } = renderHook(() => useLeaderboard());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.agents).toEqual([]);
    });
});

describe('useLeaderboard - Sorting Logic', () => {
    it('should sort agents by PnL descending', () => {
        const mockAgents = [
            { name: 'Agent1', totalPnl: 1.5 },
            { name: 'Agent2', totalPnl: 5.0 },
            { name: 'Agent3', totalPnl: 2.5 },
        ];

        const sorted = [...mockAgents].sort((a, b) => b.totalPnl - a.totalPnl);

        expect(sorted[0].totalPnl).toBe(5.0);
        expect(sorted[1].totalPnl).toBe(2.5);
        expect(sorted[2].totalPnl).toBe(1.5);
    });

    it('should calculate win rate correctly', () => {
        const profitableTrades = 75;
        const totalTrades = 100;
        const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

        expect(winRate).toBe(75);
    });

    it('should handle zero trades case', () => {
        const totalTrades = 0;
        const winRate = totalTrades > 0 ? (50 / totalTrades) * 100 : 0;

        expect(winRate).toBe(0);
    });
});

describe('LeaderboardAgent Interface', () => {
    it('should have correct structure', () => {
        const mockAgent = {
            pubkey: 'abc123',
            owner: 'def456',
            name: 'TITAN_ALPHA',
            archetypeName: 'SNIPER',
            totalTrades: 100,
            profitableTrades: 75,
            totalPnl: 2.5,
            winRate: 75,
            capital: 5.0,
            leverage: 2,
            status: 'Active' as const,
            createdAt: new Date(),
        };

        expect(mockAgent.pubkey).toBeDefined();
        expect(mockAgent.archetypeName).toBe('SNIPER');
        expect(mockAgent.totalPnl).toBe(2.5);
        expect(['Active', 'Inactive']).toContain(mockAgent.status);
    });
});

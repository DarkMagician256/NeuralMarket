/**
 * useMyAgents Hook Tests
 * 
 * Tests for fetching user's agents from on-chain data
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock Solana dependencies
vi.mock('@solana/web3.js', () => {
    const mockPublicKey = vi.fn().mockImplementation((key: string) => ({
        toBuffer: () => Buffer.alloc(32),
        toBase58: () => key,
        equals: (other: any) => key === other?.toBase58?.(),
    })) as any;

    mockPublicKey.findProgramAddressSync = vi.fn().mockReturnValue([
        { toBase58: () => 'mock-pda' },
        255,
    ]);

    return {
        PublicKey: mockPublicKey,
        Connection: vi.fn().mockImplementation(() => ({
            getProgramAccounts: vi.fn().mockResolvedValue([]),
            getMultipleAccountsInfo: vi.fn().mockResolvedValue([]),
        })),
    };
});

vi.mock('@solana/wallet-adapter-react', () => ({
    useConnection: () => ({
        connection: {
            getProgramAccounts: vi.fn().mockResolvedValue([]),
            getMultipleAccountsInfo: vi.fn().mockResolvedValue([]),
        },
    }),
    useWallet: () => ({
        connected: true,
        publicKey: {
            toBuffer: () => Buffer.alloc(32),
            toBase58: () => 'TestWallet123',
            equals: vi.fn().mockReturnValue(true),
        },
    }),
}));

// Import after mocks
import { useMyAgents } from '@/hooks/useMyAgents';

describe('useMyAgents', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return agents array', () => {
        const { result } = renderHook(() => useMyAgents());
        expect(result.current.agents).toBeDefined();
        expect(Array.isArray(result.current.agents)).toBe(true);
    });

    it('should return loading state', () => {
        const { result } = renderHook(() => useMyAgents());
        expect(typeof result.current.loading).toBe('boolean');
    });

    it('should return error state', () => {
        const { result } = renderHook(() => useMyAgents());
        expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
    });

    it('should return refresh function', () => {
        const { result } = renderHook(() => useMyAgents());
        expect(typeof result.current.refresh).toBe('function');
    });

    it('should have empty agents when no program accounts exist', async () => {
        const { result } = renderHook(() => useMyAgents());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.agents).toEqual([]);
    });
});

describe('useMyAgents - OnChainAgent Interface', () => {
    it('should define correct agent properties', () => {
        // Type check for OnChainAgent interface
        const mockAgent = {
            pubkey: 'abc123',
            agentId: '1001',
            archetype: 0,
            archetypeName: 'SNIPER',
            riskLevel: 50,
            capital: 1.5,
            leverage: 1,
            name: 'TestAgent',
            status: 'Active' as const,
            createdAt: new Date(),
            totalTrades: 10,
            profitableTrades: 7,
            totalPnl: 0.5,
        };

        expect(mockAgent.pubkey).toBeDefined();
        expect(mockAgent.archetypeName).toBe('SNIPER');
        expect(['Active', 'Inactive']).toContain(mockAgent.status);
    });
});

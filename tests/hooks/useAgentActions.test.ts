/**
 * useAgentActions Hook Tests
 * 
 * Tests for the agent action hooks structure and exports
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all Solana dependencies before importing the hook
vi.mock('@solana/web3.js', () => {
    const mockPublicKey = vi.fn().mockImplementation((key: string) => ({
        toBuffer: () => Buffer.alloc(32),
        toBase58: () => key,
        equals: () => false,
    }));

    // Add static method
    mockPublicKey.findProgramAddressSync = vi.fn().mockReturnValue([
        { toBase58: () => 'mock-pda' },
        255,
    ]);

    return {
        PublicKey: mockPublicKey,
        SystemProgram: {
            transfer: vi.fn().mockReturnValue({}),
        },
        Transaction: vi.fn().mockImplementation(() => ({
            add: vi.fn(),
            recentBlockhash: null,
            feePayer: null,
        })),
        Connection: vi.fn().mockImplementation(() => ({})),
    };
});

vi.mock('@solana/wallet-adapter-react', () => ({
    useConnection: () => ({
        connection: {
            getLatestBlockhash: vi.fn().mockResolvedValue({
                blockhash: 'mock-blockhash',
                lastValidBlockHeight: 1000,
            }),
            confirmTransaction: vi.fn().mockResolvedValue({ value: { err: null } }),
        },
    }),
    useWallet: () => ({
        connected: true,
        publicKey: {
            toBuffer: () => Buffer.alloc(32),
            toBase58: () => '6GJ8hgLB8FpwSHLAFqjKwGKkUUmGRYrmhKVqonvHVPKD',
            equals: vi.fn(),
        },
        sendTransaction: vi.fn().mockResolvedValue('mock-signature'),
    }),
}));

vi.mock('@coral-xyz/anchor', () => ({
    AnchorProvider: vi.fn().mockImplementation(() => ({})),
    Program: vi.fn().mockImplementation(() => ({
        methods: {
            recordTradeStandalone: vi.fn().mockReturnValue({
                accounts: vi.fn().mockReturnThis(),
                rpc: vi.fn().mockResolvedValue('mock-tx-hash'),
            }),
            deactivateAgent: vi.fn().mockReturnValue({
                accounts: vi.fn().mockReturnThis(),
                rpc: vi.fn().mockResolvedValue('mock-tx-hash'),
            }),
            reactivateAgent: vi.fn().mockReturnValue({
                accounts: vi.fn().mockReturnThis(),
                rpc: vi.fn().mockResolvedValue('mock-tx-hash'),
            }),
        },
    })),
    BN: vi.fn().mockImplementation((val) => ({
        toArrayLike: () => Buffer.alloc(8),
        toNumber: () => Number(val),
    })),
}));

// Now import after mocks are set up
import { useAgentActions } from '@/hooks/useAgentActions';
import { renderHook, act } from '@testing-library/react';

describe('useAgentActions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return all action functions', () => {
        const { result } = renderHook(() => useAgentActions());

        expect(result.current.recordTrade).toBeDefined();
        expect(result.current.deactivateAgent).toBeDefined();
        expect(result.current.reactivateAgent).toBeDefined();
        expect(result.current.depositCapital).toBeDefined();
        expect(result.current.isConnected).toBe(true);
    });

    it('should return isConnected as true when wallet is connected', () => {
        const { result } = renderHook(() => useAgentActions());
        expect(result.current.isConnected).toBe(true);
    });

    it('recordTrade should be a function', () => {
        const { result } = renderHook(() => useAgentActions());
        expect(typeof result.current.recordTrade).toBe('function');
    });

    it('deactivateAgent should be a function', () => {
        const { result } = renderHook(() => useAgentActions());
        expect(typeof result.current.deactivateAgent).toBe('function');
    });

    it('reactivateAgent should be a function', () => {
        const { result } = renderHook(() => useAgentActions());
        expect(typeof result.current.reactivateAgent).toBe('function');
    });

    it('depositCapital should be a function', () => {
        const { result } = renderHook(() => useAgentActions());
        expect(typeof result.current.depositCapital).toBe('function');
    });
});

describe('useAgentActions - Trade Operations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('recordTrade should return success with tx hash', async () => {
        const { result } = renderHook(() => useAgentActions());

        let tradeResult: { success: boolean; txHash?: string; error?: string } | undefined;
        await act(async () => {
            tradeResult = await result.current.recordTrade(
                '1001', // agentId
                0.1,    // volume in SOL
                true,   // isProfitable
                0.05    // pnl in SOL
            );
        });

        expect(tradeResult).toBeDefined();
        expect(tradeResult?.success).toBe(true);
        expect(tradeResult?.txHash).toBe('mock-tx-hash');
    });

    it('deactivateAgent should return success', async () => {
        const { result } = renderHook(() => useAgentActions());

        let actionResult: { success: boolean; txHash?: string; error?: string } | undefined;
        await act(async () => {
            actionResult = await result.current.deactivateAgent('1001');
        });

        expect(actionResult).toBeDefined();
        expect(actionResult?.success).toBe(true);
        expect(actionResult?.txHash).toBe('mock-tx-hash');
    });

    it('reactivateAgent should return success', async () => {
        const { result } = renderHook(() => useAgentActions());

        let actionResult: { success: boolean; txHash?: string; error?: string } | undefined;
        await act(async () => {
            actionResult = await result.current.reactivateAgent('1001');
        });

        expect(actionResult).toBeDefined();
        expect(actionResult?.success).toBe(true);
        expect(actionResult?.txHash).toBe('mock-tx-hash');
    });
});

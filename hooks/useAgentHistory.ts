'use client';

import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, ConfirmedSignatureInfo } from '@solana/web3.js';
import { useState, useCallback, useEffect } from 'react';
import { BN } from '@coral-xyz/anchor';

const PROGRAM_ID = new PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");

export interface TradeHistoryItem {
    signature: string;
    timestamp: number;
    // We would need to decode the instructions to get volume/pnl
    // For now, let's just get the transactions
}

export function useAgentHistory(agentPda: string | null) {
    const { connection } = useConnection();
    const [history, setHistory] = useState<ConfirmedSignatureInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        if (!agentPda) return;
        setLoading(true);
        try {
            const pubkey = new PublicKey(agentPda);
            const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 10 });
            setHistory(signatures);
        } catch (err) {
            console.error("Failed to fetch agent history:", err);
        } finally {
            setLoading(false);
        }
    }, [connection, agentPda]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { history, loading, refresh: fetchHistory };
}

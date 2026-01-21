'use client';

import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useState, useCallback, useEffect } from 'react';

const PROGRAM_ID = new PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");
const AGENT_DISCRIMINATOR = [47, 166, 112, 147, 155, 197, 86, 7];

export interface LeaderboardAgent {
    pubkey: string;
    owner: string;
    name: string;
    archetypeName: string;
    totalTrades: number;
    profitableTrades: number;
    totalPnl: number;
    winRate: number;
    capital: number;
    leverage: number;
    status: 'Active' | 'Inactive';
    createdAt: Date;
}

function parseAgentForLeaderboard(pubkey: PublicKey, data: Buffer): LeaderboardAgent | null {
    try {
        const discriminator = Array.from(data.slice(0, 8));
        if (JSON.stringify(discriminator) !== JSON.stringify(AGENT_DISCRIMINATOR)) {
            return null;
        }

        let offset = 8;
        const bump = data.readUInt8(offset); offset += 1;
        const owner = new PublicKey(data.slice(offset, offset + 32)); offset += 32;
        const agentId = data.readBigUInt64LE(offset); offset += 8;
        const archetype = data.readUInt8(offset); offset += 1;
        const riskLevel = data.readUInt8(offset); offset += 1;
        const capital = data.readBigUInt64LE(offset); offset += 8;
        const leverage = data.readUInt8(offset); offset += 1;
        const nameBytes = data.slice(offset, offset + 32); offset += 32;
        const status = data.readUInt8(offset); offset += 1;
        const createdAt = data.readBigInt64LE(offset); offset += 8;
        const totalTrades = data.readBigUInt64LE(offset); offset += 8;
        const profitableTrades = data.readBigUInt64LE(offset); offset += 8;
        const totalPnl = data.readBigInt64LE(offset);

        const name = new TextDecoder().decode(nameBytes).replace(/\0/g, '').trim();
        const archetypeNames = ['SNIPER', 'ORACLE', 'HEDGER', 'WHALE'];
        const totalTradesNum = Number(totalTrades);
        const profitableTradesNum = Number(profitableTrades);

        return {
            pubkey: pubkey.toBase58(),
            owner: owner.toBase58(),
            name: name || `AGENT-${agentId.toString().slice(-6)}`,
            archetypeName: archetypeNames[archetype] || 'UNKNOWN',
            totalTrades: totalTradesNum,
            profitableTrades: profitableTradesNum,
            totalPnl: Number(totalPnl) / 1_000_000_000,
            winRate: totalTradesNum > 0 ? (profitableTradesNum / totalTradesNum) * 100 : 0,
            capital: Number(capital) / 1_000_000_000,
            leverage: leverage,
            status: status === 1 ? 'Active' : 'Inactive',
            createdAt: new Date(Number(createdAt) * 1000),
        };
    } catch (e) {
        return null;
    }
}

export function useLeaderboard() {
    const { connection } = useConnection();
    const [agents, setAgents] = useState<LeaderboardAgent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch ALL program accounts (all agents from all users)
            const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
                commitment: 'confirmed',
            });

            const parsedAgents: LeaderboardAgent[] = [];

            for (const account of accounts) {
                const data = account.account.data;
                if (data.length < 100) continue;

                const discriminator = Array.from(data.slice(0, 8));
                if (JSON.stringify(discriminator) !== JSON.stringify(AGENT_DISCRIMINATOR)) {
                    continue;
                }

                const parsed = parseAgentForLeaderboard(account.pubkey, data);
                if (parsed && parsed.totalTrades > 0) {
                    parsedAgents.push(parsed);
                }
            }

            // Sort by PnL (descending)
            parsedAgents.sort((a, b) => b.totalPnl - a.totalPnl);

            setAgents(parsedAgents);
        } catch (e: any) {
            console.error("Failed to fetch leaderboard:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [connection]);

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [fetchLeaderboard]);

    return { agents, loading, error, refresh: fetchLeaderboard };
}

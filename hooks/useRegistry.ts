'use client';

import { useEffect, useState, useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");

const AGENT_DISCRIMINATOR = [47, 166, 112, 147, 155, 197, 86, 7];

export interface RegistryAgent {
    pubkey: string;
    agentId: string;
    owner: string;
    archetype: number;
    archetypeName: string;
    riskLevel: number;
    capital: number;
    leverage: number;
    name: string;
    status: 'Active' | 'Inactive';
    createdAt: Date;
    totalTrades: number;
    profitableTrades: number;
    totalPnl: number;
    winRate: number;
}

function parseAgentAccount(data: Buffer, pubkey: PublicKey): RegistryAgent | null {
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

        const trades = Number(totalTrades);
        const wins = Number(profitableTrades);
        const winRate = trades > 0 ? (wins / trades) * 100 : 0;

        return {
            pubkey: pubkey.toBase58(),
            agentId: agentId.toString(),
            owner: owner.toBase58(),
            archetype,
            archetypeName: archetypeNames[archetype] || 'UNKNOWN',
            riskLevel,
            capital: Number(capital) / 1_000_000_000,
            leverage,
            name: name || `AGENT-${agentId.toString().slice(-6)}`,
            status: status === 1 ? 'Active' : 'Inactive',
            createdAt: new Date(Number(createdAt) * 1000),
            totalTrades: trades,
            profitableTrades: wins,
            totalPnl: Number(totalPnl) / 1_000_000_000,
            winRate
        };
    } catch (e) {
        console.error("Failed to parse agent:", e);
        return null;
    }
}

export function useRegistry() {
    const { connection } = useConnection();
    const [agents, setAgents] = useState<RegistryAgent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRegistry = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch ALL accounts owned by the program
            const fullAccounts = await connection.getProgramAccounts(PROGRAM_ID);
            const parsedAgents: RegistryAgent[] = [];

            for (const account of fullAccounts) {
                const parsed = parseAgentAccount(account.account.data as Buffer, account.pubkey);
                if (parsed) {
                    parsedAgents.push(parsed);
                }
            }

            // Sync Real TVL (Native SOL Balance)
            if (parsedAgents.length > 0) {
                const pubkeys = parsedAgents.map(a => new PublicKey(a.pubkey));
                // Split into chunks of 100 for getMultipleAccountsInfo limit
                const chunkSize = 99;
                for (let i = 0; i < pubkeys.length; i += chunkSize) {
                    const chunk = pubkeys.slice(i, i + chunkSize);
                    const infos = await connection.getMultipleAccountsInfo(chunk);

                    infos.forEach((info, idx) => {
                        if (info) {
                            const realIdx = i + idx;
                            if (parsedAgents[realIdx]) {
                                parsedAgents[realIdx].capital = info.lamports / 1_000_000_000;
                            }
                        }
                    });
                }
            }

            // Sort by Win Rate (Descending) by default for Leaderboard
            parsedAgents.sort((a, b) => b.winRate - a.winRate);

            setAgents(parsedAgents);
        } catch (e: any) {
            console.error("Failed to fetch registry:", e);
            setError(e.message || "Failed to load market registry");
        } finally {
            setLoading(false);
        }
    }, [connection]);

    useEffect(() => {
        fetchRegistry();
        // Auto-refresh every 60s
        const interval = setInterval(fetchRegistry, 60000);
        return () => clearInterval(interval);
    }, [fetchRegistry]);

    return { agents, loading, error, refresh: fetchRegistry };
}

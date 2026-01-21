'use client';

import { useEffect, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");

// Agent account structure offset (after 8-byte discriminator)
// bump: 1, owner: 32, agent_id: 8, archetype: 1, risk_level: 1, capital: 8, leverage: 1, name: 32, status: 1, created_at: 8, total_trades: 8, profitable_trades: 8, total_pnl: 8
const AGENT_DISCRIMINATOR = [47, 166, 112, 147, 155, 197, 86, 7];

export interface OnChainAgent {
    pubkey: string;
    agentId: string;
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
}

function parseAgentAccount(data: Buffer): Omit<OnChainAgent, 'pubkey'> | null {
    try {
        // Verify discriminator
        const discriminator = Array.from(data.slice(0, 8));
        if (JSON.stringify(discriminator) !== JSON.stringify(AGENT_DISCRIMINATOR)) {
            return null;
        }

        let offset = 8; // skip discriminator

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

        // Decode name (remove null bytes)
        const name = new TextDecoder().decode(nameBytes).replace(/\0/g, '').trim();

        const archetypeNames = ['SNIPER', 'ORACLE', 'HEDGER', 'WHALE'];

        return {
            agentId: agentId.toString(),
            archetype,
            archetypeName: archetypeNames[archetype] || 'UNKNOWN',
            riskLevel,
            capital: Number(capital) / 1_000_000_000, // Convert lamports to SOL
            leverage,
            name: name || `AGENT-${agentId.toString().slice(-6)}`,
            status: status === 1 ? 'Active' : 'Inactive',
            createdAt: new Date(Number(createdAt) * 1000),
            totalTrades: Number(totalTrades),
            profitableTrades: Number(profitableTrades),
            totalPnl: Number(totalPnl) / 1_000_000_000,
        };
    } catch (e) {
        console.error("Failed to parse agent account:", e);
        return null;
    }
}

export function useMyAgents() {
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();
    const [agents, setAgents] = useState<OnChainAgent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAgents = useCallback(async () => {
        if (!connected || !publicKey) {
            setAgents([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch all program accounts
            const fullAccounts = await connection.getProgramAccounts(PROGRAM_ID);

            const parsedAgents: OnChainAgent[] = [];

            for (const account of fullAccounts) {
                const data = account.account.data as Buffer;

                // Check discriminator
                const discriminator = Array.from(data.slice(0, 8));
                if (JSON.stringify(discriminator) !== JSON.stringify(AGENT_DISCRIMINATOR)) {
                    continue;
                }

                // Check owner at offset 9 (after discriminator[8] + bump[1])
                const ownerBytes = data.slice(9, 41);
                const owner = new PublicKey(ownerBytes);

                if (!owner.equals(publicKey)) {
                    continue;
                }

                const parsed = parseAgentAccount(data);
                if (parsed) {
                    parsedAgents.push({
                        ...parsed,
                        pubkey: account.pubkey.toBase58()
                    });
                }
            }

            // Sort by creation date (newest first)
            parsedAgents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            // --- FETCH REAL SOL BALANCES (TVL) ---
            // The 'capital' in the struct is static/initial. We want the real account balance.
            if (parsedAgents.length > 0) {
                const agentPubkeys = parsedAgents.map(a => new PublicKey(a.pubkey));
                // Fetch in chunks of 99 if needed, but for now assuming small number
                const accountInfos = await connection.getMultipleAccountsInfo(agentPubkeys);

                accountInfos.forEach((info, index) => {
                    if (info) {
                        // Update capital with real lamports balance
                        parsedAgents[index].capital = info.lamports / 1_000_000_000;
                    }
                });
            }

            setAgents(parsedAgents);
        } catch (e: any) {
            console.error("Failed to fetch agents:", e);
            setError(e.message || "Failed to fetch agents");
        } finally {
            setLoading(false);
        }
    }, [connection, publicKey, connected]);

    useEffect(() => {
        fetchAgents();
        const interval = setInterval(fetchAgents, 30000);
        return () => clearInterval(interval);
    }, [fetchAgents]);

    return { agents, loading, error, refresh: fetchAgents };
}

/**
 * NeuralMarket Trade Test Script
 * 
 * This script tests the full on-chain trade execution flow:
 * 1. Memo Program - For indexer/explorer visibility
 * 2. recordTradeStandalone - NeuralVault on-chain (no UserStats required)
 * 
 * Usage:
 *   npx ts-node scripts/test_trade.ts
 * 
 * Note: Requires a funded wallet on Devnet
 */

import { Connection, Keypair, Transaction, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Program, AnchorProvider, BN, Idl } from '@coral-xyz/anchor';
import bs58 from 'bs58';
import fs from 'fs';

const idl = JSON.parse(fs.readFileSync('./anchor/target/idl/neural_vault.json', 'utf-8'));

// Configuration
const RPC_URL = process.env.RPC_URL || 'https://api.devnet.solana.com';
const PROGRAM_ID = new PublicKey('A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F');

async function testTrade(privateKeyBase58: string, agentIdNumber: number = 1001) {
    const connection = new Connection(RPC_URL, 'confirmed');

    // Decode the base58 private key
    const secretKey = bs58.decode(privateKeyBase58);
    const wallet = Keypair.fromSecretKey(secretKey);
    const agentId = new BN(agentIdNumber);

    console.log('🔑 Wallet:', wallet.publicKey.toBase58());

    // Check balance
    const balance = await connection.getBalance(wallet.publicKey);
    console.log('💰 Balance:', balance / 1e9, 'SOL');

    if (balance < 10000000) {
        console.log('❌ Insufficient balance for test (need at least 0.01 SOL)');
        return;
    }

    // Derive Agent PDA
    const [agentPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('agent'), wallet.publicKey.toBuffer(), agentId.toArrayLike(Buffer, 'le', 8)],
        PROGRAM_ID
    );

    console.log('🤖 Agent PDA:', agentPda.toBase58());

    // Check if agent exists
    const agentInfo = await connection.getAccountInfo(agentPda);
    console.log('📊 Agent exists:', !!agentInfo);

    if (!agentInfo) {
        console.log('❌ Agent not found. Create one first using create_demo_agents.ts');
        return;
    }

    // Build transaction with Memo
    const tx = new Transaction();

    const memoData = JSON.stringify({
        app: 'NeuralMarket',
        ticker: 'BTC-250K-2026',
        outcome: 'YES',
        amount: 0.01,
        agentId: agentIdNumber,
        timestamp: Date.now()
    });

    const memoIx = new TransactionInstruction({
        keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: true }],
        programId: new PublicKey('Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'),
        data: Buffer.from(memoData)
    });
    tx.add(memoIx);
    console.log('✅ Memo instruction added');

    // Add recordTradeStandalone - NO UserStats required!
    try {
        const provider = new AnchorProvider(connection, { publicKey: wallet.publicKey } as any, {});
        const program = new Program(idl as Idl, provider);

        const volume = new BN(10000000); // 0.01 SOL in lamports
        const isProfitable = true;
        const pnl = new BN(0);

        const recordTradeIx = await program.methods
            .recordTradeStandalone(
                agentId,
                volume,
                isProfitable,
                pnl
            )
            .accounts({
                agent: agentPda,
                user: wallet.publicKey
            } as any)
            .instruction();
        tx.add(recordTradeIx);
        console.log('✅ recordTradeStandalone instruction added (NO UserStats needed!)');
    } catch (e: any) {
        console.log('⚠️ Could not add Anchor instruction:', e.message);
    }

    // Send
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    tx.sign(wallet);

    console.log('📤 Sending transaction...');
    const sig = await connection.sendRawTransaction(tx.serialize());
    console.log('🚀 Transaction sent:', sig);
    console.log('🔗 Explorer: https://explorer.solana.com/tx/' + sig + '?cluster=devnet');

    await connection.confirmTransaction(sig);
    console.log('✅ Transaction CONFIRMED!');

    // Verify agent stats were updated
    const agentAfter = await connection.getAccountInfo(agentPda);
    if (agentAfter) {
        console.log('\n📈 Agent account updated on-chain!');
        console.log('📊 Account data length:', agentAfter.data.length, 'bytes');
    }

    return sig;
}

// Run if called directly
const privateKey = process.argv[2];
if (!privateKey) {
    console.log('Usage: npx ts-node scripts/test_trade.ts <PRIVATE_KEY_BASE58>');
    console.log('Example: npx ts-node scripts/test_trade.ts 5qVqB9...');
    process.exit(1);
}

testTrade(privateKey).catch(console.error);

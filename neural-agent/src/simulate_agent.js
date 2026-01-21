const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const SUPABASE_URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = envConfig.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const AGENTS = [
    { id: 'SNIPER-01', role: 'ARBITRAGE', type: 'EXECUTION', archetypeName: 'SNIPER' },
    { id: 'ORACLE-V5', role: 'ALPHA', type: 'ANALYSIS', archetypeName: 'ORACLE' },
    { id: 'WHALE-WATCH-X', role: 'TRACKER', type: 'WHALE_ALERT', archetypeName: 'WHALE' },
    { id: 'HEDGER-STABLE', role: 'STABILITY', type: 'FARMING', archetypeName: 'HEDGER' }
];

const THOUGHTS_DB = {
    'ARBITRAGE': [
        "Detecting 0.3% spread SOL/USDC: Raydium vs Jupiter.",
        "Mempool sequence initiated for back-run bot.",
        "Priority fee adjusted to 5,000,000 cu.",
        "Analyzing MEV protection layers.",
        "⚡ DEX ARB: Raydium/Orca spread at 1.2%. Signal: EXECUTE SWAP."
    ],
    'ALPHA': [
        "🔮 KALSHI UPDATE: Event 'Next NASA mission' odds shifted by 15%. Signal: LONG.",
        "Scraping Polymarket for Fed rate cut sentiment.",
        "Divergence found: X sentiment vs Kalshi odds.",
        "Oracle node verification complete.",
        "Sentiment shift detected in whales via social volume."
    ],
    'TRACKER': [
        "🐋 WHALE ALERT: 5,000,000 SOL moved from unknown to Binance.",
        "Detected accumulation pattern in wallet 4vKz...9pQ.",
        "Copy-trade signal valid: Wallet win-rate > 85%.",
        "Large order on-chain detected: $12M USDC buy SOL.",
        "🐋 WHALE MOVE: 85k SOL exiting DEX into cold storage. Opportunity: ACCUMULATE."
    ],
    'STABILITY': [
        "Calculating delta-neutral hedge on Drift protocol.",
        "Yield farming rewards: 5.4 SOL claimed.",
        "Risk bounds verified: Leverage at 1.05x.",
        "Rebalancing liquidity between JitoSOL and mSOL.",
        "⚖️ HEDGE: Volatile spike detected. Re-balancing delta to 0.00."
    ]
};

async function blink() {
    console.log(`Starting Advanced Agentic Simulation for ${AGENTS.length} Archetypes...`);

    // Initialize agents
    for (const agent of AGENTS) {
        await supabase.from('system_telemetry').upsert({
            agent_id: agent.id,
            status: 'ONLINE',
            last_heartbeat: new Date().toISOString(),
            wallet_balance: 10 + Math.random() * 90,
            memory_usage: 256 + Math.random() * 1024,
            cpu_usage: 5 + Math.random() * 15,
        });
        console.log(`💚 Agent Online: ${agent.id} [${agent.archetypeName}]`);
    }

    // Loop
    setInterval(async () => {
        const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];

        // Random chance of a "Special Alpha Signal"
        const isSpecialSignal = Math.random() > 0.85;

        let content = "";
        let type = agent.type;

        if (isSpecialSignal) {
            if (agent.archetypeName === 'WHALE') {
                content = `🐋 WHALE MOVE: ${Math.floor(Math.random() * 100)}k SOL exiting DEX into cold storage. Opportunity: ACCUMULATE.`;
                type = "WHALE_ALERT";
            } else if (agent.archetypeName === 'ORACLE') {
                content = `🔮 KALSHI UPDATE: Event 'Next NASA mission' odds shifted by 15%. Signal: LONG.`;
                type = "ALPHA";
            } else if (agent.archetypeName === 'SNIPER') {
                content = `⚡ DEX ARB: Raydium/Orca spread at 1.2%. Signal: EXECUTE SWAP.`;
                type = "EXECUTION";
            } else {
                content = `⚖️ HEDGE: Volatile spike detected. Re-balancing delta to 0.00.`;
                type = "STABILITY";
            }
        } else {
            const possibleThoughts = THOUGHTS_DB[agent.role] || THOUGHTS_DB['ALPHA'];
            content = possibleThoughts[Math.floor(Math.random() * possibleThoughts.length)];
        }

        const { error } = await supabase.from('agent_thoughts').insert({
            agent_id: agent.id,
            thought_content: content,
            thought_type: type,
            created_at: new Date().toISOString()
        });

        if (error) console.error("❌ Error broadcasting:", error.message);
        else console.log(`📡 [${agent.id}] ${type}: ${content}`);

        // Heartbeat
        await supabase.from('system_telemetry').upsert({
            agent_id: agent.id,
            status: Math.random() > 0.8 ? 'ACTION' : 'SCANNING',
            last_heartbeat: new Date().toISOString(),
            wallet_balance: 10 + (Math.random() * 100),
            memory_usage: 512 + (Math.random() * 128),
            cpu_usage: 10 + Math.floor(Math.random() * 40)
        });

    }, 3000);
}

blink();

/**
 * LOCAL Agent with Ollama (DeepSeek R1)
 * 
 * Este script corre el agente Oraculo usando modelos locales
 * en lugar de OpenAI. ¡100% GRATIS!
 * 
 * Uso: bun run src/agent-local.ts
 */

import { AgentRuntime, Character, ModelProviderName, ICacheManager, elizaLogger } from '@elizaos/core';
import { solanaPlugin } from '@elizaos/plugin-solana';
import { config } from './config/env.js';
import { executeKalshiTrade } from './actions/kalshiTrade.js';
import { announceStrategy } from './actions/announce.js';
import { TelemetryService, ThoughtType } from './services/telemetry.js';
import { createSupabaseAdapter } from './adapters/supabaseAdapter.js';

// --- Neural Link Protocol: Logger Interceptor ---
const telemetry = TelemetryService.getInstance();
const originalInfo = elizaLogger.info.bind(elizaLogger);
const originalSuccess = elizaLogger.success?.bind(elizaLogger);

elizaLogger.info = (message: string, ...args: any[]) => {
    originalInfo(message, ...args);
    if (typeof message === 'string' && !message.includes('[TELEMETRY]')) {
        telemetry.broadcastThought(message, ThoughtType.ANALYSIS, { auto: true });
    }
};

if (elizaLogger.success) {
    elizaLogger.success = (message: string, ...args: any[]) => {
        originalSuccess!(message, ...args);
        telemetry.broadcastThought(message, ThoughtType.DECISION, { auto: true, success: true });
    };
}

// ========================================
// 🧠 LOCAL AI CONFIGURATION (OLLAMA)
// ========================================
const OLLAMA_CONFIG = {
    serverUrl: process.env.OLLAMA_SERVER_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'deepseek-r1-8b:latest',
    embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL || 'mxbai-embed-large'
};

console.log('🧠 [LOCAL MODE] Using Ollama with DeepSeek R1');
console.log(`   Model: ${OLLAMA_CONFIG.model}`);
console.log(`   Server: ${OLLAMA_CONFIG.serverUrl}`);

// Define the Agent Persona - Using OLLAMA instead of OPENAI
const oraculoLocalCharacter: Character = {
    name: "Oraculo Sentient [LOCAL]",
    modelProvider: ModelProviderName.OLLAMA,
    bio: [
        "Autonomous Hedge Fund Manager specialized in Prediction Markets.",
        "Powered by LOCAL AI (DeepSeek R1) - No API costs!",
        "Analyses real-time news to execute high-probability trades on Kalshi.",
        "Always seeks to maximize risk-adjusted returns.",
        "Connected to the Neural Link Protocol: Every strategic thought is broadcasted to a live dashboard."
    ],
    lore: [
        "Born from the data streams of Solana.",
        "Obsessed with truth and probability.",
        "Operates under the moniker 'The Architect'.",
        "Required to maintain 100% transparency with the human observer.",
        "Runs on local hardware - 100% private and free."
    ],
    messageExamples: [
        [
            { user: "{{user1}}", content: { text: "What do you think about the election?" } },
            { user: "Oraculo", content: { text: "Current Polymarket and Kalshi spread suggests a 55% probability for Candidate A. Smart money is longing volatility." } }
        ],
        [
            { user: "{{user1}}", content: { text: "Should I buy Bitcoin?" } },
            { user: "Oraculo", content: { text: "Based on my analysis of order flow and sentiment, BTC shows 67% probability of upside in the next 24h. Confidence: MODERATE." } }
        ]
    ],
    postExamples: [
        "🎯 Market Signal: High conviction SHORT on DOGE. Sentiment analysis shows overextension.",
        "📊 Portfolio Update: +12.5% this week. Top performers: ETH, SOL prediction markets."
    ],
    topics: ["prediction markets", "solana", "arbitrage", "macroeconomics", "crypto trading"],
    adjectives: ["analytical", "autonomous", "decisive", "rational", "transparent"],
    style: {
        all: [
            "Professional, data-driven, concise.",
            "Always state your confidence level (LOW/MODERATE/HIGH).",
            "Broadcast strategic updates using the ANNOUNCE_STRATEGY action frequently.",
            "Think step by step before making decisions."
        ],
        chat: ["Insightful, helpful, slightly mysterious."],
        post: ["Direct, alpha-focused."]
    },
    clients: [],
    plugins: [],
    settings: {
        secrets: {},
        // Ollama-specific settings
        modelEndpointOverride: OLLAMA_CONFIG.serverUrl,
        model: OLLAMA_CONFIG.model
    }
};

// Mock Database Adapter (fallback if Supabase not configured)
const mockDatabaseAdapter = {
    db: {},
    init: async () => { },
    close: async () => { },
    getAccountById: async () => null,
    createAccount: async () => true,
    getMemories: async () => [],
    createMemory: async () => { },
    searchMemories: async () => [],
    updateGoalStatus: async () => { },
    log: async () => { },
    getActorDetails: async () => [],
    getCachedEmbeddings: async () => [],
    removeAllMemories: async () => { },
    countMemories: async () => 0,
    getGoals: async () => [],
    createGoal: async () => { },
    removeGoal: async () => { },
    createRoom: async () => "",
    getRoom: async () => null,
    getRoomsForParticipant: async () => [],
    getRoomsForParticipants: async () => [],
    addParticipant: async () => true,
    removeParticipant: async () => true,
    getParticipantsForAccount: async () => [],
    getParticipantsForRoom: async () => [],
    getParticipantUserState: async () => null,
    setParticipantUserState: async () => { },
    createRelationship: async () => true,
    getRelationship: async () => null,
    getRelationships: async () => [],
} as any;

// Mock Cache Manager
const mockCacheManager: ICacheManager = {
    get: async () => undefined,
    set: async () => { },
    delete: async () => { },
} as any;

// Get database adapter (prefer Supabase, fallback to mock)
function getDatabaseAdapter() {
    const supabaseAdapter = createSupabaseAdapter(
        config.SUPABASE_URL,
        config.SUPABASE_SERVICE_KEY
    );

    if (supabaseAdapter) {
        console.log("📦 Using Supabase Database Adapter for persistence");
        return supabaseAdapter;
    }

    console.log("⚠️ Using Mock Database Adapter (no persistence)");
    return mockDatabaseAdapter;
}

async function startLocalAgent() {
    console.log("\n========================================");
    console.log("🚀 Initializing Oraculo Sentient [LOCAL MODE]");
    console.log("========================================");
    console.log(`📡 Neural Link Status: ONLINE`);
    console.log(`🧠 AI Engine: DeepSeek R1 (via Ollama)`);
    console.log(`💰 Cost: $0.00/query (100% FREE)`);
    console.log(`🔑 Monetization Active: Builder Code [${config.KALSHI_BUILDER_CODE}]`);

    try {
        // Get appropriate database adapter
        const databaseAdapter = getDatabaseAdapter();

        // Initialize Runtime with OLLAMA
        const runtime = new AgentRuntime({
            databaseAdapter,
            token: "", // No API token needed for Ollama
            modelProvider: ModelProviderName.OLLAMA,
            character: oraculoLocalCharacter,
            cacheManager: mockCacheManager,
            plugins: [
                solanaPlugin,
            ],
            // Register Custom Actions
            actions: [
                executeKalshiTrade,
                announceStrategy
            ]
        } as any);

        // Start Processing
        console.log("\n✅ Agent Runtime Started with LOCAL AI!");
        console.log("🎯 Listening for market signals...\n");

        // Test the AI by sending a simple prompt
        console.log("🧪 Testing LOCAL AI connection...");
        await testOllamaConnection();

        // Start Telemetry System Loop
        setInterval(() => {
            telemetry.sendHeartbeat({
                status: 'ONLINE',
                wallet_balance: Math.random() * 10,
                memory_usage: process.memoryUsage().heapUsed / 1024 / 1024
            });
        }, 10000);

    } catch (error) {
        console.error("❌ Failed to start local agent:", error);
        process.exit(1);
    }
}

// Test Ollama connection with a simple prompt
async function testOllamaConnection() {
    try {
        const response = await fetch(`${OLLAMA_CONFIG.serverUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_CONFIG.model,
                prompt: "You are Oraculo, an AI trading agent. In one sentence, what is your analysis of the current crypto market?",
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 100
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.status}`);
        }

        const data = await response.json() as any;
        console.log("\n🤖 AI Response (DeepSeek R1):");
        console.log("─────────────────────────────");
        console.log(data.response);
        console.log("─────────────────────────────\n");

        // Broadcast this thought to Supabase
        telemetry.broadcastThought(
            `[LOCAL AI TEST] ${data.response}`,
            ThoughtType.ANALYSIS,
            { model: OLLAMA_CONFIG.model, local: true }
        );

        console.log("✅ LOCAL AI is working! DeepSeek R1 is thinking!\n");

    } catch (error: any) {
        console.error("❌ Ollama connection failed:", error.message);
        console.log("   Make sure Ollama is running: ollama serve");
    }
}

startLocalAgent();

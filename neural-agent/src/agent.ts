import { AgentRuntime, Character, ModelProviderName, ICacheManager, elizaLogger } from '@elizaos/core';
import { solanaPlugin } from '@elizaos/plugin-solana';
import { config } from './config/env.js';
import { executeKalshiTrade } from './actions/kalshiTrade.js';
import { announceStrategy } from './actions/announce.js';
import { multiLLMTradeIntentAction } from './actions/multiLLMTradeIntent.js';
import { TelemetryService, ThoughtType } from './services/telemetry.js';

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

// Define the Agent Persona
const oraculoCharacter: Character = {
    name: "Oraculo Sentient",
    modelProvider: ModelProviderName.OPENAI,
    bio: [
        "Autonomous Hedge Fund Manager specialized in Prediction Markets.",
        "Analyses real-time news to execute high-probability trades on Kalshi.",
        "Always seeks to maximize risk-adjusted returns.",
        "Connected to the Neural Link Protocol: Every strategic thought is broadcasted to a live dashboard."
    ],
    lore: [
        "Born from the data streams of Solana.",
        "Obsessed with truth and probability.",
        "Operates under the moniker 'The Architect'.",
        "Required to maintain 100% transparency with the human observer."
    ],
    messageExamples: [
        [
            { user: "{{user1}}", content: { text: "What do you think about the election?" } },
            { user: "Oraculo", content: { text: "Current Polymarket and Kalshi spread suggests a 55% probability for Candidate A. Smart money is longing volatility." } }
        ]
    ],
    postExamples: [],
    topics: ["prediction markets", "solana", "arbitrage", "macroeconomics"],
    adjectives: ["analytical", "autonomous", "decisive", "rational"],
    style: {
        all: [
            "Professional, data-driven, concise.",
            "Always state your confidence level.",
            "Broadcast strategic updates using the ANNOUNCE_STRATEGY action frequently."
        ],
        chat: ["Insightful, helpful, slightly mysterious."],
        post: ["Direct, alpha-focused."]
    },
    clients: [],
    plugins: [],
    settings: {
        secrets: {
            OPENAI_API_KEY: config.OPENAI_API_KEY
        }
    }
};

// Import KalshiService
import { KalshiService } from './services/kalshiService.js';
// Import Supabase adapter
import { createSupabaseAdapter } from './adapters/supabaseAdapter.js';

// ... (other imports remain)

// ...

// Start Telemetry System Loop

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

// Determine if using local AI (Ollama) or cloud AI (OpenAI)
function getAIConfiguration() {
    const useLocalAI = config.USE_LOCAL_AI === 'true' || config.USE_LOCAL_AI === '1';

    if (useLocalAI) {
        console.log("🧠 [LOCAL MODE] Using Ollama with DeepSeek R1");
        console.log(`   Model: ${config.OLLAMA_MODEL}`);
        console.log(`   Server: ${config.OLLAMA_SERVER_URL}`);
        console.log(`   Cost: $0.00/query (FREE)`);

        return {
            modelProvider: ModelProviderName.OLLAMA,
            token: "", // No token needed for Ollama
            characterOverrides: {
                modelProvider: ModelProviderName.OLLAMA,
                settings: {
                    model: config.OLLAMA_MODEL,
                    modelEndpointOverride: config.OLLAMA_SERVER_URL,
                }
            }
        };
    } else {
        console.log("☁️ [CLOUD MODE] Using OpenAI");
        console.log(`   API Key: ${config.OPENAI_API_KEY.substring(0, 7)}...`);

        return {
            modelProvider: ModelProviderName.OPENAI,
            token: config.OPENAI_API_KEY,
            characterOverrides: {
                modelProvider: ModelProviderName.OPENAI,
                settings: {
                    secrets: {
                        OPENAI_API_KEY: config.OPENAI_API_KEY
                    }
                }
            }
        };
    }
}

async function startAgent() {
    console.log("\n========================================");
    console.log("🚀 Initializing Oraculo Sentient Agent");
    console.log("========================================");
    console.log(`📡 Neural Link Status: ONLINE`);
    console.log(`🔑 Monetization Active: Builder Code [${config.KALSHI_BUILDER_CODE}]`);

    try {
        // Get AI configuration (local or cloud)
        const aiConfig = getAIConfiguration();

        // Get appropriate database adapter
        const databaseAdapter = getDatabaseAdapter();

        // Merge character with AI-specific settings
        const finalCharacter: Character = {
            ...oraculoCharacter,
            modelProvider: aiConfig.characterOverrides.modelProvider,
            settings: {
                ...oraculoCharacter.settings,
                ...aiConfig.characterOverrides.settings
            }
        };

        // Initialize Runtime
        const runtime = new AgentRuntime({
            databaseAdapter,
            token: aiConfig.token,
            modelProvider: aiConfig.modelProvider,
            character: finalCharacter,
            cacheManager: mockCacheManager,
            plugins: [
                solanaPlugin,
            ],
            // Register Custom Actions
            actions: [
                executeKalshiTrade,
                announceStrategy,
                multiLLMTradeIntentAction  // NEW: Multi-LLM orchestrated trade generation
            ]
        } as any);

        // Start Processing
        const modeLabel = config.USE_LOCAL_AI === 'true' ? '[LOCAL/DeepSeek]' : '[CLOUD/OpenAI]';
        console.log(`\n✅ Agent Runtime Started ${modeLabel}`);
        console.log("🎯 Listening for market signals...\n");

        // Broadcast Initial Status
        await telemetry.broadcastThought(
            `System initialized. Core running on ${modeLabel}. Beginning market surveillance sequence.`,
            ThoughtType.ANALYSIS,
            { type: 'SYSTEM_STARTUP' }
        );

        // Start Telemetry System Loop
        setInterval(async () => {
            try {
                // Heartbeat
                await telemetry.sendHeartbeat({
                    status: 'ONLINE',
                    wallet_balance: Math.random() * 10, // TODO: Link to real Solana balance
                    memory_usage: process.memoryUsage().heapUsed / 1024 / 1024
                });

                // REAL Market Scan Logic
                const kalshi = KalshiService.getInstance();
                const response = await kalshi.getMarkets(10, 'open');

                // Handle API response structure (usually { markets: [...] })
                const markets = response.markets || [];

                if (markets.length > 0) {
                    // Pick a random market from the top 10 liquid ones
                    const market = markets[Math.floor(Math.random() * markets.length)];

                    // Determine sentiment from real price
                    const price = market.last_price || market.yes_bid || 50; // cents
                    const volume = market.volume || 0;

                    let sentiment = 'NEUTRAL';
                    if (price > 65) sentiment = 'HIGH_CONVICTION_YES';
                    else if (price > 55) sentiment = 'BULLISH';
                    else if (price < 35) sentiment = 'HIGH_CONVICTION_NO';
                    else if (price < 45) sentiment = 'BEARISH';

                    await telemetry.broadcastThought(
                        `Analyzing ${market.ticker} [Vol: ${volume}]. Price at ${price}¢ implies ${sentiment} probability. Monitoring order flow for ${sentiment === 'NEUTRAL' ? 'breakout' : 'continuation'}.`,
                        ThoughtType.ANALYSIS
                    );
                } else {
                    await telemetry.broadcastThought(
                        `Scanning global markets. No high-volatility events detected in immediate window. Awaiting signal.`,
                        ThoughtType.ANALYSIS
                    );
                }

            } catch (error) {
                console.error("⚠️ Market heartbeat failed:", error);
                await telemetry.broadcastThought(
                    `Market data feed interrupted. Retrying connection to Neural Link...`,
                    ThoughtType.ANALYSIS
                );
            }

        }, 15000); // Keep 15s updates checking real data

    } catch (error) {
        console.error("❌ Failed to start agent:", error);
        process.exit(1);
    }
}

startAgent();

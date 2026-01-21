import { AgentRuntime, Character, ModelProviderName, ICacheManager, elizaLogger } from '@elizaos/core';
import { solanaPlugin } from '@elizaos/plugin-solana';
import { config } from './config/env';
import { executeKalshiTrade } from './actions/kalshiTrade';
import { announceStrategy } from './actions/announce';
import { TelemetryService, ThoughtType } from './services/telemetry';

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

// Mock Database Adapter for Demo
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

async function startAgent() {
    console.log("🚀 Initializing Oraculo Sentient Agent...");
    console.log(`📡 Neural Link Status: ONLINE`);
    console.log(`🔑 Monetization Active: Builder Code [${config.KALSHI_BUILDER_CODE}]`);

    try {
        // Initialize Runtime
        const runtime = new AgentRuntime({
            databaseAdapter: mockDatabaseAdapter,
            token: config.OPENAI_API_KEY,
            modelProvider: ModelProviderName.OPENAI,
            character: oraculoCharacter,
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
        console.log("✅ Agent Runtime Started. Listening for market signals...");

        // Start Telemetry System Loop
        setInterval(() => {
            telemetry.sendHeartbeat({
                status: 'ONLINE',
                wallet_balance: Math.random() * 10, // Simulated or fetch from public key
                memory_usage: process.memoryUsage().heapUsed / 1024 / 1024
            });
        }, 10000);

    } catch (error) {
        console.error("❌ Failed to start agent:", error);
        process.exit(1);
    }
}

startAgent();

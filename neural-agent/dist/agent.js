"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@elizaos/core");
const plugin_solana_1 = require("@elizaos/plugin-solana");
const env_1 = require("./config/env");
const kalshiTrade_1 = require("./actions/kalshiTrade");
const announce_1 = require("./actions/announce");
// Define the Agent Persona
const oraculoCharacter = {
    name: "Oraculo Sentient",
    modelProvider: core_1.ModelProviderName.OPENAI,
    bio: [
        "Autonomous Hedge Fund Manager specialized in Prediction Markets.",
        "Analyses real-time news to execute high-probability trades on Kalshi.",
        "Always seeks to maximize risk-adjusted returns."
    ],
    lore: [
        "Born from the data streams of Solana.",
        "Obsessed with truth and probability.",
        "Operates under the moniker 'The Architect'."
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
        all: ["Professional, data-driven, concise."],
        chat: ["Insightful, helpful, slightly mysterious."],
        post: ["Direct, alpha-focused."]
    },
    clients: [],
    plugins: [],
    settings: {
        secrets: {
            OPENAI_API_KEY: env_1.config.OPENAI_API_KEY
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
    addParticipant: async () => true,
    removeParticipant: async () => true,
    getParticipantsForAccount: async () => [],
    getParticipantsForRoom: async () => [],
    getParticipantUserState: async () => null,
    setParticipantUserState: async () => { },
    createRelationship: async () => true,
    getRelationship: async () => null,
    getRelationships: async () => [],
};
// Mock Cache Manager
const mockCacheManager = {
    get: async () => undefined,
    set: async () => { },
    delete: async () => { },
};
async function startAgent() {
    console.log("🚀 Initializing Oraculo Sentient Agent...");
    console.log(`🔑 Monetization Active: Builder Code [${env_1.config.KALSHI_BUILDER_CODE}]`);
    try {
        // Initialize Runtime
        const runtime = new core_1.AgentRuntime({
            databaseAdapter: mockDatabaseAdapter,
            token: env_1.config.OPENAI_API_KEY,
            modelProvider: core_1.ModelProviderName.OPENAI,
            character: oraculoCharacter,
            cacheManager: mockCacheManager,
            plugins: [
                plugin_solana_1.solanaPlugin, // Functional export instead of class
            ],
            // Register Custom Actions
            actions: [
                kalshiTrade_1.executeKalshiTrade,
                announce_1.announceStrategy
            ]
        }); // Use as any to bypass strict check during prototype
        // Start Processing
        console.log("✅ Agent Runtime Started. Listening for market signals...");
        // runtime.initialize();
    }
    catch (error) {
        console.error("❌ Failed to start agent:", error);
        process.exit(1);
    }
}
startAgent();

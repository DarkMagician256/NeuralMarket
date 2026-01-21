"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announceStrategy = void 0;
const telemetry_1 = require("../services/telemetry");
exports.announceStrategy = {
    name: 'ANNOUNCE_STRATEGY',
    similes: ['BROADCAST_THOUGHT', 'UPDATE_DASHBOARD', 'SHARE_ANALYSIS'],
    description: 'Use this action to send a strategic update, neural thought process, or decision to the external public dashboard in real-time.',
    validate: async (runtime, message) => {
        // Always valid if the message exists
        return !!message.content.text;
    },
    handler: async (runtime, message, state, options = {}, callback) => {
        try {
            const telemetry = telemetry_1.TelemetryService.getInstance();
            // Determine content. If it's a specific strategic thought or just the last message.
            const thoughtText = message.content.text;
            // Broadcast as DECISION to highlight on the dashboard
            await telemetry.broadcastThought(thoughtText, telemetry_1.ThoughtType.DECISION, { source: 'manual_announce' });
            if (callback) {
                callback({
                    text: "Strategic update broadcast to Neural Dashboard.",
                    content: { success: true }
                });
            }
            return true;
        }
        catch (error) {
            console.error('[ANNOUNCE_STRATEGY] Error:', error);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Broadcast your latest market analysis to the dashboard." }
            },
            {
                user: "OraculoBot",
                content: {
                    text: "Broadcasting current sentiment on SOL/USDC to the Neural Link.",
                    action: "ANNOUNCE_STRATEGY"
                }
            }
        ]
    ]
};

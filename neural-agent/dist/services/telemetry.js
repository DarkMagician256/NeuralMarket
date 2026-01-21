"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = exports.ThoughtType = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const core_1 = require("@elizaos/core");
const env_1 = require("../config/env");
var ThoughtType;
(function (ThoughtType) {
    ThoughtType["ANALYSIS"] = "ANALYSIS";
    ThoughtType["DECISION"] = "DECISION";
    ThoughtType["EXECUTION"] = "EXECUTION";
    ThoughtType["ERROR"] = "ERROR";
    ThoughtType["SOCIAL"] = "SOCIAL";
})(ThoughtType || (exports.ThoughtType = ThoughtType = {}));
class TelemetryService {
    constructor() {
        this.supabase = (0, supabase_js_1.createClient)(env_1.config.SUPABASE_URL, env_1.config.SUPABASE_SERVICE_KEY);
        this.agentId = 'oraculo-sentient-v2'; // Matches characterize or env if added
    }
    static getInstance() {
        if (!TelemetryService.instance) {
            TelemetryService.instance = new TelemetryService();
        }
        return TelemetryService.instance;
    }
    /**
     * Broadcast a thought to the public dashboard via Supabase.
     */
    async broadcastThought(content, type = ThoughtType.ANALYSIS, metadata = {}) {
        core_1.elizaLogger.info(`[TELEMETRY] Broadcasting ${type}: ${content.substring(0, 50)}...`);
        const { error } = await this.supabase
            .from('agent_thoughts')
            .insert({
            agent_id: this.agentId,
            thought_content: content,
            thought_type: type,
            metadata: metadata,
            created_at: new Date().toISOString()
        });
        if (error) {
            core_1.elizaLogger.error(`[TELEMETRY] Failed to broadcast thought: ${error.message}`);
        }
    }
    /**
     * Record a market prediction/action.
     */
    async logPrediction(ticker, side, confidence, proofLink) {
        const { error } = await this.supabase
            .from('market_predictions')
            .insert({
            agent_id: this.agentId,
            market_ticker: ticker,
            prediction_side: side,
            confidence_level: confidence,
            proof_link: proofLink,
            status: 'ACTIVE'
        });
        if (error) {
            core_1.elizaLogger.error(`[TELEMETRY] Failed to log prediction: ${error.message}`);
        }
    }
    /**
     * System Heartbeat
     */
    async sendHeartbeat(stats = {}) {
        const { error } = await this.supabase
            .from('system_telemetry')
            .upsert({
            agent_id: this.agentId,
            last_heartbeat: new Date().toISOString(),
            ...stats
        });
        if (error) {
            core_1.elizaLogger.error(`[TELEMETRY] Heartbeat failed: ${error.message}`);
        }
    }
}
exports.TelemetryService = TelemetryService;

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { elizaLogger } from '@elizaos/core';
import { config } from '../config/env.js';

export enum ThoughtType {
    ANALYSIS = 'ANALYSIS',
    DECISION = 'DECISION',
    EXECUTION = 'EXECUTION',
    ERROR = 'ERROR',
    SOCIAL = 'SOCIAL'
}

export class TelemetryService {
    private static instance: TelemetryService;
    private supabase: SupabaseClient;
    private agentId: string;

    private constructor() {
        this.supabase = createClient(
            config.SUPABASE_URL,
            config.SUPABASE_SERVICE_KEY
        );
        this.agentId = 'oraculo-sentient-v2'; // Matches characterize or env if added
    }

    public static getInstance(): TelemetryService {
        if (!TelemetryService.instance) {
            TelemetryService.instance = new TelemetryService();
        }
        return TelemetryService.instance;
    }

    /**
     * Broadcast a thought to the public dashboard via Supabase.
     */
    public async broadcastThought(content: string, type: ThoughtType = ThoughtType.ANALYSIS, metadata: any = {}) {
        elizaLogger.info(`[TELEMETRY] Broadcasting ${type}: ${content.substring(0, 50)}...`);

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
            elizaLogger.error(`[TELEMETRY] Failed to broadcast thought: ${error.message}`);
        }
    }

    /**
     * Record a market prediction/action.
     */
    public async logPrediction(ticker: string, side: string, confidence: number, proofLink?: string) {
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
            elizaLogger.error(`[TELEMETRY] Failed to log prediction: ${error.message}`);
        }
    }

    /**
     * System Heartbeat
     */
    public async sendHeartbeat(stats: any = {}) {
        const { error } = await this.supabase
            .from('system_telemetry')
            .upsert({
                agent_id: this.agentId,
                last_heartbeat: new Date().toISOString(),
                ...stats
            });

        if (error) {
            elizaLogger.error(`[TELEMETRY] Heartbeat failed: ${error.message}`);
        }
    }
}

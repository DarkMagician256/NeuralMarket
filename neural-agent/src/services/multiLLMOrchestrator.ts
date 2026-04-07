/**
 * ============ MULTI-LLM DYNAMIC ORCHESTRATOR ============
 *
 * Tier 3 (Heavy Mining / Local):    DeepSeek R1 via Ollama (raw sentiment + Kalshi metrics)
 * Tier 2 (API Formatting & Audits): Claude 3.5 Sonnet (structured JSON + board summaries)
 * Tier 1 (Execution Validation):    OpenAI o1 (final risk approval before DFlow)
 *
 * No Flash execution. Kalshi bets take days/weeks. No high-frequency loops.
 * Non-Custodial: AI proposes, User approves, Vault executes via Anchor CPI.
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import axios from 'axios';
import crypto from 'crypto';
import { elizaLogger } from '@elizaos/core';
import { formatAndAuditViaKalshiTier2, KalshiBuildersCompliance } from './kalshiEnhancedOrchestrator';
import { fetchKalshiMarketData, fetchTopTradersForMarket } from './kalshiIntegration';
import { PublicKey } from '@solana/web3.js';

// ============ CONFIGURATION ============

const OLLAMA_BASE_URL = process.env.OLLAMA_SERVER_URL || 'http://localhost:11434';
const DEEPSEEK_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:8b';

// Initialize Anthropic (Claude) client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize OpenAI (o1) client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============ TYPE DEFINITIONS ============

export interface KalshiMarketData {
  ticker: string;
  description: string;
  current_price_yes: number; // Implied probability (0-1)
  current_price_no: number;
  volume_24h: number;
  liquidity_depth: number;
  resolved_at?: number;
}

export interface SentimentAnalysis {
  score: number; // -100 (bearish) to +100 (bullish)
  key_signals: string[];
  data_sources: string[];
  confidence: number; // 0-100
  timestamp: number;
}

export interface TradeIntent {
  vault_id: string;
  market_ticker: string;
  side: 'YES' | 'NO';
  amount_usdc: number;
  confidence: number; // 0-100
  risk_score: number; // 0-100
  reasoning: string;
  audit_trail: string; // HMAC-SHA256 signed audit payload
  approval_required: boolean; // If risk_score > 75
}

export interface RiskAssessment {
  approved: boolean;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  capital_at_risk: number;
  position_ratio: number; // % of vault balance
  reasoning: string;
  timestamp: number;
}

// ============ TIER 3: LOCAL DEEPSEEK R1 (SENTIMENT ANALYSIS) ============

/**
 * Heavy lifting: Process massive sentiment streams + Kalshi order book depth
 * No API costs. Runs locally via Ollama.
 */
export async function analyzeSentimentViaTier3(
  marketData: KalshiMarketData,
  twitterStream: string,
  newsHeadlines: string[]
): Promise<SentimentAnalysis> {
  const prompt = `
You are a financial sentiment analyst. Analyze the following Kalshi prediction market for directional bias:

Market: ${marketData.ticker}
Current YES Price: ${marketData.current_price_yes}
Current NO Price: ${marketData.current_price_no}
Volume 24h: ${marketData.volume_24h} USDC
Liquidity Depth: ${marketData.liquidity_depth}

Twitter Sentiment Stream (last 100 tweets):
${twitterStream}

News Headlines:
${newsHeadlines.join('\n')}

Provide a JSON response with:
- sentiment_score: -100 (bearish) to +100 (bullish)
- key_signals: [list of 3-5 signals]
- confidence: 0-100 (how confident are you?)

Be concise. No fluff.
`;

  try {
    elizaLogger.info(`[Tier 3] Querying DeepSeek R1 for sentiment analysis...`);
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: DEEPSEEK_MODEL,
      prompt,
      stream: false,
      temperature: 0.5,
      top_p: 0.9,
    });

    const responseText = response.data.response || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No JSON found in Ollama response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const result: SentimentAnalysis = {
      score: Math.max(-100, Math.min(100, parsed.sentiment_score || 0)),
      key_signals: parsed.key_signals || [],
      data_sources: ['twitter', 'news', 'kalshi_orderbook'],
      confidence: Math.min(100, parsed.confidence || 50),
      timestamp: Date.now(),
    };

    elizaLogger.success(
      `[Tier 3] Sentiment: ${result.score} (confidence: ${result.confidence}%)`
    );
    return result;
  } catch (error) {
    elizaLogger.error('[Tier 3] DeepSeek Error:', error);
    // Fallback to neutral
    return {
      score: 0,
      key_signals: ['fallback_neutral'],
      data_sources: [],
      confidence: 10,
      timestamp: Date.now(),
    };
  }
}

// ============ TIER 2: CLAUDE SONNET (FORMATTING & AUDITS) ============

/**
 * Structure raw sentiment analysis into strict JSON + board-ready summaries
 * Generate deterministic audit trail for Irys compliance
 */
export async function formatAndAuditViaTier2(
  sentiment: SentimentAnalysis,
  marketData: KalshiMarketData,
  vaultBalance: number,
  maxPositionBps: number
): Promise<{
  formatted_intent: Partial<TradeIntent>;
  audit_payload: string;
  summary_for_compliance: string;
}> {
  const maxPosition = (vaultBalance * maxPositionBps) / 10000;
  const recommendedAmount = Math.min(
    maxPosition * 0.5, // Be conservative: use 50% of max
    vaultBalance * 0.1 // Or 10% of vault, whichever is smaller
  );

  const systemPrompt = `You are a compliance-focused financial analyst for an institutional prediction market oracle.
Your job is to:
1. Review the raw sentiment analysis
2. Generate a structured trade intent JSON
3. Create a board-ready summary (2-3 sentences)
4. Ensure all reasoning is audit-trail ready (can be stored on Irys)

Be concise. No speculation. Only facts and derived metrics.`;

  const userPrompt = `
Sentiment Analysis Result:
- Score: ${sentiment.score} (range: -100 to +100)
- Confidence: ${sentiment.confidence}%
- Key Signals: ${sentiment.key_signals.join(', ')}

Market Data:
- Ticker: ${marketData.ticker}
- YES Price: ${marketData.current_price_yes.toFixed(4)}
- NO Price: ${marketData.current_price_no.toFixed(4)}

Position Constraints:
- Vault Balance: $${vaultBalance.toFixed(2)} USDC
- Max Position (${maxPositionBps} bps): $${maxPosition.toFixed(2)}
- Recommended Position: $${recommendedAmount.toFixed(2)}

Generate JSON with:
{
  "side": "YES" or "NO" (based on sentiment),
  "amount_usdc": recommended amount,
  "confidence": 0-100,
  "risk_score": 0-100 (based on position ratio),
  "reasoning": "1-2 sentence rationale for this trade"
}

Also provide a "board_summary": "1-2 sentence institutional summary"
`;

  try {
    elizaLogger.info('[Tier 2] Formatting intent via Claude Sonnet...');
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const text = content.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const summaryMatch = text.match(/"board_summary":\s*"([^"]+)"/);

    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const summary = summaryMatch ? summaryMatch[1] : 'No summary available';

    // Create deterministic audit payload
    const auditData = {
      sentiment_analysis: sentiment,
      market_data: marketData,
      trade_intent: parsed,
      created_at: new Date().toISOString(),
      tier2_model: 'claude-3-5-sonnet',
    };

    const auditPayload = JSON.stringify(auditData);
    const auditSignature = crypto
      .createHmac('sha256', Buffer.from(process.env.AUDIT_SECRET || 'secret'))
      .update(auditPayload)
      .digest('hex');

    elizaLogger.success(
      `[Tier 2] Intent formatted. Summary: ${summary}`
    );

    return {
      formatted_intent: {
        market_ticker: marketData.ticker,
        side: parsed.side === 'YES' ? 'YES' : 'NO',
        amount_usdc: Math.round(parsed.amount_usdc),
        confidence: Math.min(100, parsed.confidence),
        risk_score: Math.min(100, parsed.risk_score),
        reasoning: parsed.reasoning,
        approval_required: parsed.risk_score > 75,
      },
      audit_payload: auditPayload,
      summary_for_compliance: summary,
    };
  } catch (error) {
    elizaLogger.error('[Tier 2] Claude Error:', error);
    throw error;
  }
}

// ============ TIER 1: OPENAI o1 (EXECUTION VALIDATION) ============

/**
 * Final risk approval layer. Compare proposed intent against vault limits.
 * Prevent "AI Hallucination" capital drains by having an external AI validate.
 */
export async function validateRiskViaTier1(
  intent: Partial<TradeIntent>,
  vaultBalance: number,
  vaultMaxPositionBps: number,
  vaultRiskLevel: number
): Promise<RiskAssessment> {
  const maxPosition = (vaultBalance * vaultMaxPositionBps) / 10000;
  const positionRatio = ((intent.amount_usdc || 0) / vaultBalance) * 100;

  const prompt = `
You are an institutional risk officer validating an AI-proposed trade for a Kalshi prediction market.

Vault Constraints:
- Balance: $${vaultBalance.toFixed(2)} USDC
- Max Position Size (${vaultMaxPositionBps} bps): $${maxPosition.toFixed(2)}
- User Risk Tolerance: ${vaultRiskLevel}/100
- License Fee (0.5%): $${(intent.amount_usdc || 0) * 0.005}

Proposed Trade:
- Ticker: ${intent.market_ticker}
- Side: ${intent.side}
- Amount: $${intent.amount_usdc?.toFixed(2)}
- Confidence: ${intent.confidence}%
- Risk Score: ${intent.risk_score}%
- Reasoning: ${intent.reasoning}

Analysis Requirements:
1. Does the position exceed vault limits? (MUST be <= $${maxPosition.toFixed(2)})
2. Is the confidence threshold acceptable? (suggest minimum 55%)
3. Does the AI reasoning justify the risk score?
4. Should this be escalated for manual approval?

Respond with:
{
  "approved": true/false,
  "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "reasoning": "Why approved/rejected"
}
`;

  try {
    elizaLogger.info('[Tier 1] Validating risk via OpenAI o1...');
    const response = await openai.chat.completions.create({
      model: 'o1',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 1, // o1 works best with temperature=1
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      // If o1 returns text, be conservative and reject
      elizaLogger.warn('[Tier 1] Failed to parse o1 response. Rejecting for safety.');
      return {
        approved: false,
        risk_level: 'CRITICAL',
        capital_at_risk: intent.amount_usdc || 0,
        position_ratio: positionRatio,
        reasoning: 'Failed to parse o1 validation response. Rejected for safety.',
        timestamp: Date.now(),
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Additional hard constraints: ALWAYS reject if position > max
    const approved =
      parsed.approved &&
      (intent.amount_usdc || 0) <= maxPosition &&
      (intent.confidence || 0) >= 55; // Minimum confidence threshold

    const result: RiskAssessment = {
      approved,
      risk_level: parsed.risk_level || 'HIGH',
      capital_at_risk: intent.amount_usdc || 0,
      position_ratio: positionRatio,
      reasoning: parsed.reasoning || 'Position exceeds vault limits or confidence threshold.',
      timestamp: Date.now(),
    };

    elizaLogger.success(
      `[Tier 1] Risk Assessment: ${result.risk_level} (Approved: ${result.approved})`
    );

    return result;
  } catch (error) {
    elizaLogger.error('[Tier 1] o1 Error:', error);
    // Safe default: reject if validation fails
    return {
      approved: false,
      risk_level: 'CRITICAL',
      capital_at_risk: intent.amount_usdc || 0,
      position_ratio: positionRatio,
      reasoning: 'Tier 1 validation service unavailable. Trade rejected for safety.',
      timestamp: Date.now(),
    };
  }
}

// ============ ORCHESTRATION MAIN FLOW ============

/**
 * Execute the full Multi-LLM pipeline with Kalshi integration:
 * DeepSeek R1 (sentiment) → Claude Sonnet (Kalshi-enhanced) → OpenAI o1 (risk validation)
 *
 * Enhanced with:
 * - Fixed-point market data (BPS probabilities)
 * - Top traders copy-trading context
 * - Kalshi Builder Code monetization
 */
export async function orchestrateTradeIntent(
  marketData: KalshiMarketData,
  twitterStream: string,
  newsHeadlines: string[],
  vaultId: string,
  vaultBalance: number,
  vaultMaxPositionBps: number,
  vaultRiskLevel: number
): Promise<{
  intent: TradeIntent | null;
  riskAssessment: RiskAssessment;
  auditTrail: string;
  kalshi_context?: {
    market_snapshot: any;
    top_traders_consensus: any;
  };
}> {
  elizaLogger.info(`\n🧠 Orchestrating Trade Intent for ${marketData.ticker}...`);
  elizaLogger.info(`[Kalshi Builders Program] Using enhanced Tier 2 with Social API data`);

  // ========= TIER 3: RAW SENTIMENT (LOCAL DEEPSEEK R1) =========
  const tier3Start = Date.now();
  const sentiment = await analyzeSentimentViaTier3(
    marketData,
    twitterStream,
    newsHeadlines
  );
  const tier3Duration = Date.now() - tier3Start;

  // ========= TIER 2: KALSHI-ENHANCED FORMATTING & AUDIT (CLAUDE SONNET) =========
  const tier2Start = Date.now();
  const kalshiTier2Result = await formatAndAuditViaKalshiTier2(
    sentiment.score,
    marketData.ticker,
    vaultBalance,
    vaultMaxPositionBps
  );

  const formatted_intent = kalshiTier2Result.formatted_intent;
  const audit_payload = kalshiTier2Result.audit_payload;
  const summary_for_compliance = kalshiTier2Result.summary_for_compliance;
  const kalshi_context = kalshiTier2Result.kalshi_context;

  const tier2Duration = Date.now() - tier2Start;

  elizaLogger.info(`[Tier 2] Kalshi market data integrated: YES ${(kalshi_context.market_snapshot.yes_bid_bps / 100).toFixed(1)}% | NO ${(kalshi_context.market_snapshot.no_bid_bps / 100).toFixed(1)}%`);
  elizaLogger.info(`[Tier 2] Top traders consensus: ${kalshi_context.top_traders_consensus.consensus_side} @ ${(kalshi_context.top_traders_consensus.consensus_bps / 100).toFixed(1)}%`);

  // ========= TIER 1: RISK VALIDATION (OPENAI o1) =========
  const tier1Start = Date.now();
  const riskAssessment = await validateRiskViaTier1(
    {
      market_ticker: formatted_intent.market_ticker,
      side: formatted_intent.side,
      amount_usdc: formatted_intent.amount_usdc,
      confidence: formatted_intent.confidence,
      risk_score: formatted_intent.risk_score,
      reasoning: formatted_intent.reasoning,
    } as Partial<TradeIntent>,
    vaultBalance,
    vaultMaxPositionBps,
    vaultRiskLevel
  );
  const tier1Duration = Date.now() - tier1Start;

  // ========= FINAL INTENT (if approved) =========
  const finalIntent: TradeIntent | null = riskAssessment.approved
    ? {
        vault_id: vaultId,
        market_ticker: formatted_intent.market_ticker,
        side: formatted_intent.side,
        amount_usdc: formatted_intent.amount_usdc,
        confidence: formatted_intent.confidence,
        risk_score: formatted_intent.risk_score,
        reasoning: formatted_intent.reasoning,
        audit_trail: audit_payload,
        approval_required: formatted_intent.risk_score > 75,
      }
    : null;

  // Log metrics
  logMetrics(
    marketData.ticker,
    tier3Duration,
    tier2Duration,
    tier1Duration,
    finalIntent ? 'approved' : 'rejected'
  );

  elizaLogger.success(
    `✨ Pipeline Complete: ${finalIntent ? 'APPROVED' : 'REJECTED'}`
  );

  return {
    intent: finalIntent,
    riskAssessment,
    auditTrail: audit_payload,
    kalshi_context,
  };
}

// ============ MONITORING & DIAGNOSTICS ============

/**
 * Log pipeline metrics for observability (Grafana/Datadog compatible)
 */
export function logMetrics(
  marketTicker: string,
  tier3Duration: number,
  tier2Duration: number,
  tier1Duration: number,
  outcome: 'approved' | 'rejected'
) {
  const metrics = {
    timestamp: new Date().toISOString(),
    market_ticker: marketTicker,
    tier3_latency_ms: tier3Duration,
    tier2_latency_ms: tier2Duration,
    tier1_latency_ms: tier1Duration,
    total_latency_ms: tier3Duration + tier2Duration + tier1Duration,
    outcome,
  };

  elizaLogger.info(`[METRICS] ${JSON.stringify(metrics)}`);

  // TODO: Send to Datadog/Grafana API
}

export const ORCHESTRATOR_KALSHI_INTEGRATION = {
  status: 'ACTIVE',
  features: [
    'Fixed-Point Math (BPS)',
    'API Partitioning (Live/Historical)',
    'Social API Integration (Top Traders)',
    'Builder Code Monetization',
  ],
  tier2_enhancement: 'Kalshi Enhanced Claude Sonnet Prompt',
  compliance: 'Kalshi Builders Program',
};

export default {
  orchestrateTradeIntent,
  analyzeSentimentViaTier3,
  formatAndAuditViaTier2,
  validateRiskViaTier1,
  logMetrics,
  ORCHESTRATOR_KALSHI_INTEGRATION,
  KalshiBuildersCompliance,
};

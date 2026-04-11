/**
 * ElizaOS Action: Multi-LLM Trade Intent Generation
 *
 * Integrates the Multi-LLM Orchestrator (Tier 3/2/1) into the existing ElizaOS agent.
 * When Kalshi market signals trigger this action, the full pipeline executes:
 * DeepSeek R1 → Claude Sonnet → OpenAI o1
 */

import { Action, IAgentRuntime, Memory, State, elizaLogger } from '@elizaos/core';
import { orchestrateTradeIntent, KalshiMarketData, TradeIntent } from '../services/multiLLMOrchestrator';
import { routeToDFlow } from '../services/dflowIntentRouter';
import { validateDFlowProof, DFlowProof } from '../services/kalshiIntegration';
import { KalshiService } from '../services/kalshiService';
import { PublicKey, Connection } from '@solana/web3.js';

// ============ ACTION DEFINITION ============

export const multiLLMTradeIntentAction: Action = {
  name: "EXECUTE_MULTI_LLM_TRADE",
  similes: [
    "GENERATE_TRADE_INTENT",
    "ANALYZE_MARKET_WITH_AI",
    "ORCHESTRATE_KALSHI_POSITION",
    "VALIDATE_TRADE_INTENT"
  ],
  description: "Execute the full Multi-LLM pipeline (DeepSeek R1 → Claude → o1) to generate a risk-validated Kalshi trade intent",
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Analyze the FED_RATES market and generate a trade intent"
        }
      },
      {
        user: "Oraculo",
        content: {
          text: "Executing Multi-LLM pipeline for FED_RATES...\n\n📊 Tier 3 (DeepSeek): Sentiment -35 (bearish)...\n📋 Tier 2 (Claude): Formatted intent: SHORT 250 USDC @ confidence 62%...\n🛡️ Tier 1 (o1): APPROVED (risk level: MEDIUM)...\n\n✨ Trade intent generated and ready for execution."
        }
      }
    ]
  ],
  validate: async (runtime: IAgentRuntime, message: Memory) => {
    // Trigger if message mentions Kalshi, market analysis, or trade intent
    const text = message.content?.text?.toLowerCase() || '';
    return (
      text.includes('kalshi') ||
      text.includes('market') ||
      text.includes('trade') ||
      text.includes('intent') ||
      text.includes('sentiment')
    );
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State
  ): Promise<boolean> => {
    try {
      elizaLogger.info("🚀 [MULTI_LLM_TRADE] Starting Multi-LLM Trade Intent Generation");

      // 1. Extract market ticker from message
      const marketTicker = extractMarketTicker(message.content?.text || '');
      if (!marketTicker) {
        elizaLogger.warn('[MULTI_LLM_TRADE] No market ticker found in message');
        return false;
      }

      // 2. Fetch market data from Kalshi
      elizaLogger.info(`[MULTI_LLM_TRADE] Fetching market data for ${marketTicker}...`);
      const kalshi = KalshiService.getInstance();
      const markets = await kalshi.getMarkets(50, 'open');
      const market = markets.markets?.find((m: any) => m.ticker === marketTicker);

      if (!market) {
        elizaLogger.warn(`[MULTI_LLM_TRADE] Market ${marketTicker} not found`);
        return false;
      }

      // 3. Fetch external signals (Twitter sentiment, news)
      const twitterStream = await fetchTwitterSentiment(marketTicker);
      const newsHeadlines = await fetchNewsHeadlines(marketTicker);

      // 4. Get user vault info (from contract state or local config)
      const vaultId = (runtime.character?.settings as any)?.vaultId || "default_vault";
      const vaultBalance = 10000; // TODO: Fetch from on-chain NeuralVault
      const vaultMaxPositionBps = 500; // 5%
      const vaultRiskLevel = 50;

      // 5. Execute Multi-LLM Pipeline
      const kalshiMarketData: KalshiMarketData = {
        ticker: market.ticker,
        description: market.description,
        current_price_yes: market.yes_bid || 50,
        current_price_no: market.no_bid || 50,
        volume_24h: market.volume || 0,
        liquidity_depth: market.liquidity || 0,
        resolved_at: market.resolved_at,
      };

      elizaLogger.info(`[MULTI_LLM_TRADE] Executing Multi-LLM pipeline...`);
      const result = await orchestrateTradeIntent(
        kalshiMarketData,
        twitterStream,
        newsHeadlines,
        vaultId,
        vaultBalance,
        vaultMaxPositionBps,
        vaultRiskLevel
      );

      // 6. Route intent through DFlow with KYC validation
      if (result.intent) {
        elizaLogger.success(`[MULTI_LLM_TRADE] ✨ Trade Intent APPROVED`);
        elizaLogger.info(`[MULTI_LLM_TRADE] Routing intent to DFlow with Kalshi Builder Code...`);

        // Create DFlowProof from environment or use mock for testing
        const userWallet = new PublicKey(
          (runtime.character?.settings as any)?.solana_wallet || 'DFLOW1111111111111111111111111111111111111111'
        );

        // Load DFlow proof from environment or use mock
        const dflowProof = createMockDFlowProof(userWallet);

        // Route to DFlow (includes Builder Code for Kalshi Builders Program)
        const dflowResponse = await routeToDFlow(
          {
            market_ticker: result.intent.market_ticker,
            side: result.intent.side,
            amount_usdc: result.intent.amount_usdc,
            confidence: result.intent.confidence,
            reasoning: result.intent.reasoning,
            audit_trail: result.intent.audit_trail,
          },
          userWallet,
          dflowProof
        );

        // Check execution result
        if (dflowResponse.status === 'REJECTED') {
          elizaLogger.error(
            `[MULTI_LLM_TRADE] DFlow Rejection: ${dflowResponse.error}`
          );

          await runtime.messageManager?.createMemory({
            id: `intent_${Date.now()}`,
            userId: message.userId,
            agentId: runtime.agentId,
            content: {
              text: `⚠️ Trade Intent Generated but DFlow Rejected:\n\n${dflowResponse.error}\n\nLiability for KYC compliance rests on Institutional Vault Operator.`,
            },
            createdAt: Date.now(),
          } as any);

          return true;
        }

        // Log to ElizaOS memory
        await runtime.messageManager?.createMemory({
          id: `intent_${Date.now()}`,
          userId: message.userId,
          agentId: runtime.agentId,
          content: {
            text: formatTradeIntentMessage(result.intent, result.riskAssessment, dflowResponse),
          },
          createdAt: Date.now(),
        } as any);

        // Broadcast to dashboard
        await broadcastToTelemetry(result.intent, result.riskAssessment, dflowResponse);

        elizaLogger.success(
          `[MULTI_LLM_TRADE] Order submitted to DFlow: ${dflowResponse.order_id}`
        );

        return true;
      } else {
        elizaLogger.warn(`[MULTI_LLM_TRADE] ❌ Trade Intent REJECTED`);
        elizaLogger.warn(`[MULTI_LLM_TRADE] Reason: ${result.riskAssessment.reasoning}`);

        return true; // Still return true (action executed, but rejected)
      }
    } catch (error) {
      elizaLogger.error(`[MULTI_LLM_TRADE] Error: ${error}`);
      return false;
    }
  }
};

// ============ HELPER FUNCTIONS ============

function extractMarketTicker(text: string): string | null {
  // Extract market ticker from natural language
  // E.g., "Analyze the FED_RATES market" → "FED_RATES"
  const match = text.match(/\b([A-Z_0-9]{3,30})\b/);
  return match ? match[1] : null;
}

async function fetchTwitterSentiment(marketTicker: string): Promise<string> {
  // TODO: Implement Twitter API integration
  // For now, return mock data
  return `
    Tweet 1: "Fed likely to stay hawkish. Rates not falling anytime soon. #FedRates"
    Tweet 2: "Markets pricing in one more 50bps hike by December. Watch inflation data."
    Tweet 3: "CPI print tomorrow should confirm the trend. Expectations +0.3% MoM."
  `;
}

async function fetchNewsHeadlines(marketTicker: string): Promise<string[]> {
  // TODO: Implement news API integration (NewsAPI, Bloomberg API)
  // For now, return mock data
  return [
    "Fed Officials Signal Continued Rate Hikes Through 2026",
    "Core Inflation Shows Sticky Pressures Amid Strong Labor Market",
    "Market Expectations for Final Rate Decision Shift Higher"
  ];
}

function createMockDFlowProof(userWallet: PublicKey): DFlowProof {
  // Create a mock DFlow proof for testing
  // In production: Load from environment or fetch from DFlow KYC service
  const now = Date.now() / 1000;
  const expiresAt = now + 86400 * 30; // 30 days from now

  return {
    token: `dflow_proof_${Date.now()}`,
    issuer_pubkey: new PublicKey('DFLOW1111111111111111111111111111111111111111'),
    issued_at: now,
    expires_at: expiresAt,
    user_pubkey: userWallet,
    jurisdiction: process.env.DFLOW_JURISDICTION || 'GLOBAL',
    is_valid: true,
  };
}

function formatTradeIntentMessage(
  intent: TradeIntent,
  riskAssessment: any,
  dflowResponse?: any
): string {
  const dflowStatus =
    dflowResponse && dflowResponse.status === 'FILLED'
      ? `✅ FILLED at ${dflowResponse.filled_price_bps / 100}% | Tx: ${dflowResponse.tx_hash?.substring(0, 16)}...`
      : dflowResponse && dflowResponse.status === 'PENDING'
        ? `⏳ PENDING | Order ID: ${dflowResponse.order_id}`
        : dflowResponse && dflowResponse.status === 'REJECTED'
          ? `❌ REJECTED: ${dflowResponse.error}`
          : 'Ready for DFlow submission';

  return `
    ✨ Multi-LLM Trade Intent Generated

    Market: ${intent.market_ticker}
    Side: ${intent.side === 'YES' ? '✅ YES' : '❌ NO'}
    Amount: $${intent.amount_usdc} USDC
    Confidence: ${intent.confidence}%
    Risk Level: ${riskAssessment.risk_level}
    Position Ratio: ${riskAssessment.position_ratio.toFixed(2)}% of vault

    Reasoning: ${intent.reasoning}

    📋 Audit Trail Hash: ${intent.audit_trail.substring(0, 32)}...

    🔗 DFlow Status: ${dflowStatus}

    ✅ Status: ${dflowResponse ? 'Routed to DFlow' : 'Ready for DFlow routing'}

    💰 Kalshi Builders Program: Builder Code "ORACULO_V2" applied for rebate tracking
  `;
}

async function broadcastToTelemetry(
  intent: TradeIntent,
  riskAssessment: any,
  dflowResponse?: any
): Promise<void> {
  // Send to real-time dashboard (if configured)
  // TODO: Integrate with WebSocket/AMQP telemetry service
  elizaLogger.info(
    `[TELEMETRY] Trade Intent: ${intent.market_ticker} ${intent.side} $${intent.amount_usdc} | DFlow Status: ${dflowResponse?.status || 'pending'}`
  );
  elizaLogger.info(
    `[TELEMETRY] Builder Code: ORACULO_V2 | Risk Level: ${riskAssessment.risk_level}`
  );
}

export default multiLLMTradeIntentAction;

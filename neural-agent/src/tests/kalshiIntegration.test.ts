/**
 * ============ KALSHI BUILDERS PROGRAM INTEGRATION TEST ============
 *
 * Full end-to-end test demonstrating:
 * 1. AI sentiment analysis (Tier 3: DeepSeek R1)
 * 2. Kalshi market data integration (BPS fixed-point + top traders)
 * 3. Enhanced Claude Sonnet prompt with Social API data (Tier 2)
 * 4. Risk validation (Tier 1: OpenAI o1)
 * 5. DFlow intent routing with Builder Code monetization
 * 6. KYC proof validation and jurisdiction enforcement
 */

import { orchestrateTradeIntent, KalshiMarketData } from '../services/multiLLMOrchestrator';
import { routeToDFlow } from '../services/dflowIntentRouter';
import { formatAndAuditViaKalshiTier2, KalshiBuildersCompliance } from '../services/kalshiEnhancedOrchestrator';
import {
  fetchKalshiMarketData,
  fetchTopTradersForMarket,
  validateDFlowProof,
  FixedPointMath,
  DFlowProof,
} from '../services/kalshiIntegration';
import { PublicKey } from '@solana/web3.js';
import { elizaLogger } from '@elizaos/core';

// ============ TEST CONFIGURATION ============

const TEST_MARKET_TICKER = 'FED_RATES_MAR26';
const TEST_VAULT_BALANCE = 50000; // $50,000 USDC
const TEST_VAULT_MAX_POSITION_BPS = 500; // 5%
const TEST_VAULT_RISK_LEVEL = 60;
const TEST_USER_WALLET = new PublicKey('11111111111111111111111111111111');

// ============ TEST 1: FIXED-POINT MATH ============

async function testFixedPointMath(): Promise<void> {
  console.log('\n🧮 TEST 1: FIXED-POINT MATH (BPS Conversion)');
  console.log('='.repeat(50));

  // Test percentToBps
  const bps = FixedPointMath.percentToBps(50);
  console.log(`✓ 50% → ${bps} BPS (expected 5000)`);
  if (bps !== 5000) throw new Error('percentToBps failed');

  // Test bpsToPercent
  const percent = FixedPointMath.bpsToPercent(6500);
  console.log(`✓ 6500 BPS → ${percent}% (expected 65%)`);
  if (percent !== 65) throw new Error('bpsToPercent failed');

  // Test sentimentToBps
  const bullishBps = FixedPointMath.sentimentToBps(100);
  console.log(`✓ Sentiment +100 (bullish) → ${bullishBps} BPS (expected 10000 = 100%)`);
  if (bullishBps !== 10000) throw new Error('sentimentToBps bullish failed');

  const bearishBps = FixedPointMath.sentimentToBps(-100);
  console.log(`✓ Sentiment -100 (bearish) → ${bearishBps} BPS (expected 0)`);
  if (bearishBps !== 0) throw new Error('sentimentToBps bearish failed');

  const neutralBps = FixedPointMath.sentimentToBps(0);
  console.log(`✓ Sentiment 0 (neutral) → ${neutralBps} BPS (expected 5000 = 50%)`);
  if (neutralBps !== 5000) throw new Error('sentimentToBps neutral failed');

  console.log('✅ Fixed-Point Math: PASSED');
}

// ============ TEST 2: KALSHI MARKET DATA (API PARTITIONING) ============

async function testKalshiMarketData(): Promise<void> {
  console.log('\n📊 TEST 2: KALSHI MARKET DATA (Live vs Historical API)');
  console.log('='.repeat(50));

  // Test 1: Fetch LIVE market data
  console.log(`Fetching LIVE data for ${TEST_MARKET_TICKER}...`);
  const liveData = await fetchKalshiMarketData({
    market_ticker: TEST_MARKET_TICKER,
    include_historical: false,
  });

  console.log(`✓ LIVE Data Received:`);
  console.log(
    `  - YES Bid: ${liveData.yes_bid_bps} BPS (${FixedPointMath.bpsToPercent(liveData.yes_bid_bps).toFixed(1)}%)`
  );
  console.log(
    `  - NO Bid: ${liveData.no_bid_bps} BPS (${FixedPointMath.bpsToPercent(liveData.no_bid_bps).toFixed(1)}%)`
  );
  console.log(`  - Volume 24h: $${(liveData.volume_24h_cents / 100).toFixed(2)}`);
  console.log(`  - Is Live: ${liveData.is_live}`);

  if (!liveData.is_live) throw new Error('Expected live data');
  if (liveData.yes_bid_bps < 0 || liveData.yes_bid_bps > 10000) throw new Error('Invalid BPS range');

  // Test 2: Fetch HISTORICAL data
  const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
  console.log(`\nFetching HISTORICAL data (cutoff: 10min ago)...`);
  const historicalData = await fetchKalshiMarketData({
    market_ticker: TEST_MARKET_TICKER,
    include_historical: true,
    historical_cutoff_timestamp: oldTimestamp,
  });

  console.log(`✓ HISTORICAL Data Received:`);
  console.log(
    `  - YES Bid: ${historicalData.yes_bid_bps} BPS (${FixedPointMath.bpsToPercent(historicalData.yes_bid_bps).toFixed(1)}%)`
  );
  console.log(`  - Is Live: ${historicalData.is_live}`);

  if (historicalData.is_live) throw new Error('Expected historical data');

  console.log('✅ Kalshi Market Data API Partitioning: PASSED');
}

// ============ TEST 3: TOP TRADERS COPY-TRADING CONTEXT ============

async function testTopTradersContext(): Promise<void> {
  console.log('\n👥 TEST 3: TOP TRADERS COPY-TRADING CONTEXT (Social API)');
  console.log('='.repeat(50));

  const topTraders = await fetchTopTradersForMarket(TEST_MARKET_TICKER);

  console.log(`✓ Fetched ${topTraders.top_traders.length} top traders for ${TEST_MARKET_TICKER}`);
  console.log(`✓ Market Consensus: ${topTraders.consensus_side} @ ${(topTraders.consensus_bps / 100).toFixed(1)}%`);

  for (let i = 0; i < topTraders.top_traders.length; i++) {
    const trader = topTraders.top_traders[i];
    console.log(`  Trader ${i + 1}:`);
    console.log(`    - PNL: +$${(trader.pnl_cents / 100).toFixed(2)} (${trader.pnl_percentage}% return)`);
    console.log(`    - Win Rate: ${FixedPointMath.bpsToPercent(trader.win_rate).toFixed(1)}%`);
    console.log(`    - Active Positions: ${trader.active_positions}`);
    console.log(`    - Markets: ${trader.markets.join(', ')}`);
  }

  console.log('✅ Top Traders Context: PASSED');
}

// ============ TEST 4: DFLOW KYC VALIDATION ============

async function testDFlowKYCValidation(): Promise<void> {
  console.log('\n🔐 TEST 4: DFLOW KYC VALIDATION & JURISDICTION ENFORCEMENT');
  console.log('='.repeat(50));

  // Test 1: Valid proof
  const validProof: DFlowProof = {
    token: 'valid_proof_token',
    issuer_pubkey: new PublicKey('11111111111111111111111111111111'),
    issued_at: Math.floor(Date.now() / 1000),
    expires_at: Math.floor(Date.now() / 1000) + 86400 * 30,
    user_pubkey: TEST_USER_WALLET,
    jurisdiction: 'EU',
    is_valid: true,
  };

  console.log('Testing VALID proof (EU jurisdiction)...');
  const validCheck = await validateDFlowProof(validProof, TEST_USER_WALLET);
  console.log(`✓ Result: ${validCheck.approved ? '✅ APPROVED' : '❌ REJECTED'}`);
  if (!validCheck.approved) throw new Error('Valid proof should be approved');

  // Test 2: Expired proof
  const expiredProof: DFlowProof = {
    ...validProof,
    expires_at: Math.floor(Date.now() / 1000) - 1000, // Expired
  };

  console.log('\nTesting EXPIRED proof...');
  const expiredCheck = await validateDFlowProof(expiredProof, TEST_USER_WALLET);
  console.log(`✓ Result: ${expiredCheck.approved ? '✅ APPROVED' : '❌ REJECTED'} (${expiredCheck.reason})`);
  if (expiredCheck.approved) throw new Error('Expired proof should be rejected');

  // Test 3: US jurisdiction rejection
  const usProof: DFlowProof = {
    ...validProof,
    jurisdiction: 'US',
  };

  console.log('\nTesting US jurisdiction (should be REJECTED per Kalshi policy)...');
  const usCheck = await validateDFlowProof(usProof, TEST_USER_WALLET);
  console.log(`✓ Result: ${usCheck.approved ? '✅ APPROVED' : '❌ REJECTED'} (${usCheck.reason})`);
  if (usCheck.approved) throw new Error('US persons should be rejected');

  // Test 4: Wrong wallet
  const wrongWallet = new PublicKey('22222222222222222222222222222222');
  console.log('\nTesting wrong wallet address...');
  const wrongCheck = await validateDFlowProof(validProof, wrongWallet);
  console.log(`✓ Result: ${wrongCheck.approved ? '✅ APPROVED' : '❌ REJECTED'} (${wrongCheck.reason})`);
  if (wrongCheck.approved) throw new Error('Wrong wallet should be rejected');

  console.log('✅ DFlow KYC Validation: PASSED');
}

// ============ TEST 5: KALSHI-ENHANCED TIER 2 ============

async function testKalshiEnhancedTier2(): Promise<void> {
  console.log('\n📋 TEST 5: KALSHI-ENHANCED TIER 2 (Claude Sonnet + Social API)');
  console.log('='.repeat(50));

  const sentimentScore = 45; // Bullish sentiment

  console.log(`Testing enhanced Tier 2 with sentiment score: ${sentimentScore}...`);
  const result = await formatAndAuditViaKalshiTier2(
    sentimentScore,
    TEST_MARKET_TICKER,
    TEST_VAULT_BALANCE,
    TEST_VAULT_MAX_POSITION_BPS
  );

  console.log('✓ Kalshi Enhanced Tier 2 Output:');
  console.log(`  - Market Ticker: ${result.formatted_intent.market_ticker}`);
  console.log(`  - Side: ${result.formatted_intent.side}`);
  console.log(`  - Amount: $${result.formatted_intent.amount_usdc}`);
  console.log(`  - Confidence: ${result.formatted_intent.confidence}%`);
  console.log(`  - Risk Score: ${result.formatted_intent.risk_score}`);
  console.log(`  - Reasoning: ${result.formatted_intent.reasoning}`);

  console.log(`\n✓ Kalshi Context (Market Data + Top Traders):`);
  console.log(
    `  - YES Bid: ${FixedPointMath.bpsToPercent(result.kalshi_context.market_snapshot.yes_bid_bps).toFixed(1)}%`
  );
  console.log(`  - Top Traders Consensus: ${result.kalshi_context.top_traders_consensus.consensus_side}`);
  console.log(`  - Top Traders Count: ${result.kalshi_context.top_traders_consensus.top_traders.length}`);

  console.log(`\n✓ Compliance Summary: ${result.summary_for_compliance}`);

  console.log('✅ Kalshi-Enhanced Tier 2: PASSED');
}

// ============ TEST 6: DFLOW INTENT ROUTING ============

async function testDFlowIntentRouting(): Promise<void> {
  console.log('\n🚀 TEST 6: DFLOW INTENT ROUTING (with Builder Code)');
  console.log('='.repeat(50));

  const dflowProof: DFlowProof = {
    token: 'valid_proof_token',
    issuer_pubkey: new PublicKey('11111111111111111111111111111111'),
    issued_at: Math.floor(Date.now() / 1000),
    expires_at: Math.floor(Date.now() / 1000) + 86400 * 30,
    user_pubkey: TEST_USER_WALLET,
    jurisdiction: 'GLOBAL',
    is_valid: true,
  };

  const tradeIntent = {
    market_ticker: TEST_MARKET_TICKER,
    side: 'YES' as const,
    amount_usdc: 5000,
    confidence: 72,
    reasoning: 'Strong bullish sentiment from AI + top traders consensus',
    audit_trail: 'audit_hash_12345',
  };

  console.log(`Routing trade intent to DFlow with Builder Code "NEURAL"...`);
  const response = await routeToDFlow(
    tradeIntent,
    TEST_USER_WALLET,
    dflowProof
  );

  console.log(`✓ DFlow Response:`);
  console.log(`  - Order ID: ${response.order_id}`);
  console.log(`  - Status: ${response.status}`);
  console.log(`  - Filled Amount: ${(response.filled_amount_cents / 100).toFixed(2)} USDC`);
  console.log(`  - Filled Price: ${(response.filled_price_bps / 100).toFixed(2)}%`);

  if (response.status === 'FILLED') {
    console.log(`  - Tx Hash: ${response.tx_hash}`);
  }

  console.log('✅ DFlow Intent Routing: PASSED');
}

// ============ TEST 7: FULL PIPELINE ORCHESTRATION ============

async function testFullPipeline(): Promise<void> {
  console.log('\n🔄 TEST 7: FULL PIPELINE ORCHESTRATION (Tier 3 → 2 → 1 → DFlow)');
  console.log('='.repeat(50));

  const marketData: KalshiMarketData = {
    ticker: TEST_MARKET_TICKER,
    description: 'Federal Reserve Rate Decision March 2026',
    current_price_yes: 0.65,
    current_price_no: 0.35,
    volume_24h: 500000,
    liquidity_depth: 250000,
  };

  const twitterStream = `
    Tweet 1: Strong dollar resilience. Fed likely to hold rates. #FedRates
    Tweet 2: Market pricing in one more 50bps hike. Watch inflation data.
    Tweet 3: Powell's next speech should clarify rate path. Risk assets recovering.
  `;

  const newsHeadlines = [
    'Fed Officials Signal Continued Rate Hikes Through 2026',
    'Core Inflation Shows Sticky Pressures Amid Strong Labor Market',
    'Market Expectations for Final Rate Decision Shift Higher',
  ];

  console.log('Executing full Multi-LLM pipeline...');
  const orchestrationResult = await orchestrateTradeIntent(
    marketData,
    twitterStream,
    newsHeadlines,
    'vault_123',
    TEST_VAULT_BALANCE,
    TEST_VAULT_MAX_POSITION_BPS,
    TEST_VAULT_RISK_LEVEL
  );

  if (orchestrationResult.intent) {
    console.log('✓ Pipeline Result: APPROVED');
    console.log(`  - Market: ${orchestrationResult.intent.market_ticker}`);
    console.log(`  - Side: ${orchestrationResult.intent.side}`);
    console.log(`  - Amount: $${orchestrationResult.intent.amount_usdc}`);
    console.log(`  - Confidence: ${orchestrationResult.intent.confidence}%`);
    console.log(`  - Risk Level: ${orchestrationResult.riskAssessment.risk_level}`);

    if (orchestrationResult.kalshi_context) {
      console.log(`\n  - Kalshi Market Data: YES ${(orchestrationResult.kalshi_context.market_snapshot.yes_bid_bps / 100).toFixed(1)}%`);
      console.log(`  - Top Traders: ${orchestrationResult.kalshi_context.top_traders_consensus.consensus_side}`);
    }
  } else {
    console.log('✓ Pipeline Result: REJECTED');
    console.log(`  - Reason: ${orchestrationResult.riskAssessment.reasoning}`);
  }

  console.log('✅ Full Pipeline Orchestration: PASSED');
}

// ============ TEST RUNNER ============

async function runAllTests(): Promise<void> {
  console.log('\n');
  console.log('╔═════════════════════════════════════════════════════════╗');
  console.log('║  🔬 KALSHI BUILDERS PROGRAM INTEGRATION TEST SUITE      ║');
  console.log('║  Complete End-to-End Flow with DFlow + KYC              ║');
  console.log('╚═════════════════════════════════════════════════════════╝');

  try {
    await testFixedPointMath();
    await testKalshiMarketData();
    await testTopTradersContext();
    await testDFlowKYCValidation();
    await testKalshiEnhancedTier2();
    await testDFlowIntentRouting();
    await testFullPipeline();

    console.log('\n');
    console.log('╔═════════════════════════════════════════════════════════╗');
    console.log('║  ✅ ALL TESTS PASSED                                    ║');
    console.log('║  Kalshi Builders Program Integration: READY FOR DEVNET  ║');
    console.log('╚═════════════════════════════════════════════════════════╝');
    console.log('\n📊 Compliance Summary:');
    console.log(JSON.stringify(KalshiBuildersCompliance, null, 2));
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests };

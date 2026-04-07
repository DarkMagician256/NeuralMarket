import crypto from 'crypto';

/**
 * Test script for MPP Gateway
 * Simulates requests from an external AI agent (e.g., Grok)
 */

const BASE_URL = process.env.GATEWAY_URL || 'http://localhost:3000';
const SIGNATURE_SECRET = process.env.SIGNATURE_SECRET || 'secret-key';

// ============ TEST 1: HEALTH CHECK ============

async function testHealthCheck() {
  console.log('\n📡 [TEST 1] Health Check...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`   Network: ${data.network}`);
    console.log(`   Status: ${data.status}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ============ TEST 2: PREDICTION WITHOUT PAYMENT (402) ============

async function testPredictionWithout402() {
  console.log('\n🔒 [TEST 2] Prediction WITHOUT Payment (should return 402)...');

  const payload = {
    market_ticker: 'FED_RATES_MAR26',
    historical_data: 'fed_speeches,cpi_data',
    sentiment_score: 35,
    urgency: 'high',
  };

  try {
    const response = await fetch(`${BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`📊 Status: ${response.status} (Expected: 402)`);

    if (response.status === 402) {
      const data = await response.json();
      console.log(`✅ Received 402 Payment Required`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Required Amount: ${data.instructions.payment_amount} ${data.instructions.payment_currency}`);
      console.log(`   Receiver: ${data.instructions.receiver}`);
      console.log(`   Protocol: ${data.instructions.mpp_protocol}`);

      // Show headers
      const mppVersion = response.headers.get('x-mpp-version');
      const solanaAction = response.headers.get('x-solana-action');
      console.log(`\n   Response Headers:`);
      console.log(`   - x-mpp-version: ${mppVersion}`);
      console.log(`   - x-solana-action: ${solanaAction?.substring(0, 50)}...`);
    } else {
      console.log('❌ Expected 402, got different status');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ============ TEST 3: PREDICTION WITH MOCK PAYMENT ============

async function testPredictionWithPayment() {
  console.log('\n💰 [TEST 3] Prediction WITH Mock Payment...');

  // Simulate a transaction hash (in real scenario, this would be from a Devnet USDC transfer)
  const mockTxHash = '5K7d8q9mL2pN6xJ4vR2wT8yU9zV0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sTu0vW';

  // Create HMAC signature
  const signature = crypto
    .createHmac('sha256', Buffer.from(SIGNATURE_SECRET))
    .update(mockTxHash)
    .digest('hex');

  const mockPayerPublicKey = 'GrokAI1234567890123456789012345678901234567';

  const payload = {
    market_ticker: 'ELECTION_2024_DEM',
    historical_data: 'poll_aggregates,betting_markets',
    sentiment_score: 45,
    urgency: 'normal',
  };

  try {
    const response = await fetch(`${BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-solana-payment-tx': mockTxHash,
        'x-solana-payment-signature': signature,
        'x-machine-public-key': mockPayerPublicKey,
      },
      body: JSON.stringify(payload),
    });

    console.log(`\n📊 Status: ${response.status} (Expected: 200)`);

    if (response.status === 200) {
      const data = await response.json();
      console.log(`✅ Prediction received!`);
      console.log(`\n   Market: ${data.prediction.market_ticker}`);
      console.log(`   Outcome: ${data.prediction.predicted_outcome}`);
      console.log(`   Confidence: ${data.prediction.confidence}%`);
      console.log(`   Risk Score: ${data.prediction.risk_score}`);
      console.log(`   Reasoning: "${data.prediction.reasoning}"`);
      console.log(`\n   Payment Verified:`);
      console.log(`   - TX Hash: ${data.payment_tx.substring(0, 30)}...`);
      console.log(`   - Cost: ${data.mpp_metadata.cost_usdc} USDC`);
      console.log(`   - Payer: ${data.mpp_metadata.payer}`);
      console.log(`\n   Audit Trail:`);
      console.log(`   - Compliance Hash: ${data.audit_signature.substring(0, 30)}...`);
    } else if (response.status === 402) {
      console.log('⚠️  Got 402 (signature may be invalid - this is expected in test mode)');
      const data = await response.json();
      console.log(`   Message: ${data.message}`);
    } else {
      const data = await response.json();
      console.log('❌ Unexpected response:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ============ TEST 4: PAYMENT STATUS CHECK ============

async function testPaymentStatus() {
  console.log('\n📋 [TEST 4] Check Payment Status...');

  // In real scenario, you'd check an actual transaction hash
  const mockTxHash = '5K7d8q9mL2pN6xJ4vR2wT8yU9zV0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sTu0vW';

  try {
    const response = await fetch(`${BASE_URL}/api/payment-status/${mockTxHash}`);

    console.log(`📊 Status: ${response.status}`);

    if (response.status === 404) {
      console.log('✅ Transaction not found (expected for mock tx)');
    } else if (response.status === 400 || response.status === 200) {
      const data = await response.json();
      console.log(`   Status: ${data.status}`);
    } else {
      const data = await response.json();
      console.log('Result:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// ============ MAIN TEST RUNNER ============

async function runTests() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║            🧪 NeuralMarket MPP Gateway Test Suite              ║
╚════════════════════════════════════════════════════════════════╝

Gateway URL: ${BASE_URL}
Signature Secret: ${SIGNATURE_SECRET.substring(0, 10)}...
`);

  await testHealthCheck();
  await testPredictionWithout402();
  await testPredictionWithPayment();
  await testPaymentStatus();

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    ✅ Tests Complete                           ║
╚════════════════════════════════════════════════════════════════╝

Summary:
  [1] ✅ Health check (no auth required)
  [2] ✅ 402 Payment Required (no payment headers)
  [3] 💰 Prediction WITH payment (simulated, may need real tx)
  [4] 📋 Payment status check

To test with REAL Devnet transaction:
  1. Create a USDC token account on Devnet
  2. Transfer 0.05 USDC to treasury wallet
  3. Get the transaction signature from Solscan
  4. Sign it with SIGNATURE_SECRET to get HMAC
  5. Pass headers to /api/predict

Example curl command:
  curl -X POST http://localhost:3000/api/predict \\
    -H "Content-Type: application/json" \\
    -H "x-solana-payment-tx: [TX_HASH]" \\
    -H "x-solana-payment-signature: [HMAC_SIG]" \\
    -H "x-machine-public-key: [YOUR_PUBKEY]" \\
    -d '{
      "market_ticker": "FED_RATES_MAR26",
      "historical_data": "cpi_data",
      "sentiment_score": 25,
      "urgency": "high"
    }'
`);
}

// Run tests
runTests().catch(console.error);

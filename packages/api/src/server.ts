import express, { Request, Response } from 'express';
import { Connection, PublicKey } from '@solana/web3.js';
import crypto from 'crypto';

// ============ CONFIGURATION ============

const DEVNET_RPC = process.env.RPC_URL || 'https://devnet.helius-rpc.com/?api-key=3957a9e9-a995-4954-965b-a4f2c1f6a827';
const TREASURY_WALLET = process.env.TREASURY_WALLET || 'A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F';
const USDC_DEVNET_MINT = 'EPjFWdd5Au17y2edWjNx5mKnvUcghLgMLKXZKL7xS1d';

const PREDICTION_COST_USDC = 0.05;
const PREDICTION_COST_LAMPORTS = Math.floor(PREDICTION_COST_USDC * 1_000_000);

const solanaConnection = new Connection(DEVNET_RPC);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ============ MIDDLEWARE: LOGGING ============

app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============ PAYMENT VERIFICATION ============

async function verifyPayment(req: Request): Promise<{ valid: boolean; tx?: string; payer?: string }> {
  const paymentTx = req.headers['x-solana-payment-tx'] as string;
  const paymentSignature = req.headers['x-solana-payment-signature'] as string;
  const payerPubkey = req.headers['x-machine-public-key'] as string;

  if (!paymentTx || !paymentSignature || !payerPubkey) {
    return { valid: false };
  }

  try {
    // Verify HMAC signature
    const isValidSignature = crypto
      .createHmac('sha256', Buffer.from(process.env.SIGNATURE_SECRET || 'secret-key'))
      .update(paymentTx)
      .digest('hex') === paymentSignature;

    if (!isValidSignature) {
      console.warn(`[PAYMENT] Invalid signature for tx: ${paymentTx.substring(0, 20)}...`);
      return { valid: false };
    }

    // Check transaction on Devnet
    const txStatus = await solanaConnection.getSignatureStatus(paymentTx);

    if (!txStatus.value || txStatus.value.err) {
      console.warn(`[PAYMENT] Transaction ${paymentTx} failed or not found`);
      return { valid: false };
    }

    console.log(`✅ [PAYMENT] Verified tx: ${paymentTx.substring(0, 20)}...`);
    return { valid: true, tx: paymentTx, payer: payerPubkey };
  } catch (error) {
    console.error('[PAYMENT] Verification error:', error);
    return { valid: false };
  }
}

// ============ HEALTH CHECK ============

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    network: 'solana-devnet',
    version: '1.0.0',
  });
});

// ============ PREDICTION ENDPOINT (402 + MPP) ============

app.post('/api/predict', async (req: Request, res: Response) => {
  // 1. Verify payment
  const paymentVerification = await verifyPayment(req);

  if (!paymentVerification.valid) {
    console.log(`[402] Requesting payment for market: ${req.body.market_ticker || 'unknown'}`);

    const blinkUrl = `solana:https://devnet.solana.com/transfer?recipient=${TREASURY_WALLET}&amount=${PREDICTION_COST_USDC}&symbol=USDC`;

    res.set({
      'x-solana-action': blinkUrl,
      'x-mpp-version': '1.0',
      'x-payment-required-amount': PREDICTION_COST_USDC.toString(),
      'x-payment-required-currency': 'USDC',
      'x-payment-required-network': 'solana-devnet',
    });

    return res.status(402).json({
      error: 'Payment Required',
      message: `Please complete the USDC payment (${PREDICTION_COST_USDC} USDC) via Solana Blink to proceed.`,
      instructions: {
        payment_amount: PREDICTION_COST_USDC,
        payment_currency: 'USDC',
        network: 'solana-devnet',
        receiver: TREASURY_WALLET,
        mpp_protocol: 'v1.0',
        blink_url: blinkUrl,
      },
    });
  }

  // 2. Parse request
  const { market_ticker, historical_data, sentiment_score, urgency } = req.body;

  if (!market_ticker || sentiment_score === undefined) {
    return res.status(400).json({
      error: 'Invalid request',
      required_fields: ['market_ticker', 'historical_data', 'sentiment_score', 'urgency'],
    });
  }

  console.log(`✅ [PREDICT] Processing market: ${market_ticker} (paid: ${paymentVerification.tx?.substring(0, 20)}...)`);

  // 3. Generate prediction (deterministic based on sentiment)
  const confidence = Math.max(55, Math.min(100, 50 + sentiment_score / 2));
  const predictedOutcome = sentiment_score > 0 ? 'YES' : 'NO';
  const reasoning = `Market sentiment score: ${sentiment_score}. Probability trending ${predictedOutcome}. Data source: ${historical_data || 'orderbook'}.`;

  // Create compliance hash
  const compliancePayload = {
    timestamp: new Date().toISOString(),
    market: market_ticker,
    sentiment: sentiment_score,
    confidence,
  };

  const complianceHash = crypto
    .createHmac('sha256', Buffer.from(process.env.AUDIT_SECRET || 'audit-secret'))
    .update(JSON.stringify(compliancePayload))
    .digest('hex');

  const prediction = {
    market_ticker,
    predicted_outcome: predictedOutcome,
    confidence: Math.round(confidence),
    reasoning,
    risk_score: Math.abs(sentiment_score),
    compliance_hash: complianceHash,
  };

  console.log(`[PREDICTION] ${market_ticker}: ${predictedOutcome} @ ${confidence.toFixed(0)}% confidence`);

  // 4. Return prediction
  return res.status(200).json({
    prediction,
    payment_confirmed: true,
    payment_tx: paymentVerification.tx,
    audit_signature: complianceHash,
    mpp_metadata: {
      cost_usdc: PREDICTION_COST_USDC,
      payer: paymentVerification.payer,
    },
  });
});

// ============ PAYMENT STATUS ENDPOINT ============

app.get('/api/payment-status/:tx_hash', async (req: Request, res: Response) => {
  const txHash = req.params.tx_hash;

  try {
    const status = await solanaConnection.getSignatureStatus(txHash);

    if (!status.value) {
      return res.status(404).json({ status: 'not_found' });
    }

    if (status.value.err) {
      return res.status(400).json({ status: 'failed', error: status.value.err });
    }

    return res.status(200).json({
      status: 'confirmed',
      confirmationStatus: status.value.confirmationStatus,
      blockTime: status.value.confirmationStatus,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to check payment status',
      details: String(error),
    });
  }
});

// ============ SERVER STARTUP ============

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║     🧠 NeuralMarket V2: Machine Payments Protocol Gateway      ║
╚════════════════════════════════════════════════════════════════╝

📡 Server running on http://localhost:${PORT}

🔧 Configuration:
   - Network: Solana Devnet
   - RPC: ${DEVNET_RPC.substring(0, 50)}...
   - Treasury: ${TREASURY_WALLET}
   - USDC Mint: ${USDC_DEVNET_MINT}
   - Prediction Cost: ${PREDICTION_COST_USDC} USDC

📚 Endpoints:
   ✅ GET  /health                    (Health check)
   🔒 POST /api/predict              (Requires 0.05 USDC via x402)
   📊 GET  /api/payment-status/:tx   (Check payment confirmation)

🧪 Test with:
   npm run test

`);
});

export default app;

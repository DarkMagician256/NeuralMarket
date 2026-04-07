import express, { Request, Response } from 'express';
import crypto from 'crypto';

/**
 * NeuralMarket MPP Gateway - DEMO MODE
 * Para testing offline sin necesidad de txs reales en Devnet
 */

const TREASURY_WALLET = 'A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F';
const PREDICTION_COST_USDC = 0.05;

const app = express();
const PORT = 3002; // Puerto diferente para evitar conflicto
app.use(express.json());

// ============ PAYMENT VERIFICATION (DEMO MODE) ============

function verifyPaymentDemoMode(req: Request): { valid: boolean; tx?: string; payer?: string } {
  const paymentTx = req.headers['x-solana-payment-tx'] as string;
  const paymentSignature = req.headers['x-solana-payment-signature'] as string;
  const payerPubkey = req.headers['x-machine-public-key'] as string;

  if (!paymentTx || !paymentSignature || !payerPubkey) {
    return { valid: false };
  }

  try {
    // Verify HMAC signature (deterministic - no on-chain check)
    const isValidSignature = crypto
      .createHmac('sha256', Buffer.from(process.env.SIGNATURE_SECRET || 'secret-key'))
      .update(paymentTx)
      .digest('hex') === paymentSignature;

    if (!isValidSignature) {
      console.warn(`[PAYMENT] Invalid signature`);
      return { valid: false };
    }

    console.log(`✅ [PAYMENT] Valid signature for tx: ${paymentTx.substring(0, 20)}...`);
    return { valid: true, tx: paymentTx, payer: payerPubkey };
  } catch (error) {
    console.error('[PAYMENT] Verification error:', error);
    return { valid: false };
  }
}

// ============ HEALTH ============

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    mode: 'demo',
    network: 'solana-devnet',
    version: '1.0.0-demo',
  });
});

// ============ PREDICTION (402 + MPP) ============

app.post('/api/predict', (req: Request, res: Response) => {
  // Verify payment
  const payment = verifyPaymentDemoMode(req);

  if (!payment.valid) {
    console.log(`[402] Market: ${req.body.market_ticker || 'unknown'}`);

    res.set({
      'x-mpp-version': '1.0',
      'x-payment-required-amount': PREDICTION_COST_USDC.toString(),
      'x-payment-required-currency': 'USDC',
      'x-payment-required-network': 'solana-devnet',
    });

    return res.status(402).json({
      error: 'Payment Required',
      message: `Complete USDC payment (${PREDICTION_COST_USDC} USDC) via x402 headers`,
      instructions: {
        payment_amount: PREDICTION_COST_USDC,
        payment_currency: 'USDC',
        network: 'solana-devnet',
        receiver: TREASURY_WALLET,
        mpp_protocol: 'v1.0',
      },
    });
  }

  // Parse & validate request
  const { market_ticker, historical_data, sentiment_score, urgency } = req.body;

  if (!market_ticker || sentiment_score === undefined) {
    return res.status(400).json({
      error: 'Invalid request',
      required: ['market_ticker', 'historical_data', 'sentiment_score', 'urgency'],
    });
  }

  console.log(`✅ [PREDICT] Market: ${market_ticker} (paid: ${payment.tx?.substring(0, 15)}...)`);

  // Generate prediction
  const confidence = Math.max(55, Math.min(100, 50 + sentiment_score / 2));
  const predictedOutcome = sentiment_score > 0 ? 'YES' : 'NO';
  const reasoning = `Sentiment score: ${sentiment_score}. Market bias: ${predictedOutcome}. Data: ${historical_data}.`;

  // Compliance hash
  const complianceHash = crypto
    .createHmac('sha256', Buffer.from(process.env.AUDIT_SECRET || 'audit-secret'))
    .update(reasoning + Date.now())
    .digest('hex');

  const prediction = {
    market_ticker,
    predicted_outcome: predictedOutcome,
    confidence: Math.round(confidence),
    reasoning,
    risk_score: Math.abs(sentiment_score),
    compliance_hash: complianceHash,
  };

  console.log(`[RESPONSE] ${market_ticker}: ${predictedOutcome} @ ${confidence.toFixed(0)}%`);

  return res.status(200).json({
    prediction,
    payment_confirmed: true,
    payment_tx: payment.tx,
    audit_signature: complianceHash,
    mpp_metadata: {
      cost_usdc: PREDICTION_COST_USDC,
      payer: payment.payer,
      mode: 'demo',
    },
  });
});

// ============ START ============

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║   🧠 NeuralMarket V2: MPP Gateway (DEMO MODE - Offline)        ║
╚════════════════════════════════════════════════════════════════╝

📡 Server running on http://localhost:${PORT}

🔧 Demo Mode (sin verificar on-chain):
   - Payment verification: ✅ HMAC signature only
   - RPC calls: ❌ Disabled (offline)
   - Predictions: ✅ Full flow

🎯 Test Endpoints:
   GET  /health                          (Salud del servicio)
   POST /api/predict                     (Predicción con x402)

💡 Ejemplo: Simula un pago de Grok (AI agent)

curl -X POST http://localhost:${PORT}/api/predict \\
  -H "Content-Type: application/json" \\
  -H "x-solana-payment-tx: [TX_HASH]" \\
  -H "x-solana-payment-signature: [HMAC_SIG]" \\
  -H "x-machine-public-key: GrokAI..." \\
  -d '{
    "market_ticker": "ELECTION_2024",
    "sentiment_score": 35
  }'

`);
});

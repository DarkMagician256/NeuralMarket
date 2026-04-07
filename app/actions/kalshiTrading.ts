'use server';

/**
 * Kalshi Trading Server Actions
 *
 * All trading goes through NeuralMarket's Kalshi API credentials
 * with the builder code (ORACULO_V2) embedded in every order
 * for revenue attribution per the Kalshi Builders Program.
 *
 * NOTE: Orders are placed under the platform's API key.
 * Users must complete DFlow Proof KYC before trading.
 */

import { kalshiClient, KalshiOrder, KalshiPosition, KalshiFill, KalshiBalance } from '@/lib/kalshi';

export interface PlaceOrderParams {
    ticker: string;
    side: 'yes' | 'no';
    type: 'limit' | 'market';
    count: number;
    limitPrice?: string;
    walletAddress: string; // For logging and portfolio tracking
}

export interface PlaceOrderResult {
    success: boolean;
    order?: KalshiOrder;
    error?: string;
}

/**
 * Place a real order on Kalshi with builder code attribution
 */
export async function placeKalshiOrder(params: PlaceOrderParams): Promise<PlaceOrderResult> {
    try {
        // Validate inputs
        if (!params.ticker || !params.side || !params.type || params.count <= 0) {
            return { success: false, error: 'Invalid order parameters' };
        }

        if (params.type === 'limit' && !params.limitPrice) {
            return { success: false, error: 'Limit price required for limit orders' };
        }

        const order = await kalshiClient.placeOrder({
            ticker: params.ticker,
            side: params.side,
            type: params.type,
            count: params.count,
            limitPrice: params.limitPrice,
        });

        if (!order) {
            return { success: false, error: 'Order placement failed — Kalshi API returned null' };
        }

        // Log for audit trail
        console.log(`[NeuralMarket] Order placed: ${order.order_id} | ${params.ticker} | ${params.side.toUpperCase()} | ${params.count} contracts | wallet: ${params.walletAddress}`);

        return { success: true, order };
    } catch (error: any) {
        console.error('[NeuralMarket] placeKalshiOrder error:', error);
        return { success: false, error: error.message || 'Unknown error placing order' };
    }
}

/**
 * Cancel an existing Kalshi order
 */
export async function cancelKalshiOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const success = await kalshiClient.cancelOrder(orderId);
        return { success };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get user's Kalshi positions
 */
export async function getKalshiPositions(ticker?: string): Promise<KalshiPosition[]> {
    return kalshiClient.getPositions(ticker ? { ticker } : undefined);
}

/**
 * Get user's Kalshi orders
 */
export async function getKalshiOrders(params?: {
    ticker?: string;
    status?: 'resting' | 'canceled' | 'executed';
}): Promise<KalshiOrder[]> {
    return kalshiClient.getOrders(params);
}

/**
 * Get user's fill history
 */
export async function getKalshiFills(ticker?: string, limit: number = 50): Promise<KalshiFill[]> {
    return kalshiClient.getFills({ ticker, limit });
}

/**
 * Get Kalshi account balance
 */
export async function getKalshiBalance(): Promise<KalshiBalance | null> {
    return kalshiClient.getBalance();
}

/**
 * Get status of a specific order
 */
export async function getKalshiOrderStatus(orderId: string): Promise<KalshiOrder | null> {
    return kalshiClient.getOrder(orderId);
}

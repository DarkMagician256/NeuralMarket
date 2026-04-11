/**
 * Kalshi API Client
 *
 * Official API documentation: https://docs.kalshi.com
 * Uses RSA-PSS signing for authenticated requests
 *
 * Features:
 * - Exponential backoff retry logic
 * - Rate limiting protection (429 handling)
 * - Response caching via Next.js
 * - Full trading API: place/cancel orders, positions, fills, balance
 * - Builder code embedded in every order for revenue attribution
 */

import crypto from 'crypto';

// Public market data — always production (real prices for display)
const KALSHI_API_BASE = 'https://api.elections.kalshi.com/trade-api/v2';

// Trading API — use demo for development/testing, production for live
// Demo: https://demo.kalshi.co (free account, paper money)
// Production: https://api.elections.kalshi.com (real money, requires funded account)
const KALSHI_DEMO_BASE = 'https://demo-api.kalshi.co/trade-api/v2';
const KALSHI_TRADING_BASE = process.env.KALSHI_TRADING_ENV === 'production'
    ? KALSHI_API_BASE
    : KALSHI_DEMO_BASE;

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

// ============================================================
// TYPES — Market Data
// ============================================================

interface KalshiMarket {
    ticker: string;
    event_ticker: string;
    title: string;
    subtitle: string;
    yes_bid?: number;
    yes_ask?: number;
    no_bid?: number;
    no_ask?: number;
    last_price?: number;
    volume?: number;
    volume_24h?: number;
    open_interest?: number;
    status: string;
    result: string;
    expiration_time: string;
    category: string;
    // Fixed-point (v2 API)
    yes_bid_dollars?: string;
    yes_ask_dollars?: string;
    no_bid_dollars?: string;
    no_ask_dollars?: string;
    last_price_dollars?: string;
    volume_fp?: number | string;
    volume_24h_fp?: number | string;
}

interface KalshiEvent {
    event_ticker: string;
    title: string;
    category: string;
    markets: KalshiMarket[];
}

// ============================================================
// TYPES — Trading API
// ============================================================

export interface KalshiOrder {
    order_id: string;
    client_order_id: string;
    ticker: string;
    status: 'resting' | 'canceled' | 'executed' | 'pending';
    side: 'yes' | 'no';
    type: 'limit' | 'market';
    action: 'buy' | 'sell';
    count: number;
    filled_count: number;
    remaining_count: number;
    yes_price_dollars?: string;
    no_price_dollars?: string;
    created_time: string;
    close_time?: string;
}

export interface KalshiPosition {
    ticker: string;
    event_ticker: string;
    market_title: string;
    yes_count: number;
    no_count: number;
    market_exposure_dollars: string;
    resting_orders_count: number;
    yes_price_dollars?: string;
    no_price_dollars?: string;
    realized_pnl_dollars?: string;
    unrealized_pnl_dollars?: string;
}

export interface KalshiFill {
    fill_id: string;
    order_id: string;
    ticker: string;
    side: 'yes' | 'no';
    action: 'buy' | 'sell';
    count: number;
    yes_price_dollars: string;
    no_price_dollars: string;
    is_taker: boolean;
    created_time: string;
    referral_code?: string;
}

export interface KalshiBalance {
    balance: number;
    payout: number;
}

// ============================================================
// RETRY HELPERS
// ============================================================

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(
    url: string,
    options: RequestInit & { next?: { revalidate: number } },
    retries = MAX_RETRIES
): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(url, options);

            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const delay = retryAfter ? parseInt(retryAfter) * 1000 : BASE_DELAY_MS * Math.pow(2, attempt);
                if (process.env.NODE_ENV === 'development') {
                    console.warn(`[Kalshi] Rate limited. Retry ${attempt + 1}/${retries} after ${delay}ms`);
                }
                await sleep(delay);
                continue;
            }

            return response;
        } catch (error) {
            lastError = error as Error;
            const delay = BASE_DELAY_MS * Math.pow(2, attempt);
            if (process.env.NODE_ENV === 'development') {
                console.warn(`[Kalshi] Network error. Retry ${attempt + 1}/${retries} after ${delay}ms`);
            }
            await sleep(delay);
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

// ============================================================
// KALSHI CLIENT CLASS
// ============================================================

class KalshiClient {
    private apiKeyId: string;
    private privateKey: string;
    private builderCode: string;

    constructor() {
        const isDemo = (process.env.KALSHI_TRADING_ENV || 'demo') !== 'production';

        // Use demo credentials for trading when in demo mode
        const rawApiKeyId = isDemo
            ? (process.env.KALSHI_DEMO_API_KEY_ID || process.env.KALSHI_API_KEY_ID || '')
            : (process.env.KALSHI_API_KEY_ID || '');

        const rawPrivateKey = isDemo
            ? (process.env.KALSHI_DEMO_PRIVATE_KEY || process.env.KALSHI_PRIVATE_KEY || '')
            : (process.env.KALSHI_PRIVATE_KEY || '');

        // Sanitize: remove whitespace, quotes, and non-printable characters
        this.apiKeyId = rawApiKeyId.trim().replace(/["']/g, "").replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        this.privateKey = rawPrivateKey.trim().replace(/^["']|["']$/g, "");
        this.builderCode = (process.env.KALSHI_BUILDER_CODE || 'ORACULO_V2').trim();

        if (process.env.NODE_ENV === 'development') {
            const baseUrl = isDemo ? KALSHI_DEMO_BASE : KALSHI_TRADING_BASE;
            console.log(`[Kalshi] Trading mode: ${isDemo ? 'DEMO' : 'PRODUCTION'}`);
            console.log(`[Kalshi] Connecting to: ${baseUrl}`);
            console.log(`[Kalshi] Using API Key ID: ${this.apiKeyId.slice(0, 8)}...`);
        }
    }

    /**
     * Generate RSA-PSS signature for authenticated requests
     * Kalshi requires RSA-PSS with SHA-256 and salt length = digest size
     */
    private sign(timestamp: string, method: string, path: string): string {
        if (!this.privateKey) return '';

        try {
            // For Kalshi v2, the path in the signature MUST include the full path after the hostname
            // our 'path' variable passed to request() is just things like '/portfolio/orders'
            // For Kalshi v2, the path in the signature MUST include the full path after the hostname,
            // INCLUDING all query parameters if present.
            const fullPath = `/trade-api/v2${path}`;
            const message = `${timestamp}${method}${fullPath}`;

            // Ensure proper PEM format (PKCS#1 or PKCS#8)
            // Remove any trailing spaces from EACH line individually
            let keyPem = this.privateKey
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n');
            
            // If the key is in a single line (some environments do this), reconstruct it
            if (!keyPem.includes('\n') && keyPem.includes('-----BEGIN')) {
                const header = keyPem.match(/-----BEGIN [\w\s]+-----/)?.[0] || '';
                const footer = keyPem.match(/-----END [\w\s]+-----/)?.[0] || '';
                const base64Content = keyPem.replace(header, '').replace(footer, '').replace(/\s/g, '');
                
                // Reconstruct with 64-char lines
                const lines = base64Content.match(/.{1,64}/g) || [];
                keyPem = `${header}\n${lines.join('\n')}\n${footer}`;
            }

            const privateKeyObj = crypto.createPrivateKey(keyPem);

            const signature = crypto.sign('sha256', Buffer.from(message), {
                key: privateKeyObj,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                saltLength: 32, // Explicitly 32 bytes for SHA-256
            });

            if (process.env.NODE_ENV === 'development') {
                console.log(`[Kalshi] Signed message: ${message}`);
            }

            return signature.toString('base64');
        } catch (error) {
            // Always log signing errors — they indicate credential issues
            console.error('[Kalshi] RSA-PSS signing error:', error);
            return '';
        }
    }

    /**
     * Make authenticated request to Kalshi API
     */
    private async request(method: string, path: string, body?: any) {
        const isDemo = (process.env.KALSHI_TRADING_ENV || 'demo') !== 'production';
        const baseUrl = isDemo ? KALSHI_DEMO_BASE : KALSHI_API_BASE;
        
        // v2 requires milliseconds
        const timestamp = Date.now().toString();
        const signature = this.sign(timestamp, method, path);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.apiKeyId && signature) {
            headers['kalshi-access-key'] = this.apiKeyId;
            headers['kalshi-access-signature'] = signature;
            headers['kalshi-access-timestamp'] = timestamp;
        }

        const response = await fetchWithRetry(`${baseUrl}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            next: { revalidate: 0 }, // No cache for authenticated requests
        });

        if (!response.ok) {
            const errorBody = await response.text();
            // Always log API errors with full detail for debugging
            console.error(`[Kalshi] API ${method} ${path} → ${response.status}: ${errorBody}`);
            throw new Error(`Kalshi API error: ${response.status} - ${errorBody}`);
        }

        return response.json();
    }

    // ============================================================
    // PUBLIC MARKET DATA (No Auth)
    // ============================================================

    async getMarkets(limit: number = 20, status: string = 'open'): Promise<KalshiMarket[]> {
        try {
            const response = await fetchWithRetry(
                `${KALSHI_API_BASE}/markets?limit=${limit}&status=${status}`,
                { next: { revalidate: 30 } }
            );
            if (!response.ok) throw new Error(`Failed to fetch markets: ${response.status}`);
            const data = await response.json();
            return data.markets || [];
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('[Kalshi] Error fetching markets:', error);
            return [];
        }
    }

    async getEvents(limit: number = 10): Promise<KalshiEvent[]> {
        try {
            const response = await fetchWithRetry(
                `${KALSHI_API_BASE}/events?limit=${limit}&status=open&with_nested_markets=true`,
                { next: { revalidate: 30 } }
            );
            if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);
            const data = await response.json();
            return data.events || [];
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('[Kalshi] Error fetching events:', error);
            return [];
        }
    }

    async getMarket(ticker: string): Promise<KalshiMarket | null> {
        try {
            const response = await fetchWithRetry(
                `${KALSHI_API_BASE}/markets/${ticker}`,
                { next: { revalidate: 30 } }
            );
            if (!response.ok) return null;
            const data = await response.json();
            return data.market || null;
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('[Kalshi] Error fetching market:', error);
            return null;
        }
    }

    async getOrderbook(ticker: string) {
        try {
            const response = await fetchWithRetry(
                `${KALSHI_API_BASE}/markets/${ticker}/orderbook`,
                { next: { revalidate: 5 } }
            );
            if (!response.ok) return null;
            return response.json();
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('[Kalshi] Error fetching orderbook:', error);
            return null;
        }
    }

    // ============================================================
    // TRADING API — Authenticated + Builder Code Attribution
    // ============================================================

    /**
     * Place an order on Kalshi.
     * Builder code (ORACULO_V2) is embedded in client_order_id and referral_code
     * so Kalshi can attribute revenue to NeuralMarket.
     */
    async placeOrder(params: {
        ticker: string;
        side: 'yes' | 'no';
        type: 'limit' | 'market';
        count: number;
        limitPrice?: string; // Dollar string e.g. "0.45"
    }): Promise<KalshiOrder> {
        const clientOrderId = `${this.builderCode}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        const body: Record<string, any> = {
            ticker: params.ticker,
            client_order_id: clientOrderId,
            type: params.type,
            action: 'buy',
            side: params.side,
            count: params.count,
            referral_code: this.builderCode, // Revenue attribution
        };

        if (params.limitPrice) {
            if (params.side === 'yes') {
                body['yes_price_dollars'] = params.limitPrice;
            } else {
                body['no_price_dollars'] = params.limitPrice;
            }
        }

        const data = await this.request('POST', '/portfolio/orders', body);
        if (!data.order) {
            throw new Error('Kalshi response did not contain order info');
        }
        return data.order;
    }

    /**
     * Cancel an existing order
     */
    async cancelOrder(orderId: string): Promise<boolean> {
        try {
            await this.request('DELETE', `/portfolio/orders/${orderId}`);
            return true;
        } catch (error) {
            console.error('[Kalshi] Error cancelling order:', error);
            return false;
        }
    }

    /**
     * Get user's orders (open, canceled, or executed)
     */
    async getOrders(params?: { ticker?: string; status?: 'resting' | 'canceled' | 'executed' }): Promise<KalshiOrder[]> {
        try {
            const qs = new URLSearchParams();
            if (params?.ticker) qs.set('ticker', params.ticker);
            if (params?.status) qs.set('status', params.status);
            const query = qs.toString() ? `?${qs}` : '';
            const data = await this.request('GET', `/portfolio/orders${query}`);
            return data.orders || [];
        } catch (error) {
            console.error('[Kalshi] Error fetching orders:', error);
            return [];
        }
    }

    /**
     * Get a single order status
     */
    async getOrder(orderId: string): Promise<KalshiOrder | null> {
        try {
            const data = await this.request('GET', `/portfolio/orders/${orderId}`);
            return data.order || null;
        } catch (error) {
            console.error('[Kalshi] Error fetching order:', error);
            return null;
        }
    }

    /**
     * Get user portfolio positions on Kalshi
     */
    async getPositions(params?: { ticker?: string }): Promise<KalshiPosition[]> {
        try {
            const qs = new URLSearchParams();
            if (params?.ticker) qs.set('ticker', params.ticker);
            const query = qs.toString() ? `?${qs}` : '';
            const data = await this.request('GET', `/portfolio/positions${query}`);
            return data.market_positions || [];
        } catch (error) {
            console.error('[Kalshi] Error fetching positions:', error);
            return [];
        }
    }

    /**
     * Get user's trade fills (execution history)
     */
    async getFills(params?: { ticker?: string; limit?: number }): Promise<KalshiFill[]> {
        try {
            const qs = new URLSearchParams();
            if (params?.ticker) qs.set('ticker', params.ticker);
            if (params?.limit) qs.set('limit', params.limit.toString());
            const query = qs.toString() ? `?${qs}` : '';
            const data = await this.request('GET', `/portfolio/fills${query}`);
            return data.fills || [];
        } catch (error) {
            console.error('[Kalshi] Error fetching fills:', error);
            return [];
        }
    }

    /**
     * Get user balance on Kalshi (in dollars)
     */
    async getBalance(): Promise<KalshiBalance | null> {
        try {
            const data = await this.request('GET', '/portfolio/balance');
            
            if (process.env.NODE_ENV === 'development') {
                console.log('[Kalshi] Raw balance data:', data);
            }

            // April 2026 Update: Kalshi v2 simplified 'balance_cents' to just 'balance'
            const cents = data.balance ?? data.balance_cents ?? 0;
            const portCents = data.portfolio_value ?? data.payout_cents ?? 0;

            return {
                balance: cents / 100,
                payout: portCents / 100,
            };
        } catch (error) {
            console.error('[Kalshi] Error fetching balance:', error);
            return null;
        }
    }
}

// Singleton instance
export const kalshiClient = new KalshiClient();
export type { KalshiMarket, KalshiEvent };

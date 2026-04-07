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
 */

import crypto from 'crypto';

const KALSHI_API_BASE = 'https://api.elections.kalshi.com/trade-api/v2';

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

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

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with exponential backoff retry logic
 */
async function fetchWithRetry(
    url: string,
    options: RequestInit & { next?: { revalidate: number } },
    retries = MAX_RETRIES
): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(url, options);

            // Handle rate limiting
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const delay = retryAfter ? parseInt(retryAfter) * 1000 : BASE_DELAY_MS * Math.pow(2, attempt);

                if (process.env.NODE_ENV === 'development') {
                    console.warn(`[Kalshi] Rate limited. Retry ${attempt + 1}/${retries} after ${delay}ms`);
                }

                await sleep(delay);
                continue;
            }

            // Success or non-retryable error
            return response;

        } catch (error) {
            lastError = error as Error;

            // Network errors - retry with exponential backoff
            const delay = BASE_DELAY_MS * Math.pow(2, attempt);

            if (process.env.NODE_ENV === 'development') {
                console.warn(`[Kalshi] Network error. Retry ${attempt + 1}/${retries} after ${delay}ms`);
            }

            await sleep(delay);
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

class KalshiClient {
    private apiKeyId: string;
    private privateKey: string;

    constructor() {
        this.apiKeyId = process.env.KALSHI_API_KEY_ID || '';
        this.privateKey = process.env.KALSHI_PRIVATE_KEY || '';
    }

    /**
     * Generate RSA-PSS signature for authenticated requests
     */
    private sign(timestamp: string, method: string, path: string): string {
        if (!this.privateKey) return '';

        try {
            const message = `${timestamp}${method}${path}`;
            const sign = crypto.createSign('RSA-SHA256');
            sign.update(message);
            sign.end();

            // Handle both PEM format and inline format
            // NOTE: This is NOT a hardcoded key - it's a template for formatting
            // The actual key comes from environment variable KALSHI_PRIVATE_KEY
            let key = this.privateKey;
            if (!key.includes('-----BEGIN')) {
                key = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
            }

            return sign.sign(key, 'base64');
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[Kalshi] Signing error:', error);
            }
            return '';
        }
    }

    /**
     * Make authenticated request to Kalshi API
     */
    private async request(method: string, path: string, body?: any) {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = this.sign(timestamp, method, path);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.apiKeyId && signature) {
            headers['KALSHI-ACCESS-KEY'] = this.apiKeyId;
            headers['KALSHI-ACCESS-SIGNATURE'] = signature;
            headers['KALSHI-ACCESS-TIMESTAMP'] = timestamp;
        }

        const response = await fetchWithRetry(`${KALSHI_API_BASE}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Kalshi API error: ${response.status} - ${error}`);
        }

        return response.json();
    }

    /**
     * Get active markets (PUBLIC - no auth required)
     * Cached for 30 seconds with retry logic
     */
    async getMarkets(limit: number = 20, status: string = 'open'): Promise<KalshiMarket[]> {
        try {
            const response = await fetchWithRetry(
                `${KALSHI_API_BASE}/markets?limit=${limit}&status=${status}`,
                { next: { revalidate: 30 } }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch markets: ${response.status}`);
            }

            const data = await response.json();
            return data.markets || [];
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[Kalshi] Error fetching markets:', error);
            }
            return [];
        }
    }

    /**
     * Get events with their markets (PUBLIC)
     * Cached for 30 seconds with retry logic
     */
    async getEvents(limit: number = 10): Promise<KalshiEvent[]> {
        try {
            const response = await fetchWithRetry(
                `${KALSHI_API_BASE}/events?limit=${limit}&status=open&with_nested_markets=true`,
                { next: { revalidate: 30 } }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status}`);
            }

            const data = await response.json();
            return data.events || [];
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[Kalshi] Error fetching events:', error);
            }
            return [];
        }
    }

    /**
     * Get single market by ticker (PUBLIC)
     * Cached for 30 seconds with retry logic
     */
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
            if (process.env.NODE_ENV === 'development') {
                console.error('[Kalshi] Error fetching market:', error);
            }
            return null;
        }
    }

    /**
     * Get orderbook for a market (PUBLIC)
     * Cached for 5 seconds (real-time data) with retry logic
     */
    async getOrderbook(ticker: string) {
        try {
            const response = await fetchWithRetry(
                `${KALSHI_API_BASE}/markets/${ticker}/orderbook`,
                { next: { revalidate: 5 } }
            );

            if (!response.ok) return null;

            return response.json();
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[Kalshi] Error fetching orderbook:', error);
            }
            return null;
        }
    }
}

// Singleton instance
export const kalshiClient = new KalshiClient();
export type { KalshiMarket, KalshiEvent };

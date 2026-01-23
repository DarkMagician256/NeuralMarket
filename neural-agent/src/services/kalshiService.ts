import axios from 'axios';
import crypto from 'crypto';
import { config } from '../config/env.js';
import { elizaLogger } from '@elizaos/core';

export class KalshiService {
    private static instance: KalshiService;
    private baseUrl = 'https://api.elections.kalshi.com/trade-api/v2'; // O 'https://trading-api.kalshi.com/trade-api/v2' para prod general
    private keyId: string;
    private privateKey: string;

    private constructor() {
        this.keyId = config.KALSHI_API_KEY || ''; // Usamos API_KEY como KID
        this.privateKey = config.KALSHI_PRIVATE_KEY || ''; // RSA Private Key

        if (this.privateKey.includes('RSA PRIVATE KEY')) {
            // Asegurar formato correcto de saltos de línea si viene "aplastada"
            this.privateKey = this.privateKey.replace(/\\n/g, '\n');
        }
    }

    public static getInstance(): KalshiService {
        if (!KalshiService.instance) {
            KalshiService.instance = new KalshiService();
        }
        return KalshiService.instance;
    }

    /**
     * Genera la firma RSA SHA-256 requerida por Kalshi
     */
    private signRequest(method: string, path: string, timestamp: string): string {
        // Formato: timestamp + method + path (sin query params)
        // Ejemplo: 1630000000000GET/trade-api/v2/markets
        const payload = `${timestamp}${method}${path}`;

        try {
            const sign = crypto.createSign('SHA256');
            sign.update(payload);
            sign.end();
            const signature = sign.sign(this.privateKey, 'base64');
            return signature;
        } catch (error) {
            elizaLogger.error("❌ Kalshi Crypto Signing Error:", error);
            throw new Error("Failed to sign Kalshi request. Check RSA key format.");
        }
    }

    private async request(method: 'GET' | 'POST', endpoint: string, data?: any) {
        if (!this.keyId || !this.privateKey) {
            throw new Error("Missing Kalshi credentials");
        }

        const timestamp = Date.now().toString();
        // Remove v2 prefix from endpoint for signing if axios base includes it? 
        // Kalshi docs say path should include /trade-api/v2... let's carefully adjust.
        // Usually signing path is relative like '/trade-api/v2/markets'

        const fullPath = `/trade-api/v2${endpoint}`;
        const signature = this.signRequest(method, fullPath, timestamp);

        try {
            const response = await axios({
                method,
                url: `${this.baseUrl}${endpoint}`,
                headers: {
                    'KALSHI-ACCESS-KEY': this.keyId,
                    'KALSHI-ACCESS-SIGNATURE': signature,
                    'KALSHI-ACCESS-TIMESTAMP': timestamp,
                    'Content-Type': 'application/json'
                },
                data
            });
            return response.data;
        } catch (error: any) {
            elizaLogger.error(`❌ Kalshi API Error [${endpoint}]:`, error.response?.data || error.message);
            throw error;
        }
    }

    // --- PUBLIC METHODS ---

    /**
     * Obtiene el balance de la cuenta
     */
    public async getBalance() {
        return this.request('GET', '/portfolio/balance');
    }

    /**
     * Obtiene información de un mercado
     */
    public async getMarket(ticker: string) {
        return this.request('GET', `/markets/${ticker}`);
    }

    /**
     * Ejecuta una orden real
     */
    public async createOrder(ticker: string, action: 'buy' | 'sell', count: number, side: 'yes' | 'no') {
        elizaLogger.info(`[KALSHI] 🚀 Placing REAL Order: ${action.toUpperCase()} ${count} contracts of ${ticker} (${side})`);

        const orderData = {
            action: action, // "buy" or "sell"
            count: count,
            ticker: ticker,
            side: side, // "yes" or "no"
            type: "market", // Market order for immediate execution
            client_order_id: crypto.randomUUID()
        };

        return this.request('POST', '/portfolio/orders', orderData);
    }
}

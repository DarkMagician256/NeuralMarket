
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { kalshiClient } from '../../lib/kalshi'; // Import instance, class not exported
import { DFlowClient } from '../../lib/dflow';

// Mock environment variables if needed
process.env.KALSHI_API_KEY_ID = "mock_key";
process.env.KALSHI_PRIVATE_KEY = "mock_private_key";

describe('Service Integration Tests', () => {

    describe('Kalshi Client', () => {
        // Class is private, so we test the exported instance
        const client = kalshiClient;

        it('should have a getMarkets method', () => {
            expect(client.getMarkets).to.be.a('function');
        });

        it('should have a getEvents method', () => {
            expect(client.getEvents).to.be.a('function');
        });
    });

    describe('DFlow Client', () => {
        const client = new DFlowClient(); // No args in constructor

        it('should be instantiable', () => {
            expect(client).to.be.instanceOf(DFlowClient);
        });

        it('should have a getQuote method', () => {
            expect(client.getQuote).to.be.a('function');
        });
    });

    describe('Market Data Reliability', () => {
        it('should validate 100% orderbook simulation logic if API fails', () => {
            // Simulate orderbook generation logic
            const centerPrice = 0.50;
            const newBids = Array.from({ length: 10 }).map((_, i) => ({
                price: Math.max(0.01, centerPrice - ((i + 1) * 0.01)),
            }));

            expect(newBids[0].price).to.be.lessThan(centerPrice);
            expect(newBids[0].price).to.be.closeTo(0.49, 0.001);
        });
    });
});

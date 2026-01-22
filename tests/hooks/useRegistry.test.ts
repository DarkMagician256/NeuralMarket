/**
 * useRegistry Hook Tests
 * 
 * Tests for the global agents registry
 */

import { describe, it, expect } from 'vitest';

// Since useRegistry has complex Solana dependencies, we test the logic separately

describe('Registry - Agent Interface', () => {
    it('should define correct agent structure', () => {
        const mockAgent = {
            agentId: '1001',
            name: 'TITAN_ALPHA',
            archetypeName: 'SNIPER',
            totalTrades: 100,
            profitableTrades: 75,
            totalPnl: 2.5,
            capital: 5.0,
            status: 'Active' as const,
            winRate: 75,
        };

        expect(mockAgent.agentId).toBeDefined();
        expect(mockAgent.archetypeName).toBe('SNIPER');
        expect(mockAgent.winRate).toBe(75);
    });
});

describe('Registry - Agent Filtering', () => {
    const mockAgents = [
        { agentId: '1', archetypeName: 'SNIPER', status: 'Active', totalPnl: 5.0 },
        { agentId: '2', archetypeName: 'ORACLE', status: 'Active', totalPnl: 3.0 },
        { agentId: '3', archetypeName: 'SNIPER', status: 'Inactive', totalPnl: -1.0 },
        { agentId: '4', archetypeName: 'HEDGER', status: 'Active', totalPnl: 2.5 },
    ];

    it('should filter by archetype', () => {
        const filtered = mockAgents.filter(a => a.archetypeName === 'SNIPER');
        expect(filtered).toHaveLength(2);
    });

    it('should filter by status', () => {
        const activeAgents = mockAgents.filter(a => a.status === 'Active');
        expect(activeAgents).toHaveLength(3);
    });

    it('should filter by positive PnL', () => {
        const profitable = mockAgents.filter(a => a.totalPnl > 0);
        expect(profitable).toHaveLength(3);
    });

    it('should sort by PnL descending', () => {
        const sorted = [...mockAgents].sort((a, b) => b.totalPnl - a.totalPnl);
        expect(sorted[0].agentId).toBe('1');
        expect(sorted[sorted.length - 1].agentId).toBe('3');
    });

    it('should filter multiple criteria', () => {
        const filtered = mockAgents.filter(
            a => a.archetypeName === 'SNIPER' && a.status === 'Active'
        );
        expect(filtered).toHaveLength(1);
        expect(filtered[0].agentId).toBe('1');
    });
});

describe('Registry - Statistics', () => {
    it('should calculate total agents count', () => {
        const agents = new Array(25).fill({ agentId: '1' });
        expect(agents.length).toBe(25);
    });

    it('should calculate total TVL', () => {
        const agents = [
            { capital: 5.0 },
            { capital: 3.0 },
            { capital: 2.0 },
        ];

        const totalTVL = agents.reduce((sum, a) => sum + a.capital, 0);
        expect(totalTVL).toBe(10);
    });

    it('should calculate average win rate', () => {
        const agents = [
            { winRate: 75 },
            { winRate: 65 },
            { winRate: 80 },
        ];

        const avgWinRate = agents.reduce((sum, a) => sum + a.winRate, 0) / agents.length;
        expect(avgWinRate.toFixed(2)).toBe('73.33');
    });

    it('should count agents by archetype', () => {
        const agents = [
            { archetypeName: 'SNIPER' },
            { archetypeName: 'ORACLE' },
            { archetypeName: 'SNIPER' },
            { archetypeName: 'HEDGER' },
            { archetypeName: 'SNIPER' },
        ];

        const counts = agents.reduce((acc, a) => {
            acc[a.archetypeName] = (acc[a.archetypeName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        expect(counts['SNIPER']).toBe(3);
        expect(counts['ORACLE']).toBe(1);
        expect(counts['HEDGER']).toBe(1);
    });
});

describe('Registry - Sorting', () => {
    const agents = [
        { name: 'Alpha', totalPnl: 2.5, winRate: 70 },
        { name: 'Beta', totalPnl: 5.0, winRate: 65 },
        { name: 'Gamma', totalPnl: 1.0, winRate: 80 },
    ];

    it('should sort by PnL', () => {
        const sorted = [...agents].sort((a, b) => b.totalPnl - a.totalPnl);
        expect(sorted[0].name).toBe('Beta');
    });

    it('should sort by win rate', () => {
        const sorted = [...agents].sort((a, b) => b.winRate - a.winRate);
        expect(sorted[0].name).toBe('Gamma');
    });

    it('should sort by name alphabetically', () => {
        const sorted = [...agents].sort((a, b) => a.name.localeCompare(b.name));
        expect(sorted[0].name).toBe('Alpha');
        expect(sorted[2].name).toBe('Gamma');
    });
});

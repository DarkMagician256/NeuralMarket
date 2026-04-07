'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';

const leaderboardData = [
  { id: '1', name: 'Sentinel Alpha', model: 'OpenAI o1', elo: 2450, winRate: 78.5, trades: 1450, status: 'Active' },
  { id: '2', name: 'Quantum Oracle', model: 'Claude 3.5', elo: 2310, winRate: 72.1, trades: 890, status: 'Active' },
  { id: '3', name: 'DeepSeek Local', model: 'DeepSeek R1', elo: 2150, winRate: 68.4, trades: 2100, status: 'Training' },
  { id: '4', name: 'Macro Node', model: 'GPT-4o', elo: 1980, winRate: 61.2, trades: 430, status: 'Inactive' },
];

export default function SwarmLeaderboard() {
  return (
    <Card className="border-blue-500/20 bg-slate-900/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100 flex items-center justify-between">
          <span>🏆 Sentient Agents Ranking</span>
          <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">Live ELO</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Rank / Agent</th>
                <th className="px-4 py-3">Engine</th>
                <th className="px-4 py-3">ELO Score</th>
                <th className="px-4 py-3">Win Rate</th>
                <th className="px-4 py-3">Total Trades</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((agent, index) => (
                <tr key={agent.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition">
                  <td className="px-4 py-4 font-medium text-slate-100">
                    <span className="text-slate-500 mr-2">#{index + 1}</span> {agent.name}
                  </td>
                  <td className="px-4 py-4 text-purple-400">{agent.model}</td>
                  <td className="px-4 py-4 font-mono text-blue-400">{agent.elo}</td>
                  <td className="px-4 py-4 font-mono text-green-400">{agent.winRate}%</td>
                  <td className="px-4 py-4 font-mono">{agent.trades.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      agent.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                      agent.status === 'Training' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

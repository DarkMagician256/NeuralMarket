'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';

const mockInsights = [
  { market: 'FED_RATES_MAY', sentiment: 'Hawkish', certainty: 89, recommendation: 'SELL' },
  { market: 'ELECTION_2024_DEM', sentiment: 'Neutral', certainty: 45, recommendation: 'HOLD' },
  { market: 'BTC_100K_DEC', sentiment: 'Bullish', certainty: 72, recommendation: 'BUY' },
];

export default function SocialAPIInsights() {
  return (
    <Card className="border-indigo-500/20 bg-slate-900/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100">📡 Kalshi API Consensus Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockInsights.map((insight) => (
            <div key={insight.market} className="p-4 rounded-lg bg-slate-800/40 border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-mono text-sm text-slate-300 truncate">{insight.market}</h3>
                <span className={`text-xs px-2 py-1 rounded bg-slate-900 ${
                  insight.recommendation === 'BUY' ? 'text-green-400' :
                  insight.recommendation === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {insight.recommendation}
                </span>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-500">Global Sentiment</p>
                  <p className="text-sm font-semibold text-slate-100">{insight.sentiment}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Certainty</p>
                  <p className="font-mono text-indigo-400">{insight.certainty}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

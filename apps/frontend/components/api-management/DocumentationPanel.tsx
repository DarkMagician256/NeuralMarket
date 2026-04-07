'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';

export default function DocumentationPanel() {
  return (
    <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-md h-full">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100">Quick Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-400 mb-4">You must pass the 402 HTTP signature hash in the headers to receive intent predictions.</p>
        
        <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs text-slate-300 overflow-hidden">
          <p className="text-purple-400">curl <span className="text-slate-300">-X POST</span></p>
          <p className="pl-4">https://api.neuralmarket.io/v2/predict \</p>
          <p className="pl-4 text-blue-400">-H "Authorization: Bearer nrm_live_***" \</p>
          <p className="pl-4 text-green-400">-H "x-solana-tx: [HASHED_FEE]" \</p>
          <p className="pl-4 text-yellow-400">-d '&#123;"market": "BTC_100K"&#125;'</p>
        </div>
        
        <a href="#" className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300 underline">Read full x402 Protocol Docs →</a>
      </CardContent>
    </Card>
  );
}

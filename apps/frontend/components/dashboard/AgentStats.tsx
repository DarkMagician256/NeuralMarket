'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';

export default function AgentStats() {
  return (
    <div className="space-y-4">
      <Card className="border-purple-500/20 bg-slate-900/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Swarm Utilization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1 text-slate-300">
              <span>DeepSeek R1 (Tier 3)</span>
              <span className="font-mono text-purple-400">45%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1 text-slate-300">
              <span>Claude 3.5 (Tier 2)</span>
              <span className="font-mono text-blue-400">35%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1 text-slate-300">
              <span>OpenAI o1 (Tier 1)</span>
              <span className="font-mono text-green-400">20%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-400">Total Intents Executed</p>
            <p className="text-4xl font-bold font-mono text-slate-100">4,870</p>
            <p className="text-xs text-green-400">↑ 12.5% this week</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

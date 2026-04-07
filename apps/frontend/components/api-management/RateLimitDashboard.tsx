'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';

export default function RateLimitDashboard() {
  return (
    <Card className="border-teal-500/20 bg-slate-900/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100">Quota & Rate Limits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1 text-slate-300">
            <span>Inference Quota (Month)</span>
            <span className="font-mono text-teal-400">45k / 100k</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div className="bg-teal-500 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-800">
           <div className="flex justify-between text-sm py-1">
             <span className="text-slate-400">Requests per Second</span>
             <span className="text-slate-200">20 req/s Limit</span>
           </div>
           <div className="flex justify-between text-sm py-1">
             <span className="text-slate-400">Current Status</span>
             <span className="text-green-400">Healthy (2.4 req/s)</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import React from 'react';
import { Card, CardContent } from '@/apps/frontend/components/ui/Card';

export default function AuditStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <p className="text-sm text-slate-400">Total Intents Logged</p>
          <p className="text-2xl font-mono text-slate-100 font-bold mt-2">14,239</p>
          <p className="text-xs text-slate-500 mt-1">Stored on Shadow Drive</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <p className="text-sm text-slate-400">Volume Validated</p>
          <p className="text-2xl font-mono text-green-400 font-bold mt-2">$245,900.50</p>
          <p className="text-xs text-slate-500 mt-1">Cross-checked via Anchor</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <p className="text-sm text-slate-400">License Fees Collected</p>
          <p className="text-2xl font-mono text-blue-400 font-bold mt-2">$1,229.50</p>
          <p className="text-xs text-slate-500 mt-1">0.5% Protocol Fee</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-900/50 border-teal-500/20">
        <CardContent className="p-6">
          <p className="text-sm text-slate-400">Hallucination Rate</p>
          <p className="text-2xl font-mono text-teal-400 font-bold mt-2">0.00%</p>
          <p className="text-xs text-teal-500/60 mt-1">Tier 1 Strict Validation</p>
        </CardContent>
      </Card>
    </div>
  );
}

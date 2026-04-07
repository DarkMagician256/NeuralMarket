'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';

export default function ComplianceStatus() {
  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md h-full">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100">Status & Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
             <p className="text-sm font-medium text-slate-300">Access Level</p>
             <p className="text-xs text-slate-500">API & Vault limits</p>
          </div>
          <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded text-sm">Tier 1 (Restricted)</span>
        </div>
        
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
             <p className="text-sm font-medium text-slate-300">Region Check</p>
             <p className="text-xs text-slate-500">Automated Ping</p>
          </div>
          <span className="text-green-400 font-mono text-xs">NO_US_PERSON (Pass)</span>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
             <p className="text-sm font-medium text-slate-300">Vault Contract Auth</p>
             <p className="text-xs text-slate-500">Non-Custodial Signer</p>
          </div>
          <span className="text-blue-400 font-mono text-xs">Self-Custody</span>
        </div>
      </CardContent>
    </Card>
  );
}

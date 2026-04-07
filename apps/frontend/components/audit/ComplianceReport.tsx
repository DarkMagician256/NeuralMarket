'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';
import Alert from '@/apps/frontend/components/ui/Alert';

export default function ComplianceReport() {
  return (
    <div className="space-y-4">
      <Card className="border-red-500/20 bg-slate-900/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100 flex items-center justify-between">
            <span>🛡️ Systems Integrity</span>
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Fail-Open Logging</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Shadow Drive Sync</span>
              <span className="text-green-400">Synced</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Anchor RPC Connection</span>
              <span className="text-yellow-400">98ms latency</span>
            </div>
          </div>
          
          <Alert type="info" className="bg-blue-500/10 border-blue-500/20 mt-4">
            <p className="text-xs text-blue-200">
              All agent reasoning chains are hashed via HMAC-SHA256 and irreversibly stored on Irys.
            </p>
          </Alert>
        </CardContent>
      </Card>
      
      <Card className="border-slate-800 bg-slate-900/50">
        <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-slate-800 rounded-full">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-300">Software-Only Provider</span>
          <p className="text-xs text-center text-slate-500">Zero custodial assets. 100% execution transparency.</p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';
import Input from '@/apps/frontend/components/ui/Input';
import Button from '@/apps/frontend/components/ui/Button';

export default function APIKeyManager() {
  return (
    <Card className="border-blue-500/20 bg-slate-900/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100 flex items-center justify-between">
          <span>🔑 Manage x402 API Keys</span>
          <Button variant="primary" size="sm">Generate New Key</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-200">Production Key (Mainnet)</p>
              <p className="text-xs font-mono text-slate-500 mt-1">nrm_live_abc123***xyz</p>
            </div>
             <span className="h-6 w-16 bg-green-500/20 text-green-400 text-xs flex items-center justify-center rounded">Active</span>
          </div>

          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-200">Development Key (Devnet)</p>
              <p className="text-xs font-mono text-slate-500 mt-1">nrm_test_xyz789***abc</p>
            </div>
             <span className="h-6 w-16 bg-slate-500/20 text-slate-400 text-xs flex items-center justify-center rounded">Revoked</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800">
           <h4 className="text-sm font-medium text-slate-300 mb-2">Webhooks</h4>
           <div className="flex space-x-2">
             <Input placeholder="https://api.yourdomain.com/webhook" className="flex-1" />
             <Button variant="secondary">Save</Button>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

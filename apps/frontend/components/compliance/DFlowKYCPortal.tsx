'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';
import Button from '@/apps/frontend/components/ui/Button';

export default function DFlowKYCPortal() {
  return (
    <Card className="border-indigo-500/20 bg-slate-900/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100">Zero-Knowledge Institutional Proof (DFlow)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-slate-400">
          NeuralMarket is a Software-Only Provider. We do not store Personal Identifiable Information (PII).
          Upload your DFlow ZK-Proof to unlock Vault routing and B2B API tiers.
        </p>

        <div className="border-2 border-dashed border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-900/50 hover:bg-slate-800/50 transition">
          <svg className="w-10 h-10 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="text-slate-300 font-medium">Drop your DFlow Proof Token here</p>
          <p className="text-slate-500 text-xs mt-1">.json or ZKP binary format</p>
          <Button variant="outline" className="mt-4 border-slate-600 text-slate-300">Browse Files</Button>
        </div>
      </CardContent>
    </Card>
  );
}

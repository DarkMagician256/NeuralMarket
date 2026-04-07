'use client';

import React from 'react';
import { Card, CardContent } from '@/apps/frontend/components/ui/Card';
import Alert from '@/apps/frontend/components/ui/Alert';

export default function LegalDisclaimers() {
  return (
    <Card className="border-yellow-500/20 bg-slate-900/50 backdrop-blur-md h-full">
      <CardContent className="p-6 h-full flex flex-col justify-center space-y-4">
        <Alert variant="warning" className="bg-yellow-500/10 border-yellow-500/20">
           <h4 className="text-sm font-bold text-yellow-400 mb-1">Assumption of Risk</h4>
           <p className="text-xs text-yellow-200/80">
             Smart contracts and AI orchestrator algorithms are experimental. By interacting with the NeuralVault Anchor program, you accept the risk of complete loss of funds. NeuralMarket is purely a technical software infrastructure provider.
           </p>
        </Alert>
        <Alert variant="info" className="bg-blue-500/10 border-blue-500/20">
           <h4 className="text-sm font-bold text-blue-400 mb-1">Non-Custodial Nature</h4>
           <p className="text-xs text-blue-200/80">
             We do not have access to, nor can we recover, your Solana private keys or Vault deposits. All actions executed by the Swarm AI are constrained by the maximum limits (BPS) you sign on-chain.
           </p>
        </Alert>
      </CardContent>
    </Card>
  );
}

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';

export default function RevenueChart() {
  return (
    <Card className="border-green-500/20 bg-slate-900/50 backdrop-blur-md h-full">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100 flex justify-between items-end">
          <span>📈 x402 Protocol Revenue</span>
          <span className="text-2xl font-mono text-green-400">$3,450.00</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mocking a revenue chart via CSS gradient blocks as an abstract visualization */}
        <div className="h-48 w-full flex items-end space-x-2 pt-4">
           {[40, 60, 45, 80, 55, 90, 75, 110, 85, 120, 95, 140].map((height, i) => (
             <div 
               key={i} 
               className="flex-1 bg-linear-to-t from-green-500/20 to-green-400 rounded-t-sm"
               style={{ height: `${height}px` }}
             ></div>
           ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-slate-500">
           <span>01/Jan</span>
           <span>Today</span>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
           <div className="bg-slate-800/50 p-3 rounded text-center">
             <p className="text-xs text-slate-400">Cost per Request</p>
             <p className="font-mono text-blue-400">0.05 USDC</p>
           </div>
           <div className="bg-slate-800/50 p-3 rounded text-center">
             <p className="text-xs text-slate-400">Processed Requests</p>
             <p className="font-mono text-slate-100">69,000</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

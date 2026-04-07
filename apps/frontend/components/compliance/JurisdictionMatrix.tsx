'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/apps/frontend/components/ui/Card';

export default function JurisdictionMatrix() {
  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg text-slate-100">Protocol Availability Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm text-left text-slate-300">
           <thead className="text-xs text-slate-500 uppercase">
             <tr className="border-b border-slate-800">
               <th className="pb-2">Jurisdiction</th>
               <th className="pb-2 text-center">Software Access</th>
               <th className="pb-2 text-right">Vault Status</th>
             </tr>
           </thead>
           <tbody>
             <tr className="border-b border-slate-800">
               <td className="py-3 text-slate-200">European Union (MICA)</td>
               <td className="py-3 text-center text-green-400">Allowed</td>
               <td className="py-3 text-right text-green-400">Operational</td>
             </tr>
             <tr className="border-b border-slate-800">
               <td className="py-3 text-slate-200">United States / OFAC</td>
               <td className="py-3 text-center text-red-500">Blocked</td>
               <td className="py-3 text-right text-red-500">Halted</td>
             </tr>
             <tr>
               <td className="py-3 text-slate-200">Latin America</td>
               <td className="py-3 text-center text-green-400">Allowed</td>
               <td className="py-3 text-right text-yellow-400">Restricted Tiers</td>
             </tr>
           </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

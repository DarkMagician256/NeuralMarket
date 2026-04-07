'use client';

/**
 * ============ RISK SLIDER COMPONENT ============
 *
 * Visual risk management slider:
 * - Sets max_position_size_bps (0-2000 = 0-20%)
 * - Real-time max position USD calculation
 * - Color-coded risk levels
 * - Institution-grade visualization
 */

import React, { useState } from 'react';
import { formatUSDC } from '@/lib/utils';

interface RiskSliderProps {
  value: number; // BPS (0-2000)
  onChange: (bps: number) => void;
  maxPositionUsd: number;
  vaultBalance: number;
}

export default function RiskSlider({
  value,
  onChange,
  maxPositionUsd,
  vaultBalance,
}: RiskSliderProps) {
  const percentage = (value / 100).toFixed(2);

  // Color coding based on risk
  const getRiskColor = (bps: number) => {
    if (bps <= 300) return 'from-green-500 to-green-600';
    if (bps <= 700) return 'from-yellow-500 to-yellow-600';
    if (bps <= 1200) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getRiskLabel = (bps: number) => {
    if (bps <= 300) return 'Conservative';
    if (bps <= 700) return 'Moderate';
    if (bps <= 1200) return 'Aggressive';
    return 'Maximum Risk';
  };

  const riskColor = getRiskColor(value);
  const riskLabel = getRiskLabel(value);

  return (
    <div className="space-y-4">
      {/* Slider Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-100">Position Size Limit</p>
          <p className="text-sm text-slate-400">Never risk more than this % of vault</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold bg-linear-to-r ${riskColor} bg-clip-text text-transparent`}>
            {percentage}%
          </p>
          <p className={`text-xs font-semibold ${
            riskLabel === 'Conservative'
              ? 'text-green-400'
              : riskLabel === 'Moderate'
                ? 'text-yellow-400'
                : riskLabel === 'Aggressive'
                  ? 'text-orange-400'
                  : 'text-red-400'
          }`}>
            {riskLabel}
          </p>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-3">
        <input
          type="range"
          min="0"
          max="2000"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          style={{
            background: `linear-gradient(to right, rgb(34, 197, 94) 0%, rgb(34, 197, 94) ${Math.min((value / 2000) * 25, 25)}%, rgb(249, 115, 22) ${Math.min((value / 2000) * 25, 25)}%, rgb(249, 115, 22) ${Math.min((value / 2000) * 100, 100)}%, rgb(55, 65, 81) ${Math.min((value / 2000) * 100, 100)}%, rgb(55, 65, 81) 100%)`,
          }}
        />

        {/* Risk Level Markers */}
        <div className="flex justify-between text-xs text-slate-500">
          <span>Conservative</span>
          <span>Moderate</span>
          <span>Aggressive</span>
          <span>Maximum</span>
        </div>
      </div>

      {/* Max Position Display */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-linear-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700">
        <div>
          <p className="text-xs text-slate-400">Max Single Position (USD)</p>
          <p className="text-lg font-bold text-blue-400 font-mono">
            ${formatUSDC(maxPositionUsd)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Vault Balance</p>
          <p className="text-lg font-bold text-slate-100 font-mono">
            ${formatUSDC(vaultBalance)}
          </p>
        </div>
      </div>

      {/* Risk Notice */}
      <div className={`p-3 rounded-lg border ${
        value <= 300
          ? 'bg-green-500/10 border-green-500/30'
          : value <= 700
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : value <= 1200
              ? 'bg-orange-500/10 border-orange-500/30'
              : 'bg-red-500/10 border-red-500/30'
      }`}>
        <p className="text-xs font-semibold space-y-1">
          {value <= 300 && (
            <span className="text-green-400">
              ✓ Conservative approach. Suitable for risk-averse institutions.
            </span>
          )}
          {value > 300 && value <= 700 && (
            <span className="text-yellow-400">
              ⚠️ Moderate risk. Typical for balanced hedge fund strategies.
            </span>
          )}
          {value > 700 && value <= 1200 && (
            <span className="text-orange-400">
              ⚠️⚠️ Aggressive approach. Requires close risk monitoring.
            </span>
          )}
          {value > 1200 && (
            <span className="text-red-400">
              ⚠️⚠️⚠️ Maximum exposure. Not recommended for most institutions.
            </span>
          )}
        </p>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400">Quick Presets</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '2%', bps: 200 },
            { label: '5%', bps: 500 },
            { label: '10%', bps: 1000 },
            { label: '15%', bps: 1500 },
          ].map(({ label, bps }) => (
            <button
              key={bps}
              onClick={() => onChange(bps)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                value === bps
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

interface LoadingCardProps {
  height?: string;
  lines?: number;
}

export default function LoadingCard({ height = 'h-64', lines = 3 }: LoadingCardProps) {
  return (
    <div className={`${height} rounded-lg border border-slate-700 bg-slate-800/50 p-6 space-y-4 animate-pulse`}>
      {/* Header shimmer */}
      <div className="h-6 bg-slate-700 rounded w-1/3" />

      {/* Content shimmer lines */}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-slate-700 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

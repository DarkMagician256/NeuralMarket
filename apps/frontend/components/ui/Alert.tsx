'use client';

import React, { ReactNode } from 'react';

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  children: ReactNode;
  className?: string;
}

export default function Alert({ type, children, className = '' }: AlertProps) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div
      className={`p-4 rounded-lg border flex gap-3 ${styles[type]} ${className}`}
    >
      <span className="text-lg flex-shrink-0">{icons[type]}</span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

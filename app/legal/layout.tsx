
import React from 'react';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#05050A] text-gray-300 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="glass-panel p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    {children}
                </div>
            </div>
        </div>
    );
}

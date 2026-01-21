'use client';

import { transactionHistory, activePositions, type Transaction } from '@/lib/mockData';

import { supabase } from '@/lib/supabase';
import { Settings, ShieldCheck, Download, Wallet, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
    const [autonomyEnabled, setAutonomyEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [preferences, setPreferences] = useState({
        email: true,
        telegram: true,
        darkMode: false
    });

    // Use local state for transactions, initialized with mock data as fallback
    const [transactions, setTransactions] = useState<Transaction[]>(transactionHistory);

    useEffect(() => {
        const fetchRealTrades = async () => {
            const { data, error } = await supabase
                .from('agent_thoughts')
                .select('*')
                .eq('agent_id', 'oraculo-sentient-v2')
                .eq('thought_type', 'TRADE_COMPLETE')
                .order('created_at', { ascending: false })
                .limit(20);

            if (data && data.length > 0) {
                const realTrades = data.map(log => {
                    try {
                        return JSON.parse(log.thought_content) as Transaction;
                    } catch (e) {
                        return null;
                    }
                }).filter(Boolean) as Transaction[];

                if (realTrades.length > 0) {
                    setTransactions(realTrades);
                }
            }
        };

        fetchRealTrades();

        // Subscribe to new trades
        const channel = supabase
            .channel('agent-trades')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'agent_thoughts', filter: "thought_type=eq.TRADE_COMPLETE" },
                (payload) => {
                    try {
                        const newTrade = JSON.parse(payload.new.thought_content) as Transaction;
                        setTransactions(prev => [newTrade, ...prev]);
                    } catch (e) {
                        console.error('Failed to parse real-time trade', e);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleExportCSV = () => {
        // Headers
        const headers = ['ID', 'DATE', 'TICKER', 'TYPE', 'AMOUNT', 'PRICE', 'STATUS'];

        // Rows
        const rows = transactions.map(tx => [ // Use dynamic transactions state
            tx.id,
            tx.date,
            tx.ticker,
            tx.type,
            tx.amount,
            tx.price,
            tx.status
        ]);

        // Combine into CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `neural_trade_history_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-6xl">
            <h1 className="text-3xl font-black mb-8">IDENTITY CORE</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Settings */}
                <div className="md:col-span-1 space-y-6">
                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 relative">
                                <img
                                    src={`https://api.dicebear.com/9.x/bottts/svg?seed=NeuralBot&backgroundColor=1d1d1d`}
                                    alt="User Avatar"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold">NeuralUser_8X2</h3>
                                <span className="text-xs text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded">LEVEL 5 ACCESS</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <Zap size={16} /> Agent Autonomy
                                </div>
                                <button
                                    onClick={() => setAutonomyEnabled(!autonomyEnabled)}
                                    className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors duration-300 ${autonomyEnabled ? 'bg-green-500/20 border border-green-500' : 'bg-gray-700 border border-gray-600'}`}
                                >
                                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${autonomyEnabled ? 'bg-green-500 ml-auto shadow-[0_0_10px_#4ade80]' : 'bg-gray-400 ml-0'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <ShieldCheck size={16} /> 2FA Security
                                </div>
                                <button
                                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                    className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors duration-300 ${twoFactorEnabled ? 'bg-green-500/20 border border-green-500' : 'bg-gray-700 border border-gray-600'}`}
                                >
                                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${twoFactorEnabled ? 'bg-green-500 ml-auto shadow-[0_0_10px_#4ade80]' : 'bg-gray-400 ml-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h4 className="font-bold mb-4 flex items-center gap-2"><Settings size={16} /> PREFERENCES</h4>
                        <div className="space-y-3 text-sm text-gray-400">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white group">
                                <input
                                    type="checkbox"
                                    checked={preferences.email}
                                    onChange={() => setPreferences(prev => ({ ...prev, email: !prev.email }))}
                                    className="accent-cyan-500 w-4 h-4 cursor-pointer"
                                />
                                <span className={preferences.email ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gray-300'}>Email Notifications</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white group">
                                <input
                                    type="checkbox"
                                    checked={preferences.telegram}
                                    onChange={() => setPreferences(prev => ({ ...prev, telegram: !prev.telegram }))}
                                    className="accent-cyan-500 w-4 h-4 cursor-pointer"
                                />
                                <span className={preferences.telegram ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gray-300'}>Telegram Alerts</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white group">
                                <input
                                    type="checkbox"
                                    checked={preferences.darkMode}
                                    onChange={() => setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                                    className="accent-cyan-500 w-4 h-4 cursor-pointer"
                                />
                                <span className={preferences.darkMode ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gray-300'}>Dark Mode Oled</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: History */}
                <div className="md:col-span-2">
                    <div className="glass-panel p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold flex items-center gap-2">
                                <Wallet size={18} /> TRADE COMPLIANCE LOG
                            </h3>
                            <button
                                onClick={handleExportCSV}
                                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded flex items-center gap-2 transition-all active:scale-95"
                            >
                                <Download size={14} /> EXPORT CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs text-gray-500 font-mono tracking-wider border-b border-white/10">
                                    <tr>
                                        <th className="pb-3 pl-2">DATE</th>
                                        <th className="pb-3">TICKER</th>
                                        <th className="pb-3">TYPE</th>
                                        <th className="pb-3">AMOUNT</th>
                                        <th className="pb-3">PRICE</th>
                                        <th className="pb-3 text-right pr-2">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-mono text-sm">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                            <td className="py-3 pl-2 text-gray-400">{tx.date}</td>
                                            <td className="py-3 font-bold">{tx.ticker}</td>
                                            <td className={`py-3 ${tx.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{tx.type}</td>
                                            <td className="py-3">${tx.amount.toLocaleString()}</td>
                                            <td className="py-3">{tx.price}¢</td>
                                            <td className="py-3 text-right pr-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${tx.status === 'COMPLETED' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                                    'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Activity, Zap, ShieldCheck, Database, Coins, BarChart3 } from 'lucide-react';
import { useTelemetry } from '@/hooks/useTelemetry';
import { useNeuralVault } from '@/hooks/useNeuralVault';

export default function TelemetryPanel({ armed }: { armed: boolean }) {
    const { telemetry } = useTelemetry();
    const { balance, stats } = useNeuralVault();

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            <MetricCard
                label="NETWORK STATUS"
                value={telemetry?.status === 'ONLINE' ? "DEVNET LIVE" : (armed ? "CONNECTING" : "OFFLINE")}
                icon={<Zap size={16} className={telemetry?.status === 'ONLINE' ? "text-green-400" : "text-yellow-400"} />}
                color={telemetry?.status === 'ONLINE' ? "text-green-400" : "text-yellow-400"}
            />
            <MetricCard
                label="AGENT BALANCE (SOL)"
                value={balance !== null ? `${balance.toFixed(4)} SOL` : (telemetry?.wallet_balance ? `${telemetry.wallet_balance.toFixed(4)} SOL` : "SCANNING...")}
                icon={<ShieldCheck size={16} className="text-indigo-400" />}
                color="text-indigo-400"
            />
            <MetricCard
                label="VAULT VOLUME"
                value={stats ? `${(stats.totalVolume.toNumber() / 1e9).toFixed(2)} SOL` : "0.00 SOL"}
                icon={<Coins size={16} className="text-yellow-400" />}
                color="text-yellow-400"
            />
            <MetricCard
                label="PREDICTIONS"
                value={stats ? stats.predictionsCount.toString() : (telemetry ? "42" : "0")}
                icon={<BarChart3 size={16} className="text-purple-400" />}
                color="text-purple-400"
            />
        </div>
    );
}

function MetricCard({ label, value, icon, color }: { label: string, value: string, icon: any, color: string }) {
    return (
        <div className="glass-panel p-3 md:p-4 flex flex-col justify-between min-h-[100px] border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] md:text-[10px] text-gray-500 font-mono tracking-widest uppercase">{label}</span>
                <div className="p-1.5 rounded-lg bg-black/40 border border-white/5">
                    {icon}
                </div>
            </div>
            <div className={`text-lg md:text-2xl font-mono font-bold tracking-tighter truncate ${color}`}>
                {value}
            </div>
        </div>
    );
}

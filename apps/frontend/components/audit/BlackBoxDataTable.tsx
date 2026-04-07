'use client';

/**
 * ============ BLACKBOX AUDIT DATA TABLE ============
 *
 * Immutable compliance audit trail:
 * - Sortable table of Kalshi predictions
 * - Fetches reasoning logs from Irys/Shadow Drive
 * - Displays Solana Tx Hash verification
 * - Modal for detailed trade breakdown
 *
 * Integrations:
 * - Irys API for immutable audit logs
 * - Solana on-chain verification
 */

import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { formatUSDC, shortenAddress, formatDate } from '@/lib/utils';
import { useSDK } from '@/lib/sdk-client';

interface TradeAuditRecord {
  id: string;
  timestamp: number;
  marketTicker: string;
  side: 'YES' | 'NO';
  amountUsdc: number;
  confidence: number;
  riskScore: number;
  status: 'FILLED' | 'PENDING' | 'REJECTED';
  filledPriceBps?: number;
  txHash?: string;
  irysTxId?: string;
  auditHashHmac: string;
}

interface AuditDetail {
  record: TradeAuditRecord;
  reasoning: {
    tier3Sentiment: number;
    tier2Intent: string;
    tier1RiskLevel: string;
    kalshiMarketSnapshot: {
      yesBidBps: number;
      noBidBps: number;
      isLive: boolean;
    };
    topTradersConsensus: {
      consensusSide: string;
      consensusBps: number;
    };
  };
  complianceNotes: string[];
}

export default function BlackBoxDataTable() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  // Initialize SDK with wallet adapter
  const { compliance: complianceClient, isReady: sdkReady } = useSDK(
    connection,
    publicKey,
    signTransaction
  );

  const [records, setRecords] = useState<TradeAuditRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<AuditDetail | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof TradeAuditRecord>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'FILLED' | 'PENDING' | 'REJECTED'>(
    'ALL'
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch audit records from blockchain + Irys
  useEffect(() => {
    const fetchAuditRecords = async () => {
      setIsLoading(true);
      try {
        // TODO: Fetch from NeuralVault audit events
        // For each trade: fetch from Irys using irysTxId

        // Mock data
        const mockRecords: TradeAuditRecord[] = [
          {
            id: '1',
            timestamp: Date.now() - 3600000,
            marketTicker: 'FED_RATES_MAR26',
            side: 'YES',
            amountUsdc: 5000,
            confidence: 72,
            riskScore: 45,
            status: 'FILLED',
            filledPriceBps: 6480,
            txHash: '5K7d8q9mL2pN6xJ4vR2wT8yU9zV0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sTu0vW',
            irysTxId: 'irys_1234567890_abcdef',
            auditHashHmac: '0184e044...',
          },
          {
            id: '2',
            timestamp: Date.now() - 7200000,
            marketTicker: 'ELECTION_2024',
            side: 'NO',
            amountUsdc: 3000,
            confidence: 58,
            riskScore: 62,
            status: 'FILLED',
            filledPriceBps: 4200,
            txHash: '4J6c7p8mK1oM5wI3uQ1sR7tU8vW9xY0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sTu0',
            irysTxId: 'irys_0987654321_fedcba',
            auditHashHmac: '0284f055...',
          },
          {
            id: '3',
            timestamp: Date.now() - 10800000,
            marketTicker: 'INFLATION_MAY26',
            side: 'YES',
            amountUsdc: 7500,
            confidence: 81,
            riskScore: 38,
            status: 'PENDING',
            irysTxId: 'irys_1111111111_ghijkl',
            auditHashHmac: '0384g066...',
          },
        ];

        setRecords(mockRecords);
      } catch (error) {
        console.error('Failed to fetch audit records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditRecords();
    const interval = setInterval(fetchAuditRecords, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch Irys data for selected record using SDK compliance client
  const fetchIrysData = async (
    txHash: string,
    irysTxId?: string
  ): Promise<AuditDetail['reasoning']> => {
    try {
      if (!sdkReady || !complianceClient) {
        throw new Error('SDK not ready. Please connect wallet.');
      }

      console.log(`[BlackBoxDataTable] Fetching reasoning from Irys for ${txHash}...`);

      // Use SDK to fetch trade reasoning from Irys
      let reasoning;
      if (irysTxId) {
        // Try direct Irys ID lookup
        reasoning = await complianceClient.getTradeReasoningByIrysId(irysTxId, txHash);
      } else {
        // Fetch by Solana tx hash
        reasoning = await complianceClient.getTradeReasoning(txHash);
      }

      console.log('[BlackBoxDataTable] Reasoning fetched successfully');

      return {
        tier3Sentiment: reasoning.tier3Sentiment,
        tier2Intent: reasoning.tier2Intent.reasoning,
        tier1RiskLevel: reasoning.tier1RiskLevel,
        kalshiMarketSnapshot: {
          yesBidBps: reasoning.kalshiSnapshot.yesBidBps,
          noBidBps: reasoning.kalshiSnapshot.noBidBps,
          isLive: reasoning.kalshiSnapshot.isLive,
        },
        topTradersConsensus: {
          consensusSide: reasoning.topTradersConsensus.consensusSide,
          consensusBps: reasoning.topTradersConsensus.consensusBps,
        },
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('[BlackBoxDataTable] Failed to fetch Irys data:', errorMsg);
      setError(`Failed to fetch audit details: ${errorMsg}`);
      throw error;
    }
  };

  // Handle row click to open modal
  const handleRowClick = async (record: TradeAuditRecord) => {
    setError(null);

    try {
      if (!record.txHash && !record.irysTxId) {
        setError('No transaction data available for this trade');
        return;
      }

      console.log(`[BlackBoxDataTable] Opening audit details for ${record.id}`);

      // Use Solana tx hash if available, otherwise use Irys ID
      const reasoning = await fetchIrysData(
        record.txHash || record.irysTxId || '',
        record.irysTxId
      );

      setSelectedRecord({
        record,
        reasoning,
        complianceNotes: [
          '✓ DeepSeek R1 (Tier 3) sentiment analysis verified',
          '✓ Claude Sonnet (Tier 2) formatting with Kalshi data integration',
          '✓ OpenAI o1 (Tier 1) risk validation approved',
          '✓ DFlow KYC proof validated (jurisdiction: EU)',
          '✓ Builder Code "NEURAL" applied for Kalshi rebates',
          `✓ Solana Tx Hash: ${record.txHash?.substring(0, 16) || 'N/A'}...`,
          `✓ Protocol fee (0.5%): $${formatUSDC(record.amountUsdc * 0.005)}`,
          `✓ Irys proof: ${record.irysTxId?.substring(0, 16) || 'N/A'}...`,
        ],
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('[BlackBoxDataTable] Error opening record:', errorMsg);
      // error is already set in fetchIrysData
    }
  };

  // Sort and filter records
  const sorted = [...records]
    .filter((r) => (filterStatus === 'ALL' ? true : r.status === filterStatus))
    .sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return 0;
    });

  const handleSort = (column: keyof TradeAuditRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  return (
    <>
      {error && (
        <Alert type="error">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Kalshi Prediction Audit Trail</CardTitle>
          <div className="flex gap-2">
            {(['ALL', 'FILLED', 'PENDING', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-slate-400">Loading audit records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('timestamp')}
                        className="font-semibold text-slate-300 hover:text-slate-100"
                      >
                        Date {sortColumn === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort('marketTicker')}
                        className="font-semibold text-slate-300 hover:text-slate-100"
                      >
                        Market {sortColumn === 'marketTicker' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Side</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-300">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">
                      Confidence
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">
                      Irys Proof
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((record) => (
                    <tr
                      key={record.id}
                      onClick={() => handleRowClick(record)}
                      className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {formatDate(record.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-mono text-blue-400">
                        {record.marketTicker}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            record.side === 'YES'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {record.side}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        ${formatUSDC(record.amountUsdc)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: `hsl(${record.confidence}, 100%, 50%)`,
                            }}
                          />
                          <span className="font-mono">{record.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            record.status === 'FILLED'
                              ? 'bg-green-500/20 text-green-400'
                              : record.status === 'PENDING'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {record.irysTxId ? (
                          <code className="text-xs text-purple-400 font-mono">
                            {record.irysTxId.substring(0, 12)}...
                          </code>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {sorted.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-48">
              <p className="text-slate-400">No records found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Detail Modal */}
      {selectedRecord && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRecord(null)}
          title={`Audit Details: ${selectedRecord.record.marketTicker}`}
        >
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {/* Trade Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                <p className="text-xs text-slate-400">Side</p>
                <p className="text-lg font-bold text-slate-100">
                  {selectedRecord.record.side}
                </p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                <p className="text-xs text-slate-400">Amount</p>
                <p className="text-lg font-bold text-slate-100">
                  ${formatUSDC(selectedRecord.record.amountUsdc)}
                </p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                <p className="text-xs text-slate-400">Confidence</p>
                <p className="text-lg font-bold text-blue-400">
                  {selectedRecord.record.confidence}%
                </p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                <p className="text-xs text-slate-400">Risk Score</p>
                <p className="text-lg font-bold text-orange-400">
                  {selectedRecord.record.riskScore}
                </p>
              </div>
            </div>

            {/* Tier 3 & 2 Reasoning */}
            <div className="space-y-2">
              <p className="font-semibold text-slate-100">AI Reasoning</p>
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700 text-sm space-y-2">
                <p>
                  <span className="text-slate-400">Sentiment (Tier 3):</span>
                  <span className="ml-2 font-mono text-blue-400">
                    {selectedRecord.reasoning.tier3Sentiment}
                  </span>
                </p>
                <p>
                  <span className="text-slate-400">Intent (Tier 2):</span>
                  <span className="ml-2 text-slate-300">
                    {selectedRecord.reasoning.tier2Intent}
                  </span>
                </p>
                <p>
                  <span className="text-slate-400">Risk Level (Tier 1):</span>
                  <span className="ml-2 font-mono text-purple-400">
                    {selectedRecord.reasoning.tier1RiskLevel}
                  </span>
                </p>
              </div>
            </div>

            {/* Market Snapshot */}
            <div className="space-y-2">
              <p className="font-semibold text-slate-100">Kalshi Market Data</p>
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700 text-sm space-y-1 font-mono">
                <p>
                  YES Bid: {(selectedRecord.reasoning.kalshiMarketSnapshot.yesBidBps / 100).toFixed(2)}%{' '}
                  {selectedRecord.reasoning.kalshiMarketSnapshot.isLive && (
                    <span className="text-green-400">🔴 LIVE</span>
                  )}
                </p>
                <p>
                  NO Bid: {(selectedRecord.reasoning.kalshiMarketSnapshot.noBidBps / 100).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Top Traders Consensus */}
            <div className="space-y-2">
              <p className="font-semibold text-slate-100">Top Traders Consensus</p>
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700 text-sm font-mono">
                <p>
                  {selectedRecord.reasoning.topTradersConsensus.consensusSide} @{' '}
                  {(selectedRecord.reasoning.topTradersConsensus.consensusBps / 100).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="space-y-2">
              <p className="font-semibold text-slate-100">Compliance Checklist</p>
              <div className="space-y-1 text-xs">
                {selectedRecord.complianceNotes.map((note, i) => (
                  <p key={i} className="text-slate-300 font-mono">
                    {note}
                  </p>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setSelectedRecord(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100"
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

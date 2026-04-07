'use client';

/**
 * ============ NEURALVAULT RISK MANAGEMENT PANEL ============
 *
 * Core institutional vault control component:
 * - Deposit/withdraw interface for Devnet USDC
 * - Risk slider (max_position_size_bps)
 * - Yield strategy toggle
 * - Non-custodial emphasis
 * - Solana wallet integration
 */

import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import RiskSlider from '@/components/vault/RiskSlider';
import { formatUSDC, shortenAddress } from '@/lib/utils';
import { useSDK } from '@/lib/sdk-client';

interface VaultState {
  balance: number;
  maxPositionBps: number;
  riskLevel: number;
  isYieldEnabled: boolean;
  lastUpdated: number;
}

export default function NeuralVaultPanel() {
  const { connection } = useConnection();
  const { publicKey, connected, signTransaction } = useWallet();

  // Initialize SDK with wallet adapter (non-custodial)
  const { vault: vaultClient, isReady: sdkReady, error: sdkError } = useSDK(
    connection,
    publicKey,
    signTransaction
  );

  // Local state
  const [vaultState, setVaultState] = useState<VaultState>({
    balance: 0,
    maxPositionBps: 500, // 5% default
    riskLevel: 50,
    isYieldEnabled: false,
    lastUpdated: Date.now(),
  });

  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch vault state from blockchain using SDK
  useEffect(() => {
    if (!sdkReady || !vaultClient) return;

    const fetchVaultState = async () => {
      try {
        const state = await vaultClient.getVaultState();
        setVaultState({
          balance: state.balanceCents / 100,
          maxPositionBps: state.maxPositionBps,
          riskLevel: state.riskLevel,
          isYieldEnabled: state.isActive,
          lastUpdated: state.lastUpdated,
        });
      } catch (error) {
        console.error('[NeuralVaultPanel] Failed to fetch vault state:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch vault state');
      }
    };

    // Fetch immediately
    fetchVaultState();

    // Then poll every 5 seconds
    const interval = setInterval(fetchVaultState, 5000);
    return () => clearInterval(interval);
  }, [sdkReady, vaultClient]);

  const handleDeposit = async () => {
    if (!sdkReady || !vaultClient) {
      setError('SDK not initialized. Please check wallet connection.');
      return;
    }

    if (!connected || !publicKey || !signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Invalid amount');
        setIsLoading(false);
        return;
      }

      console.log(`[NeuralVaultPanel] Depositing ${amount} USDC...`);

      // Call SDK deposit method - wallet adapter will prompt for signature
      const response = await vaultClient.deposit({ amountUsdc: amount });

      console.log(`[NeuralVaultPanel] Deposit confirmed: ${response.txHash}`);

      // Update local state
      setVaultState((prev) => ({
        ...prev,
        balance: response.newBalanceUsdc,
        lastUpdated: Date.now(),
      }));

      setDepositAmount('');
      setTxHash(response.txHash);

      // Clear tx after 8 seconds
      setTimeout(() => setTxHash(null), 8000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[NeuralVaultPanel] Deposit failed:', errorMessage);
      setError(`Deposit failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!sdkReady || !vaultClient) {
      setError('SDK not initialized. Please check wallet connection.');
      return;
    }

    if (!connected || !publicKey || !signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0 || amount > vaultState.balance) {
        setError('Invalid amount or insufficient balance');
        setIsLoading(false);
        return;
      }

      console.log(`[NeuralVaultPanel] Withdrawing ${amount} USDC...`);

      // Call SDK withdraw method - wallet adapter will prompt for signature
      const response = await vaultClient.withdraw(amount);

      console.log(`[NeuralVaultPanel] Withdrawal confirmed: ${response.txHash}`);

      // Update local state
      setVaultState((prev) => ({
        ...prev,
        balance: response.newBalanceUsdc,
        lastUpdated: Date.now(),
      }));

      setWithdrawAmount('');
      setTxHash(response.txHash);

      // Clear tx after 8 seconds
      setTimeout(() => setTxHash(null), 8000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[NeuralVaultPanel] Withdrawal failed:', errorMessage);
      setError(`Withdrawal failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRiskChange = async (bps: number) => {
    if (!sdkReady || !vaultClient) {
      setError('SDK not initialized. Please check wallet connection.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`[NeuralVaultPanel] Updating risk limits to ${bps} BPS...`);

      // Call SDK setRiskLimits method
      const response = await vaultClient.setRiskLimits({
        maxPositionBps: bps,
        riskLevel: vaultState.riskLevel,
      });

      console.log(`[NeuralVaultPanel] Risk limits updated: ${response.txHash}`);

      // Update local state
      setVaultState((prev) => ({
        ...prev,
        maxPositionBps: bps,
        lastUpdated: Date.now(),
      }));

      setTxHash(response.txHash);
      setTimeout(() => setTxHash(null), 8000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[NeuralVaultPanel] Risk update failed:', errorMessage);
      setError(`Risk update failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const maxPosition = (vaultState.balance * vaultState.maxPositionBps) / 10000;

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert type="error">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {/* SDK Error Alert */}
      {sdkError && (
        <Alert type="warning">
          <p className="text-sm">SDK Initialization: {sdkError.message}</p>
        </Alert>
      )}

      {/* Header Card */}
      <Card className="border-blue-500/20 bg-linear-to-br from-slate-800/50 to-slate-900/50">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-100">
                NeuralVault Balance
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Non-custodial Devnet USDC Vault
              </p>
            </div>
            {connected && (
              <div className="text-right">
                <div className="text-sm text-slate-400">Connected Wallet</div>
                <div className="text-lg font-mono text-green-400">
                  {publicKey ? shortenAddress(publicKey.toString()) : 'Loading...'}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
            <div>
              <p className="text-sm text-slate-400">Total Balance</p>
              <p className="text-2xl font-bold text-blue-400 font-mono">
                ${formatUSDC(vaultState.balance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Max Position (5%)</p>
              <p className="text-2xl font-bold text-purple-400 font-mono">
                ${formatUSDC(maxPosition)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Last Updated</p>
              <p className="text-sm text-slate-300 font-mono">
                {new Date(vaultState.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Risk Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RiskSlider
            value={vaultState.maxPositionBps}
            onChange={handleRiskChange}
            maxPositionUsd={maxPosition}
            vaultBalance={vaultState.balance}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400">Max Single Position</p>
              <p className="text-xl font-bold text-slate-100 font-mono">
                {(vaultState.maxPositionBps / 100).toFixed(2)}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                = ${formatUSDC(maxPosition)}
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400">Risk Tolerance</p>
              <p className="text-xl font-bold text-slate-100 font-mono">
                {vaultState.riskLevel}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {vaultState.riskLevel < 30
                  ? 'Conservative'
                  : vaultState.riskLevel < 70
                    ? 'Moderate'
                    : 'Aggressive'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit/Withdraw Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fund Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6">
            {(['deposit', 'withdraw'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab === 'deposit' ? '📥 Deposit' : '📤 Withdraw'}
              </button>
            ))}
          </div>

          {/* Deposit Tab */}
          {activeTab === 'deposit' && (
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Amount in USDC"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={isLoading || !connected}
                min="0"
                step="0.01"
              />

              <Alert type="info">
                <div className="text-sm space-y-1">
                  <p>💡 Non-Custodial: Your keys, your funds</p>
                  <p className="text-xs text-slate-400">
                    You control the vault with your Solana wallet. We never hold your private keys.
                  </p>
                </div>
              </Alert>

              <Button
                onClick={handleDeposit}
                disabled={isLoading || !connected || !depositAmount}
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Deposit USDC'}
              </Button>

              {txHash && (
                <Alert type="success">
                  <p className="text-sm font-mono">{txHash}</p>
                </Alert>
              )}
            </div>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Amount in USDC"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={isLoading || !connected || vaultState.balance === 0}
                min="0"
                max={vaultState.balance}
                step="0.01"
              />

              <div className="text-sm text-slate-400">
                Available: ${formatUSDC(vaultState.balance)}
              </div>

              <Alert type="warning">
                <p className="text-sm">
                  ⚠️ Withdrawal fee: 0.5% (protocol license). Active positions must be closed first.
                </p>
              </Alert>

              <Button
                onClick={handleWithdraw}
                disabled={
                  isLoading || !connected || !withdrawAmount || vaultState.balance === 0
                }
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Withdraw USDC'}
              </Button>

              {txHash && (
                <Alert type="success">
                  <p className="text-sm font-mono">{txHash}</p>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Non-Custodial Notice */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="text-yellow-500 text-xl">🔐</div>
            <div className="text-sm space-y-1">
              <p className="font-semibold text-yellow-400">Non-Custodial Architecture</p>
              <p className="text-yellow-900/70 text-xs">
                NeuralMarket is a Software-Only Provider. The vault PDA is controlled by your
                Solana wallet signature. We cannot withdraw funds without your explicit approval
                via signed Solana transactions. Your keys = your funds.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

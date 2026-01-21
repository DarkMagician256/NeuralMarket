"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lamportsToSol = lamportsToSol;
exports.solToLamports = solToLamports;
/**
 * Convert lamports to SOL
 * @param lamports Amount in lamports (1 SOL = 1e9 lamports)
 * @returns Amount in SOL
 */
function lamportsToSol(lamports) {
    const lamportsNum = typeof lamports === 'string' ? parseFloat(lamports) : lamports;
    return lamportsNum / 1e9;
}
/**
 * Convert SOL to lamports
 * @param sol Amount in SOL
 * @returns Amount in lamports
 */
function solToLamports(sol) {
    const solNum = typeof sol === 'string' ? parseFloat(sol) : sol;
    return (solNum * 1e9).toString();
}

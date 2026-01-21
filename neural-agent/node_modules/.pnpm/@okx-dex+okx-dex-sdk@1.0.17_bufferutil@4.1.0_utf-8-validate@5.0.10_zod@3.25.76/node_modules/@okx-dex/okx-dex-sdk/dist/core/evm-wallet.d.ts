import { ethers } from 'ethers';
export interface EVMWallet {
    readonly address: string;
    readonly provider: ethers.Provider;
    signTransaction(transaction: ethers.TransactionRequest): Promise<string>;
    signMessage(message: string | Uint8Array): Promise<string>;
    sendTransaction(transaction: ethers.TransactionRequest): Promise<ethers.TransactionResponse>;
}
export declare class PrivateKeyWallet implements EVMWallet {
    readonly address: string;
    readonly provider: ethers.Provider;
    private readonly signer;
    constructor(privateKey: string, provider: ethers.Provider);
    signTransaction(transaction: ethers.TransactionRequest): Promise<string>;
    signMessage(message: string | Uint8Array): Promise<string>;
    sendTransaction(transaction: ethers.TransactionRequest): Promise<ethers.TransactionResponse>;
}
export declare function createEVMWallet(privateKey: string, provider: ethers.Provider): EVMWallet;

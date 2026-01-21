"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeypairWallet = void 0;
exports.createWallet = createWallet;
const web3_js_1 = require("@solana/web3.js");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const bs58_1 = __importDefault(require("bs58"));
/**
 * Implementation of Wallet interface using a Keypair
 * This class handles the actual signing operations while keeping the private key secure
 */
class KeypairWallet {
    constructor(keypair, connection) {
        this.payer = keypair;
        this.publicKey = keypair.publicKey;
        this.connection = connection;
    }
    async signTransaction(transaction) {
        if (transaction instanceof web3_js_1.Transaction) {
            transaction.partialSign(this.payer);
        }
        else {
            transaction.sign([this.payer]);
        }
        return transaction;
    }
    async signAllTransactions(transactions) {
        return Promise.all(transactions.map(tx => this.signTransaction(tx)));
    }
    async signAndSendTransaction(transaction, options) {
        const signedTx = await this.signTransaction(transaction);
        const signature = await this.connection.sendRawTransaction(signedTx.serialize(), options);
        return { signature };
    }
    async signMessage(message) {
        const signature = tweetnacl_1.default.sign.detached(message, this.payer.secretKey);
        return signature;
    }
}
exports.KeypairWallet = KeypairWallet;
/**
 * Factory function to create a wallet instance
 * This provides a clean way to initialize a wallet without exposing implementation details
 */
function createWallet(privateKey, connection) {
    const keypair = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(privateKey));
    return new KeypairWallet(keypair, connection);
}

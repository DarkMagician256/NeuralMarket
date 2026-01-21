"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKeyWallet = void 0;
exports.createEVMWallet = createEVMWallet;
const ethers_1 = require("ethers");
class PrivateKeyWallet {
    constructor(privateKey, provider) {
        this.signer = new ethers_1.ethers.Wallet(privateKey, provider);
        this.address = this.signer.address;
        this.provider = provider;
    }
    async signTransaction(transaction) {
        return this.signer.signTransaction(transaction);
    }
    async signMessage(message) {
        return this.signer.signMessage(message);
    }
    async sendTransaction(transaction) {
        return this.signer.sendTransaction(transaction);
    }
}
exports.PrivateKeyWallet = PrivateKeyWallet;
function createEVMWallet(privateKey, provider) {
    return new PrivateKeyWallet(privateKey, provider);
}

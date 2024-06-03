"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = __importDefault(require("crypto-js/sha256"));
class CryptoBlock {
    constructor(timestamp, data, precedingHash = "") {
        this.index = 0;
        this.nonce = 0;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
    }
    computeHash() {
        return (0, sha256_1.default)(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    proofOfWork(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }
}
class CryptoBlockchain {
    constructor() {
        this.blockchain = [this.initFirstBlock()];
        this.difficulty = 4;
    }
    initFirstBlock() {
        // * INIT THE FIRST BLOCK IN THE BLOCKCHAIN
        return new CryptoBlock("01/01/2020", "Initial Block in the Chain", "0");
    }
    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }
    addNewBlock(newBlock) {
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        newBlock.index = this.obtainLatestBlock().index + 1;
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }
    checkChainValidity() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i - 1];
            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }
            if (currentBlock.precedingHash !== precedingBlock.hash)
                return false;
        }
        return true;
    }
}
let zencoin = new CryptoBlockchain();
// zencoin.addNewBlock(new CryptoBlock("01/06/2020", {sender: "Iris Ljesnjanin", recipient: "Cosima Mielke", quantity: 50}));
// zencoin.addNewBlock(new CryptoBlock("01/07/2020", {sender: "Vitaly Friedman", recipient: "Ricardo Gimenes", quantity: 100}) );
for (let i = 0; i < 50; i++) {
    zencoin.addNewBlock(new CryptoBlock("01/01/2022", { sender: "Sender " + i, recipient: "Recipient " + i, quantity: i }));
}
console.log(JSON.stringify(zencoin, null, 4));
console.log('Is blockchain valid? ' + zencoin.checkChainValidity());

const SHA256 = require('crypto-js/sha256')
const ChainUtil = require('./chain-util');
const DIFFICULTY = 4
const BLOCKTIME = 5000

class Block {

    static genesisBlock() {
        return new Block(new Date(), '', 'fdaifjdsifj', [], '', 2)
    }

    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.hash = hash;
        this.data = data;
    }

    toString() {
        return `
        ${this.timestamp},
        ${this.lastHash},
        ${this.hash},
        ${this.nonce},
        ${this.data}
        `
    }

    static mineBlock(lastBlock, data) {
        let nonce = 0
        let timestamp
        let hash
        let difficulty = lastBlock.difficulty
        do {
            timestamp = Date.now()
            nonce ++;
            difficulty = Block.adjustDificulty(lastBlock, timestamp) || 1
            hash = SHA256(`${timestamp}${lastBlock.hash}${JSON.stringify(data)}${nonce}${difficulty}`).toString()
        } while (hash.substr(0, difficulty) !== '0'.repeat(difficulty))
        console.log(timestamp - lastBlock.timestamp)
        return new this(timestamp, lastBlock.hash, hash, data, nonce, difficulty)
    }

    static adjustDificulty(lastBlock, timestamp) {
        return (lastBlock.timestamp + BLOCKTIME) > timestamp ? (lastBlock.difficulty + 1) : (lastBlock.difficulty - 1)
    }

    static hashFn(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${JSON.stringify(data)}${nonce}${difficulty}`).toString()
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block

        return Block.hashFn(timestamp, lastHash, data, nonce, difficulty)
    }
}


module.exports = Block;

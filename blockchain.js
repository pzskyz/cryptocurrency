const Block = require("./block")

class BlockChain {


    constructor() {
        this.chain = [Block.genesisBlock()]
    }

    addBlock(data) {
        const lastBlock = this.chain[this.chain.length - 1]
        // const block = new Block(new Date(), lastBlock.hash, data)
        const block = Block.mineBlock(lastBlock, data)
        this.chain.push(block);
        return block;
    }

    toString() {
        return this.chain.map(c => {
            return c
        })
        return `Blockchain
            ${JSON.stringify(this.chain.map(c => c.toString()))}
        `
    }
}

module.exports = BlockChain;

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

    isValid(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesisBlock)) {
            return false
        }
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i]
            const lastBlock = chain[i - 1]
            if (block.lastHash !== lastBlock.hash) {
                return false
            }
        }
        return true
    }

    replace(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('new chain qua ngan')
            return
        }
        if (!this.isValid) {
            console.log('new chain invalid')
            return
        }
        console.log('Replace new chain')
        this.chain = newChain
    }
}

module.exports = BlockChain;

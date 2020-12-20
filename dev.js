// const Block = require('./block')

const BlockChain = require("./blockchain");

// const coin = new Block(new Date(), 'abc', 'def', { fuckme: true })

// console.log(coin)

const bc = new BlockChain();

const newBlock = bc.addBlock({ fuckoff: true })

console.log(newBlock.toString())

const Wallet = require('./wallet');
const Transaction = require('./wallet/transaction');

class Miner {
    constructor(bc, tp, wallet, p2p) {
        this.blockchain = bc;
        this.transactionPool = tp;
        this.wallet = wallet;
        this.p2pServer = p2p;
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions();

        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));

        const block = this.blockchain.addBlock(validTransactions);
        this.p2pServer.syncChains();
        this.transactionPool.clear();
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}

module.exports = Miner;
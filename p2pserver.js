const ws = require('ws')

const P2P_PORT = process.env.P2PPORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
}

class P2PServer {
    constructor(bc, tp) {
        this.sockets = []
        this.blockChain = bc
        this.transactionPool = tp;
    }

    listen() {
        const server = new ws.Server({
            port: P2P_PORT
        })

        server.on('connection', socket => {
            this.connectSocket(socket)
        })

        this.connectPeers()
        console.log(`listening in port ${P2P_PORT}`)
    }

    connectSocket(socket) {
        this.sockets.push(socket)
        console.log(`socket connected`)

        this.messageHandler(socket)
        this.sendChain(socket)
    }

    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockChain.chain
        }))
    }

    messageHandler(socket) {
        socket.on('message', (message) => {
            const data = JSON.parse(message)
            switch (data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockChain.replace(data.chain); break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
        })
    }

    connectPeers() {
        peers.forEach(p => {
            const socket = new ws(p)
            socket.on('open', () => {
                this.connectSocket(socket)
            })
        })
    }

    syncChains() {
        this.sockets.forEach(s => {
            this.sendChain(s)
        })
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction: transaction
        }));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction))
    }

    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({ type: MESSAGE_TYPES.clear_transactions })))
    }
}

module.exports = P2PServer
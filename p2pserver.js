const ws = require('ws')

const P2P_PORT = process.env.P2PPORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

class P2PServer {
    constructor(bc) {
        this.sockets = []
        this.blockChain = bc
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
        socket.send(JSON.stringify(this.blockChain.chain))
    }

    messageHandler(socket) {
        socket.on('message', (data) => {
            const receivedChain = JSON.parse(data)
            this.blockChain.replace(receivedChain)
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

    syncChain() {
        this.sockets.forEach(s => {
            this.sendChain(s)
        })
    }
}

module.exports = P2PServer
const ws = require('ws')

const peers = []

const server = new ws.Server({
    port: 98765
})

server.on('connection', ws => {
    ws.on('open', (socket) => {
        
    })

    ws.on('message', (data) => {
        if (data.event === 'init') {
            peers.push(data.host)
        }
    })
})
const net = require('net')

const socket = net.createConnection({
    host:'127.0.0.1',
    port:2022,
}, () => {
    socket.write('A message from client...')
})
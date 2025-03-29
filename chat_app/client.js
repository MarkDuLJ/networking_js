const net = require('net')

const socket = net.createConnection({
    host:'127.0.0.1',
    port:2022,
}, () => {
    const buff = Buffer.alloc(2);
    buff[0] = 11;
    buff[1] = 22;
    socket.write(buff);
})
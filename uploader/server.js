const net = require('net')
const fs = require('node:fs/promises')

const server = net.createServer()

server.on('connection', (socket) => {
    console.log("New connection");

    socket.on('data', async (data) => {
        const fileHandle = await fs.open(`./uploader/storage/test.txt`, 'w');

        const fileStream = fileHandle.createWriteStream();
        fileHandle.write(data);
    })
});

server.listen(5050, '::1', () => {
    console.log('Uploader server open on ', server.address());
    
})
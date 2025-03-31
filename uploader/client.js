const net = require('net')
const fs = require('node:fs/promises')

const socket = net.createConnection({
    host:'::1',
    port:5050,
}, async () => {
    const filePath = './uploader/text.txt';
    const fileHandle = await fs.open(filePath, 'r');
    const fileStream = fileHandle.createReadStream();
    
    fileStream.on('data', (data) => {
        if(!socket.write(data)){
            fileStream.pause();
        }
    });

    socket.on('drain', () => {
        fileStream.resume();
    });

    fileStream.on('end', () => {
        console.log('upload successfully.');
        socket.end();
    });
});


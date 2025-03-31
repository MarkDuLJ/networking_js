const net = require('net');
const { log } = require('node:console');
const fs = require('node:fs/promises')

const server = net.createServer()

let fileHandle, fileStream;

server.on('connection', (socket) => {
    console.log("New connection");

    socket.on('data', async (data) => {
        if(!fileHandle){
            socket.pause();
            fileHandle = await fs.open(`./uploader/storage/test.txt`, 'w');
   
            fileStream = fileHandle.createWriteStream();
            fileHandle.write(data);

            socket.resume();
            fileStream.on('drain', () => {
                socket.resume();
            });
        } else {
            if(!fileHandle.write(data)){
                socket.pause();
            }
        }
    });

    socket.on('end', () => {
        console.log("close connection...");
        fileHandle.close();
        fileHandle = undefined;
        fileStream = undefined;
        socket.end();
    });
});

server.listen(5050, '::1', () => {
    console.log('Uploader server open on ', server.address());
    
})
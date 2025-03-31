const net = require('net');
const { log } = require('node:console');
const fs = require('node:fs/promises')

const server = net.createServer()


server.on('connection', (socket) => {
    console.log("New connection");
    
    let fileHandle, fileStream;
    socket.on('data', async (data) => {
        if(!fileHandle){
            socket.pause();

            const indexOfDiv = data.indexOf('------');
            console.log(indexOfDiv);
            
            const fileName = data.subarray(10, indexOfDiv).toString();
            console.log(fileName);
            fileHandle = await fs.open(`./uploader/storage/${fileName}`, 'w');
   
            fileStream = fileHandle.createWriteStream();
            fileHandle.write(data);

            fileStream.write(data.subarray(indexOfDiv + 6));
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
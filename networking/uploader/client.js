const net = require('net')
const fs = require('node:fs/promises')
const path = require('path')

const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => resolve());
    });
};

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx,dy, () => resolve());
    });
};

const socket = net.createConnection({
    host:'::1',
    port:5050,
}, async () => {
    const filePath = process.argv[2];
    const fileName =  path.basename(filePath);
    const fileHandle = await fs.open(filePath, 'r');
    const fileStream = fileHandle.createReadStream();

    //calculate upload percentage
    const fileSize = (await fileHandle.stat()).size;
    let uploadPercentage = 0;
    let bytesUploaded = 0;

    socket.write(`FileName: ${fileName}------`);


console.log();
    
    fileStream.on('data', async (data) => {
        if(!socket.write(data)){
            fileStream.pause();
        }

        bytesUploaded += data.length;
        let updatedPercentage = Math.floor((bytesUploaded/fileSize) * 100);

        if(updatedPercentage !== uploadPercentage){
            uploadPercentage = updatedPercentage;
            await moveCursor(0, -1);
            await clearLine(0);
            console.log(`uploading...${uploadPercentage}%`);
            
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


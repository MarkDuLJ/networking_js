const fs = require('node:fs/promises');

(
    async () => {
        console.time("RW_time");
        const fileHandle = await fs.open('stream/writeMany/text.txt','r');
        const fileHandleWrite = await fs.open('stream/writeMany/dest.txt', 'w')
        const readStream = fileHandle.createReadStream();
        const writeStream = fileHandleWrite.createWriteStream();
        
        readStream.on('data', (chunk) => {
            console.log(chunk.length);
            if(!writeStream.write(chunk)){
                readStream.pause();
            }
            
        });

        writeStream.on('drain', () => readStream.resume());

        
        writeStream.on('finish', ()=>{
            console.timeEnd("RW_time");
        })
    }
)();
const fs = require('node:fs/promises');
const { buffer } = require('node:stream/consumers');

/**
 * memory: almost file size
(async () => {
    const dest = await fs.open('stream/copy/cp.txt', 'w');
    const result = await fs.readFile('stream/writeMany/text.txt');
    
    //Not work for large file
    await dest.write(result);
    
})();
*/

/** 
//reduce memory usage, drop to 30MB
(async () => {
    console.time("COPY");
    const srcFile = await fs.open('stream/writeMany/text.txt','r');
    const destFile = await fs.open('stream/copy/cp.txt', 'w');
    
    let bytesRead = -1;
    while (bytesRead !== 0) {
        
         const res = await srcFile.read();
         bytesRead = res.bytesRead;
         const buffer = res.buffer;
        
        // deal with the last non fullfilled buffer
        if(bytesRead !== 16384) {
            const indexOfNull = buffer.indexOf(0);//find no data starting index
            const newBuff = Buffer.alloc(indexOfNull);
            buffer.copy(newBuff, 0, 0, indexOfNull);//copy useful data to new buffer
            destFile.write(newBuff);
        } else {
            destFile.write(buffer);
        }
    }
    
    console.timeEnd("COPY");
    
})();
*/

//use stream
(async () => {
    console.time("COPY");
    const srcFile = await fs.open('stream/writeMany/text.txt','r');
    const destFile = await fs.open('stream/copy/cp.txt', 'w');
    
    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    readStream.pipe(writeStream, {end: false});
    
    //pipe handls destination Writable stream not over highwatermark automatically
    readStream.on('end', () => {

        console.timeEnd("COPY");
    });
    
})();
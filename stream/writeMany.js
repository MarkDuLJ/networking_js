/**
 * Use Promise write a large file
 * time: 10.5s
 * memory: 50mB
 * 
 * After:
 * time: 225ms

const fs = require("node:fs/promises");
const Stream = require("node:stream");

(
    async () => {
        const fileHandle = await fs.open('./stream/text.txt','w');
        const fileWStream = fileHandle.createWriteStream();
        
        console.time("write_large_file");
        for (let i = 0; i < 1000000; i++) {
            if(!fileWStream.write(`${i}\n`)){
                await new Promise(reslove => fileWStream.once('drain',reslove));
            }
        }
        fileWStream.end();
        await new Promise(resolve => fileWStream.on('finish', resolve));
        console.timeEnd("write_large_file");
    }
)();

*/


/**
 * use writesync or call back
 * time: 1.3s
 * memory: 500mB 
 * For call back, if file too huge, will crash
 * too many event into event loop
const fs = require('fs');

console.time("write_large");

fs.open('./stream/text.txt', 'w', (err,fd) => {
    for (let i = 0; i < 1000000; i++) {       
        // fs.writeSync(fd, `${i}\n`); // keep the order
        fs.write(fd, `${i}\n` , ()=>{}); // no order
    }
    console.timeEnd("write_large");
});
*/


/**
 * Use stream
 * time: 170ms
 * memory:200mB hard to see from active monitor because of frequency

const fs = require('node:fs/promises');

(async () => {
    console.time("Stream_write_large_file");
    
    const fileHandle = await fs.open('./stream/text.txt', 'w');
    const stream = fileHandle.createWriteStream();
    
    for (let i = 0; i < 1000000; i++) {
        const buff = Buffer.from(`${i}\n`, 'utf-8');
        stream.write(buff);
    }
    
    console.timeEnd("Stream_write_large_file");
})();
*/

/**
 * Use read/write stream to smooth memory usage
 * time:
 * memory:
 */

const fs = require('node:fs/promises');

(
    async () => {
        console.time("R/W stream");

        const fileHandle = await fs.open('./stream/text.txt', 'w');
        const writeStream = fileHandle.createWriteStream();

        let i = 0;

        const writeBuff = () => {
            for ( ;i < 1000000; i++) {
                const buff = Buffer.from(`${i}`, 'utf-8');
               if(!writeStream.write(buff)){
                   break; 
               }    
            }
        }

        writeBuff();

        writeStream.on('drain', ()=>{
            console.log('cleaning buff...');
            writeBuff();
            
        });

        console.timeEnd("R/W stream");
    }
)();
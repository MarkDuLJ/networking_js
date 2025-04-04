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
 * Use drain for a write stream to smooth memory usage
 * time:
 * memory:
 */

const fs = require('node:fs/promises');
// clearer solution than below
(
    async () => {
        console.time('Wrtie_stream');
        let fileHandle;

        try {
            fileHandle = await fs.open('./stream/text.txt', 'w');
            const writeStream = fileHandle.createWriteStream();

            let i = 0;
            const total = 1_000_000;
            const stop_at = 99_999; //since i starts from 0

            const writeBuff = () => {
                let write_ok = true;
                while (i < total && write_ok) {
                    const buff = Buffer.from(`${i}`, 'utf-8');
                    write_ok = writeStream.write(buff);
                    i++;

                    if(i = stop_at){
                        console.log(`stopping at ${stop_at}...`);
                        writeStream.end(() => {
                            console.timeEnd('Wrtie_stream');
                            console.log("Steam closed.");
                            
                        });
                        return; // stop executaion after ending stream
                    }

                    if(i < total){
                        writeStream.once('drain', writeBuff);
                    }
                }
            }
            writeBuff(); //start writing
        } catch (error) {
            console.log(error);
            
        }finally{
            if(fileHandle){
                await fileHandle.close();// ensure fileHandle always closed.
            }
        }
    })();


/** 

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

               if(i === 99999) {
                return writeStream.end(buff);
               }
            }
        }

        writeBuff();

        // resume loop when buff is empty
        writeStream.on('drain', ()=>{
            console.log('cleaning buff...');
            writeBuff();
            
        });

        writeStream.on('finish', () => {
            console.timeEnd("R/W stream");
            fileHandle.close();
        })

    }
)();
*/
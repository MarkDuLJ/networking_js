const fs = require('node:fs/promises');
const Stream = require('node:stream');

(
    async () => {
        console.time("RW_time");
        const fileHandle = await fs.open('stream/writeMany/text.txt','r');
        const fileHandleWrite = await fs.open('stream/writeMany/dest.txt', 'w')
        const readStream = fileHandle.createReadStream();
        const writeStream = fileHandleWrite.createWriteStream();
        
        let broken_num = '';
        readStream.on('data', (chunk) => {
            // console.log(chunk.length);
            // if(!writeStream.write(chunk)){
            //     readStream.pause();
            // }

            // only write even number from stream
            // after split, some number like '310',   '78311', '78312', '78313', '78314', '78315', '78316',
            const numbers = chunk.toString('utf-8').split(" ");

            //from current chunk
            if(Number(numbers[0]) !== Number(numbers[1]) - 1){
                if(broken_num){
                    numbers[0] = broken_num + numbers[0];
                }
            }

            // from last chunk
            if(Number(numbers[numbers.length -2]) + 1 !== Number(numbers[numbers.length -1])){
                broken_num = numbers.pop();
            }

            // console.log(numbers);
            
            numbers.forEach(number => {
                let n = Number(number);

                if(n % 2 === 0){
                    if(!writeStream.write(`${n} `)){
                        readStream.pause();
                    }
                }
            });    
        });

        writeStream.on('drain', () => readStream.resume());
   
        writeStream.on('close', ()=>{
            console.timeEnd("RW_time");
        })
    }
)();
const {Readable} = require('node:stream');

const fs = require('node:fs');

class MyReadStream extends Readable {
    constructor({highWaterMark, fileName}){
        super({highWaterMark});
        this.fileName = fileName;
        this.fd = null;
    }

    _construct(callback){
        fs.open(this.fileName, 'r', (err, fd) => {
            if(err) return callback(err)
            
            this.fd =fd;
            callback();
        });
    }

    _read(size){
        const buff = Buffer.alloc(size);
        fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
            if(err) this.destroy(err);

            this.push(bytesRead > 0 ? buff.subarray(0,bytesRead): null)
        })
        // this.push(Buffer.from("hello"))
    }

    _destroy(error, callback){
        if(this.fd){
            fs.close(this.fd, (err) => callback(err||error));
        }else{
            callback(error);
        }
    }
}

console.time("Read File")
const stream = new MyReadStream({fileName:'stream/readable/text.txt'});

stream.on('data', (chunk) => {
    console.log(chunk.toString('utf-8'));
    
})

stream.on('end', () => {
    console.log("Finish reading.");
    
    console.timeEnd("Read File")
})
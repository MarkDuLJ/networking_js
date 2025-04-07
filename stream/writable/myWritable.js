const {Writable} = require('node:stream');
const fs = require('node:fs');

class FileWriteStream extends Writable {
    constructor({highWaterMark, fileName}) {
        super({highWaterMark});
        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunkSize = 0;
        this.writeCount = 0;
    }

    // run after constructor but before other methods
    _construct(callback){
        fs.open(this.fileName, 'w', (err, fd) => {
            if(err) {callback(err);}else{
                this.fd = fd;
                callback();
            }
        });

    }

    _write(chunk, encoding, callback){
        this.chunks.push(chunk);
        this.chunkSize += chunk.length;
        
        //only do write when size overflow
        if(this.chunkSize > this.writableHighWaterMark){
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (!err) {
                    this.chunkSize = 0;
                    this.chunks = [];
                }
                callback(err);
            });
        }
        this.writeCount += 1;
        callback();
        
    }

    _final(callback) {
        if(this.chunks.length > 0) {

            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
               if(err) return callback(err);
    
               this.chunks = [];
               fs.close(this.fd, callback);
            });
        } else{
            fs.close(this.fd, callback);
        }
    }

    _destroy (error, callback){
        console.log(`Total write ${this.writeCount} times.`);
        if(this.fd){
            fs.close(this.fd, (err) => callback(err | error));
        }
        
    }
}

const stream = new FileWriteStream({highWaterMark: 1900, fileName:"stream/writable/text.txt"});

stream.write(Buffer.from("1st write"));
stream.end(Buffer.from("last write"));

stream.on('finish', () => console.log("Stream finished.")
)

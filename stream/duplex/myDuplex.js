const {Duplex} = require('node:stream')
const fs = require('node:fs')

class MyDuplex extends Duplex {
    constructor({writableHighWaterMark, readableHighWaterMark, srcFileName, destFileName}){
        super({readableHighWaterMark,writableHighWaterMark});
        this.srcFileName = srcFileName;
        this.destFileName = destFileName;
        this.readFd = null;
        this.writeFd = null;
        this.chunks = [];
        this.chunkSize = 0;
        this.writeCount = 0;
    }

    _construct(callback){
        fs.open(this.srcFileName, 'r', (err, readFd) => {
            if(err) return callback(err);
            
            this.readFd = readFd;
            fs.open(this.destFileName, 'w', (err, writeFd) => {
                if(err) return callback(err);
    
                this.writeFd = writeFd;
                
                callback();
            });
            
        });
    }

    _write(chunk, encoding, callback) {
console.log(this.writeFd, this.readFd);

        this.chunks.push(chunk);
        this.chunkSize += chunk.length;

        if(this.chunkSize > this.writableHighWaterMark) {
            fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
                if(err) return callback(err);

                this.chunks = [];
                this.chunkSize = 0;
                ++this.writeCount;
                callback();
            })
        } else{ callback();}
    }

    _read(size){
        const buff = Buffer.alloc(size);
        fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
            if(err) return this.destroy(err);

            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
        })
    }

    _final(callback){
        if (this.chunks.length > 0) {
            fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
                if (err) return callback(err);
                this.chunks = [];
                ++this.writeCount;
                // fs.close(this.writeFd, () => callback());
            });
        } else {
            // fs.close(this.writeFd, () => callback());
        }
    }

    _destroy(error, callback){
        // if(this.writeFd){
        //             fs.close(this.writeFd, (err) => callback(err | error));
        //         }
        callback();
    }
}

const duplex = new MyDuplex({
    srcFileName:'stream/readable/text.txt',
    destFileName:'stream/duplex/dest.txt',
});

duplex.write(Buffer.from(" 1st try."));
duplex.write(Buffer.from(" 2nd try."));
duplex.end(Buffer.from("final"));

duplex.on('data', chunk => {
    console.log("reading...", chunk.toString());

})

duplex.on('end', () => duplex.end())

const {Transform} = require('node:stream');
const fs = require('node:fs/promises');

class MyTransform extends Transform {
    _transform(chunk, encoding, callback){
        console.log(chunk.toString());
        for (let i = 0; i < chunk.length; ++i) {
            if(chunk[i] !== 255) chunk[i] = chunk[i] + 1;
            
        }
        console.log(chunk.toString());
        
        this.push(chunk);//not good, use callback instead
        callback(null, chunk);
    }
}

(async () => {
    const readFileHandle = await fs.open('stream/transform/read.txt', 'r');
    const writeFileHandle = await fs.open('stream/transform/write.txt', 'w');

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const transformer = new MyTransform();

    readStream.pipe(transformer).pipe(writeStream);

})();
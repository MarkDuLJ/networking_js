/** 
const { Readable} = require('stream');

class MyStream extends Readable {
    count = 0;
    _read(size){
        setImmediate(() => {// trigger async

            this.push('HIHI');
            if(this.count++ === 5){this.push(null)}
        })
    }
}

const stream = new MyStream({
    highWaterMark: 200,
    encoding:'utf-8'
});
stream.on('data', chunk => {
    console.log(chunk.toString());
    
})

stream.on('readable', () => {
    console.count('>> readable:');
    let chunk;
    while ((chunk = stream.read()) !== null) {
        console.log(chunk.toString());   
    }
})

stream.on('end', () => console.log('end.'))

import {createReadStream} from 'fs'
import { Readable } from 'stream'
import {setTimeout as sleep } from 'timers/promises'

const stream = createReadStream(import.meta.filename, {encoding:'utf-8'})

for await( let chunk of stream){
    console.log(chunk.toUpperCase());
    
}

async function * generate() {
    yield 'Hi'
    await sleep(100)
    yield ' '
    await sleep(100)
    yield 'There'
}

Readable.from(generate()).on('data', chunk => console.log(chunk))

import {Writable} from 'stream'
import {once} from 'events'

class WriteStream extends Writable {
    constructor(){
        super({highWaterMark: 10})
    }
    
    _write(data, encoding, callback){
        process.stdout.write(data.toString().toUpperCase() + '\n', callback)
    }
}

const stream = new WriteStream()

for (let i = 0; i < 10; i++) {
    const waitDrain = !stream.write('Hello')
    
    if(waitDrain){
        console.log('>> Draining...\n');
        await once(stream, 'drain')
    } 
}

stream.end('end.')

import fs from 'fs'
import {pipeline} from 'stream/promises'

await pipeline(
    fs.createReadStream(import.meta.filename),
    async function * (source) {
        for await (let chunk of source){
            yield chunk.toString().toUpperCase()
        }
    },
    process.stdout,
)

*/


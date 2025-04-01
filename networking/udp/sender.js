const dgram = require('dgram');

const sender = dgram.createSocket('udp4');

sender.send("hello", 8000, '127.0.0.1', (err, bytes) => {
    if (err) {
        console.log(err);
        
    }

    console.log(bytes);
    
})
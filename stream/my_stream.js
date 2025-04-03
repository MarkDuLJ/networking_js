const MyEventEmitter = require('../eventEmitter/MyEventEmitter');

class MyStream extends MyEventEmitter {
    constructor() {
        super();
        this.buffer = [];
    }

    write(chunk){
        this.buffer.push(chunk);
        this.emit('data', chunk);
    }

    end(){
        this.emit('end', this.buffer.join(''));
    }
}

module.exports = MyStream;
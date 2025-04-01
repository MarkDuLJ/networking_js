const EventEmitter = require('events');

class WithTime extends EventEmitter {
    constructor() {
        super();
        this.on('data', (data) => {
            console.log("Got data:", data); 
        });
    }

    async execute(asyncFunc, ...args) {
        this.emit('begin');
        console.time('execute');

        try {
            const data = await asyncFunc(...args);
            this.emit('data', data);
        } catch (err) {
            this.emit('error', err)
        }

        console.timeEnd('execute');
        this.emit('end');
    }
}

module.exports = WithTime;
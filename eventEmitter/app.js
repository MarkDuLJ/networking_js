// const EventEmitter = require('events');
const EventEmitter = require('./MyEventEmitter');

class Emitter extends EventEmitter {}

/**
 * Pure javasctipt, no libuv, no event loop, no async
 *          SAMPLE for a network request
 * req -> OS -> libuv -> event loop ->  inside App on method call back 
 */
const myE = new Emitter();

// ON:push new function to myE object
//EMIT: run function inside this object
myE.on('doo', () => {
    console.log("event2 happening...");    
});
myE.on('doo', () => {
    console.log("event1 happening...");    
});
myE.on('doo', (x) => {
    console.log(`event3 happening with parameter: ${x}...`);    
});
myE.once('john', () => {
    console.log("event4 happening...");    
});

console.log(
    myE.eventNames()
);
console.log(
    myE.listenerCount('doo')
);


myE.emit('doo', "hoho")

myE.emit('john');
myE.emit('john');
console.log(
    myE.listenerCount('john')
);


// if no function inside object, won't run
myE.emit('hahaha');


const WithTime = require('./WithTime');
const withTime = new WithTime();
withTime.on('begin', () => console.log('ready to exectue...'));
withTime.on('end', () => console.log('finishing exectue...'));

const readFile = async (url,cb) => {
   const resp = await fetch(url);
   return resp.json();
};

withTime.execute(readFile,'https://jsonplaceholder.typicode.com/posts/1');
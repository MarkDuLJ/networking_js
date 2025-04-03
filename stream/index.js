/**
 * A simple demo for mystream class
 */

const MyStream = require("./my_stream");

const mystream = new MyStream();

mystream.on('data', chunk => {
    console.log(`Stream writing: ${chunk}`);
});

mystream.on('end', (final) => {
    console.log("Stream writing finished...");
    console.log("Final Data:", final);
});

mystream.write("hello, ");
mystream.write("long long time ago,  ");
mystream.write("there was a war between birds and beasts.");
mystream.end();
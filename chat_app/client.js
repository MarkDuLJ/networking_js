const net = require('net')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const socket = net.createConnection({
    host:'127.0.0.1',
    port:2025,
},  () => {
    console.log(`connect to server...`);
    
    rl.question("Input >>> ", (message) => {
       socket.write(message);
    });
    
})

// Handle server response
socket.on('data', (data) => {
    console.log("Server:", data.toString());
});

// Handle connection close
socket.on('end', () => {
    console.log("Connection is ended...");
    rl.close();
});

// Handle errors
socket.on('error', (err) => {
    console.error("Error:", err.message);
    rl.close();
});

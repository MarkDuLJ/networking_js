const net = require('net')
const http = require('http')

const server = net.createServer();

server.on('connection',(socket) => {
    console.log(`New connection to server...`);
    
    socket.on('data', (data) => {
        console.log(data.toString('utf-8'));
        
    })
    
})

server.on('error', (err) => {
    console.log("wrong");
    
})

server.on('close', () => {
    console.log("close");
    
})

server.listen(2025,'127.0.0.1', () => {
    console.log(`Server is running... on`, server.address());
    
} )
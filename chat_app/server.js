const net = require('net')
const http = require('http')

const clients = new Map(); // store connected client with id
let user_count = 0;

const broadcast = (message, sender) => {
    clients.forEach((id, client) => {
        // if(client !== sender) {
            client.write(message + '\n');
        // }
    });
};

const server = net.createServer((socket) => {
    user_count++;
    const clientId = `User-${user_count}`;
    clients.set(socket, clientId);
    console.log(`${clientId} joined in.`);
    socket.write(`Set prompt ${clientId}\n`);
    broadcast(`${clientId} in chat now`, null);
    
    socket.on('data', data => {
        const message = data.toString().trim();
        if(message){
            broadcast(`${clientId}: ${message}`, socket);
        }
    });
    
    socket.on('error', (err) => {
        console.log(`error with ${clientId}:`, err.message);      
    });
    
    socket.on('end', () => {
        clients.delete(socket);
        console.log(`${clientId} disconnected.`);
        broadcast(`${clientId} left.`, null);
    });
});


server.listen(2025,'127.0.0.1', () => {
    console.log(`Server is running... on`, server.address());
    
} )
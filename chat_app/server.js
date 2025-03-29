const net = require('net')
const http = require('http')

const server = net.createServer((socket) => {

})

server.listen(2022,'127.0.0.1', () => {
    console.log(`Server is running... on`, server.address());
    
} )
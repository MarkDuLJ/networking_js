const dns = require('dns')

// (() => {
    dns.lookup('google.com', (err,addr, family) => {

        console.log(addr);
    })

    
// })();
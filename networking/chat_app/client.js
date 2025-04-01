const net = require('net')
const readline = require('readline')

let  user_prompt= 'Input >>> ';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: user_prompt,
})

const clearLine = ()  => {
    readline.cursorTo(process.stdout, 0); // Move cursor to the start of the line
    readline.clearLine(process.stdout, 0); // Clear the entire line
}

const clearLastLine = () => {
    process.stdout.moveCursor(0, -1); // move curson up
    process.stdout.clearLine(); //clear the whole line
    process.stdout.cursorTo(0); //move cursot to begin
}

const socket = net.createConnection({
    host:'127.0.0.1',
    port:2025,
},  () => {
    console.log(`connecting to server...`);
   
});

rl.on('line', (message) => {
    socket.write(message);
    rl.prompt(true);
});


// Handle server response
socket.on('data', (data) => {
    const message = data.toString().trim();
    if(message.startsWith("Set prompt")){
        user_prompt = message.split(" ")[1] + ": ";
        rl.setPrompt(user_prompt);
        rl.prompt();
    }else {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log("\n" + message);
        rl.prompt(true);
    }
});


// Handle connection close
socket.on('end', () => {
    clearLastLine();
    console.log("Connection was ended...");
    rl.close();
});

// Handle errors
socket.on('error', (err) => {
    console.error("Error:", err.message);
    rl.close();
});

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;

server.listen(port, function() {
    console.log(`listening on *:${port}`);
 });

// app.get('/', (req, res) => {
//     res.sendFile( __dirname + '/src/index.html' )
// })

app.use(express.static(path.join(__dirname, 'src')))

let clients = 0
io.on(`connection`, (socket) => {
    console.log(`user terhubung`);
    
    setTimeout(() => {
        // socket.send(`kirim a pesan`)
        socket.emit(`testerEvent`, { description: 'custom sebuah event dengan nama testerEvent'})
    }, 4000);

    // event handlint
    socket.on(`clientEvent`, (data) => {
        console.log(data);
        socket.emit(`sendToClient`, data)
        // io.sockets.emit(`sendToClient`, data)
    })

    // broadcast
    clients++;
    socket.emit('broadcast',{ description: ' Hey, selamat datang! '});
    io.sockets.emit(`broadcast`, {description: clients + ` klien terhubung`})

    socket.on(`disconnect`, () => {
        clients--
        console.log(`user tidak terhubung`);
    })
})

let nsp = io.of(`/queue`)
nsp.on(`connection`, (socket) => {
    socket.emit(`antrian`, `testing aja`)
})

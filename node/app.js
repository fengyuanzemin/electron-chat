const koa = require('koa');
const app = new koa();
// const route = require('koa-route');
var server = require('http').Server(app.callback());
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(port, () => {
    console.log('listening on *:' + port);
});
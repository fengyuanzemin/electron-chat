const koa = require('koa');
const app = new koa();
// const route = require('koa-route');
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
const port = 8080;
const robot = require('./robot');

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Chatroom

var numUsers = 0;

io.on('connection', (socket) => {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', async(data) => {
        if (/^\@风/.test(data)) {
            let message;
            try {
                const res = await robot(data);
                if (res.data.code === 100000) {
                    message = res.data.text;
                } else {
                    message = '哦是吗';
                }
            } catch (e) {
                console.error(e);
                message = '我这边出现了一点小问题～（其实就是 API 不能调用了）';
            }
            io.sockets.emit('new message', {
                username: '风',
                message,
            });
        } else {
            // we tell the client to execute 'new message'
            socket.broadcast.emit('new message', {
                username: socket.username,
                message: data,
            });
        }
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});
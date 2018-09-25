// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const socket = require('socket.io-client')('http://localhost:8080');
const $ = require('jquery');

$(function() {
    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });
});
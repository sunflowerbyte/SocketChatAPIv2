const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('connection', 'a new user connected'); // Broadcast to all users that a new user has connected

    // Handle chat messages
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg); // Broadcast the message to all users
    });

    // Handle nickname event
    socket.on('nickname', (msg) => {
        console.log("nickname received: " + msg);
        socket.emit("nickname", "Hey " + msg);
    });

    // Handle user typing event
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username); // Broadcast typing event to all other users
    });

    // Handle user stopped typing event
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing'); // Notify others that the user stopped typing
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

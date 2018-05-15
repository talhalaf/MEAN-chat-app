const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname,'..',path.win32.basename('/public'));
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection',(socket)=> {
    console.log('New user connected');

    socket.emit('newMessage',{
        from: 'System',
        text: 'Wellcome new user!',
        createdAt: new Date().getTime()
    });
    socket.broadcast.emit('newMessage',{
        from: 'System',
        text: 'New user has joined to chat!',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage',(newMessage) =>{

        console.log('createMessage',newMessage);

        socket.broadcast.emit('newMessage',{
            from: newMessage.from,
            text: newMessage.text,
            createdAt: new Date().getTime()
        });
    });
    socket.on('disconnect',()=> {
        console.log('User was disconnected');
    });
});


server.listen(port,() => {
    console.log(`Server is up on port ${port}`);
});
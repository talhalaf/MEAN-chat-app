const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname,'..',path.win32.basename('/public'));
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

var connections = [];

io.on('connection',(socket)=> {
    console.log('New user connected');
    connections.push(socket.id);
    console.log(connections);

    socket.emit('newMessage',generateMessage('System','Wellcome new user!'));
    socket.broadcast.emit('newMessage',generateMessage('System','New user has joined!'));

    socket.on('createMessage',(newMessage,callback) =>{

        console.log('createMessage',newMessage);

        if (newMessage && newMessage.from && newMessage.text){
         io.emit('newMessage',generateMessage(newMessage.from,newMessage.text));
         callback? callback('This is from the server'):console.log('malware detect'); //TODO: add auth for createMessage listener
        }
    });

    socket.on('createLocation',(positionMessage,callback)=>{
        
        var generatedMessage = generateLocationMessage(positionMessage.from,positionMessage.lat,positionMessage.lng).then(res => {
            console.log('generatedMessage', res);
            io.emit('newLocationMessage', res);
            callback(undefined,'This is from the server');
        }).catch(e =>{
            console.log(e);
        });;
    })

    socket.on('disconnect',()=> {
        console.log('User was disconnected');
        connections.splice(socket.id,1);
        console.log(connections);
    });
});

server.listen(port,() => {
    console.log(`Server is up on port ${port}`);
});
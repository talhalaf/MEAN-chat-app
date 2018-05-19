const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

const publicPath = path.join(__dirname,'..',path.win32.basename('/public'));
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));


io.on('connection',(socket)=> {
    console.log('New user connected');

    socket.on('joinRoom',(params,callback)=>{
        if(!params || !isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room are required');
        }
        socket.emit('newMessage',generateMessage('System','Wellcome new user!'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('System',`${params.name} has joined the room!`));

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        
        console.log(users.getUserList(params.room));
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        callback();
    })
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
        var removedUser = users.removeUser(socket.id);
        io.to(removedUser.room).emit('updateUserList',users.getUserList(removedUser.room));
    });
});

server.listen(port,() => {
    console.log(`Server is up on port ${port}`);
});
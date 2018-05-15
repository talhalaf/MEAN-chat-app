const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {geocodeAddress} = require('./utils/geocode');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname,'..',path.win32.basename('/public'));
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection',(socket)=> {
    console.log('New user connected');

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
        console.log('createLocation',positionMessage);
        geocodeAddress(positionMessage.lat,positionMessage.lng,function(error,res){
            if (error){
                return console.log('Unable to fetch Address');
            }
            io.emit('newMessage',generateMessage(positionMessage.from,`Hi from ${res.address}!`));
            callback('This is from the server');
        });
    })

    socket.on('disconnect',()=> {
        console.log('User was disconnected');
    });
});


server.listen(port,() => {
    console.log(`Server is up on port ${port}`);
});
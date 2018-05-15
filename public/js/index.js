var socket = io();

socket.on('connect',function(){
    console.log('Connected to server');

    socket.emit('createMessage',{
        to:'jen@example.com',
        text: 'Hi, this is Tal!',
        createdAt: new Date()
    });
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});

socket.on('newMessage',function(message){
    console.log('New message!', message);
});
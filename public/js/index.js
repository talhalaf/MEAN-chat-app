var socket = io();

socket.on('connect',function(){
    console.log('Connected to server');
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});

socket.on('newMessage',function(message){
    console.log('New message!', message);
    var formattedTime = moment(message.createdAt).format('HH:mm');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit',function (e) {
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('');
    })
});

var locationButton = jQuery('#send-location');

locationButton.on('click',function() {
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }
    locationButton.attr("disabled", true).text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(pos){
        socket.emit('createLocation',{
            from: 'User',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        }, function(error, data){
            if (error){
                alert(error);
            }
            locationButton.removeAttr("disabled").text('Send location');
        })
    },function(){
        alert('Unable to fetch location.');
    });
    // locationButton.attr("disabled", false);
});
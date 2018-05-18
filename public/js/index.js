var socket = io();

socket.on('connect',function(){
    console.log('Connected to server');
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});

function scrollToBottom(){
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('newMessage',function(message){
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        text: message.text,
        formattedTime: moment(message.createdAt).format('HH:mm')
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage',function(message){

    var template = jQuery('#location-message-template').html();
    console.log(message);
    var html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        address: message.address,
        formattedTime: moment(message.createdAt).format('HH:mm')
    });
    console.log(html);
    jQuery('#messages').append(html);
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
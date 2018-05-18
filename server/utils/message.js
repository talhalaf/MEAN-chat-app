const {geocodeAddress} = require('./geocode');

var generateMessage = (from,text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };
};

var generateLocationMessage = (from, lat, lng) => {
    return geocodeAddress(lat,lng).then(res => {
        message = res;
        console.log('Result',res);
        address = res.address;
        return this.message =  {
            from,
            url: `https://www.google.com/maps?q=${lat},${lng}`,
            address,
           createdAt: new Date().getTime()
        };
    }).catch((error)=>{
        return this.message =  {
            from,
            url: `https://www.google.com/maps?q=${lat},${lng}`,
            address: 'My Current Location',
           createdAt: new Date().getTime()
        };
    });
    // var address = geocodeAddress(lat,lng,function(error,res){
    //     if (error){
    //         console.log(error);
    //         return undefined;
    //     } else {
    //         console.log(res);
    //         address2 = res.address;
    //     }
    // });


}

module.exports = {generateMessage,generateLocationMessage};
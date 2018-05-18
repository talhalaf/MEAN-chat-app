const request = require('request');

var geocodeAddress = (lat,lng) => {
  return new Promise((resolve,reject)=>{
    request({
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`,
      json: true
    }, (error, response, body) => {
      // console.log('error',error);
      // console.log('response',response);
      // console.log('body',body);
      if (error) {
        reject('Unable to connect to Google servers.');
      } else if (body.status === 'ZERO_RESULTS') {
        // console.log(body.status);
        reject('Unable to find that address.');
      } else if (body.status === 'OVER_QUERY_LIMIT'){
        // console.log(body.status);
        reject(body.status);
      } else if (body.status === 'OK') {
        resolve({
          address: body.results[0].formatted_address
        });
      } else {
          reject('Unexpected Error fetching address!');
        }
    });
  }); 
};



module.exports.geocodeAddress = geocodeAddress;

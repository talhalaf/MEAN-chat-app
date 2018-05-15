const request = require('request');

var geocodeAddress = (lat,lng, callback) => {

  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('Unable to connect to Google servers.');
    } else if (body.status === 'ZERO_RESULTS') {
      callback('Unable to find that address.');
    } else if (body.status === 'OK') {
      callback(undefined, {
        address: body.results[0].formatted_address
      });
    }
  });
};


module.exports.geocodeAddress = geocodeAddress;

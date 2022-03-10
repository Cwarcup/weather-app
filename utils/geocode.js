const request = require('postman-request');

// use geocode to query a city name and return the latitude and longitude.
const geocode = (address, callback) => {
  const url =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    encodeURIComponent(address) +
    '.json?access_token=pk.eyJ1IjoiY3VydGlzd2FyY3VwIiwiYSI6ImNsMGp5b3c1MDBoYzIzcGtjMG0ydHgwZXYifQ.UUL9qMMMqC7XezgJIGqdNg&limit=1';

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to location services!', undefined);
    } else if (response.body.error) {
      callback('Unable to find location. Try another search.', undefined);
    } else {
      // set first arg for callback to undefined, meaning the error is undefined
      callback(undefined, {
        latitude: response.body.features[0].center[1],
        longitude: response.body.features[0].center[0],
        location: response.body.features[0].place_name,
      });
    }
  });
};

module.exports = geocode;

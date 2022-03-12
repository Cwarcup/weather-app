const request = require('postman-request');
const geocode = require('./src/utils/geocode');
const forecast = require('./src/utils/forecast');

const address = process.argv[2];

if (!address) {
  console.log('Please provide an address or city name');
} else {
  geocode(address, (error, { longitude, latitude, location } = {}) => {
    if (error) {
      return console.log(error);
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return console.log(error);
      }

      console.log(location);
      console.log(forecastData);
    });
  });
}

const request = require('postman-request');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

forecast(49.163168, -123.137414, (error, data) => {
  console.log('error', error);
  console.log('data', data);
});

geocode('Richmond, British Columbia', (error, data) => {
  console.log('error', error);
  console.log('data', data);
});

const request = require('postman-request');
const geocode = require('./utils/geocode');

// const url =
//   'http://api.weatherstack.com/current?access_key=320d76a9035985b875dca26811572be4&query=49.1665025,-123.1924007&units=m';

// request({ url: url, json: true }, (error, response) => {
//   const data = response.body;

//   if (error) {
//     console.log('Unable to connect to weather service!');
//   } else if (response.body.error) {
//     console.log('Unable to find location');
//   } else {
//     console.log(
//       `The weather in ${data.location.name} is ${data.current.weather_descriptions}. The temperature is ${data.current.temperature} but feels like ${data.current.feelslike}.`
//     );
//   }
// });

// const geocodeLocation = 'Vancouver';

// const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${geocodeLocation}.json?access_token=pk.eyJ1IjoiY3VydGlzd2FyY3VwIiwiYSI6ImNsMGp5b3c1MDBoYzIzcGtjMG0ydHgwZXYifQ.UUL9qMMMqC7XezgJIGqdNg&limit=1`;

// request({ url: geocodeURL, json: true }, (error, response) => {
//   if (error) {
//     console.log('Unable to connect to geocode service!');
//   } else if (response.body.features.length === 0) {
//     console.log('Unable to find location. Try another search.');
//   } else {
//     const latitude = response.body.features[0].center[1];
//     const longitude = response.body.features[0].center[0];
//     console.log(
//       `The geocode for ${geocodeLocation} is Latitude is ${latitude} & longitude is ${longitude}`
//     );
//   }
// });

geocode('Richmond, British Columbia', (error, data) => {
  console.log('error', error);
  console.log('data', data);
});

const request = require('postman-request');

const url =
  'http://api.weatherstack.com/current?access_key=320d76a9035985b875dca26811572be4&query=49.1665025,-123.1924007&units=m';

request({ url: url, json: true }, (error, response) => {
  const data = response.body;
  console.log(
    `The weather in ${data.location.name} is ${data.current.weather_descriptions}. The temperature is ${data.current.temperature} but feels like ${data.current.feelslike}.`
  );
});

const geocodeURL =
  'https://api.mapbox.com/geocoding/v5/mapbox.places/Vancouver.json?access_token=pk.eyJ1IjoiY3VydGlzd2FyY3VwIiwiYSI6ImNsMGp5b3c1MDBoYzIzcGtjMG0ydHgwZXYifQ.UUL9qMMMqC7XezgJIGqdNg&limit=1';

request({ url: geocodeURL, json: true }, (error, response) => {
  const data = response.body;
  console.log(
    `Latitude is ${data.features[0].center[0]} & longitude is ${data.features[0].center[1]}`
  );
});

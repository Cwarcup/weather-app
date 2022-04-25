require('dotenv').config();
const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
  const access_key = '320d76a9035985b875dca26811572be4';

  const url = `http://api.weatherstack.com/current?access_key=${access_key}&query=${latitude},${longitude}&units=m`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weatherstack API.', undefined);
    } else if (body.error) {
      callback(
        'Unable to find weather with the specified latitude and longitude. Try again.',
        undefined
      );
    } else {
      const data = {
        locName: body.location.name,
        weatherDescription: body.current.weather_descriptions,
        feelsLike: body.current.feelslike,
        temp: body.current.temperature,
        humidity: body.current.humidity,
      };

      const sentence = `The temperature in ${data.locName} is ${data.temp} degrees C, but feels like ${data.feelsLike} degrees. It appears to be ${data.weatherDescription} and has a humidity of ${data.humidity} %.`;

      callback(undefined, {
        sentence: sentence,
        icon: body.current.weather_icons,
      });
    }
  });
};

module.exports = forecast;

const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
  const access_key = '320d76a9035985b875dca26811572be4';

  const url = `http://api.weatherstack.com/current?access_key=${access_key}&query=${latitude},${longitude}&units=m`;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to weatherstack API.', undefined);
    } else if (response.body.error) {
      callback(
        'Unable to find weather with the specified latitude and longitude. Try again.',
        undefined
      );
    } else {
      const data = {
        locName: response.body.location.name,
        weatherDescription: response.body.current.weather_descriptions,
        feelsLike: response.body.current.feelslike,
        temp: response.body.current.temperature,
        humidity: response.body.current.humidity,
      };

      callback(
        undefined,
        `The temperature in ${data.locName} is ${data.temp} degrees C, but feels like ${data.feelsLike} degrees. It appears to be ${data.weatherDescription} and has a humidity of ${data.humidity} %.`
      );
    }
  });
};

module.exports = forecast;

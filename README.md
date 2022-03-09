# Weather App

Course found [here](https://www.udemy.com/course/the-complete-nodejs-developer-course-2):

# Making HTTP Request

Will be using [weatherstack api.](https://weatherstack.com/documentation)

Will be using npm module [Postman Request](https://www.npmjs.com/package/postman-request) for this.
```
npm i postman-request
```

Basic Request
```js
const request = require('postman-request');

const url =
  'http://api.weatherstack.com/current?access_key=320d76a9035985b875dca26811572be4&query=49.1665025,-123.1924007';

request(url, (error, response) => {
  const data = JSON.parse(response.body);
  console.log(data.current);
});
```

Adding the **json** option in the `request` allows us to convert the json data into an object. Therefore, no need for JSON.parse().

```js
const request = require('postman-request');

const url =
  'http://api.weatherstack.com/current?access_key=320d76a9035985b875dca26811572be4&query=49.1665025,-123.1924007';

request({ url: url, json: true }, (error, response) => {
  const data = response.body;
  console.log(
    `The weather in ${data.location.name} is ${data.current.weather_descriptions}. The temperature is ${data.current.temperature} but feels like ${data.current.feelslike}.`
  );
});

// The weather in Steveston is Partly cloudy. The temperature is 7 but feels like 5.
```

## Adding geocoding API

Will be using [mapbox](https://docs.mapbox.com/api/search/geocoding/).

```ts
const geocodingUrl =
  'https://api.mapbox.com/geocoding/v5/mapbox.places/Vancouver.json?access_token=pk.eyJ1IjoiY3VydGlzd2FyY3VwIiwiYSI6ImNsMGp5b3c1MDBoYzIzcGtjMG0ydHgwZXYifQ.UUL9qMMMqC7XezgJIGqdNg&limit=1';

request({ url: geocodingUrl, json: true }, (error, response) => {
  const data = response.body;
  console.log(
    `Latitude is ${data.features[0].center[0]} & longitude is ${data.features[0].center[1]}`
  );
});

// Latitude is -123.113953 & longitude is 49.260872
```
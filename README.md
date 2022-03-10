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
const geocodeURL =
  'https://api.mapbox.com/geocoding/v5/mapbox.places/Vancouver.json?access_token=pk.eyJ1IjoiY3VydGlzd2FyY3VwIiwiYSI6ImNsMGp5b3c1MDBoYzIzcGtjMG0ydHgwZXYifQ.UUL9qMMMqC7XezgJIGqdNg&limit=1';

request({ url: geocodeURL, json: true }, (error, response) => {
  const latitude = response.body.features[0].center[1];
  const longitude = response.body.features[0].center[0];
  console.log(
    `Latitude is ${latitude} & longitude is ${longitude}`
  );
});

// The weather in Steveston is Partly cloudy. The temperature is 7 but feels like 5.
```

### Adding geocoding API

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

# Error Handling

What if you do not have internet (network request)? Need to add conditional logic before we try to interact with the response. 

```js
const request = require('postman-request');

const url =
  'http://api.weatherstack.com/current?access_key=320d76a9035985b875dca26811572be4&query=49.1665025,-123.1924007&units=m';

request({ url: url, json: true }, (error, response) => {
  const data = response.body;

  if (error) {
    console.log('Unable to connect to weather service!');
  } else if (response.body.error) {
    console.log('Unable to find location');
  } else {
    console.log(
      `The weather in ${data.location.name} is ${data.current.weather_descriptions}. The temperature is ${data.current.temperature} but feels like ${data.current.feelslike}.`
    );
  }
});
```
If we messed up our URL query we would get an error in console stating "Unable to find location".

Steps for handling errors:
1. Setup an error handler for **low-level errors**.
  - For time where our error argument exists and our response does not.
2. Test by disabling network request and running the app.
3. Setup error handling for **no matching results**.
4. Test by altering the search terms and running the app.

```js
const geocodeLocation = 'Vancouver';

const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${geocodeLocation}.json?access_token=pk.eyJ1IjoiY3VydGlzd2FyY3VwIiwiYSI6ImNsMGp5b3c1MDBoYzIzcGtjMG0ydHgwZXYifQ.UUL9qMMMqC7XezgJIGqdNg&limit=1`;

request({ url: geocodeURL, json: true }, (error, response) => {
  if (error) {
    console.log('Unable to connect to geocode service!');
  } else if (response.body.features.length === 0) {
    console.log('Unable to find location. Try another search.');
  } else {
    const latitude = response.body.features[0].center[1];
    const longitude = response.body.features[0].center[0];
    console.log(
      `The geocode for ${geocodeLocation} is Latitude is ${latitude} & longitude is ${longitude}`
    );
  }
});
```

# Callback functions

A callback function is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of routine or action.

```js
function greeting(name) {
  alert('Hello ' + name);
}

function processUserInput(callback) {
  var name = prompt('Please enter your name.');
  callback(name);
}

processUserInput(greeting);
```

Could do something like this for our code:
```js
const geocode = (address, callback) => {
  setTimeout(() => {
    const data = {
      lat: 0,
      long: 0,
    };
    callback(data);
  });
};

geocode('Vancouver', (data) => {
  console.log(data);
});

// { lat: 0, long: 0 }
```
or
```js
const add = (x, y, callback) => {
  setTimeout(() => {
    callback(x + y);
  }, 2000);
};
add(1, 4, (sum) => {
  console.log(sum); // 5
});
```

### Callback for our app

encodeURIComponent()
- used to replace each instance of a certain character.
- Sometimes a user may create a search with a special character. We want to make sure these characters can be encoded properly. 

`const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=<ACCESS_TOKEN>&limit=1";`

When making our request, we can use the `callback` if we get an error. We know that our callback will either receive `error` or `data`.
```js
// use geocode to query a city name and return the latitude and longitude.
const geocode = (address, callback) => {
  const url =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    encodeURIComponent(address) +
    '.json?access_token=pk.eyJ1IjoiY3VydGlzd2FyY3VwIiwiYSI6ImNsMGp5b3c1MDBoYzIzcGtjMG0ydHgwZXYifQ.UUL9qMMMqC7XezgJIGqdNg&limit=1';

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to location services!', undefined);
    } else if (response.body.features.length === 0) {
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

geocode('Richmond, British Columbia', (error, data) => {
  console.log('error', error);
  console.log('data', data);
});
```

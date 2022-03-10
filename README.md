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

Can do the same for `forecast`:
```js
const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
  const access_key = '320d76a9035985b875dca26811572be4';

  const url = `http://api.weatherstack.com/current?access_key=${access_key}&query=${latitude},${longitude}&units=m`;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to weatherstack API.', undefined);
    } else if (response.body.current.length === 0) {
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
        `
      The temperature in ${data.locName} is ${data.temp} degrees C, but feels like ${data.feelsLike} degrees. It appears to be ${data.weatherDescription} and has a humidity of ${data.humidity} %.
      `
      );
    }
  });
};

module.exports = forecast;
```

# Chaining Callbacks
Goal is to use `geocode` to return a latitude and longitude, then use these values in `forecast` to return the weather in a particular latitude and longitude.

```js
const request = require('postman-request');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

geocode('Boston', (error, data) => {
  if (error) {
    return console.log(error);
  }

  forecast(data.latitude, data.longitude, (error, forecastData) => {
    if (error) {
      return console.log(error);
    }

    console.log(data.location);
    console.log(forecastData);
  });
});

// The temperature in Boston is 8 degrees C, but feels like 7 degrees. It appears to be Partly cloudy and has a humidity of 49 %.
```

# process.argv

nodejs [docs](https://nodejs.org/docs/latest/api/process.html#process_process_argv).

The process.argv property returns an array containing the command-line arguments passed when the Node.js process was launched.


```zsh
node app.js Vancouver
[
  '/Users/curtisw/.nvm/versions/node/v16.13.2/bin/node',
  '/Users/curtisw/weather-app/app.js',
  'Vancouver'
]
```
- first is the execution path
- second will be the path to the javascript file being **executed**.
- **any additional*** elements will be the ***command-line arguments**

In this can, to we want to target 'Vancouver', which is index 2. Can do this by creating a variable and targeting the `process.args` like so: `const address = process.argv[2];`.

```js
const request = require('postman-request');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const address = process.argv[2];

if (!address) {
  console.log('Please provide an address or city name');
} else {
  geocode(address, (error, data) => {
    if (error) {
      return console.log(error);
    }

    forecast(data.latitude, data.longitude, (error, forecastData) => {
      if (error) {
        return console.log(error);
      }

      console.log(data.location);
      console.log(forecastData);
    });
  });
}
```
> we then feel in our `address` into `geocode()` as an argument.
> Have also addressed issue is no address is provided.

## ES6 Objects

```js
// Object property shorthand

const name = 'Curtis';
const userAge = 28;

const user = {
  name: name,
  age: userAge,
  location: 'Vancouver',
};

console.log(user); // { name: 'Curtis', age: 28, location: 'Vancouver' }
```

Now since we are calling `name: name,` with the **same variable name** we can use a shorthand:
```js
const user = {
  name, // removed the key
  age: userAge, // cannot take advantage of the shorthand here because 
  location: 'Vancouver',
};
```
> We will get the exact same result as before.
> `age: userAge,` cannot take advantage of the shorthand here because the property name we are creating does **not** match the value name.

## Object Destructuring

Goal is to extract object properties and their values into individual variables.

We can create a variable for each property we want to extract. However this can become a lot of code:
```js
const product = {
  label: 'red notebook',
  price: 3,
  stock: 201,
  salePrice: undefined,
};

const label = product.label
const stock = product.stock
```

HOWEVER, with ES6..

`const {properties we want to extract, } = objectToDestructure`

```js
const product = {
  label: 'red notebook',
  price: 3,
  stock: 201,
  salePrice: undefined,
};
const { label, stock } = product;

console.log(label); // red notebook
console.log(stock); // 201 
console.log(salesPrice); // salesPrice is not defined 
```

Now we only need to add the properties we want between the `{}`. List the properties as a comma separated list.

We can even **change the name of a property using destructuring.**
Done by adding a `:` after the desired property, then adding the new name.
```js
const product = {
  label: 'red notebook',
  price: 3,
  stock: 201,
  salePrice: undefined,
};
const { label:newNameForLabel, stock } = product;

console.log(newNameForLabel); // red notebook
```

### Default Values

A variable can be assigned a default, in the case that the value unpacked from the array is `undefined`.

```js
const product = {
  label: 'red notebook',
  price: 3,
  stock: 201,
  salePrice: undefined,
};

const { label: newNameForLabel, stock, rating = 5 } = product;

console.log(rating);
```

Can also destructure an argument if it's an object and we know which properties we want.
```js
const product = {
  label: 'red notebook',
  price: 3,
  stock: 201,
  salePrice: undefined,
};

const transaction = (type, {label, stock }) => {
  console.log(type, label, stock);
};

transaction('order', product); // order red notebook 201 
```
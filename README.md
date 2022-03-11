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

# HTTP request without a library

We don't need the npm library `postman-request`. We can use the default methods that node.js provides. 

nodejs [docs](https://nodejs.org/dist/latest-v16.x/docs/api/http.html#httprequesturl-options-callback).

We use HTTP when making a request, and HTTPS when making request to a secure server. 

```js
const http = require('http');

const url =
  'http://api.weatherstack.com/current?access_key=pk.eyJ1IjoiY3VydGlzd2FyY3VwIiwiYSI6ImNsMGp5b3c1MDBoYzIzcGtjMG0ydHgwZXYifQ.UUL9qMMMqC7XezgJIGqdNg&query=0,0&units=m';

const request = http.request(url, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data = data + chunk.toString();
  });

  response.on('end', () => {
    console.log(data);
  });
});

request.end();


```

- `response.on()` is a function that allows us to register a handler.

# Express

Basic setup:
```js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/help', (req, res) => {
  res.send('Help page');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

run node server (app.js file is within src):
```
node src/app.js
```

# Serving up JSON and HTML
Will still be using `res.send()` just change what's inside.

Can send **HTML** directly:
```js
app.get('/weather', (req, res) => {
  res.send(`<h1>Weather</h1>`);
});
```

Can send **JSON** directly:
```js
app.get('/weather', (req, res) => {
  res.send({
    forecast: 'sunny as fuck',
    location: {
      lat: 123,
      long: 234,
    },
  });
});
```
> Will be able to our json at http://localhost:3000/weather.

# Serving static assets

[express docs on static files.](https://expressjs.com/en/starter/static-files.html)

Node.js [path.join](https://nodejs.org/api/path.html#pathjoinpaths).

```js
(path.join(__dirname, '../public')
```
> Use `..` to move up the tree.

To serve static files such as images, CSS files, and JavaScript files, use the `express.static` built-in middleware function in Express.

The function signature is:
```js
express.static(root, [options])
```
The **root argument** specifies the **root directory** from which to serve static assets. In our case, `__dirname`.

For more information on the options argument, see [express.static.](https://expressjs.com/en/4x/api.html#express.static).

`express.static()` takes the path to the folder we want to serve up. In our case, we want to serve the content in the `public` directory, to pass on our `index.html`.

Remember, this is done by `path.join(__dirname, '../public'`.

All together:
```js
app.use(express.static(path.join(__dirname, '../public')));
```

So if we have an HTML file in the `public` directory, we can serve this page

Serve up a directory:
```js
app.use(express.static(path.join(__dirname, '../public')));
```

Can also create a variable to store the path to the public directory.
```js
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
```

Now if we create more files in the public folder, we can visit them in the browser as so "http://localhost:3000/about.html".

# Dynamic Webpages with Template Engine 

Using handlebars module

`npm install hbs`

Using hbs as the default view engine requires just one line of code in your app setup. This will render .hbs files when res.render is called.

`app.set('view engine', 'hbs');`

```js
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Curtis',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
  });
});

// app.get('/weather', (req, res) => {
//   res.send({
//     forecast: 'sunny as fuck',
//     location: {
//       lat: 123,
//       long: 234,
//     },
//   });
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

# Advanced Templating with Partials
Partials can be used to add repetitive HTML elements, such as headers, footers and sidebars. 

hbs exposes the registerHelper and registerPartial method from handlebars.

```js
var hbs = require('hbs');

//
hbs.registerPartial('partial_name', 'partial value');

//create path to our partials
const partialsPath = path.join(__dirname, '../templates/partials');

// update our path to our views
const viewsPath = path.join(__dirname, '../templates/views');
```

So how do we render a partial?

In the desired `views` file, add the partial like so:
```html
//views file "help.hbs"
  <body>
    {{>header}} // name of partial you want to use

    <h1>{{title}}</h1>
    <p>This is the help page.</p>
  </body>

  // in the partial
  <h1>Static header.hbs text</h1>
  ```

  
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const hbs = require('hbs');
const geocode = require('./src/utils/geocode');
const forecast = require('./src/utils/forecast');

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '/public');
const viewsPath = path.join(__dirname, '/templates/views');
const partialsPath = path.join(__dirname, '/templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
// setup partials
hbs.registerPartials(partialsPath, function (err) {});

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// routes
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Curtis Warcup',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    title: 'About Me',
    name: 'Curtis Warcup',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some helpful info',
    title: 'Help',
    name: 'Curtis Warcup',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'please provide an address!',
    });
  } else {
    geocode(
      req.query.address,
      (error, { longitude, latitude, location } = {}) => {
        if (error) {
          return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
          if (error) {
            return res.send({ error });
          }
          res.send({
            forecast: forecastData,
            location: location,
            address: req.query.address,
          });
        });
      }
    );
  }
});

// learning
app.get('/products', (req, res) => {
  // only run if no search term
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }
  res.send({
    products: [],
  });
});

// will match any page that has NOT been matched with /help
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'Oops Help!',
    errorMessage: 'Help article not found.',
    name: 'Curtis Warcup',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: 'Oops!',
    errorMessage: 'Page not found.',
    name: 'Curtis Warcup',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

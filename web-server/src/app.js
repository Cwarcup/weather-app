const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');

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

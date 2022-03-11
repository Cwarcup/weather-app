const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

console.log(__dirname);
console.log(path.join(__dirname, '../public'));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send(`<div>home</div>`);
});

app.get('/help', (req, res) => {
  res.send([
    {
      name: 'Curtis',
      age: 28,
      occupation: 'jobless',
    },
    {
      name: 'Hana',
      hasDog: true,
    },
  ]);
});

app.get('/about', (req, res) => {
  res.send(`<h1>About Page</h1>`);
});

app.get('/weather', (req, res) => {
  res.send({
    forecast: 'sunny as fuck',
    location: {
      lat: 123,
      long: 234,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

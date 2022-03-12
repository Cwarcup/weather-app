//client side javascript running on the browser
// this is the only js file running in index.js

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const locationSearch = search.value;

  const weatherURl = `http://localhost:3000/weather?address=${locationSearch}`;

  fetch(weatherURl).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data.location);
        console.log(data.forecast);
      }
    });
  });
});

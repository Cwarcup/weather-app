//client side javascript running on the browser
// this is the only js file running in index.js

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const topPara = document.querySelector('#top-para');
const bottomPara = document.querySelector('#bottom-para');
const weatherIcon = document.querySelector('#weather-icon');

// topPara.textContent = 'Success!';
// bottomPara.textContent = 'Fail!';

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const locationSearch = search.value;

  const weatherURl = `/weather?address=${locationSearch}`;

  topPara.textContent = 'Loading...';

  fetch(weatherURl).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        topPara.innerHTML = data.error;
        bottomPara.innerHTML = '';
      } else {
        topPara.innerHTML = data.location;
        bottomPara.innerHTML = data.forecast.sentence;
        weatherIcon.src = data.forecast.icon;
      }
    });
  });
});

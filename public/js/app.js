//client side javascript running on the browser

console.log('client side js file is loaded.');

const testURL = 'https://puzzle.mead.io/puzzle';

const weatherURl = 'http://localhost:3000/weather?address=!';

fetch(testURL).then((response) => {
  response.json().then((data) => {
    console.log(data);
  });
});

fetch(weatherURl).then((response) => {
  response.json().then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      console.log(data);
      console.log(data.location);
      console.log(data.forecast);
    }
  });
});

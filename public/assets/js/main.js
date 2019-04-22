/* eslint-disable no-console */
'use strict';

//Get elements
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');
const resultListEl = document.querySelector('.list-results');
// console.log(inputEl, btnEl, resultListEl);

function createItem(a, b) {
  return (
    `<li>
          <img src="` +
    b +
    `" alt=` +
    a +
    `>` +
    `<p>` +
    a +
    `</p>` +
    `</li>`
  );
}

//Handler for main button
function handlerBtn() {
  //Save user input value
  const userValue = inputEl.value;
  console.log(userValue);
  //Connect to API
  fetch(`http://api.tvmaze.com/search/shows?q=${userValue}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseParsed) {
      console.log(responseParsed);
      return responseParsed;
    })
    .then(function(data) {
      //The response is an array of objects
      const arrShows = data;
      //   console.log('arrShows', arrShows);
      for (const element of arrShows) {
        const arrNames = element.show.name;
        const arrUrls = element.show.image.medium;
        console.log(arrNames, arrUrls);

        const itemsFilled = createItem(arrNames, arrUrls);
        console.log(itemsFilled);

        resultListEl.innerHTML += itemsFilled;
      }
    });
}

//Add lister to main button
btnEl.addEventListener('click', handlerBtn);

//# sourceMappingURL=main.js.map

/* eslint-disable no-console */
'use strict';

//Get elements
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');
const resultListEl = document.querySelector('.results__list');
// console.log(inputEl, btnEl, resultListEl);

function createItem(a, b) {
  return (
    `<li class="show-card">
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

function paintResults(array) {
  for (const element of array) {
    const arrNames = element.show.name;
    let arrUrls = '';
    // console.log(arrNames, arrUrls);

    if (!element.show.image) {
      arrUrls = 'https://via.placeholder.com/210x295/f4eded/9b1414/?text=show';
      console.log('replacing image');
    } else {
      arrUrls = element.show.image.medium;
    }

    const itemsFilled = createItem(arrNames, arrUrls);
    // console.log(itemsFilled);

    resultListEl.innerHTML += itemsFilled;
  }
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

      paintResults(arrShows);
    });
}

//Add lister to main button
btnEl.addEventListener('click', handlerBtn);

//Add listener to each card from the results

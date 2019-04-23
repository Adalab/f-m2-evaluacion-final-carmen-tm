/* eslint-disable no-console */
'use strict';

//Get elements
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');

//Get list elements to fill with items
const resultListEl = document.querySelector('.results__list');
const favouritesListEl = document.querySelector('.favourites__list');

//Empty array for storing favourites shows
const myFavShowsArr = [];
//Emtpy array of objects for storing in LS
const favArrObjects = [];

//Handler for main button
function handlerBtnSearch() {
  //Save user input value
  const userValue = inputEl.value;
  //   console.log(userValue);
  //Connect to API
  fetch(`http://api.tvmaze.com/search/shows?q=${userValue}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseParsed) {
      return responseParsed;
    })
    .then(function(data) {
      //The response is an array of objects
      const arrShows = data;
      //   console.log('arrShows', arrShows);

      //Reset results list with each search
      resultListEl.innerHTML = '';

      //Create li items from data
      Create;

      //Paint li results
      paintResults(arrShows, resultListEl);

      //Add listener to each card from the results to add Favourites functionality
      const resultsCardEl = document.querySelectorAll('.show-card');
      for (const card of resultsCardEl) {
        card.addEventListener('click', handlerCardsClick);
      }
    });
}

//Add lister to main Search button
btnEl.addEventListener('click', handlerBtnSearch);

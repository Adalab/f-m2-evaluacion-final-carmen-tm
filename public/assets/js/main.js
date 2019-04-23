/* eslint-disable no-console */
'use strict';

//Get elements
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');

//Get list elements to fill with items
const resultListEl = document.querySelector('.results__list');
const favouritesListEl = document.querySelector('.favourites__list');

//Empty array for items results from search
let resultsArr = [];
//Empty array for storing favourites shows
const myFavShowsArr = [];
//Emtpy array of objects for storing in LS
const favArrObjects = [];

function createItemsFromSearch(array) {
  //Reset array
  resultsArr = [];
  //Iterate the api results to create items with content
  for (const element of array) {
    // console.log(array);
    const arrNames = element.show.name;
    let arrUrls = '';

    if (!element.show.image) {
      arrUrls = `https://via.placeholder.com/210x295/f4eded/9b1414/?text=${arrNames}`;
    } else {
      arrUrls = element.show.image.medium;
    }
    // console.log(arrNames, arrUrls);

    //Create li elements
    const newItemEl = document.createElement('li');
    newItemEl.classList.add('show-card');

    //Create content node
    const contentItemImgEl = document.createElement('img');
    contentItemImgEl.setAttribute('src', arrUrls);
    contentItemImgEl.setAttribute('alt', arrNames);

    const contentItemTitleEl = document.createElement('h3');
    const contentItemTitleText = document.createTextNode(arrNames);
    contentItemTitleEl.appendChild(contentItemTitleText);

    //Add id to make easier further instructions
    newItemEl.setAttribute('id', arrNames);

    newItemEl.appendChild(contentItemImgEl);
    newItemEl.appendChild(contentItemTitleEl);

    //Fill empty array with all items:
    resultsArr.push(newItemEl);
  }
  // console.log('my array of results is working', resultsArr);
  return resultsArr;
}

//Append each li to its list
function paintResults(array, list) {
  for (const element of array) {
    list.appendChild(element);
  }
}

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
      console.log('arrShows', arrShows);

      //Reset results list on every search
      resultListEl.innerHTML = '';

      //FIRST Create li items from data
      createItemsFromSearch(arrShows);
      //SECOND Paint li results
      paintResults(resultsArr, resultListEl);

      //Add listener to each card from the results to add Favourites functionality
      // const resultsCardEl = document.querySelectorAll('.show-card');
      // for (const card of resultsCardEl) {
      //   card.addEventListener('click', handlerCardsFavClick);
      // }
    });
}

//Add lister to main Search button
btnEl.addEventListener('click', handlerBtnSearch);

//# sourceMappingURL=main.js.map

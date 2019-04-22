/* eslint-disable no-console */
'use strict';

//Get elements
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');

const resultListEl = document.querySelector('.results__list');
const favouritesListEl = document.querySelector('.favourites__list');

const myFavShowsArr = [];

function createItem(a, b) {
  //Create li elements
  const newItemEl = document.createElement('li');
  newItemEl.classList.add('show-card');

  //Create content node
  const contentItemImgEl = document.createElement('img');
  contentItemImgEl.setAttribute('src', b);
  contentItemImgEl.setAttribute('alt', a);

  const contentItemTitleEl = document.createElement('h3');
  const contentItemTitleText = document.createTextNode(a);
  contentItemTitleEl.appendChild(contentItemTitleText);

  newItemEl.appendChild(contentItemImgEl);
  newItemEl.appendChild(contentItemTitleEl);
  //   console.log(newItemEl);

  return newItemEl;
}

function paintResults(array, list) {
  for (const element of array) {
    const arrNames = element.show.name;
    let arrUrls = '';

    if (!element.show.image) {
      arrUrls = `https://via.placeholder.com/210x295/f4eded/9b1414/?text=${arrNames}`;
    } else {
      arrUrls = element.show.image.medium;
    }

    const itemsFilled = createItem(arrNames, arrUrls);

    list.appendChild(itemsFilled);
  }
}

function createFavItem(a) {
  //Make a copy of the li element as favourite
  const favItemCloned = a.cloneNode(true);
  favItemCloned.classList.add('preview--favourite');
  console.log('favItemCloned', favItemCloned);

  //Create btn reset
  const resetBtnEl = document.createElement('button');
  resetBtnEl.classList.add('reset-btn');
  const resetBtnContent = document.createTextNode('x');
  resetBtnEl.appendChild(resetBtnContent);
  resetBtnEl.setAttribute('data--id', 'trial');

  favItemCloned.appendChild(resetBtnEl);

  return favItemCloned;
}

function paintResultsReduced(array, list) {
  list.appendChild(array);
}

function selectFavourite(a) {
  //Include favourite items in an array
  //NOT WORKING. IF NOT FAVOURITE (NOT HAVING THAT CLASS), IT SHOULD REMOVE IT FROM THE ARRAY
  if (a.classList.contains('show-card--favourite')) {
    myFavShowsArr.push(a);
    console.log('myFavShowsArr', myFavShowsArr);
    //   } else {
    //     delete myFavShowsArr[a];
    //     console.log('myFavShowsArr', myFavShowsArr);
  }
}

function handlerResetBtnClick(event) {
  const resetBtnClicked = event.currentTarget;
  console.log('click');
}

function handlerCardsClick(event) {
  const selectedCard = event.currentTarget;
  //   console.log('selecting one card', selectedCard);

  //Add a special class for favourites
  selectedCard.classList.add('show-card--favourite');

  selectFavourite(selectedCard);

  //Copy items
  const favItems = createFavItem(selectedCard);

  //Paint favourite results on its list
  paintResultsReduced(favItems, favouritesListEl);

  const resetArrayBtnEl = document.querySelectorAll('.reset-btn');
  // console.log(resetArrayBtnEl);

  //Add listener to each reset butoton
  for (const button of resetArrayBtnEl) {
    button.addEventListener('click', handlerResetBtnClick);
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
      //   console.log('arrShows', arrShows);

      //Reset results
      resultListEl.innerHTML = '';
      //Paint results
      paintResults(arrShows, resultListEl);

      //Add listener to each card from the results
      const resultsCardEl = document.querySelectorAll('.show-card');
      for (const card of resultsCardEl) {
        card.addEventListener('click', handlerCardsClick);
      }
    });
}

//Add listener to main button
btnEl.addEventListener('click', handlerBtnSearch);

//# sourceMappingURL=main.js.map

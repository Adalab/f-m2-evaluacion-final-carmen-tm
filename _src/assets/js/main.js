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
  //   console.log('favItemCloned', favItemCloned);

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

function handlerCardsClick(event) {
  const selectedCard = event.currentTarget;
  //   console.log('selecting one card', selectedCard);

  //Add a special class for favourites
  selectedCard.classList.toggle('show-card--favourite');

  selectFavourite(selectedCard);

  //Copy items
  const favItems = createFavItem(selectedCard);

  //Paint favourite results on its list
  paintResultsReduced(favItems, favouritesListEl);
}

//Handler for main button
function handlerBtn() {
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

//Add lister to main button
btnEl.addEventListener('click', handlerBtn);

//initial info: array of favourites
const fakeArray = document.querySelectorAll('.fake-item');
// console.log(fakeArray);

const favArrObjects = [];
const myObject = {};

for (let i = 0; i < fakeArray.length; i++) {
  const favImgEl = fakeArray[i].firstElementChild;
  const favImgUrl = favImgEl.src;

  const favTitleEl = fakeArray[i].lastElementChild;
  const favTitleText = favTitleEl.innerHTML;

  myObject.url = favImgUrl;
  myObject.title = favTitleText;
  // console.log(myObject);

  favArrObjects.push(myObject);
}

//I have an array of objects to be store in LS
console.log(favArrObjects);

//Store our array in LS
function storeInLS(a, b) {
  localStorage.setItem(a, JSON.stringify(b));
}
storeInLS('favArrObjects', favArrObjects);

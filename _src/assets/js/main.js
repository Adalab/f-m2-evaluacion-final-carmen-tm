/* eslint-disable no-console */
'use strict';

//Get elements
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');

//Get list elements to fill with items
const resultListEl = document.querySelector('.results__list');
const favouritesListEl = document.querySelector('.favourites__list');

//FIRST Empty array for items results from search
let resultsArr = [];
//Empty array for storing favourites shows
const myFavShowsArr = [];
//Emtpy array of objects for paiting in favourit list and storing in LS
const favShowsObject = [];

function createItemsFromSearch(array) {
  //Reset array
  resultsArr = [];
  //Iterate the api results to create items with content
  for (const element of array) {
    const arrNames = element.show.name;
    let arrUrls = '';

    if (!element.show.image) {
      arrUrls = `https://via.placeholder.com/210x295/f4eded/9b1414/?text=${arrNames}`;
    } else {
      arrUrls = element.show.image.medium;
    }

    //Create li elements
    const newItemEl = document.createElement('li');

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
  console.log('my array of results is working', 'resultsArr', resultsArr);
  return resultsArr;
}

//SECOND Add class
function appendClass(arrayItems, myClass) {
  for (const item of arrayItems) {
    item.classList.add(myClass);
  }
  return arrayItems;
}

//THIRD Append each li to its list
function paintResults(array, list) {
  for (const element of array) {
    list.appendChild(element);
  }
}

function storeArrInObject(array) {
  for (let i = 0; i < array.length; i++) {
    const favImgEl = array[i].firstElementChild;
    const favImgUrl = favImgEl.src;

    const favTitleEl = array[i].lastElementChild;
    const favTitleText = favTitleEl.innerHTML;
    // console.log(favTitleText);

    favShowsObject[i] = {
      url: favImgUrl,
      title: favTitleText
    };
  }
}

//Add favourite functionlity on click
function handlerCardsFavClick(event) {
  const selectedCard = event.currentTarget;

  //Add a special class for favourites
  selectedCard.classList.add('show-card--favourite');

  //Store in my favArray empty array
  myFavShowsArr.push(selectedCard);
  console.log('myFavShowsArr', myFavShowsArr);

  //Store my array of li in an object
  storeArrInObject(myFavShowsArr);
  console.log('favShowsObject', favShowsObject);

  // const myFavShowsArrCloned = cloneArray(myFavShowsArr);
  // console.log(myFavShowsArr);

  // THIRD Paint li on my favourist list
  // paintResults(myFavShowsArrCloned, favouritesListEl);
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
      // console.log('arrShows', arrShows);

      //Reset results list on every search
      resultListEl.innerHTML = '';

      //FIRST Create li items from data
      const myItems = createItemsFromSearch(arrShows);
      //SECOND add card class
      const myItemsWithClass = appendClass(myItems, 'show-card');
      //THIRD Paint li results
      paintResults(myItemsWithClass, resultListEl);

      // Add listener to each card from the results to add Favourites functionality
      const resultsCardEl = document.querySelectorAll('.show-card');
      for (const card of resultsCardEl) {
        card.addEventListener('click', handlerCardsFavClick);
      }
    });
}

//Add lister to main Search button
btnEl.addEventListener('click', handlerBtnSearch);

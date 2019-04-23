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
let myFavShowsArr = [];
//Emtpy array of objects for paiting in favourit list and storing in LS
const favShowsObjectsArray = [];

function testId(myId, array) {
  for (const element of array) {
    const ids = element.getAttribute('id');
    console.log('ids', ids);
    console.log('myId', myId);
  }
}

//Create items from the API result
function createItemsFromSearch(array) {
  //Reset array
  resultsArr = [];
  //Iterate the api results to create items with content
  for (const element of array) {
    const idShow = element.show.id;
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
    newItemEl.setAttribute('id', idShow);

    newItemEl.appendChild(contentItemImgEl);
    newItemEl.appendChild(contentItemTitleEl);

    //Fill empty array with all items:
    resultsArr.push(newItemEl);
  }
  // console.log('my array of results is working', 'resultsArr', resultsArr);
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
  // Reset list content
  list.innerHTML = '';
  for (const element of array) {
    list.appendChild(element);
  }
}

function storeArrInObject(array) {
  for (let i = 0; i < array.length; i++) {
    // console.dir(array);
    const favImgEl = array[i].firstElementChild;
    const favImgUrl = favImgEl.src;

    // const favTitleEl = array[i].lastElementChild;
    const favTitleEl = favImgEl.nextElementSibling;
    console.log(favTitleEl);
    const favTitleText = favTitleEl.innerHTML;
    console.log(favTitleText);

    favShowsObjectsArray[i] = {
      url: favImgUrl,
      title: favTitleText
    };
  }
}

function createItemsFromObjArr(array) {
  const arrItemsToPaint = [];
  for (const item of array) {
    const name = item.title;
    const url = item.url;

    //Create elements and contents
    const prevItemEl = document.createElement('li');

    const prevItemImgEl = document.createElement('img');
    prevItemImgEl.setAttribute('src', url);
    prevItemImgEl.setAttribute('alt', name);

    const prevItemTitleEl = document.createElement('h3');
    const prevItemTitleContent = document.createTextNode(name);
    prevItemTitleEl.appendChild(prevItemTitleContent);

    //Append filled elements to my item
    prevItemEl.appendChild(prevItemImgEl);
    prevItemEl.appendChild(prevItemTitleEl);
    prevItemEl.classList.add('preview--favourite');

    //Add reset button to each item
    addResetBtn(name, prevItemEl);

    arrItemsToPaint.push(prevItemEl);
  }
  console.log(arrItemsToPaint);
  return arrItemsToPaint;
}

function storeInLS(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function refreshPage() {
  //Check if LS has something
  const infoSavedInLS = JSON.parse(localStorage.getItem('myObject'));

  if (infoSavedInLS) {
    console.log('caché has something', infoSavedInLS);

    const savedItemToPaint = createItemsFromObjArr(infoSavedInLS);
    console.log('savedItemToPaint', savedItemToPaint);

    myFavShowsArr = savedItemToPaint;

    // Paint li on my favourist list
    paintResults(savedItemToPaint, favouritesListEl);
  } else {
    console.log('caché is empty');
  }
}

function handlerResetBtnClick(event) {
  const resetBtnClicked = event.currentTarget;
  // console.log('click');

  const itemForRemove = resetBtnClicked.parentNode;
  console.log(itemForRemove);

  //Wanto to remove this item from my Array of objects and so it will be removed from LS, favourist list , etc

  // find

  //   storeArrInObject(myFavShowsArr);
}

function addResetBtn(title, myItem) {
  //Create btn reset
  const resetBtnEl = document.createElement('button');
  resetBtnEl.classList.add('reset-btn');
  const resetBtnContent = document.createTextNode('x');

  resetBtnEl.appendChild(resetBtnContent);
  resetBtnEl.setAttribute('data--id', title);
  // console.log(resetBtnEl);
  // console.log(myItem);

  myItem.appendChild(resetBtnEl);

  //Add listener
  resetBtnEl.addEventListener('click', handlerResetBtnClick);
}

//Add favourite functionlity on click
function handlerCardsFavClick(event) {
  const selectedCard = event.currentTarget;
  // console.log(selectedCard);
  const idFav = selectedCard.id;
  console.log(idFav);
  console.log(myFavShowsArr);

  for (const card of myFavShowsArr) {
    console.log(myFavShowsArr);
    //If element is already there, abort
    if (idFav === card.id) {
      console.log('id repetido');
      return;
    } else {
      console.log('id nuevo');
    }
  }
  //Add a special class for favourites
  selectedCard.classList.add('show-card--favourite');

  //Store in my favArray empty array
  myFavShowsArr.push(selectedCard);
  console.log('myFavShowsArr', myFavShowsArr);

  //Store my array of li in an object
  storeArrInObject(myFavShowsArr);
  // console.log('favShowsObjectsArray', favShowsObjectsArray);

  //Create array of li filled with content from the array of objects we have
  const newArrayItemsToPaint = createItemsFromObjArr(favShowsObjectsArray);
  console.log('newArrayItemsToPaint', newArrayItemsToPaint);

  // Paint li on my favourist list
  paintResults(newArrayItemsToPaint, favouritesListEl);

  //Store my favShowsObjectsArray in LS
  storeInLS('myObject', favShowsObjectsArray);
}

// //If the show is already there, dont push it!
// for (const card of myFavShowsArr) {
//   console.log(myFavShowsArr);
//   if (idFav === card.id) {
//     console.log('id repetido');
//     // return;
//   } else {
//     console.log('id nuevo');
//     //Add a special class for favourites
//     selectedCard.classList.add('show-card--favourite');

//     //Store in my favArray empty array
//     myFavShowsArr.push(selectedCard);
//     console.log('myFavShowsArr', myFavShowsArr);

//     //Store my array of li in an object
//     storeArrInObject(myFavShowsArr);
//     // console.log('favShowsObjectsArray', favShowsObjectsArray);

//     //Create array of li filled with content from the array of objects we have
//     const newArrayItemsToPaint = createItemsFromObjArr(favShowsObjectsArray);
//     console.log('newArrayItemsToPaint', newArrayItemsToPaint);

//     // Paint li on my favourist list
//     paintResults(newArrayItemsToPaint, favouritesListEl);

//     //Store my favShowsObjectsArray in LS
//     storeInLS('myObject', favShowsObjectsArray);
//   }
// }
// }

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

//Retrieve info from LS when refreshing
refreshPage();

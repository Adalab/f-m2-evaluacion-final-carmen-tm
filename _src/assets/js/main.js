/* eslint-disable no-console */
'use strict';

//ELEMENTS
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');
const resultListEl = document.querySelector('.results__list');
const favouritesListEl = document.querySelector('.favourites__list');

const URL = 'http://api.tvmaze.com/search/shows?q=';
const DEFULT_IMAGE = 'https://via.placeholder.com/210x295/f4eded/9b1414/?text=';

//EMPTY ARRAYS/OBJECTS
//Empty array for my li items results from search
let resultsArr = [];
//Empty array for storing favourites shows
let myFavShowsArr = [];
//Emtpy array of objects for paiting in favourit list and storing in LS
const favShowsObjectsArray = [];

//FUNCTIONS

//Add a class to each item on a array
function appendClass(myElement, myClass) {
  myElement.classList.add(myClass);
  myElement.setAttribute(
    'title',
    'Click para añadir este show a tu lista de favoritos'
  );
  return myElement;
}

function createLiOnDOM(id, name, image) {
  const newItemEl = document.createElement('li');
  newItemEl.setAttribute('id', id);

  //Create content nodes
  const contentItemImgEl = document.createElement('img');
  contentItemImgEl.classList.add('show-card__img');
  contentItemImgEl.setAttribute('src', image);
  contentItemImgEl.setAttribute('alt', name);

  const contentItemTitleEl = document.createElement('h3');
  contentItemTitleEl.classList.add('show-card__title');
  const contentItemTitleText = document.createTextNode(name);
  contentItemTitleEl.appendChild(contentItemTitleText);

  //Append elements
  newItemEl.appendChild(contentItemImgEl);
  newItemEl.appendChild(contentItemTitleEl);

  return newItemEl;
}

//Create li items from the API result
function createItemsFromSearch(array) {
  //Reset array
  resultsArr = [];

  for (const element of array) {
    // const idShow = element.show.id;
    // const arrNames = element.show.name;
    const { show } = element;
    console.log(show);
    const { id, name, image } = show;

    let finalImage = '';
    if (!image) {
      finalImage = `${DEFULT_IMAGE}${name}`;
    } else {
      finalImage = image.medium;
    }

    //Advanced DOM: Create <li> and append them to the DOM
    const liOnDOM = createLiOnDOM(id, name, finalImage);

    //Add class 'show-card' for visual styles
    const liOnDommWithClass = appendClass(liOnDOM, 'show-card');

    //Fill empty array with all items:
    resultsArr.push(liOnDommWithClass);
  }
  return resultsArr;
}

//Append each li to its list
function paintResults(array, list) {
  // Reset list content
  list.innerHTML = '';
  for (const element of array) {
    list.appendChild(element);
  }
}

function storeItemInObject(item) {
  const favId = item.getAttribute('id');

  const favImgEl = item.querySelector('.show-card__img');
  const favImgUrl = favImgEl.src;

  const favTitleEl = item.querySelector('.show-card__title');
  const favTitleText = favTitleEl.innerHTML;

  newFavObject = {
    id: favId,
    title: favTitleText,
    url: favImgUrl
  };
  favShowsObjectsArray.push(newFavObject);
}

function createItemsFromObjArr(array) {
  const arrItemsToPaint = [];
  for (const item of array) {
    const name = item.title;
    const url = item.url;
    const id = item.id;

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
    prevItemEl.setAttribute('id', id);
    prevItemEl.classList.add('preview--favourite');

    //Add reset button to each item
    addResetBtn(id, prevItemEl);

    arrItemsToPaint.push(prevItemEl);
  }
  return arrItemsToPaint;
}

function storeInLS(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function refreshPage() {
  //Check if LS has something
  const infoSavedInLS = JSON.parse(localStorage.getItem('myObject'));

  if (infoSavedInLS) {
    const savedItemToPaint = createItemsFromObjArr(infoSavedInLS);

    myFavShowsArr = savedItemToPaint;

    // Paint li on my favourist list
    paintResults(savedItemToPaint, favouritesListEl);
  } else {
    console.log('caché is empty');
  }
}

function handlerResetBtnClick(event) {
  const resetBtnClicked = event.currentTarget;

  const itemForRemove = resetBtnClicked.parentNode;

  //Removing from the painted list
  favouritesListEl.removeChild(itemForRemove);
}

function addResetBtn(id, myItem) {
  //Create btn reset
  const resetBtnEl = document.createElement('button');
  resetBtnEl.classList.add('reset-btn');
  resetBtnEl.setAttribute('title', 'Borra de favoritos');

  const resetBtnContent = document.createTextNode('x');

  resetBtnEl.appendChild(resetBtnContent);
  resetBtnEl.setAttribute('data--id', id);

  myItem.appendChild(resetBtnEl);

  //Add listener
  resetBtnEl.addEventListener('click', handlerResetBtnClick);
}

//Add favourite functionlity on click
function handlerAddToFavClick(event) {
  const currentCard = event.currentTarget;

  currentCard.classList.toggle('show-card--favourite');

  //Store my favourites lis as objects in my fav array
  storeItemInObject(currentCard);

  ////////////////////////////////////////////
  //Store in my favArray empty array
  myFavShowsArr.push(currentCard);

  //Create array of li filled with content from the array of objects we have
  const newArrayItemsToPaint = createItemsFromObjArr(favShowsObjectsArray);

  // Paint li on my favourist list
  paintResults(newArrayItemsToPaint, favouritesListEl);

  //Store my favShowsObjectsArray in LS
  storeInLS('myObject', favShowsObjectsArray);
  // const idFav = currentCard.id;
  // // console.log(idFav);
  // // console.log(myFavShowsArr);

  // for (const card of myFavShowsArr) {
  //   //If element is already there, abort
  //   if (idFav === card.id) {
  //     card.classList.add('show-card--favourite');
  //     return;
  //   } else {
  //     // console.log('id nuevo');
  //   }
  // }
}

//FUNCTIONS
function getShowsFromApi(query) {
  fetch(`${URL}${query}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseParsed) {
      //If there are no results... :(
      if (!responseParsed.length) {
        resultListEl.innerHTML = `
        <p>Lo sentimos. No hay resultados para tu búsqueda "${query}". Inténtalo de nuevo con otro nombre :)</p>
        `;

        //If there are results, keep going :)
      } else {
        //Create li items from data
        const myItems = createItemsFromSearch(responseParsed);
        //Paint li on the list results
        paintResults(myItems, resultListEl);

        // Add listener to each li card to impelment 'Add to Favourites' new functionality
        const resultsCardsEls = document.querySelectorAll('.show-card');
        for (const card of resultsCardsEls) {
          card.addEventListener('click', handlerAddToFavClick);
        }
      }
    });
}

//Handler for main Search button
function handlerBtnSearchClick(event) {
  event.preventDefault();

  const userValue = inputEl.value;
  //Make API fetch just if the user has written something
  if (userValue) {
    getShowsFromApi(userValue);
  }
}

//Add lister to main Search button
btnEl.addEventListener('click', handlerBtnSearchClick);

//Retrieve info from LS when refreshing
refreshPage();

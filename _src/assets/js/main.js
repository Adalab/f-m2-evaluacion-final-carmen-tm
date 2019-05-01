/* eslint-disable no-console */
'use strict';

//ELEMENTS
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');
const resultListEl = document.querySelector('.results__list');
const favouritesListEl = document.querySelector('.favourites__list');

const URL = 'http://api.tvmaze.com/search/shows?q=';
const DEFULT_IMAGE = 'https://via.placeholder.com/210x295/f4eded/9b1414/?text=';

//EMPTY ARRAYS of OBJECTS
//Empty array for storing all the info from the result on any search
let resultsObjectsArr = [];
//Empty array for storing user's favourites shows
let favShowsObjectsArr = [];

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
  newItemEl.setAttribute('data-id', id);

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
function createItemsFromObjects(array, myClass) {
  const liArr = [];
  for (const element of array) {
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
    const liOnDOMWithClass = appendClass(liOnDOM, myClass);
    liArr.push(liOnDOMWithClass);
  }
  return liArr;
}

//Append each li to its list
function paintResults(array, list) {
  // Reset list content
  list.innerHTML = '';
  for (const element of array) {
    list.appendChild(element);
  }
}

function storeObjectsOnLS(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function refreshPage() {
  //Check if LS has something
  const infoSavedInLS = JSON.parse(localStorage.getItem('myObject'));

  if (infoSavedInLS) {
    const savedItemToPaint = createItemsFromObjArr(infoSavedInLS);

    favShowsObjectsArr = savedItemToPaint;

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

function storeFavShowObjectInArr(id, array1, array2) {
  for (const item of array1) {
    if (item.show.id === id) {
      array2.push(item);
    }
  }
  return array2;
}

//Add favourite functionlity on click
function handlerAddToFavClick(event) {
  const currentCard = event.currentTarget;
  const idFav = parseInt(currentCard.getAttribute('data-id'));
  console.log(idFav);

  currentCard.classList.toggle('show-card--favourite');

  //Store my favourite show as an object in my fav objects array
  storeFavShowObjectInArr(idFav, resultsObjectsArr, favShowsObjectsArr);
  console.log(favShowsObjectsArr);

  //Create li fav items from data
  const myFavItems = createItemsFromObjects(
    favShowsObjectsArr,
    'preview--favourite'
  );
  //Paint li fav on the list fav
  paintResults(myFavItems, favouritesListEl);

  //Store my favShowsObjectsArr in LS
  storeObjectsOnLS('myObject', favShowsObjectsArr);
}

//FUNCTIONS
function getShowsFromAPI(query) {
  fetch(`${URL}${query}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseParsed) {
      //On any search, I fill this array with the objects that come from the API, with all the info of each show on it!!
      resultsObjectsArr = responseParsed;

      //If there are no results... :(
      if (!responseParsed.length) {
        resultListEl.innerHTML = `
        <p>Lo sentimos. No hay resultados para tu búsqueda "${query}". Inténtalo de nuevo con otro nombre :)</p>
        `;

        //If there are results, keep going :)
      } else {
        //Create li items from data
        const myItems = createItemsFromObjects(responseParsed, 'show-card');
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
    getShowsFromAPI(userValue);
  }
}

//Add lister to main Search button
btnEl.addEventListener('click', handlerBtnSearchClick);

//Retrieve info from LS when refreshing
refreshPage();

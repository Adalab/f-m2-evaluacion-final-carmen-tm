/* eslint-disable no-console */
'use strict';

//ELEMENTS
const inputEl = document.querySelector('.app-input');
const btnSearchEl = document.querySelector('.btn-search');
const btnResetAllEl = document.querySelector('.btn-reset-all');

const resultListEl = document.querySelector('.results__list');
const favouritesListEl = document.querySelector('.favourites__list');

const URL = 'http://api.tvmaze.com/search/shows?q=';
const DEFULT_IMAGE = 'https://via.placeholder.com/210x295/f4eded/9b1414/?text=';
const LS_FAVS_KEY = 'favShowsObjects';

//EMPTY ARRAYS of OBJECTS
//Empty array for storing all the info from the result on any search
let resultsObjectsArr = [];
//Always check if LS has something when starting/refreshing!! If not (falsy), give me an empty array
let favShowsObjectsArr = JSON.parse(localStorage.getItem(LS_FAVS_KEY)) || [];

//FUNCTIONS
function createLiOnDOM(id, name, image, isFav) {
  const newItemEl = document.createElement('li');
  newItemEl.setAttribute('data-id', id);

  //Create content nodes
  const itemImgEl = document.createElement('img');
  itemImgEl.classList.add('show-card__img');
  itemImgEl.setAttribute('src', image);
  itemImgEl.setAttribute('alt', name);

  const itemTitleEl = document.createElement('h3');
  itemTitleEl.classList.add('show-card__title');
  const itemTitleText = document.createTextNode(name);
  itemTitleEl.appendChild(itemTitleText);

  //Append elements
  newItemEl.appendChild(itemImgEl);
  newItemEl.appendChild(itemTitleEl);

  let itemBtnResetEl;
  if (isFav) {
    itemBtnResetEl = document.createElement('button');
    const itemBtnResetText = document.createTextNode('x');
    itemBtnResetEl.appendChild(itemBtnResetText);
    itemBtnResetEl.classList.add('btn-reset');
    itemBtnResetEl.setAttribute('data-id', id);
    itemBtnResetEl.setAttribute('title', 'Borra de favoritos');
    newItemEl.appendChild(itemBtnResetEl);
  } else {
    itemBtnResetEl = '';
  }

  return newItemEl;
}

//Add a class to each item on a array
function appendClassAndTitle(myElement, myClass, isFav) {
  myElement.classList.add(myClass);
  myElement.setAttribute(
    'title',
    isFav
      ? 'Show favorito'
      : 'Click para añadir este show a tu lista de favoritos'
  );
  return myElement;
}

//Create li items from Objects (the API result, my array of objects..)
function createItemsFromObjects(array, myClass, isFav) {
  const liArr = [];
  for (const element of array) {
    const { show } = element;
    const { id, name, image } = show;

    let finalImage = '';
    if (!image) {
      finalImage = `${DEFULT_IMAGE}${name}`;
    } else {
      finalImage = image.medium;
    }

    //Advanced DOM: Create <li> and append them to the DOM
    const liOnDOM = createLiOnDOM(id, name, finalImage, isFav);

    //Add class 'show-card' for visual styles
    const liOnDOMWithClass = appendClassAndTitle(liOnDOM, myClass, isFav);
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

function storeFavShowObjectInArr(id, array1, array2) {
  for (const item of array1) {
    if (item.show.id === id) {
      array2.push(item);
    }
  }
  return array2;
}

//Storing objects on LocalStore
function storeFavObjectsOnLS(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function drawFavourites() {
  //Create li fav items from data
  const myFavItems = createItemsFromObjects(
    favShowsObjectsArr,
    'preview--favourite',
    true
  );

  //Paint li fav on the list fav
  paintResults(myFavItems, favouritesListEl);

  //Add listeners to btn-reset
  if (favShowsObjectsArr.length) {
    const btnResetEls = document.querySelectorAll('.btn-reset');
    //Add listener to my reset buttons
    for (const btnReset of btnResetEls) {
      // console.log(btnResetEls);
      btnReset.addEventListener('click', handlerBtnResetClick);
    }
  }
}

function removeItemFromArray(id, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].show.id === parseInt(id)) {
      console.log('item para borrar', id, array, i);
      array.splice(i, 1);
    }
  }
  //Store my array of fav objects in LS
  storeFavObjectsOnLS(LS_FAVS_KEY, favShowsObjectsArr);
  //Draw updated list of favourites
  drawFavourites();
}

function handlerBtnResetClick(event) {
  console.log('click');
  const currentBtnReset = event.currentTarget;
  const idBtnReset = currentBtnReset.getAttribute('data-id');

  //Remove item from fav array
  removeItemFromArray(idBtnReset, favShowsObjectsArr);
}

//Add favourite functionlity on click
function handlerAddToFavClick(event) {
  const currentCard = event.currentTarget;
  const idFav = parseInt(currentCard.getAttribute('data-id'));
  console.log(idFav);

  currentCard.classList.toggle('show-card--favourite');

  if (currentCard.classList.contains('show-card--favourite')) {
    //Store my favourite show as an object in my fav objects array
    storeFavShowObjectInArr(idFav, resultsObjectsArr, favShowsObjectsArr);

    //Store my array of fav objects in LS
    storeFavObjectsOnLS(LS_FAVS_KEY, favShowsObjectsArr);

    //Create li and paint them
    drawFavourites();
  } else {
    //Remove from favourites
    removeItemFromArray(idFav, favShowsObjectsArr);
  }
}

function drawResults(responseParsed) {
  //Create li items from data
  const myItems = createItemsFromObjects(responseParsed, 'show-card', false);
  //Paint li on the list results
  paintResults(myItems, resultListEl);

  //Implement 'Add to Favourites' new functionality
  const resultsCardsEls = document.querySelectorAll('.show-card');
  for (const card of resultsCardsEls) {
    card.addEventListener('click', handlerAddToFavClick);
  }
}

function getShowsFromAPI(query) {
  fetch(`${URL}${query}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseParsed) {
      //On any search, I fill this empty array with the objects that come from the API, with ALL THE INFO of each show on it!!
      resultsObjectsArr = responseParsed;

      //If there are no results... :(
      if (!responseParsed.length) {
        resultListEl.innerHTML = `
        <p>Lo sentimos. No hay resultados para tu búsqueda "${query}". Inténtalo de nuevo con otro nombre :)</p>
        `;

        //If there are results, keep going :)
      } else {
        drawResults(responseParsed);
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

function handlerBtnResetAllClick() {
  favShowsObjectsArr = [];

  //Store my array of fav objects in LS
  storeFavObjectsOnLS(LS_FAVS_KEY, favShowsObjectsArr);

  //Create li and paint them
  drawFavourites();
}

//All the things taht happen when loading the page
//Add lister to main Search button
const initApp = () => {
  drawFavourites();
  btnSearchEl.addEventListener('click', handlerBtnSearchClick);
  btnResetAllEl.addEventListener('click', handlerBtnResetAllClick);
};
initApp();

//# sourceMappingURL=main.js.map

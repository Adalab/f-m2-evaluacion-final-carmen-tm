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

function addResetBtn(title, item) {
  //Create btn reset
  const resetBtnEl = document.createElement('button');
  resetBtnEl.classList.add('reset-btn');
  const resetBtnContent = document.createTextNode('x');

  resetBtnEl.appendChild(resetBtnContent);
  resetBtnEl.setAttribute('data--id', title);
  item.appendChild(resetBtnEl);
}

function createFavItem(a) {
  //Make a copy of the li element as favourite
  const favItemCloned = a.cloneNode(true);
  favItemCloned.classList.add('preview--favourite');
  const title = favItemCloned.innerText;

  //Create an id matching its title
  favItemCloned.setAttribute('id', title);
  console.log('favItemCloned', favItemCloned);

  addResetBtn(title, favItemCloned);

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
  const resetBtnClickedData = resetBtnClicked.getAttribute('data--id');
  console.log('click', resetBtnClickedData);
  // console.dir(resetBtnClicked);

  // const itemForRemove = getElementById(resetBtnClickedData);
  const itemForRemove = resetBtnClicked.parentNode;
  console.log(itemForRemove);

  favouritesListEl.removeChild(itemForRemove);

  //To remove the item from my array of favourites I need to find its index
  for (const element of myFavShowsArr) {
    const titleFav = element.innerText;
    const idFavRemove = itemForRemove.getAttribute('id');
    if (titleFav === idFavRemove) {
      console.log('quiero borrar este item');

      const myIndex = myFavShowsArr.indexOf(element);
      console.log(myIndex);
      //The method splice() remove one element knowing it index. The inputs are the index point to start at and the number of elements to remove.
      myFavShowsArr.splice(myIndex, 1);
      console.log(myFavShowsArr);

      ///MISSING JUST REMOVING THE FAV CLASS ON THE LIST OF RESULTS!!!
    }
  }
  // console.log(itemForRemove);
  // console.log(myFavShowsArr);
  // console.log(myIndex);
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

//Add lister to main button
btnEl.addEventListener('click', handlerBtnSearch);

////////////////////////////////////////
// LOCAL STORAGE

//initial info: array of favourites
const fakeArray = document.querySelectorAll('.fake-item');
// console.log(fakeArray);

const favArrObjects = [];

for (let i = 0; i < fakeArray.length; i++) {
  const favImgEl = fakeArray[i].firstElementChild;
  const favImgUrl = favImgEl.src;

  const favTitleEl = fakeArray[i].lastElementChild;
  const favTitleText = favTitleEl.innerHTML;
  // console.log(favTitleText);

  favArrObjects[i] = {
    url: favImgUrl,
    title: favTitleText
  };
  // console.log(favArrObjects[i]);
}

//I have an array of objects to be store in LS
console.log('favArrObjects', favArrObjects);

//Store our array in LS
function storeInLS(a, b) {
  localStorage.setItem(a, JSON.stringify(b));
}
storeInLS('favArrObjects', favArrObjects);

//Retrieve info from LS
function refreshPage() {
  //Check if LS has something
  const infoSavedInLS = JSON.parse(localStorage.getItem('favArrObjects'));

  if (infoSavedInLS) {
    console.log('caché has something', infoSavedInLS);

    for (const object of infoSavedInLS) {
      const myUrl = object.url;
      const myTitle = object.title;
      console.log(myUrl, myTitle);

      //With this info, I can create Items
      const mySavedFav = createItem(myTitle, myUrl);
      mySavedFav.classList.add('show-card--favourite');
      mySavedFav.classList.add('preview--favourite');
      console.log('mySavedFav', mySavedFav);

      //And paint them in HTML
      paintResultsReduced(mySavedFav, favouritesListEl);

      //Add reset button
      addResetBtn(myTitle, mySavedFav);
    }
  } else {
    console.log('caché is empty');
  }
}
refreshPage();

//# sourceMappingURL=main.js.map

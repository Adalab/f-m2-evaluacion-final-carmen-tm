/* eslint-disable no-console */
'use strict';

//Get elements
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');

const resultListEl = document.querySelector('.results__list');
const favouritesListEl = document.querySelector('.favourites__list');
// console.log(inputEl, btnEl, resultListEl, favouritesListEl);

const myFavouriteShows = [];

function createItem(a, b) {
  return (
    `<li class="show-card">
          <img src="` +
    b +
    `" alt=` +
    a +
    `>` +
    `<p>` +
    a +
    `</p>` +
    `</li>`
  );
}

function createItem2(a, b) {
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

  //   return (
  //     `<li class="show-card">
  //             <img src="` +
  //     b +
  //     `" alt=` +
  //     a +
  //     `>` +
  //     `<p>` +
  //     a +
  //     `</p>` +
  //     `</li>`
  //   );
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

    const itemsFilled = createItem2(arrNames, arrUrls);

    list.appendChild(itemsFilled);
    // list.innerHTML += itemsFilled;
  }
}

function paintResultsReduced(array, list) {
  for (const element of array) {
    console.log('element', element);
    // const arrFavouriteNames = element.text
    const favItem = document.createElement('li');
    favItem.classList.add('preview--favourite');

    const favItemContent = element.innerHTML;
    console.log('favItemContent', favItemContent);

    favItem.appendChild(favItemContent);

    // const favItemText = document.createElement(favItemContent);
    // favItem.appendChild(favItemText);
    // console.log('favItem', favItem);

    list.appendChild(favItem);

    // list.innerHTML += favouriteItem;
  }
}

function selectFavourite(a) {
  //Include favourite items in an array
  //NOT WORKING. IF NOT FAVOURITE (NOT HAVING THAT CLASS), IT SHOULD REMOVE IT FROM THE ARRAY
  if (a.classList.contains('show-card--favourite')) {
    myFavouriteShows.push(a);
    console.log('myFavouriteShows', myFavouriteShows);
  } else {
    delete myFavouriteShows[a];
    console.log('myFavouriteShows', myFavouriteShows);
  }
}

function handlerCardsClick(event) {
  const selectedCard = event.currentTarget;
  //   console.log('selecting one card', selectedCard);

  //Add a special class for favourites
  selectedCard.classList.toggle('show-card--favourite');

  selectFavourite(selectedCard);

  //Paint favourite results on its list
  paintResultsReduced(myFavouriteShows, favouritesListEl);
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

//# sourceMappingURL=main.js.map

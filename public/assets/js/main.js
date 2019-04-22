/* eslint-disable no-console */
'use strict';

//Get elements
const inputEl = document.querySelector('.app-input');
const btnEl = document.querySelector('.btn');
const resultListEl = document.querySelector('.list-results');
// console.log(inputEl, btnEl, resultListEl);

//Handler for main button
function handlerBtn() {
  //Save user input value
  const userValue = inputEl.nodeValue;
  console.log(userValue);
  //Connect to API
  // fetch('')
}

//Add lister to main button
btnEl.addEventListener('click', handlerBtn);

//# sourceMappingURL=main.js.map

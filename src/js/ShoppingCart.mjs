// I GOT NO IDEA WHAT THIS FILE IS FOR! WORKING ON WK3 TEAM ACTIVITY
// INSTRUCTION NOT CLEAR DO WE INTERGRATE THIS TO BE THE NEW cart.js module to be use?
// Shall we move every added function of the cart here now and discard the cart.js completely?
// Sheeeeeeeeeeeeesh


import { getLocalStorage } from './utils.mjs';

// This function generates the HTML representation for a given cart item
function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img src="${item.Image}" alt="${item.Name}" />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <span class="add-item" data-id="${item.Id}">+</span>
  <span class="remove-item" data-id="${item.Id}">x</span>
  <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

// ShoppingCart class responsible for I DONT  KNOW, Fricking instruction about this is incomplete!
export default class ProductListing {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }
  renderCartContents() {
    const cartItems = getLocalStorage(this.key);
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(this.parentSelector).innerHTML = htmlItems.join('');
  }
}

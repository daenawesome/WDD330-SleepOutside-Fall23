import { getLocalStorage } from './utils.mjs';

// This function retrieves cart items from local storage and renders them on the webpage
function renderCartContents() {
  // Fetch cart items from local storage
  const cartItems = getLocalStorage('so-cart');
  
  // Convert each item to its HTML representation using the cartItemTemplate function
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  
  // Set the HTML content of the element with class .product-list to the generated HTML
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
}

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
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

// Render the cart items on the webpage
renderCartContents();

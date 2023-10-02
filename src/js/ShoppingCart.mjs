import { setLocalStorage, getLocalStorage, renderSuperscript } from './utils.mjs';

export default class ShoppingCart {
  constructor(localStorageKey, productListSelector) {
    this.localStorageKey = localStorageKey;
    this.productListSelector = productListSelector;
  }

// This function retrieves cart items from local storage and renders them on the webpage
renderCartContents() {
  // Fetch cart items from local storage & default to empty array if null
  const cartItems = getLocalStorage(this.localStorageKey) || [];
  // Convert each item to its HTML representation using the cartItemTemplate function
  const htmlItems = cartItems.map((item) => this.cartItemTemplate(item));

  // Set the HTML content of the element with class .product-list to the generated HTML
  document.querySelector(this.productListSelector).innerHTML = htmlItems.join('');
    this.attachRemoveListeners();
    this.attachAddListeners();
    
  // Check if there are items in the cart
  if (cartItems.length > 0) {
    // Calculate the total
    let total = cartItems.reduce((acc, item) => acc + item.FinalPrice * item.quantity, 0);
    
    // Update the content of the cart-total element
    document.querySelector('.cart-total').innerHTML = `Total: $${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Make the cart footer visible
    document.querySelector('.cart-footer').classList.remove('hide');
  } else {
    // If cart is empty on page load, hide the cart footer
    if (document.readyState === 'loading') {
        document.querySelector('.cart-footer').classList.add('hide');
    } else {
        // If cart becomes empty after removing items, set the total to $0.00
        document.querySelector('.cart-total').innerHTML = `Total: $0.00`;
    }
  }

}

// This function generates the HTML representation for a given cart item
cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img src="${item.Images.PrimaryMedium}" 
         srcset="${item.Images.PrimaryLarge} 800w, 
                 ${item.Images.PrimaryMedium} 500w, 
                 ${item.Images.PrimarySmall} 300w"
         sizes="(min-width: 800px) 800px,
                (min-width: 500px) 500px,
                300px" 
         alt="${item.Name}" />
  </a>
  <a href="/product_pages/index.html?product=${item.Id}">
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

// Function to remove an item from the cart based on quantity
removeItemFromCart(productId) {
    // Fetch cart items from local storage
    const cartItems = getLocalStorage(this.localStorageKey);
    // Find the item with the specified product ID
    const itemIndex = cartItems.findIndex(item => item.Id === productId);
    
    // If the item is found and its quantity is greater than 1, decrement its quantity
    if (itemIndex !== -1 && cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1;
    } else {
        // Otherwise, remove the item from the cart
        cartItems.splice(itemIndex, 1);
    }
    
    // Update the cart in local storage with the modified items
    setLocalStorage(this.localStorageKey, cartItems);
    // Re-render the cart contents
    this.renderCartContents();
    // Superscript Feature
    renderSuperscript();
}

// Function to add an item from the cart based on quantity
addItemToCart(productId) {
  const cartItems = getLocalStorage(this.localStorageKey);
  const itemIndex = cartItems.findIndex(item => item.Id === productId);
  
  if (itemIndex !== -1) {
      cartItems[itemIndex].quantity += 1;
      setLocalStorage('so-cart', cartItems);
  }

  setLocalStorage(this.localStorageKey, cartItems);
  this.renderCartContents();
  renderSuperscript();
}

attachRemoveListeners() {
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          const productId = e.target.getAttribute('data-id');
          this.removeItemFromCart(productId);
      });
  });
}

attachAddListeners() {
  const addButtons = document.querySelectorAll('.add-item');
  addButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          const productId = e.target.getAttribute('data-id');
          this.addItemToCart(productId);
      });
  });
}
}

import { setLocalStorage, getLocalStorage, loadHeaderFooter, renderSuperscript } from './utils.mjs';

// Load the header and footer
loadHeaderFooter();

// This function retrieves cart items from local storage and renders them on the webpage
function renderCartContents() {
  // Fetch cart items from local storage & default to empty array if null
  const cartItems = getLocalStorage('so-cart') || [];

  // Convert each item to its HTML representation using the cartItemTemplate function
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  
  // Set the HTML content of the element with class .product-list to the generated HTML
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
    attachRemoveListeners();
    attachAddListeners();
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
function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
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


// Render the cart items on the webpage
renderCartContents();

// Function to remove an item from the cart based on quantity
function removeItemFromCart(productId) {
    // Fetch cart items from local storage
    const cartItems = getLocalStorage('so-cart');
    
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
    localStorage.setItem('so-cart', JSON.stringify(cartItems));
    
    // Re-render the cart contents
    renderCartContents();
    // Superscript Feature
    renderSuperscript();
}

// Function to add an item from the cart based on quantity
function addItemToCart(productId) {
  const cartItems = getLocalStorage('so-cart');
  const itemIndex = cartItems.findIndex(item => item.Id === productId);
  
  if (itemIndex !== -1) {
      cartItems[itemIndex].quantity += 1;
      setLocalStorage('so-cart', cartItems);
      renderCartContents();
  }

  // Superscript Feature
  renderSuperscript();
}

function attachRemoveListeners() {
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            removeItemFromCart(productId);
        });
    });
}

function attachAddListeners() {
    const addButtons = document.querySelectorAll('.add-item');
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            addItemToCart(productId);
        });
    });
}


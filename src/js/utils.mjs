// Wrapper function for querySelector, returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from local storage
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(`Error parsing data for key "${key}" from local storage:`, error);
    return null;
  }
}

// Save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Set a listener for both touchend and click events
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// Helper function to get URL parameters
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const urlItem = urlParams.get(param);
  return urlItem;
}

export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = false) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// Function to render a given template into a parent element with optional data and callback
export function renderWithTemplate(template, parentElement, data, callback) {
  // Insert the template into the parent element
  parentElement.insertAdjacentHTML('afterbegin', template);
  
  // If a callback function is provided, execute it with the given data
  if(callback) {
    callback(data);
  }
}

// Function to load an HTML template from a given path
export async function loadTemplate(path) {
  // Fetch the HTML content from the specified path
  const html = await fetch(path).then(response => response.text());
  
  // Create a new template element and set its innerHTML to the fetched HTML content
  const template = document.createElement('template');
  template.innerHTML = html;
  
  // Return the template element
  return template;
}

// Function to load and render the header and footer templates into their respective HTML elements
export async function loadHeaderFooter() {
  // Load the header and footer templates
  const headerTemplate = await loadTemplate('/partials/header.html');
  const footerTemplate = await loadTemplate('/partials/footer.html');
  
  // Fetch the header and footer elements from the DOM
  const headerElement = document.getElementById('header');
  const footerElement = document.getElementById('footer');
  
  // Render the loaded header and footer templates into their respective elements
  renderWithTemplate(headerTemplate.innerHTML, headerElement);
  renderWithTemplate(footerTemplate.innerHTML, footerElement);

  renderSuperscript();
}

// Superscript feature
export function renderSuperscript() {
  let cart = getLocalStorage('so-cart')
  let totalQuantity 
  if(cart !== null){
    // Calculate the total quantity of items in the cart
    totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  }else{
    totalQuantity = 0
  }
  const superscript = document.getElementById('superscript');
  superscript.innerHTML = totalQuantity;

  // Change the display style of superscript based on totalQuantity
  if (totalQuantity === 0) {
    superscript.style.display = 'none';
  } else {
    superscript.style.display = 'flex';
  }

  // Added cartIcon Id on (backpack) svg for animation
  const cartIcon = document.getElementById('cartIcon');
  // Use session storage to store the old quantity
  const oldQuantity = parseInt(sessionStorage.getItem('cartQuantity') || '0');
  // Update the cart quantity in session storage
  sessionStorage.setItem('cartQuantity', totalQuantity.toString());
  // Add the shake or shrink class based on the change in quantity
  if (totalQuantity > oldQuantity) {
    cartIcon.classList.add('shake');
  } else if (totalQuantity < oldQuantity) {
    cartIcon.classList.add('shrink');
  }
  // Remove the class after the animation to add again later
  setTimeout(() => {
    cartIcon.classList.remove('shake', 'shrink');
  }, 820);
}

// Calculate discount percentage function
export function calculateDiscountPercentage(originalPrice, discountedPrice) {
  let discount = originalPrice - discountedPrice;
  let discountPercentage = (discount / originalPrice) * 100;
  return {
    discountPercentage: Math.round(discountPercentage),
    discount: (discount.toFixed(2))
  };
}

export function alertMessage(message, scroll = true, duration = 30000) {
  // create element to hold our alert
  const alert = document.createElement('div');
  // add a class to style the alert
  alert.classList.add('alert');
  // set the contents. You should have a message and an X or something the user can click on to remove
  alert.innerHTML = `<span class="alert-message">${message} <span class="alert-close">X</span></span>`;
  // add a listener to the alert to see if they clicked on the X
  let timer;
  alert.addEventListener('click', function(e) {
      if(e.target.classList.contains('alert-close')) {
          clearTimeout(timer);  // Clear the timer if it's still pending
          fadeOutAndRemove(this);
          // this.remove();  // Remove the alert
      }
  });
  // add the alert to the top of main
  const main = document.querySelector('main');
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  // we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if(scroll)
      window.scrollTo(0,0);
  // Set a timer to automatically close the alert after the duration
  timer = setTimeout(() => {
      fadeOutAndRemove(alert);
      // alert.remove();
  }, duration);

  function fadeOutAndRemove(element) {
    element.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => {
        element.remove();
    }, 500); // This should match the duration of the fadeOut animation
  }



}


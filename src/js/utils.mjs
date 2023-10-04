// Wrapper function for querySelector, returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Fetch and parse JSON data from local storage by key
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(`Error parsing data for key "${key}" from local storage:`, error);
    return null;
  }
}

// Data to JSON and Save data to local storage
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

// Render a list of items using a template function and attach to a parent DOM element
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

// Display alert message at the top of the window with duration and scroll-to-top action
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
      }
  });
  
  const header = document.querySelector('header');
  let alertContainer = header.querySelector('.alert-container');

  // If the alert-container doesn't exist, create and append it to the header
  if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.classList.add('alert-container');
      header.prepend(alertContainer);
  }

  // Append alert to the alertContainer
  alertContainer.appendChild(alert);

  // make sure they see the alert by scrolling to the top of the window
  if (scroll)
      window.scrollTo(0,0);
  // Set a timer to automatically close the alert after the duration
  timer = setTimeout(() => {
      fadeOutAndRemove(alert);
  }, duration);

  function fadeOutAndRemove(element) {
    element.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => {
        element.remove();
    }, 500); // should match the duration of the fadeOut animation
  }
}

// toast notification with a message and an overlay
export function showToast(message) {
  let toast = document.getElementById('toast');
  let overlay = document.getElementById('overlay');

  // If toast doesn't exist, create it
  if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
  }

  // If overlay doesn't exist, create it
  if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'overlay';
      document.body.appendChild(overlay);
  }

  toast.innerHTML = message;
  toast.className = 'toast show';
  overlay.className = 'overlay show';

  // timer to remove the show class
  setTimeout(() => {
      toast.className = 'toast';
      overlay.className = 'overlay';
  }, 10000);
}


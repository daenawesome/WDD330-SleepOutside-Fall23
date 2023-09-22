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
}

import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

// Load the header and footer
loadHeaderFooter();

// Initialize a new checkout process
const checkOut = new CheckoutProcess('so-cart', '.checkout-summary');
// Initialize the checkout process to load items and other properties
checkOut.init();

// Calculate the total price for the items in the cart.
function checkoutTotal() {
  checkOut.calculateItemSummary();
}
// Display the order totals including tax & shipping
function calcShipping() {
  checkOut.displayOrderTotals();
}

// When window finish loading, calculate the checkout total for the items in the cart
window.addEventListener('load', checkoutTotal);

// When the zip field loses focus (on blur), calculate and display shipping and other totals
document.querySelector('#zip').addEventListener('blur', calcShipping);

// Event listener for the checkout form submission
document
  .getElementById('checkoutForm')
  .addEventListener('submit', function (e) {
    // prevent the default form submission action
    e.preventDefault();
    
    // check if the form is valid
    const myForm = document.getElementById('checkoutForm');
    const chk_status = myForm.checkValidity();
    // display validation feedback
    myForm.reportValidity();
    
    // proceed with the checkout when form is ok
    if(chk_status) {
      checkOut.checkout();
    }
  });

document
  .addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    
    cardNumberInput.addEventListener('input', formatCardNumber);
});

function formatCardNumber(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    value = value.slice(0, 16);
    let formatted = '';

    // Split into groups of 4 digits
    while (value.length > 0) {
        formatted += value.substr(0, 4) + ' ';
        value = value.substr(4);
    }

    input.value = formatted.trim();
}

document.addEventListener('DOMContentLoaded', function() {
  const originalExpirationInput = document.getElementById('originalExpiration');
  
  originalExpirationInput.addEventListener('change', formatExpirationDate);
});

function formatExpirationDate(event) {
  const originalInput = event.target;
  const value = originalInput.value;
  const formattedInput = document.getElementById('expiration');

  if (value) {
      const [year, month] = value.split('-');
      const formatted = `${month}/${year.slice(-2)}`; // Convert YYYY to YY
      formattedInput.value = formatted;
  }
}





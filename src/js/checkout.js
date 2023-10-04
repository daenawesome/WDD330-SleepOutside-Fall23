import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkOut = new CheckoutProcess('so-cart', '.checkout-summary');
checkOut.init();

function checkoutTotal() {
  checkOut.calculateItemSummary();
}

function calcShipping() {
  checkOut.displayOrderTotals();
}

window.addEventListener('load', checkoutTotal);

document.querySelector('#zip').addEventListener('blur', calcShipping);


document
  .getElementById('checkoutForm')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    
    const myForm = document.getElementById('checkoutForm');
    const chk_status = myForm.checkValidity();
    myForm.reportValidity();
    
    if(chk_status) {
      checkOut.checkout();
    }
  });




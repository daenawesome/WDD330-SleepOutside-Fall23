import { getLocalStorage, alertMessage, showToast } from './utils';
import ExternalServices from './ExternalServices.mjs';

// Instance of the ExternalServices class
const services = new ExternalServices();

// Convert form data into a JSON object
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);

  // Log the raw FormData and its entries
  console.log('Raw FormData:', formData);
  for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
  }

  const convertedJSON = {};
  // Convert FormData to JSON
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// Mapping the items to a simpler format
function packageItems(items) {
  let simplifiedItems;
  if (items) {
  simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: item.quantity || 1, // Default to 1
    };
  });
  }
  return simplifiedItems;
}

// The main class that handles the checkout process
export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  // Initialize the cart list from local storage
  init() {
    this.list = getLocalStorage(this.key);
  }

  // Calculate total cost of items in the cart
  calculateItemSummary() {
    const contents = getLocalStorage('so-cart');
    if (!contents) return 0;
    return contents.reduce((total, item) => total + item.FinalPrice * (item.quantity || 1), 0);
  }

  // Calculate the order total including tax and shipping
  calculateOrderTotal() {
    const contents = getLocalStorage('so-cart');
    const subTotal = this.calculateItemSummary();
    const tax = subTotal * 0.06;  // 6% tax
    const shipping = contents ? (contents.length === 0 ? 0 : 10 + (contents.length - 1) * 2) : 0;  // $10 for the first item and $2 for each additional item
    const orderTotal = subTotal + tax + shipping;

    return {
        subTotal,
        tax,
        shipping,
        orderTotal
    };
  }

  // Display the order totals
  displayOrderTotals() {
    const { subTotal, tax, shipping, orderTotal } = this.calculateOrderTotal();
    console.log('Displaying Order Totals:');
    console.log('Subtotal:', subTotal);
    console.log('Tax:', tax);
    console.log('Shipping:', shipping);
    console.log('Order Total:', orderTotal);
    
    // Set the calculated values to the respective DOM elements
    document.getElementById('subTotal').innerHTML = `Subtotal: $${subTotal.toFixed(2)}`;
    document.getElementById('tax').innerHTML = `Tax: $${tax.toFixed(2)}`;
    document.getElementById('ship').innerHTML = `Shipping: $${shipping.toFixed(2)}`;
    document.getElementById('orderTotal').innerHTML = `Total: $${orderTotal.toFixed(2)}`;
    }

    // Handle the checkout process
    async checkout() {
    const formElement = document.forms['checkoutForm'];

    // Calculate and set order totals
    const { tax, shipping, orderTotal } = this.calculateOrderTotal();
    this.tax = tax;
    this.shipping = shipping;
    this.orderTotal = orderTotal;

    const formDataResult  = formDataToJSON(formElement);
    console.log('Form Data Result:', formDataResult);

    const json = formDataResult;
    json.orderDate = new Date();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    console.log('Attempting to submit checkout data:', json);

    // Try to submit the checkout data
    try {
      const data = await services.checkout(json);
      if (data.orderId) {
      // if (res.status >= 200 && res.status < 300) {
        console.log('Checkout submitted successfully:', data);
        // Alert, Toast and Redirection
        alertMessage(`Order Processing...`);
        setTimeout(() => {
          showToast('You will be redirected in 10 seconds.');
        }, 5000);
          setTimeout(() => {
              location.assign('../checkout/checkedout.html');
          }, 15000);
        localStorage.clear();

      // } else if (res.status >= 400 && res.status < 500) {
      } else {
        console.log('Checkout submission failed. Received:', data);
        // Iterate over the error properties and show alert messages
        for (let key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
              alertMessage(`Error: ${data[key]}`);
          }
        }
      }

    } catch (err) {
      console.log('Unexpected error during checkout.', err);
      // Alert, Toast and Redirection
      alertMessage('An unexpected error occurred.');
      setTimeout(() => {
        showToast('You will be redirected in 10 seconds.');
      }, 5000);
        setTimeout(() => {
            location.assign('../checkout/failed.html');
        }, 15000);
    }
  }
  
}

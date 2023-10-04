import { getLocalStorage, alertMessage } from './utils';
import ExternalServices from './ExternalServices.mjs';

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);

  // Log the raw FormData
  console.log('Raw FormData:', formData);
  for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
  }

  const convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}


function packageItems(items) {
  let simplifiedItems;
  if (items) {
  simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: item.quantity || 1,
    };
  });
  }
  return simplifiedItems;
}

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

  init() {
    this.list = getLocalStorage(this.key);
  }

  calculateItemSummary() {
    const contents = getLocalStorage('so-cart');
    if (!contents) return 0;
    return contents.reduce((total, item) => total + item.FinalPrice * (item.quantity || 1), 0);
  }


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

  displayOrderTotals() {
    const { subTotal, tax, shipping, orderTotal } = this.calculateOrderTotal();
    console.log('Displaying Order Totals:');
    console.log('Subtotal:', subTotal);
    console.log('Tax:', tax);
    console.log('Shipping:', shipping);
    console.log('Order Total:', orderTotal);
    
    document.getElementById('subTotal').innerHTML = `Subtotal: $${subTotal.toFixed(2)}`;
    document.getElementById('tax').innerHTML = `Tax: $${tax.toFixed(2)}`;
    document.getElementById('ship').innerHTML = `Shipping: $${shipping.toFixed(2)}`;
    document.getElementById('orderTotal').innerHTML = `Total: $${orderTotal.toFixed(2)}`;
    }


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

    try {
      const res = await services.checkout(json);
      if (res && res.status === 200) { 
        console.log('Checkout submitted successfully:', res);
        // location.assign('../checkout/checkedout.html');
        localStorage.clear();
      } else {
        console.log('Checkout submission failed. Received:', res);
        // location.assign('../checkout/failed.html');
            // Handle custom error message
            if (res && res.name === 'servicesError') {
                console.error(res.message);
            } else {
                // Handle other types of errors
                console.error('Unexpected error during checkout.');
            }
      }
    } catch (err) {
      console.log('Error during checkout submission:', err);
      // location.assign('../checkout/failed.html');
      // Handle custom error message
      if (err && err.name === 'servicesError') {
        console.error(err.message);
        alertMessage(err.message);
    } else {
        // Handle other types of errors
        console.error('Unexpected error during checkout.');
        alertMessage('Unexpected error during checkout.');
    }
    }
  }

}
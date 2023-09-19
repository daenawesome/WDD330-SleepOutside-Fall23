
import ProductData from './ProductData.mjs';
import ProductListing from './ProductList.mjs';



// Create an instance of ProductData for 'tents' category
const productData = new ProductData('tents');

// Example: Create an instance of ProductListing and initialize
// Assuming an HTML element with id 'product-list' exists to render the product list
const productListElement = document.getElementById('product-list');
const productListing = new ProductListing('tents', productData, productListElement);
productListing.init();

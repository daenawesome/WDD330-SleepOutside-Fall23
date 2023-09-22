import ProductData from './ProductData.mjs';
import ProductListing from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

// Create an instance of ProductData for the 'tents' category
const productData = new ProductData('tents');

// Fetch the HTML element where the product list will be rendered
const productListElement = document.getElementById('product-list');

// Create an instance of ProductListing using the 'tents' category, the productData instance, and the HTML element
const productListing = new ProductListing('tents', productData, productListElement);

// Initialize the product listing by calling the init method
productListing.init();

// Load the header and footer
loadHeaderFooter();

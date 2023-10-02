import { loadHeaderFooter, getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// Load the header and footer
loadHeaderFooter();

// Getting the 'category' parameter from the URL to fetch products of the specific category from the API
const category = getParam('category');

// Creating an instance of the ProductData class fetching product data from the API
const productData = new ProductData();

// Selecting the HTML element where the product list will be rendered
const productListElement = document.getElementById('product-list');

// Creating an instance of the ProductList class
const myList = new ProductList(category, productData, productListElement);

// Calling the 'init' method to fetch and display the products on the webpage
myList.init();

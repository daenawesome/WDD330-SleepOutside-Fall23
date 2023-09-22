import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';
// import { loadHeaderFooter } from './utils.mjs';

// Create an instance of ProductData for the "tents" category
const dataSource = new ProductData('tents');

// Get the product ID from URL parameters
const productId = getParam('product');

// Create an instance of ProductDetails using the fetched product ID and the dataSource
const product = new ProductDetails(productId, dataSource);

// Initialize the product details by calling the init method
product.init();

// Load the header and footer
loadHeaderFooter();

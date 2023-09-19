import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

// Create an instance of ProductData for the "tents" category
const dataSource = new ProductData('tents');

// Get the product ID from URL parameters
const productId = getParam('product');

// Create an instance of ProductDetails and initialize it
const product = new ProductDetails(productId, dataSource);
product.init();

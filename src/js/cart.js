import { loadHeaderFooter } from './utils.mjs';
import ShoppingCart from './ShoppingCart.mjs';

// Load the header and footer
loadHeaderFooter();

// Create a ShoppingCart instance for managing cart operations
const cart = new ShoppingCart('so-cart', '.product-list');
// Render the initial cart contents on the webpage
cart.renderCartContents();

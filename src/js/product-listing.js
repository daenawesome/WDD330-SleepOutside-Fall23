import { loadHeaderFooter, getParam } from './utils.mjs';
import ProductData from './ExternalServices.mjs';
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

// Event handler for sort dropdown
document.getElementById('sort-dropdown').addEventListener('change', function() {
    const selectedSort = this.value;
    const selectedBrand = document.getElementById('filter-brand-dropdown').value;
    myList.init(selectedSort, selectedBrand);
});

// Event handler for brand filter dropdown
document.getElementById('filter-brand-dropdown').addEventListener('change', function() {
    const selectedBrand = this.value;
    const selectedSort = document.getElementById('sort-dropdown').value;
    myList.init(selectedSort, selectedBrand);
});

// Populate brand filter dropdown with available brands from product data
async function populateBrandDropdown() {
    const products = await productData.getData(category);
    const brands = [...new Set(products.map(product => product.Brand.Name))];
    const brandDropdown = document.getElementById('filter-brand-dropdown');
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandDropdown.appendChild(option);
    });
    // Initial population of products
    myList.init();
}

populateBrandDropdown();

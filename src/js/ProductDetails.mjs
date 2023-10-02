import { setLocalStorage, getLocalStorage, renderSuperscript } from './utils.mjs';

// Function to generate the product details HTML
function productDetailsTemplate(product) {
  return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Images.PrimaryLarge}" alt="${product.NameWithoutBrand}" />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
}

// ProductDetails class responsible for managing product details
export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.cart = []; 
  }

  // Initialize the product details
  async init() {
    // Log the Product ID
    console.log('Product ID:', this.productId);
    // Log the Data Source
    console.log('Data Source:', this.dataSource);

    // Use the data source to get the details for the current product (returns a promise)
    this.product = (await this.dataSource.findProductById(this.productId)).Result; // fetched product details are nested inside a Result property.

    // Log the Fetched Product Details
    console.log('Fetched Product Details:', this.product);
    
    // Render the product details in the "main" element
    this.renderProductDetails('main');

    // Add a click event listener to the "Add to Cart" button
    // Note the use of .bind(this) to maintain the correct context
    document.getElementById('addToCart').addEventListener('click', this.addToCart.bind(this));
  }

  // Stretch team2
  // Add the product to the shopping cart
  addToCart() {
    // Retrieve the current cart from local storage
    this.cart = getLocalStorage('so-cart') || [];

    // Check if the product already exists in the cart
    const existingProductIndex = this.cart.findIndex(item => item.Id === this.product.Id);
    
    if (existingProductIndex !== -1) {
        // If product exists in the cart, increment its quantity
        if (!this.cart[existingProductIndex].quantity) {
            this.cart[existingProductIndex].quantity = 1;
        }
        this.cart[existingProductIndex].quantity += 1;
    } else {
        // If product doesn't exist in the cart, add it with a quantity of 1
        this.product.quantity = 1;
        this.cart.push(this.product);
    }

    // Update the local storage with the modified cart
    setLocalStorage('so-cart', this.cart);
    // Superscript Feature
    renderSuperscript();
}



  // Render the product details in the specified selector
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML('afterBegin', productDetailsTemplate(this.product));
  }
}

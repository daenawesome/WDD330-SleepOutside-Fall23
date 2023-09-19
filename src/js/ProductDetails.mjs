import { setLocalStorage, getLocalStorage } from './utils.mjs';

// Function to generate the product details HTML
function productDetailsTemplate(product) {
  return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Image}" alt="${product.NameWithoutBrand}" />
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
    // Use the data source to get the details for the current product (returns a promise)
    this.product = await this.dataSource.findProductById(this.productId);
    
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
    this.cart = getLocalStorage('so-cart');
    if (this.cart != null) {
        this.cart.push(this.product);
    } else {
        this.cart = [this.product];
    }

    // Store the updated cart in local storage
    setLocalStorage('so-cart', this.cart);
}

  // Render the product details in the specified selector
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML('afterBegin', productDetailsTemplate(this.product));
  }
}

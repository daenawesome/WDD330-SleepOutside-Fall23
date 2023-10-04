import { 
  setLocalStorage, 
  getLocalStorage, 
  renderSuperscript, 
  calculateDiscountPercentage,
  alertMessage  
} from './utils.mjs';

// Function to generate the product details HTML
function productDetailsTemplate(product) {
  let { discountPercentage, discount } = calculateDiscountPercentage(product.SuggestedRetailPrice, product.FinalPrice);

  return `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" 
         src="${product.Images.PrimaryLarge}" 
         srcset="${product.Images.PrimaryExtraLarge} 1200w, 
                 ${product.Images.PrimaryLarge} 800w, 
                 ${product.Images.PrimaryMedium} 500w, 
                 ${product.Images.PrimarySmall} 300w"
         sizes="(min-width: 1200px) 1200px,
                (min-width: 800px) 800px,
                (min-width: 500px) 500px,
                300px" 
         alt="${product.NameWithoutBrand}" />
    
    <div class="discount-percent">
      <span class="flag-discount">${discountPercentage}%<sup>off</sup> <span class="savings">[ SAVE: $${discount} ]</span></span>
      <span class="deal">Deal Price!</span>
      </div>
    <p class="product-card__price"><span>$${product.FinalPrice}</span></p>
    <p class="product-card__discount">Typical Price: <span class="list-price">$${product.SuggestedRetailPrice}</span></p>
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
    updateBreadcrumb(this.product.Category, this.product.NameWithoutBrand);
    
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
    alertMessage('Product successfully added to the cart!');
}



  // Render the product details in the specified selector
  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML('afterBegin', productDetailsTemplate(this.product));
  }
}

function updateBreadcrumb(category, productName) {
  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) {
      breadcrumb.innerHTML = `<a href="/product-listing/index.html?category=${category}">${[...category][0].toUpperCase() + category.slice(1)}</a> &#8594 ${productName}`;
  }
}


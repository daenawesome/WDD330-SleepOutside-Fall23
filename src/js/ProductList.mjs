import { renderListWithTemplate, calculateDiscountPercentage } from './utils.mjs';

// ProductListing class responsible for rendering a list of products
export default class ProductListing {
  constructor(category, dataSource, listElement) {
    // We passed in this information to make our class as reusable as possible.
    // Being able to define these things when we use the class will make it very flexible
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  // Fetch and render the product list
  async init() {
    // fetch the products
    const products = await this.dataSource.getData(this.category);
    console.log('Products:', products);
    // Render the list with the fetched products
    this.renderList(products);
    console.log('List Element:', this.listElement);
    //set the title to the current category
    document.querySelector('.title').innerHTML = this.category;
  }

  // Render the product list using a template
  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}


function productCardTemplate(product) {
  // Calculate the discount percentage
  let { discountPercentage } = calculateDiscountPercentage(product.SuggestedRetailPrice, product.FinalPrice);
  // const selectedImage = selectImageBasedOnWidth(product);
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
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
         alt="${product.Name}" />
      
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <div class="discount-percent">
      <p>${discountPercentage}% off</p>
      <span class="deal">Deal</span>
      </div>
      <div class="product-price">
      <p class="product-card__price">$${product.FinalPrice}</p>
      <p class="product-card__discount">List Price: <span class="list-price">$${product.SuggestedRetailPrice}</span></p>
      </div>
    </a>
  </li>`;
}


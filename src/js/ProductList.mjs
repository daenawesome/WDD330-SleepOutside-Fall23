import { renderListWithTemplate } from './utils.mjs';

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
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

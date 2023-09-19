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
    const products = await this.dataSource.getData();
    // Check if category is 'tents' and filter the products
    const filteredProducts = this.category === 'tents' ? this.filterTentsById(products) : products;
    this.renderList(filteredProducts);
}

// Render the product list using a template
renderList(list, position = 'afterbegin', clear = false) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, position, clear);
}

  // Filter the tents based on a predefined list of tent IDs
  filterTentsById(tents) {
    const tent_ids_to_keep = ['880RR', '985RF', '985PR', '344YJ'];
    return tents.filter(tent => tent_ids_to_keep.includes(tent.Id));
  }
}


function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

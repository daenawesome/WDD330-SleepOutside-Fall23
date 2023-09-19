export default class ProductListing {
  constructor(category, dataSource, listElement) {
    // We passed in this information to make our class as reusable as possible.
    // Being able to define these things when we use the class will make it very flexible
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const products = await this.dataSource.getData();
    this.renderList(products);
  }

  renderList(products) {
    // Using map to transform product data objects into HTML strings
    const productCards = products.map(productCardTemplate).join('');
    
    // Inserting the product cards HTML into the listElement
    this.listElement.innerHTML = productCards;
  }
}

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.id}">
      <img src="${product.image}" alt="Image of ${product.name}">
      <h3 class="card__brand">${product.brand}</h3>
      <h2 class="card__name">${product.name}</h2>
      <p class="product-card__price">$${product.price}</p>
    </a>
  </li>`;
}

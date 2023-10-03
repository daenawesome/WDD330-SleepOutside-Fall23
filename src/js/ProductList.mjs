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
  async init(sort = 'default', filter = 'all') {
    // console.log('Sort parameter:', sort); // Check Sorting

    // fetch the products
    let products = await this.dataSource.getData(this.category);
    // console.log('Products:', products);
    
    updateBreadcrumb(this.category, products.length);
    
    
    // Apply filtering if filter is not 'all'
    if (filter !== 'all') {
      products = products.filter(product => product.Brand.Name === filter);
    }

    // Apply sort based on the sort parameter
    if (sort === 'Price: Low to High') {
      products.sort((a, b) => Number(a.FinalPrice) - Number(b.FinalPrice));
  } else if (sort === 'Price: High to Low') {
      products.sort((a, b) => Number(b.FinalPrice) - Number(a.FinalPrice));
  } else if (sort === 'Name: Ascending') {
      products.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
  } else if (sort === 'Name: Descending') {
      products.sort((a, b) => b.NameWithoutBrand.localeCompare(a.NameWithoutBrand));
  } else if (sort === 'Discount') {
      products.sort((a, b) => {
          const discountA = calculateDiscountPercentage(a.SuggestedRetailPrice, a.FinalPrice).discountPercentage;
          const discountB = calculateDiscountPercentage(b.SuggestedRetailPrice, b.FinalPrice).discountPercentage;
          return discountB - discountA;  // Sorting in descending order to get highest discount first
      });
}
  // Check sorting
  // console.log('After sorting:', products);
  
  // Render the list with the fetched products 
  this.renderList(products);
    //set the title to the current category
    document.querySelector('.title').innerHTML = this.category;
  }

  // Render the product list using a template
  renderList(list) {
    this.listElement.innerHTML = '';  
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}

function productCardTemplate(product) {
  // Calculate the discount percentage
  let { discountPercentage } = calculateDiscountPercentage(product.SuggestedRetailPrice, product.FinalPrice);
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

function updateBreadcrumb(category, itemCount) {
  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) {
      breadcrumb.innerHTML = `${[...category][0].toUpperCase() + category.slice(1)}&#8594 (showing ${itemCount} items)`;
  }
}


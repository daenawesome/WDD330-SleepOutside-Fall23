// Function to convert a response to JSON
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

// ProductData class responsible for fetching and managing product data
export default class ProductData {
  constructor(category) {
    // Store the product category and construct the data path
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }

  // Fetch product data and convert it to JSON
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  // Find a product by its ID
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}

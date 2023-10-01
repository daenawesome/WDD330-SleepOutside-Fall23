const baseURL = import.meta.env.VITE_SERVER_URL;

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
  constructor() {
    // Base URL from environment variable
    this.baseURL = import.meta.env.VITE_SERVER_URL;
  }

  // Fetch product data and convert it to JSON
  async getData(category) {
    const response = await fetch(this.baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // Fetch product data by ID from the API
  async findProductById(id) {
    const response = await fetch(this.baseURL + `product/${id}`);
    const data = await response.json();
    return data;
  }
}

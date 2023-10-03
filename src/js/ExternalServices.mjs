const baseURL = import.meta.env.VITE_SERVER_URL;

// Function to convert a response to JSON
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

// ExternalServices class responsible for fetching and managing product data
export default class ExternalServices {
  constructor() {
    // Base URL from environment variable
    this.baseURL = import.meta.env.VITE_SERVER_URL;
  }

  async getData(category) {
    // Logging the category
    // console.log('Category:', category); 

    // Sending a GET request to the API to search products by category.
    // The URL is constructed by concatenating the baseURL, 'products/search/', and the category.
    const response = await fetch(this.baseURL + `products/search/${category}`);
    
    // Logging the API response
    // console.log('Response:', response);

    // Converting the API response to JSON
    const data = await convertToJson(response);
    
    // Logging the JSON data
    // console.log('Data:', data);

    return data.Result; // fetched product details are nested inside a Result property.
  }
  
  // Fetch product data by ID from the API
  async findProductById(id) {
    // Sending a GET request to the API to fetch a product by its ID.
    // The URL is constructed by concatenating the baseURL, 'product/', and the product ID.
    const response = await fetch(this.baseURL + `product/${id}`);
    const data = await response.json();
    return data;
  }

  async checkout(orderData) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    };
    const response = await fetch(`${this.baseURL}checkout`, options);
    return response.json();
  }
}

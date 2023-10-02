// Exporting the Alert class as the default export of this module
export default class Alert {
  // initializes the alerts property as an empty array
  constructor() {
      this.alerts = [];
  }

  // Asynchronous to load alerts from the alerts.json file
  async loadAlerts() {
      // Fetching the alerts.json file. 
      // await to wait for the fetch to complete.
      const response = await fetch('/json/alerts.json');
      // Parsing the JSON data from the response and storing it in the alerts property.
      this.alerts = await response.json();
  }

  // build and display alerts on webpage
  buildAlerts() {
      // Check if there are any alerts to display
      if (this.alerts.length > 0) {
          // Create new section element to hold the alerts
          const alertList = document.createElement('section');
          
          // Add class to the section
          alertList.className = 'alert-list';
          
          // Looping through each alert
          this.alerts.forEach(alert => {
              // Create a paragraph element for each alert
              const p = document.createElement('p');
              // Setting the text/background/color of the paragraph to the alert message
              p.textContent = alert.message;
              p.style.backgroundColor = alert.background;
              p.style.color = alert.color;
              
              // Appending the paragraph to the section
              alertList.appendChild(p);
          });
          
          // Selecting the main element from the webpage
          const mainElement = document.querySelector('main');
          
          // Prepending the section to the main element, 
          // to appear at the beginning of main content
          mainElement.prepend(alertList);
      }
  }
}

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    try {
        const response = await fetch('http://server-nodejs.cit.byui.edu:3000/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: event.body
        });
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed fetching data' })
        };
    }
};



const fetch = require('node-fetch');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        const response = await fetch(vintedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'text/html'
            }
        });

        const text = await response.text();
        const stats = {
            enVente: (text.match(/(\d+) articles? en vente/)?.[1] || '0'),
            vendus: (text.match(/(\d+) articles? vendus?/)?.[1] || '0')
        };

        return {
            statusCode: 200,
            body: JSON.stringify(stats)
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};

const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        console.log('URL reçue:', vintedUrl);

        const response = await fetch(vintedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'text/html',
                'Accept-Language': 'fr-FR,fr;q=0.9'
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        console.log('Classes trouvées:', {
            followers: $('[data-testid="user-followers"]').text(),
            rating: $('[data-testid="user-rating"]').text(),
            items: $('[data-testid="user-items"]').text()
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                followers: $('[data-testid="user-followers"]').text() || 'N/A',
                rating: $('[data-testid="user-rating"]').text() || 'N/A',
                items: $('[data-testid="user-items"]').text() || 'N/A'
            })
        };
    } catch (error) {
        console.error('Erreur:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

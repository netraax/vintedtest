const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        const response = await fetch(vintedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'fr,fr-FR;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': 'https://www.vinted.fr/',
                'Cookie': '_vinted_fr_session=1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            }
        });

        const html = await response.text();
        console.log('HTML reçu:', html.includes('web_ui'));

        const $ = cheerio.load(html);

        // Cherchons le contenu spécifiquement
        const pageContent = $('body').text();
        console.log('Texte trouvé:', pageContent.substring(0, 200));

        const stats = {
            items: $('.web_ui__Cell__cell').length,
            rating: $('.web_ui__Rating__rating').text(),
            followers: $('[data-testid="user-followers"]').text()
        };

        return {
            statusCode: 200,
            body: JSON.stringify(stats)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

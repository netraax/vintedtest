const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        const response = await fetch(vintedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'text/html',
                'Accept-Language': 'fr-FR,fr;q=0.9'
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        const stats = {
            profile: $('.web_ui__Text__amplified').text(),
            evaluations: $('.web_ui__Text__subtitle').text(),
            articles: $('.profile__items-wrapper').length
        };

        console.log('Données extraites:', stats);

        return {
            statusCode: 200,
            body: JSON.stringify(stats)
        };
    } catch (error) {
        console.error('Erreur:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

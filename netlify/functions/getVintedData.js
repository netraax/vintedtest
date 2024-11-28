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
        
        // Log du texte des éléments potentiellement intéressants
        $('div').each((i, el) => {
            const text = $(el).text().trim();
            if (text.includes('articles') || text.includes('évaluation') || text.includes('abonné')) {
                console.log(`Trouvé: ${text}`);
            }
        });

        const stats = {
            items: $('.profile__items-wrapper .feed-grid__item').length,
            rating: $('div').filter((i, el) => $(el).text().includes('étoile')).first().text(),
            followers: $('span').filter((i, el) => $(el).text().includes('Abonné')).first().text()
        };

        console.log('Stats extraites:', stats);

        return {
            statusCode: 200,
            body: JSON.stringify(stats)
        };
    } catch (error) {
        console.error('Erreur:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

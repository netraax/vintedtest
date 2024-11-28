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
        console.log('HTML reçu:', html.substring(0, 500));

        const $ = cheerio.load(html);
        
        // Chercher toutes les classes disponibles
        const allClasses = [];
        $('*[class]').each((i, el) => {
            allClasses.push($(el).attr('class'));
        });
        console.log('Classes trouvées:', [...new Set(allClasses)]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                classes: allClasses.slice(0, 10)
            })
        };
    } catch (error) {
        console.error('Erreur:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

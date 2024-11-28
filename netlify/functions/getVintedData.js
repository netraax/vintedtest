const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        console.log('URL reçue:', vintedUrl);

        const response = await fetch(vintedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html',
                'Accept-Language': 'fr-FR,fr;q=0.9'
            }
        });
        
        console.log('Status HTTP:', response.status);
        const html = await response.text();
        console.log('HTML début:', html.substring(0, 100));
        
        const $ = cheerio.load(html);
        console.log('Cheerio chargé');

        const followersElement = $('.web_ui_Text_text').first();
        console.log('Élément followers trouvé:', followersElement.length > 0);
        const followers = followersElement.text();
        console.log('Followers texte:', followers);

        const ratingElement = $('.web_ui_Text_body').first();
        console.log('Élément rating trouvé:', ratingElement.length > 0);
        const rating = ratingElement.text();
        console.log('Rating texte:', rating);

        return {
            statusCode: 200,
            body: JSON.stringify({
                abonnés: followers || 'N/A',
                note: rating || 'N/A',
                html: html.substring(0, 200)
            })
        };
    } catch (error) {
        console.error('Erreur:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

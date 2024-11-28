const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        const response = await fetch(vintedUrl);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Extraire les données
        const followers = $('.web_ui_Text_text').first().text().split(' ')[0] || '0';
        const rating = $('.web_ui_Text_body').first().text() || 'N/A';
        const evaluations = $('.web_ui_Text_text').eq(1).text().split(' ')[0] || '0';

        return {
            statusCode: 200,
            body: JSON.stringify({
                abonnés: followers,
                note: rating,
                evaluations: evaluations
            })
        };
    } catch (error) {
        console.error('Erreur:', error);
        return { statusCode: 500, body: JSON.stringify({ error: "Erreur d'analyse" }) };
    }
};

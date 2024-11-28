const fetch = require('node-fetch');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        console.log('URL reçue:', vintedUrl);
        
        // Extraire l'ID utilisateur de l'URL Vinted
        const userId = vintedUrl.split('/member/')[1].split('-')[0];
        console.log('UserId extrait:', userId);
        
        // Appel à l'API Vinted
        const response = await fetch(`https://www.vinted.fr/api/v2/users/${userId}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const userData = await response.json();
        console.log('Réponse API:', userData);
        
        // Vérifier si on a bien les données
        const totalItems = userData.items_count || 0;
        const totalSold = userData.sold_items_count || 0;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                totalItems,
                totalSold,
                totalLikes: 'à venir',
                avgPrice: 'à venir'
            })
        };
    } catch (error) {
        console.error('Erreur détaillée:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Erreur: ${error.message}` })
        };
    }
};

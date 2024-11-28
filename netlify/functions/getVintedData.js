const fetch = require('node-fetch');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        console.log('URL reçue:', vintedUrl);
        
        // Extraire l'ID utilisateur de l'URL Vinted
        const userId = vintedUrl.split('/member/')[1].split('-')[0];
        console.log('UserId extrait:', userId);
        
        // Appel à l'API Vinted publique
        const response = await fetch(`https://www.vinted.fr/api/v2/public/users/${userId}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'fr-FR,fr;q=0.9',
                'Referer': 'https://www.vinted.fr'
            }
        });

        const userData = await response.json();
        console.log('Réponse API:', userData);
        
        if (userData.error) {
            throw new Error(userData.error);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                totalItems: userData.items_count || 0,
                totalSold: userData.sold_items_count || 0,
                totalLikes: 'Bientôt disponible',
                avgPrice: 'Bientôt disponible'
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

const fetch = require('node-fetch');
const fetch = require('node-fetch');
exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        
        // Extraire l'ID utilisateur de l'URL Vinted
        const userId = vintedUrl.split('/member/')[1].split('-')[0];
        
        // Appel à l'API Vinted
        const response = await fetch(`https://www.vinted.fr/api/v2/users/${userId}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const userData = await response.json();
        
        // Récupérer les statistiques de l'utilisateur
        const totalItems = userData.items_count || 0;
        const totalSold = userData.sold_items_count || 0;
        // Les likes nécessitent un appel supplémentaire à l'API items

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
        console.error('Erreur:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Une erreur s'est produite lors de l'analyse du profil" })
        };
    }
};

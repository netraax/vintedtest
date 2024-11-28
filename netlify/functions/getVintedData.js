const fetch = require('node-fetch');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        console.log('URL reçue:', vintedUrl);
        
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
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                totalItems: userData.items_count || 0,
                totalSold: userData.sold_items_count || 0,
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

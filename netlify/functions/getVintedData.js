const fetch = require('node-fetch');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        console.log('URL reçue:', vintedUrl);
        
        const userId = vintedUrl.split('/member/')[1].split('-')[0];
        console.log('UserId extrait:', userId);
        
        const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?user_id=${userId}&per_page=1`, {
            headers: {
                'Accept': '*/*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
                'Accept-Language': 'fr-FR,fr;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        // Vérifier si la réponse est ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Récupérer le texte brut d'abord
        const text = await response.text();
        console.log('Réponse brute:', text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Erreur parsing JSON:', e);
            throw new Error('Impossible de parser la réponse de Vinted');
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                totalItems: data.metadata?.total_entries || 0,
                totalSold: "Information non disponible",
                totalLikes: "Information non disponible",
                avgPrice: "Information non disponible"
            })
        };
    } catch (error) {
        console.error('Erreur détaillée:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "Erreur lors de l'analyse du profil",
                details: error.message 
            })
        };
    }
};

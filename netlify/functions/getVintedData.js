const fetch = require('node-fetch');

exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        // Get user ID from URL
        const userId = vintedUrl.split('/member/')[1]?.split('-')[0];
        
        const response = await fetch(`https://www.vinted.fr/api/v2/users/${userId}/items?per_page=1`, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({
                itemsCount: data.user?.total_items_count || 0,
                rating: data.user?.feedback_reputation || 0,
                transactions: data.user?.transaction_count || 0
            })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

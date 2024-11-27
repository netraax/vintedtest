exports.handler = async function(event) {
    try {
        const vintedUrl = JSON.parse(event.body).url;
        
        // Simulation de données pour le moment
        return {
            statusCode: 200,
            body: JSON.stringify({
                totalItems: 42,
                totalSold: 156,
                totalLikes: 873,
                avgPrice: "15.99€"
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Une erreur s'est produite" })
        }
    }
}

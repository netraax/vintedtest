const { Configuration, OpenAIApi } = require('openai');

// Fonction principale
exports.handler = async function (event) {
    // Configuration de l'API OpenAI
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY, // Charge la clé depuis les variables d'environnement
    });
    const openai = new OpenAIApi(configuration);

    try {
        // Récupère l'image envoyée via le body de la requête
        const { image } = JSON.parse(event.body);

        // Appelle l'API OpenAI pour analyser l'image
        const response = await openai.createImageAnalysis({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyse cette capture d'écran de profil Vinted et extrait : nombre d'articles en vente, articles vendus, et évaluations.",
                        },
                        {
                            type: "image_url",
                            image_url: image,
                        },
                    ],
                },
            ],
        });

        // Retourne les données en réponse
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        // Gestion des erreurs
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

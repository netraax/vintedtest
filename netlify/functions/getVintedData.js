const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event) {
    try {
        // Parse l'image reçue dans la requête
        const { image } = JSON.parse(event.body);

        // Configuration de l'API OpenAI
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY, // Récupère la clé API depuis les variables d'environnement
        });
        const openai = new OpenAIApi(configuration);

        // Appel à l'API OpenAI pour analyser l'image
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

        // Retourne les données analysées
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error("Erreur pendant l'analyse :", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

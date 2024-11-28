// Ne pas oublier d'ajouter require('dotenv').config() au début de ton fichier
require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env

const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event) {
    try {
        // Utiliser la clé API depuis les variables d'environnement
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,  // Vérifie que la clé est bien récupérée
        });
        const openai = new OpenAIApi(configuration);

        // Traitement de l'image reçue dans la requête
        const { image } = JSON.parse(event.body);

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

        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error("Erreur :", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

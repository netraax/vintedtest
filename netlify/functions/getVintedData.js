const { Configuration, OpenAIApi } = require('openai');

exports.handler = async function(event) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY // On mettra la clé dans les variables d'environnement Netlify
    });
    const openai = new OpenAIApi(configuration);

    try {
        const { image } = JSON.parse(event.body);
        
        const response = await openai.createImageAnalysis({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyse cette capture d'écran de profil Vinted et extrait : nombre d'articles en vente, articles vendus, et évaluations."
                        },
                        {
                            type: "image_url",
                            image_url: image
                        }
                    ]
                }
            ]
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

const tesseract = require("tesseract.js");

exports.handler = async function (event) {
    const { image } = JSON.parse(event.body);

    try {
        // 1. Extraire le texte de l'image
        const { data: { text } } = await tesseract.recognize(image);

        // 2. Analyser avec GPT
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: `Voici un texte extrait d'une capture d'écran Vinted : "${text}". 
                    Analyse et donne les informations suivantes : 
                    - Nombre d'articles en vente
                    - Nombre d'articles vendus
                    - Nombre d'évaluations.`,
                },
            ],
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data.choices[0].message.content),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

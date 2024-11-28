const { createWorker } = require('tesseract.js');

exports.handler = async function(event) {
    try {
        const imageData = JSON.parse(event.body).image;
        
        const worker = await createWorker('fra');
        const { data: { text } } = await worker.recognize(imageData);
        await worker.terminate();

        // Extraire les chiffres avec des regex
        const matches = {
            articlesEnVente: text.match(/(\d+)\s*articles? en vente/i)?.[1] || '0',
            articlesVendus: text.match(/(\d+)\s*articles? vendus/i)?.[1] || '0',
            evaluations: text.match(/(\d+)\s*évaluations?/i)?.[1] || '0'
        };

        return {
            statusCode: 200,
            body: JSON.stringify(matches)
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};

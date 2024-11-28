const { createWorker } = require('tesseract.js');

exports.handler = async function(event) {
    try {
        if (!event.body) {
            throw new Error('No image data received');
        }

        const imageData = JSON.parse(event.body).image;
        console.log('Received image data, starting OCR...');

        const worker = await createWorker('fra');
        console.log('Worker created');

        const { data: { text } } = await worker.recognize(imageData);
        console.log('OCR text extracted:', text);

        await worker.terminate();

        // Extraire les chiffres du texte
        const numbers = {
            articlesEnVente: text.match(/(\d+)\s*articles? en vente/i)?.[1] || '0',
            articlesVendus: text.match(/(\d+)\s*articles? vendus/i)?.[1] || '0',
            evaluations: text.match(/(\d+)\s*évaluations?/i)?.[1] || '0'
        };

        console.log('Extracted numbers:', numbers);

        return {
            statusCode: 200,
            body: JSON.stringify(numbers)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

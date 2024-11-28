const playwright = require('playwright-aws-lambda');

exports.handler = async function(event) {
    let browser = null;
    try {
        const vintedUrl = JSON.parse(event.body).url;
        console.log('URL reçue:', vintedUrl);

        // Lancer le navigateur
        browser = await playwright.launchChromium();
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Aller sur la page
        await page.goto(vintedUrl, { waitUntil: 'networkidle' });

        // Extraire les données
        const data = await page.evaluate(() => {
            const items = document.querySelectorAll('.feed-grid__item');
            return {
                totalItems: items.length || 0
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                totalItems: data.totalItems,
                totalSold: "Bientôt disponible",
                totalLikes: "Bientôt disponible",
                avgPrice: "Bientôt disponible"
            })
        };

    } catch (error) {
        console.error('Erreur:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erreur lors de l'analyse du profil" })
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

const chromium = require('chrome-aws-lambda');

exports.handler = async function(event) {
    let browser = null;
    try {
        const vintedUrl = JSON.parse(event.body).url;
        console.log('URL reçue:', vintedUrl);

        // Lancer le navigateur
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(vintedUrl, { waitUntil: 'networkidle0' });

        // Extraire les données
        const data = await page.evaluate(() => {
            const items = document.querySelectorAll('.feed-grid__item');
            const likes = document.querySelectorAll('.item-likes');
            const prices = document.querySelectorAll('.item-price');

            return {
                totalItems: items.length,
                totalLikes: Array.from(likes).reduce((acc, like) => acc + parseInt(like.textContent) || 0, 0),
                avgPrice: Array.from(prices).reduce((acc, price) => {
                    const value = parseFloat(price.textContent.replace('€', '').trim()) || 0;
                    return acc + value;
                }, 0) / (prices.length || 1)
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                totalItems: data.totalItems,
                totalSold: "Information à venir",
                totalLikes: data.totalLikes,
                avgPrice: `${data.avgPrice.toFixed(2)}€`
            })
        };

    } catch (error) {
        console.error('Erreur:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erreur lors de l'analyse du profil" })
        };
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};

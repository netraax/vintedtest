const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event) {
    let browser = null;
    try {
        const vintedUrl = JSON.parse(event.body).url;
        
        browser = await puppeteer.launch({
            args: [...chromium.args, '--no-sandbox'],
            executablePath: await chromium.executablePath(),
            headless: "new"
        });

        const page = await browser.newPage();
        await page.goto(vintedUrl, {waitUntil: 'networkidle0'});

        console.log('Analysant la page...');
        const stats = await page.evaluate(() => {
            // Fonction helper pour extraire le texte
            const getStats = () => {
                const allStats = Array.from(document.querySelectorAll('.web_ui__Text__text'));
                const stats = {
                    articlesEnVente: 0,
                    articlesVendus: 0,
                    tauxDeConversion: '0%'
                };

                allStats.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('vente')) {
                        stats.articlesEnVente = parseInt(text) || 0;
                    } else if (text.includes('vendu')) {
                        stats.articlesVendus = parseInt(text) || 0;
                    }
                });

                // Calculer le taux de conversion
                if (stats.articlesVendus > 0) {
                    const total = stats.articlesEnVente + stats.articlesVendus;
                    stats.tauxDeConversion = `${((stats.articlesVendus / total) * 100).toFixed(1)}%`;
                }

                return stats;
            };

            return getStats();
        });

        console.log('Stats trouvées:', stats);
        return { statusCode: 200, body: JSON.stringify(stats) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    } finally {
        if (browser) await browser.close();
    }
};

const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event) {
    let browser = null;
    try {
        const vintedUrl = JSON.parse(event.body).url;
        
        browser = await puppeteer.launch({
            args: [...chromium.args, '--no-sandbox'],
            executablePath: await chromium.executablePath(),
            headless: "new",
            timeout: 5000
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(5000);
        await page.goto(vintedUrl, {waitUntil: 'domcontentloaded'});

        const stats = await page.evaluate(() => {
            const numberFromText = text => parseInt(text.match(/\d+/)?.[0] || '0');
            const allDivs = document.querySelectorAll('div');
            let enVente = 0;
            let vendus = 0;

            allDivs.forEach(div => {
                const text = div.textContent;
                if (text.includes('en vente')) enVente = numberFromText(text);
                if (text.includes('vendus')) vendus = numberFromText(text);
            });

            return {enVente, vendus};
        });

        return { statusCode: 200, body: JSON.stringify(stats) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    } finally {
        if (browser) await browser.close();
    }
};

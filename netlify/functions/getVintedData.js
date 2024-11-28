const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event) {
    let browser = null;
    try {
        const vintedUrl = JSON.parse(event.body).url;

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto(vintedUrl, { waitUntil: 'networkidle0' });

        const stats = await page.evaluate(() => {
            const getText = selector => document.querySelector(selector)?.textContent.trim() || 'N/A';

            return {
                articles: getText('.web_ui__Cell__cell span'),
                rating: getText('.web_ui__Rating__rating'),
                evaluations: getText('.web_ui__Text__text:contains("évaluation")')
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify(stats)
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    } finally {
        if (browser) await browser.close();
    }
};

const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event) {
    let browser = null;
    try {
        const vintedUrl = JSON.parse(event.body).url;
        
        browser = await puppeteer.launch({
            args: [...chromium.args, '--no-sandbox'],
            executablePath: await chromium.executablePath(),
            headless: true,
            timeout: 8000
        });

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(8000);
        await page.goto(vintedUrl);

        const stats = await page.evaluate(() => ({
            articles: document.querySelector('.profile__items-count')?.textContent || '0',
            evaluations: document.querySelector('.profile__rating')?.textContent || '0',
            abonnés: document.querySelector('.profile__followers')?.textContent || '0'
        }));

        return { statusCode: 200, body: JSON.stringify(stats) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    } finally {
        if (browser) await browser.close();
    }
};

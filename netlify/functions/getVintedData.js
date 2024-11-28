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
           console.log('HTML Content:', document.body.innerHTML);
           
           const getTextContent = selector => {
               const elements = document.querySelectorAll(selector);
               console.log(`Elements found for ${selector}:`, elements.length);
               return Array.from(elements).map(el => el.textContent);
           };

           const stats = {
               allText: getTextContent('.web-ui__Text__text'),
               divText: getTextContent('div'),
               spanText: getTextContent('span'),
               htmlSample: document.body.innerHTML.substring(0, 500)
           };

           console.log('Stats found:', stats);
           return stats;
       });

       return { 
           statusCode: 200, 
           body: JSON.stringify({
               debug: stats,
               parsed: {
                   enVente: stats.allText.find(t => t.includes('en vente')),
                   vendus: stats.allText.find(t => t.includes('vendus'))
               }
           })
       };
   } catch (error) {
       return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
   } finally {
       if (browser) await browser.close();
   }
};

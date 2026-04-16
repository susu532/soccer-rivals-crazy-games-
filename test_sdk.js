const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('about:blank');
    await page.addScriptTag({ url: 'https://sdk.crazygames.com/crazygames-sdk-v3.js' });
    const methods = await page.evaluate(() => {
        return Object.getOwnPropertyNames(window.CrazyGames.SDK.__proto__);
    });
    console.log("SDK proto methods:", methods);
    
    // Also log SDK keys
    const keys = await page.evaluate(() => {
        return Object.keys(window.CrazyGames.SDK);
    });
    console.log("SDK keys:", keys);
    
    await browser.close();
})();

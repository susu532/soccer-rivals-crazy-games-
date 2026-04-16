import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('about:blank');
    await page.addScriptTag({ url: 'https://sdk.crazygames.com/crazygames-sdk-v3.js' });
    const keys = await page.evaluate(() => {
        return window.CrazyGames ? Object.keys(window.CrazyGames) : [];
    });
    console.log("CrazyGames keys:", keys);
    const sdkKeys = await page.evaluate(() => {
        return window.CrazyGames && window.CrazyGames.SDK ? Object.keys(window.CrazyGames.SDK) : [];
    });
    console.log("SDK keys:", sdkKeys);
    
    // Check if initialized
    await new Promise(r => setTimeout(r, 1000));
    const initError = await page.evaluate(() => {
        try {
            window.CrazyGames.SDK.data.getItem('test');
            return null;
        } catch(e) {
            return e.message;
        }
    });
    console.log("Data getItem error:", initError);
    await browser.close();
})();

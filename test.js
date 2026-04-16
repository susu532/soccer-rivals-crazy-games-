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
    
    // Also check game keys and init
    const gameKeys = await page.evaluate(() => {
        return window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game ? Object.keys(window.CrazyGames.SDK.game) : [];
    });
    console.log("SDK.game keys:", gameKeys);
    
    await browser.close();
})();

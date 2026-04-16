import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('about:blank');
    await page.addScriptTag({ url: 'https://sdk.crazygames.com/crazygames-sdk-v3.js' });
    
    // Wait for the script to load
    await new Promise(r => setTimeout(r, 1000));
    
    const gameMethods = await page.evaluate(() => {
        if (!window.CrazyGames || !window.CrazyGames.SDK || !window.CrazyGames.SDK.game) return "No SDK.game";
        return Object.getOwnPropertyNames(Object.getPrototypeOf(window.CrazyGames.SDK.game));
    });
    console.log("game Methods:", gameMethods);
    
    const adMethods = await page.evaluate(() => {
        if (!window.CrazyGames || !window.CrazyGames.SDK || !window.CrazyGames.SDK.ad) return "No SDK.ad";
        return Object.getOwnPropertyNames(Object.getPrototypeOf(window.CrazyGames.SDK.ad));
    });
    console.log("ad Methods:", adMethods);

    await browser.close();
})();

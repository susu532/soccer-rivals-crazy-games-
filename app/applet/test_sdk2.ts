import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('about:blank');
    await page.addScriptTag({ url: 'https://sdk.crazygames.com/crazygames-sdk-v3.js' });
    
    // Wait for the script to load
    await new Promise(r => setTimeout(r, 1000));
    
    const isReady = await page.evaluate(() => {
        return window.CrazyGames !== undefined;
    });
    console.log("Is ready:", isReady);
    
    const props = await page.evaluate(() => {
        if (!window.CrazyGames) return null;
        if (!window.CrazyGames.SDK) return "SDK not found";
        
        let methods = [];
        let obj = window.CrazyGames.SDK;
        while(obj) {
            methods = methods.concat(Object.getOwnPropertyNames(obj));
            obj = Object.getPrototypeOf(obj);
        }
        return methods;
    });
    console.log("SDK props/methods:", props);

    await browser.close();
})();

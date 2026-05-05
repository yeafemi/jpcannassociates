import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    page.on('requestfailed', request => console.log('REQ FAILED:', request.url(), request.failure().errorText));

    console.log("Navigating to live site...");
    await page.goto('https://yeafemi.github.io/jpcannassociates/', {waitUntil: 'networkidle0'});
    
    const rootHtml = await page.$eval('#root', el => el.innerHTML);
    console.log("Root element content length:", rootHtml.length);
    
    if (rootHtml.length < 10) {
      console.log("Root element is virtually empty! (White Screen)");
    } else {
      console.log("Root element has content! Site seems to be rendering.");
    }
    
    await browser.close();
  } catch (err) {
    console.error("Script error:", err);
  }
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error')
      console.log(`[Browser Console Error]: ${msg.text()}`);
  });
  
  page.on('pageerror', exception => {
    console.log(`[Browser Page Error]: ${exception}`);
  });
  
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  await browser.close();
})();

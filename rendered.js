const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  const content = await page.content();
  fs.writeFileSync('rendered_contact.html', content);
  
  await browser.close();
})();

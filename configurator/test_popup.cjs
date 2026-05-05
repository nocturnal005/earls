const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen to console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:5500/configurator/dist/index.html');
  await page.waitForTimeout(2000);
  
  // Click SIZE panel
  await page.evaluate(() => {
    const panels = document.querySelectorAll('[data-divider-row="true"]');
    panels[1].querySelector('div').click();
  });
  await page.waitForTimeout(1000);
  
  // Click Info button
  await page.evaluate(() => {
    document.querySelector('button[aria-label="SuperResolution info"]').click();
  });
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: 'test_popup_script.png' });
  await browser.close();
  console.log("Done");
})();

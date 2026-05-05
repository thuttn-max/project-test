const { test, expect } = require('@playwright/test');

test('measure home page performance', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: 'test',
            password: '123456xX',
        },
    });

    const page = await context.newPage();

    const start = Date.now();

    await page.goto('https://girlsbaito.jp/kanto', {
        waitUntil: 'domcontentloaded',
    });

    // Chờ nội dung chính của trang home hiển thị
    await expect(page.locator('body')).toContainText(/お仕事を探す|新着の求人情報|体入/);

    const domReady = Date.now();

    await page.waitForLoadState('networkidle');

    const fullyLoaded = Date.now();

    console.log(`Home DOM ready time: ${domReady - start} ms`);
    console.log(`Home fully loaded time: ${fullyLoaded - start} ms`);

    console.log(`Home DOM ready time: ${((domReady - start) / 1000).toFixed(2)} s`);
    console.log(`Home fully loaded time: ${((fullyLoaded - start) / 1000).toFixed(2)} s`);

    expect(domReady - start).toBeLessThan(20000);
    expect(fullyLoaded - start).toBeLessThan(30000);

    await context.close();
});
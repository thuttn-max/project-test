const { test, expect } = require('@playwright/test');

test('measure mypage login loading time', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: 'test',
            password: '123456xX',
        },
    });

    const page = await context.newPage();

    await page.goto('https://test.check-girls-baito.xyz/mypage', {
        waitUntil: 'domcontentloaded',
    });

    // Chờ form login hiển thị
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();

    // Nhập thông tin login
    await page.fill('input[name="email"]', 'cn7@mailinator.com');
    await page.fill('input[name="password"]', '123456789');

    // Bắt đầu tính từ lúc đã nhập xong thông tin và nhấn submit
    const start = Date.now();

    await Promise.all([
        page.waitForURL(/mypage/),
        page.locator('button[type="submit"], input[type="submit"]').click(),
    ]);

    // Chờ nội dung chính của mypage hiển thị
    await expect(page.locator('body')).toContainText(/マイページ|キープ中|応募済み|スマート体入/);

    const domReady = Date.now();

    // Chờ network ổn định sau khi vào mypage
    await page.waitForLoadState('networkidle');

    const fullyLoaded = Date.now();

    console.log(`Mypage login to DOM ready time: ${domReady - start} ms`);
    console.log(`Mypage login to fully loaded time: ${fullyLoaded - start} ms`);

    console.log(`Mypage login to DOM ready time: ${((domReady - start) / 1000).toFixed(2)} s`);
    console.log(`Mypage login to fully loaded time: ${((fullyLoaded - start) / 1000).toFixed(2)} s`);

    await context.close();
});
const { test, expect } = require('@playwright/test');

test('measure time from work list click to detail page fully displayed', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: 'test',
            password: '123456xX',
        },
    });

    const page = await context.newPage();

    await page.goto('https://test.check-girls-baito.xyz/kanto/archive?search_mode=detail&d_work_sulury_type=&d_min_salary=&d_max_salary=&d_search=');
    await page.waitForLoadState('networkidle');

    const firstWorkLink = page.locator('a[href$="/single"]:visible').first();
    await expect(firstWorkLink).toBeVisible();

    const href = await firstWorkLink.getAttribute('href');
    console.log('First work href:', href);

    const start = Date.now();

    await firstWorkLink.click();

    // Chờ URL chuyển đúng sang work detail
    await expect(page).toHaveURL(/\/\d+\/single/);

    // Chờ nội dung đặc trưng của detail page hiện ra
    await expect(page.getByText('店舗情報').first()).toBeVisible();

    const end = Date.now();
    const duration = end - start;

    console.log(`Time from work list to fully loaded detail page: ${duration} ms`);

    expect(duration).toBeLessThan(7000);
});
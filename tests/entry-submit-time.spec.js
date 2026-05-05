const { test, expect } = require('@playwright/test');

test('measure entry form submit time', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: 'test',
            password: '123456xX',
        },
    });

    const page = await context.newPage();

    await page.goto('https://test.check-girls-baito.xyz/kanto/entry?id=19924');

    await page.fill('input[name="first_name"]', 'テスト');
    await page.fill('input[name="last_name"]', 'テス');
    await page.fill('input[name="furigana_first_name"]', 'さとう');
    await page.fill('input[name="furigana_last_name"]', 'さとう');
    await page.fill('input[name="email"]', 'user1@mailinator.com');
    await page.fill('input[name="tel"]', '09012345678');
    await page.fill('input[name="date1"]', '2026/05/04');

    const start = Date.now();

    // Bước 1: từ form nhập sang confirm
    await page.click('button[type="submit"]');

    // Chờ tới trang confirm và nút gửi cuối cùng xuất hiện
    await expect(page.locator('#send_btn')).toBeVisible();

    // Bước 2: bấm gửi ở trang confirm
    await page.click('#send_btn');

    // Thành công khi modal success xuất hiện
    const successModal = page.locator('.modal-content.modal-success');
    await expect(successModal).toBeVisible();

    const end = Date.now();
    const submitTime = end - start;

    console.log(`Submit flow time until success modal: ${submitTime} ms`);

    expect(submitTime).toBeLessThan(7000);
});
const { test, expect } = require('@playwright/test');

test('measure time from form filled to collect entry complete', async ({ browser }) => {
    const context = await browser.newContext({
        httpCredentials: {
            username: 'test',
            password: '123456xX',
        },
    });

    const page = await context.newPage();

    await page.goto(
        'https://test.check-girls-baito.xyz/kanto/archive?search_mode=detail&d_work_sulury_type=&d_min_salary=&d_max_salary=&d_search='
    );

    await page.waitForLoadState('networkidle');

    // Chọn 3 job まとめて応募
    const collectLabels = page.locator(
        'label.js_collect_chk.collect_chk:has-text("まとめて応募")'
    );

    await expect(collectLabels.nth(0)).toBeVisible();
    await expect(collectLabels.nth(1)).toBeVisible();
    await expect(collectLabels.nth(2)).toBeVisible();

    await collectLabels.nth(0).click();
    await collectLabels.nth(1).click();
    await collectLabels.nth(2).click();

    // Click button まとめて応募 để vào collect_entry
    const resultButton = page.locator('#btn_result');
    await expect(resultButton).toBeVisible();

    await Promise.all([
        page.waitForURL(/collect_entry/),
        resultButton.click(),
    ]);

    await expect(
        page.locator('body > main > section > div.divider.maxDivider540 > h4')
    ).toHaveText('まとめて応募');

    // Điền form
    await page.fill('input[name="first_name"]', 'テスト');
    await page.fill('input[name="last_name"]', 'テス');
    await page.fill('input[name="furigana_first_name"]', 'さとう');
    await page.fill('input[name="furigana_last_name"]', 'さとう');
    await page.fill('input[name="email"]', 'user1@mailinator.com');
    await page.fill('input[name="tel"]', '09012345678');
    await page.fill('input[name="date01"]', '2026/05/04');

    // Bắt đầu tính từ thời điểm đã điền đầy đủ thông tin
    const start = Date.now();

    // Click confirm
    const confirmButton = page.locator(
        'body > main > section > div.collectentry_section__inner > form > div > button[type="submit"]'
    );

    await expect(confirmButton).toBeVisible();

    await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        confirmButton.click(),
    ]);

    // Màn xác nhận -> click send_btn
    const sendButton = page.locator('button[name="send_btn"], input[name="send_btn"]');
    await expect(sendButton).toBeVisible();

    await Promise.all([
        page.waitForURL(/collect_entry-complete/),
        sendButton.click(),
    ]);

    await page.waitForLoadState('domcontentloaded');

    const end = Date.now();
    const duration = end - start;

    console.log(`Time from form filled to complete: ${duration} ms`);
    console.log(`Time from form filled to complete: ${(duration / 1000).toFixed(2)} s`);

    expect(duration).toBeLessThan(5000);

    await context.close();
});
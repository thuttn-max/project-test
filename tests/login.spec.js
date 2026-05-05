const { test, expect } = require('@playwright/test');

test('Login thành công với account hợp lệ', async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: {
      username: 'test',
      password: '123456xX',
    },
  });

  const page = await context.newPage();

  await page.goto('https://test.check-girls-baito.xyz/login');

  await page.fill('input[type="email"]', 'cn7@mailinator.com');
  await page.fill('input[type="password"]', '123456789');
  const start = Date.now();

  await Promise.all([
    page.waitForURL(/.*mypage.*/),
    page.locator('button[type="submit"], input[type="submit"]').click(),
  ]);
  // loading xong mypage
  await expect(page.locator('body')).toContainText(/キープ中|各種設定/); // đợit text hiển thị 
  await page.waitForLoadState('networkidle');
  const fullyLoaded = Date.now();
  console.log(`Mypage login to fully loaded time: ${fullyLoaded - start} ms`);
  await context.close();
  // check login có ok ko 

});

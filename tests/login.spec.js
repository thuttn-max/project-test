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
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/.*mypage.*/);
});

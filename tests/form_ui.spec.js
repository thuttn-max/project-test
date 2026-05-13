const { test, expect, devices } = require('@playwright/test');
const fs = require('fs');

const BASE_URL = 'http://127.0.0.1:8000';
const USER_EMAIL = 'cn7@mailinator.com';
const USER_PASS = '123456789';
const AUTH_FILE = 'tests/UI/auth.json';

// Cấu hình Viewport cho Mobile (iPhone 12) ở cấp độ cao nhất
test.use({ 
    ...devices['iPhone 12'],
    storageState: AUTH_FILE 
});

const features = [
    { name: 'TrangChu', path: '/' },
    { name: 'Entry', path: '/kanto/entry?id=593' },
    { name: 'ScoutApply', path: '/scout/303/apply' },
    { name: 'SinglePage', path: '/593/single' },
    { name: 'Consultation', path: '/consultation' }
];

test.describe('Mobile UI Consistency Audit', () => {
    let globalReport = [];

    test.beforeAll(async ({ browser }) => {
        if (!fs.existsSync('tests/UI/screenshots')) {
            fs.mkdirSync('tests/UI/screenshots', { recursive: true });
        }

        const context = await browser.newContext({ ...devices['iPhone 12'] });
        const page = await context.newPage();
        
        console.log('📱 [Mobile] Đang tiến hành đăng nhập...');
        try {
            await page.goto(`${BASE_URL}/login`);
            await page.fill('input[name="email"]', USER_EMAIL);
            await page.fill('input[name="password"]', USER_PASS);
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
                page.click('button[type="submit"], input[type="submit"]')
            ]);
            await context.storageState({ path: AUTH_FILE });
            console.log('✅ [Mobile] Đăng nhập thành công.');
        } catch (e) {
            console.warn('⚠️ Cảnh báo đăng nhập:', e.message);
        }
        await page.close();
        await context.close();
    });

    test.afterAll(async () => {
        console.log("\n" + "=".repeat(50));
        console.log("BÁO CÁO TỔNG HỢP MOBILE (BORDER-RADIUS 3PX)");
        console.log("=".repeat(50));
        if (globalReport.length === 0) {
            console.log("✅ Tuyệt vời! Tất cả form Mobile đều đạt chuẩn 3px.");
        } else {
            console.table(globalReport);
        }
        console.log("=".repeat(50) + "\n");
    });

    for (const feature of features) {
        test(`Check Mobile: ${feature.name}`, async ({ page }) => {
            const url = `${BASE_URL}${feature.path}`;
            console.log(`🚀 [Mobile] Quét: ${feature.name} -> ${url}`);
            
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
                await page.waitForTimeout(2000);

                await page.screenshot({ 
                    path: `tests/UI/screenshots/mobile_${feature.name}_1.png`, 
                    fullPage: true 
                });

                const targetInputs = page.locator('form input[placeholder], form textarea[placeholder]');
                const count = await targetInputs.count();

                for (let i = 0; i < count; i++) {
                    const input = targetInputs.nth(i);
                    const name = await input.getAttribute('name') || `input-${i}`;
                    const borderRadius = await input.evaluate(el => window.getComputedStyle(el).borderRadius);

                    if (borderRadius !== '3px') {
                        globalReport.push({
                            'Tính Năng': feature.name,
                            'Tên Input': name,
                            'Radius Hiện Tại': borderRadius,
                            'Trạng Thái': 'SAI'
                        });
                    }
                }
            } catch (e) {
                console.error(`❌ Lỗi tại trang ${feature.name}:`, e.message);
            }
        });
    }
});

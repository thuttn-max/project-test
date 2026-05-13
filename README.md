# girls-baito-automation

Project chạy thử automation test cho website GirlsBaito.

## Cài đặt

```bash
npm install
npx playwright install
npx playwright test
npx playwright test --headed
```

## Ghi video (recordings)

- **Đường dẫn lưu:** `test-results/videos/`
- **Mô tả:** Playwright được cấu hình để ghi video cho mỗi test; video được lưu trong thư mục trên dưới dạng file `.webm`.
- **Chạy tests và tạo video:**
	```bash
	npm install
	npx playwright install
	npm test
	```
- **Xem video:** Mở file `.webm` trong `test-results/videos/` bằng trình phát video (VLC, Windows Media Player) hoặc xem báo cáo Playwright tại `playwright-report/index.html`.
- **File cấu hình:** Cấu hình ghi video nằm trong `playwright.config.js`.

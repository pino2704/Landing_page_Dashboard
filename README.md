# Dashboard Kiểm định và Xếp hạng — landing page

Website marketing độc lập, tiếng Việt, tại `/`. HTML, CSS và JavaScript thuần; không có bước build, backend, tài khoản hay thư viện giao diện. Nội dung gốc: `Spec/PLAN_WEB_OPENDESIGN_DASHBOARD_SITE_RIENG.md`.

## Chạy preview

Mở PowerShell tại thư mục `Landing_page_Dashboard`, chạy:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Truy cập <http://127.0.0.1:4173/> và giữ cửa sổ chạy server mở. Link này chỉ hoạt động khi server đang chạy; đóng server hoặc khởi động lại máy sẽ làm link mất kết nối. Máy cần Python 3 cho lệnh server trên. Server chỉ nghe trên máy cục bộ.

Để xem không cần server, mở `index.html` trực tiếp bằng Chrome hoặc Edge từ thư mục dự án. Giữ nguyên các file CSS, JavaScript, ảnh và font bên cạnh; không sao chép riêng file HTML sang thư mục khác.

## Mã nguồn

- `index.html`: 8 section DB-S01–DB-S08, metadata và nội dung tiếng Việt.
- `styles.css`: design tokens, Be Vietnam Pro, responsive, focus và reduced motion.
- `app.js`: mobile menu, tab có bàn phím, chọn ảnh, walkthrough, lightbox.
- `assets/fonts/`: Be Vietnam Pro 400/600/700, lưu cục bộ; giấy phép SIL Open Font License trong `OFL.txt`.
- `Real_System/`: ảnh gốc được tham chiếu trực tiếp, không sửa dữ liệu hoặc tỷ lệ.
- `tests/smoke.js`: kiểm thử trình duyệt bằng Playwright CLI.

Màu navy/xanh dương, kiểu chữ và dấu hình học cạnh tên sản phẩm là lựa chọn thiết kế cho bản preview, chưa phải nhận diện thương mại được phê duyệt. Không sử dụng logo TDTU/DTQA làm nhận diện website.

## Tương tác

- Menu sticky; liên kết Kiểm định/Xếp hạng vừa cuộn vừa chọn đúng tab.
- Tab hỗ trợ mũi tên trái/phải, Home, End; Tab chuyển đến nội dung.
- Các bộ chọn ảnh giữ nguyên ảnh thật và chú thích đúng bối cảnh.
- Walkthrough có 4 bước, cập nhật ảnh, nội dung và trạng thái; đây là minh họa trên ảnh, không kết nối Dashboard đang chạy.
- Lightbox dùng dialog có focus trap của trình duyệt, nút đóng, Escape, trả focus và chế độ kích thước ảnh gốc.
- FAQ dùng `details/summary`, hỗ trợ bàn phím.
- Nội dung chính rút gọn thành nhãn, KPI và các bước. Ảnh chiếm trọn chiều ngang phần khám phá; ngữ cảnh ảnh, giới hạn dữ liệu và điều kiện triển khai nằm trong mục mở rộng. FAQ mặc định đóng.
- CTA chỉ điều hướng đến section có thật. Không có form gửi dữ liệu hoặc thông báo gửi thành công.

## Giới hạn nội dung được giữ rõ

- 140 là số hồ sơ CTĐT; 65 là số đợt đánh giá; 51 GCN còn hiệu lực thuộc 48 CTĐT. Mốc nguồn 30/09/2026, chờ phê duyệt công bố.
- Ảnh `DB_WEB_03_program_detail.png` thực tế là danh sách minh chứng AUN-QA, không phải màn hình chi tiết riêng của một chương trình; caption phản ánh đúng điều này.
- Ảnh tổng quan dùng ngưỡng 12 tháng; ảnh cảnh báo dùng 24 tháng. Walkthrough ghi rõ đây là các góc nhìn riêng, không khẳng định kết quả của cùng một bộ lọc.
- Ảnh xếp hạng có chỉ tiêu chưa có số thực hiện. Không dùng mục tiêu hoặc ô trống để tuyên bố kết quả.
- `DB_WEB_05_admin_preview.png` đã được xem xét nhưng không nhúng vào website vì hiển thị thông tin môi trường và mã phiên bản. Dùng sơ đồ quy trình khái quát theo Spec.
- Không có kết nối hay sửa mã nguồn Dashboard nghiệp vụ hoặc dự án T-CORA.

## Kiểm thử

Sau khi bật server, chạy từ thư mục dự án:

```powershell
npx.cmd --yes --package @playwright/cli playwright-cli -s=dashboard-landing open http://127.0.0.1:4173 --browser chrome
npx.cmd --yes --package @playwright/cli playwright-cli -s=dashboard-landing run-code --filename tests/smoke.js
```

Lệnh dùng npm cache, không cài công cụ toàn hệ thống. Cần Node/npm, Chrome và truy cập npm nếu CLI chưa có trong cache. Kết quả kiểm tra có lỗi sẽ ném lỗi; thành công trả về danh sách kích thước và các mảng lỗi rỗng.

Kiểm tra trên Chromium tại 1440, 768, 390 và 375px: số section, headline, liên kết nội bộ, menu mobile, tab/bàn phím, bộ chọn ảnh, 4 bước walkthrough, lightbox/zoom/Escape/focus, FAQ, CTA, font cục bộ, ảnh đúng tỷ lệ, reduced motion, overflow, console và lỗi tài nguyên. Ảnh kiểm tra nằm tại `output/playwright/` và không nằm trong nguồn phát hành.

## Cần phê duyệt trước khi public

1. Chủ thể đứng tên, quyền giới thiệu/chuyển giao thương mại, tên và nhận diện sản phẩm.
2. Quyền công bố screenshot, dữ liệu, các nhãn/logo đã có bên trong ảnh và KPI tại TDTU.
3. Email, form hoặc lịch đặt hẹn thật; thay `TODO: Approved contact channel` và chỉ kích hoạt CTA khi điểm tiếp nhận được xác minh. Nếu thu lead, cần thông báo xử lý dữ liệu phù hợp.
4. Phạm vi demo/dùng thử, cấu hình, triển khai, hạ tầng và hỗ trợ thực tế.
5. Tên miền marketing và nơi deploy riêng. Không mặc định dùng tên miền Dashboard nghiệp vụ.

Hiện có `noindex, nofollow` cho bản preview; đây không phải biện pháp kiểm soát truy cập. Chưa deploy công khai. Khi được duyệt, chỉ đưa `index.html`, `styles.css`, `app.js`, `assets/fonts/` và 5 ảnh được sử dụng vào thư mục phát hành; không đưa `Spec/`, ảnh quản trị chưa duyệt, tests, output hoặc `.git/` lên hosting. Không xóa hoặc chỉnh sửa nguồn gốc để chuẩn bị phát hành.

Đã kiểm thử trên Chromium và Edge chạy nền. Chưa kiểm thử trên Safari/Firefox, thiết bị vật lý hoặc cổng demo production; chưa xác minh quyền công bố thương mại. Không có kênh tiếp nhận nên chưa thể kiểm thử đặt lịch thật.

## GitHub và phát hành

Repo: `pino2704/Landing_page_Dashboard`. Mã nguồn lưu trong repo private. `Spec/`, ảnh quản trị chưa duyệt, bản `DEMO.html` đóng gói và kết quả kiểm thử chỉ giữ cục bộ, được loại khỏi Git.

Workflow `.github/workflows/pages.yml` chỉ chạy thủ công, không tự phát hành khi push. Sau khi xác nhận quyền công bố và bật GitHub Pages với nguồn GitHub Actions, chạy **Publish Dashboard landing page** để phát hành. Workflow chỉ đóng gói 13 file cần thiết: HTML/CSS/JS, giấy phép, font và 5 ảnh sử dụng. README, tests và tài liệu nội bộ không nằm trong website phát hành.

GitHub Pages có thể công khai website dù repo nguồn là private; không coi chế độ private của repo là bảo vệ nội dung website. Khả năng dùng Pages với repo private phụ thuộc gói GitHub. Giấy phép mã nguồn hiện có không thay thế quyền công bố dữ liệu, ảnh và nhãn hiệu của bên thứ ba.

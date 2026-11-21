# HSK Panda — Quy trình bật thanh toán tự động

**Trạng thái:** Website v1.4 đã cập nhật lên GitHub, mã Edge Functions đã lưu trong repo. Chưa có bằng chứng backend đã triển khai hoặc tiền đã được nhận/xác minh. Không bật thu tiền trước kiểm thử.

## A. Supabase Auth
1. Authentication → URL Configuration: Site URL = https://thanhhochub-commits.github.io/HSK/; thêm Redirect URL phù hợp cho đường dẫn này.
2. Bật Email OTP/magic link để học viên đăng nhập. Google chỉ khả dụng sau khi thiết lập OAuth Client ID/Secret trong Supabase.
3. Project Settings → API Keys: sao chép PUBLIC Publishable Key có tiền tố sb_publishable_.
4. Mở file billing-config.js trên GitHub, điền supabasePublishableKey. Không đưa khóa payOS, service_role hoặc mật khẩu DB lên GitHub.
5. Giữ paymentsEnabled=false khi chưa kiểm thử thực tế.

## B. Database
Vào HSK Supabase SQL Editor và chạy nội dung file supabase/hsk_payment_schema.sql.
Xác minh hsk_orders, hsk_access đều bật RLS; authenticated chỉ xem dữ liệu thuộc tài khoản mình, không được tự đổi quyền Pro.
Chỉ service_role được EXECUTE hsk_apply_verified_payment.

## C. Edge Functions
Deploy source các hàm:
- supabase/functions/hsk-create-checkout/index.ts (xác thực user)
- supabase/functions/hsk-payment-status/index.ts (xác thực user)
- supabase/functions/hsk-payment-webhook/index.ts (tắt Verify JWT CHỈ đối với hàm này; kiểm tra chữ ký PayOS bằng SDK chính thức)
Secrets cần được lưu ở Supabase: PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY (bạn đã xác nhận lưu). SUPABASE_SERVICE_ROLE_KEY phải chỉ dùng bên trong Edge Functions.
Giữ secret PAYMENTS_ENABLED=false cho đến khi toàn bộ giao dịch thử thành công.

## D. Webhook URL
Chỉ sau khi triển khai hsk-payment-webhook thành công, hãy cấu hình URL sau trong payOS → HSK Panda → Webhook:
https://ylljdozgrfjtkufobzml.supabase.co/functions/v1/hsk-payment-webhook
payOS có thể gửi payload thử nghiệm, hàm sẽ không mở Pro với order không khớp.

## E. Kiểm thử trước khi nhận tiền
- Đăng nhập user thật, chỉ thấy đơn hàng của chính mình.
- Không có PAYMENTS_ENABLED=true thì backend không phát sinh QR.
- Sai signature, sai số tiền, sai orderCode, sai paymentLinkId => không cấp Pro.
- Gửi webhook trùng => gia hạn một lần duy nhất.
- Thanh toán được nhà cung cấp xác nhận => orders.status=paid và access.expires_at đúng.
- Sau reload hoặc đổi thiết bị, tài khoản cùng user vẫn có quyền Pro.
- Có phương án xử lý webhook chậm, hoàn tiền và hết hạn gói.

## F. Lưu ý thương mại
Giá trong code là ví dụ chưa chốt: 30 ngày 89.000đ, 90 ngày 219.000đ, 365 ngày 699.000đ. Phải chốt với chủ dự án và cập nhật đồng nhất frontend, Edge Functions và SQL trước khi cho phép thu.
Dữ liệu bài học trong JavaScript công khai chưa phải tài nguyên Pro được bảo vệ tại backend. Trước khi mở bán, cần chuyển bài học Pro ra hệ thống có xác thực quyền truy cập và kiểm thử khóa bài.
GitHub Pages không phù hợp làm hosting thương mại SaaS. Chuyển frontend thương mại sang Cloudflare Pages Free khi mở bán, giữ mã nguồn GitHub.
Chủ dự án muốn ngân sách 0đ: kiểm soát hạn mức miễn phí, không bật tự nâng cấp gói trả phí, theo dõi chi phí AI và tài nguyên Supabase.

## Link
Website: https://thanhhochub-commits.github.io/HSK/
Repository: https://github.com/thanhhochub-commits/HSK
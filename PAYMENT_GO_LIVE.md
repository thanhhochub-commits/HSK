# HSK Panda — thanh toán payOS, bản 1.8.1

Website gốc: https://thanhhochub-commits.github.io/HSK/
Trang gói: https://thanhhochub-commits.github.io/HSK/#pro

## Đã triển khai

- **Free:** một bài trải nghiệm ở mỗi mục.
- **Pro 30 ngày:** 89.000đ, plan_code `pro_30`.
- **Pro 90 ngày:** 219.000đ, plan_code `pro_90`.
- **Pro 365 ngày:** 699.000đ, plan_code `pro_365`.
- Không cần đăng nhập: trình duyệt giữ token ngẫu nhiên 256-bit trong localStorage.
- QR/link thanh toán tạo bằng API payOS trên Supabase Edge Function, không dùng QR tĩnh.
- Chỉ Supabase service role xác minh giao dịch mới có thể kích hoạt gói.
- Webhook ký số + đối soát server-to-server với payOS, kiểm tra mã đơn, số tiền và paymentLinkId.
- Gia hạn tự cộng thời gian còn lại. Thông báo webhook trùng không cộng ngày 2 lần.
- Mã khôi phục bí mật có thể sao chép trên trình duyệt đã thanh toán và nhập lại trên thiết bị khác.

## Bảo toàn giao dịch thử

Gói 2.000đ **đã ngừng bán** ở cả giao diện và hai checkout API trước đây. Giao dịch thử đã thanh toán trước đó vẫn được giữ trong `hsk_guest_trials`, được kiểm tra qua `hsk-guest-status` và `hsk-plan-status` đến lúc hết hạn. Không xóa hàng cũ.

## Backend

- SQL: `supabase/hsk_paid_plans.sql`
- Tạo đơn: `supabase/functions/hsk-plan-checkout/index.ts`
- Kiểm tra trạng thái: `supabase/functions/hsk-plan-status/index.ts`
- Webhook: `supabase/functions/hsk-payment-webhook/index.ts`
- Bảng đơn: `public.hsk_guest_subscriptions`
- Cấp quyền: `public.hsk_apply_verified_guest_subscription(...)`; EXECUTE chỉ dành cho service_role.

Mỗi lần sửa giá phải cập nhật đồng thời SQL constraints + reserve RPC, Edge Function giá server, JavaScript bảng giá và tài liệu. Không đọc giá tiền từ trình duyệt.

## Kiểm thử đã thực hiện

1. **Giao dịch thử thật 2.000đ:** payOS thông báo thành công, webhook ký số được ghi nhận, Supabase cập nhật quyền 24 giờ, website hiện "Đã mở khóa".
2. **Cả 3 gói mới:** tạo link payOS đúng số tiền thực, các đơn mới chưa trả đều là pending và không được cấp Pro. GitHub Actions: `hsk-paid-plans-check.yml`.
3. **SQL rollback unit test:** sai số tiền / paymentLinkId không cấp Pro, replay webhook không cộng ngày lần hai, mua 30 ngày rồi 90 ngày cộng dồn đúng.
4. **Retired endpoints:** checkout gói 2.000đ trả 410; webhook giả chữ ký trả 401, không cấp Pro.
5. **Giao diện:** kiểm tra các trang Home, Pro, Checkout, Payment Status, phục hồi mã, kiểm tra bài tập vẫn chạy.
6. **Chưa có** giao dịch có tiền thật trên từng gói 89.000 / 219.000 / 699.000; do đó chưa thể tuyên bố cả 3 giao dịch đã được kiểm chứng đầu-cuối bằng tiền thật.

## Vận hành miễn phí

Checkout áp giới hạn **75 đơn/24 giờ trên toàn hệ thống** và **3 đơn/24 giờ với cùng mã trình duyệt**, để hạn chế lạm dụng/hết lượt miễn phí. Giới hạn có thể thay đổi khi nâng cấp hạ tầng. Theo dõi quota payOS và Supabase thường xuyên.

## Cảnh báo cần giải quyết cho kinh doanh quy mô lớn

- **Không có đăng nhập bắt buộc** có nghĩa là người học giữ mã khôi phục như mật khẩu. Nếu xóa bộ nhớ và mất mã, không thể tự động chứng minh mình sở hữu gói trả tiền. Cần chính sách hỗ trợ và có thể tích hợp đăng nhập tùy chọn.
- Nội dung bài Pro hiện chủ yếu nằm trong mã JavaScript frontend công khai. Dù các quyền Pro được xác minh ở backend, **dữ liệu bài học chưa có bảo vệ server-side đầy đủ**; đây chưa phải mô hình bảo vệ nội dung trả phí chống sao chép chắc chắn.
- Quy trình hoàn tiền, báo mất mã, hóa đơn và hỗ trợ khách vẫn cần quy định/triển khai riêng.
- GitHub Pages / Supabase Free / payOS có giới hạn và điều khoản sử dụng; ngân sách bằng 0 chỉ khả thi khi ở trong hạn mức của từng dịch vụ.
- Không đưa API Key payOS, service-role, khóa bí mật vào mã GitHub hoặc tin nhắn.


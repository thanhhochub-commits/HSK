# 🐼 HSK Panda

Website học tiếng Trung và luyện HSK có giao diện hiện đại, tập trung vào trải nghiệm miễn phí. Repository giữ nguyên đường dẫn `thanhhochub-commits/HSK`.

## Địa chỉ triển khai

**https://thanhhochub-commits.github.io/HSK/**

> Website đang triển khai bằng GitHub Pages từ nhánh `main` (GitHub Pages build mặc định). Giữ nguyên địa chỉ trên khi cập nhật mã nguồn.

## Chức năng hiện có

- Dashboard HSK Panda, gấu trúc, lộ trình và nhiệm vụ hằng ngày.
- Thư viện từ vựng mẫu, tìm kiếm chữ Hán, pinyin và nghĩa.
- Flashcard và lặp lại ngắt quãng SRS cơ bản.
- Phát âm qua SpeechSynthesis, nghe chép chính tả, hỗ trợ shadowing.
- Nhận diện lời nói cơ bản trên trình duyệt hỗ trợ (không chấm thanh điệu).
- Bảng viết chữ Hán bằng chuột hoặc cảm ứng.
- Ngữ pháp, mini quiz và luyện đề 10 câu: **chọn câu trả lời là biết đúng/sai ngay**, hiện đáp án đúng, giải thích và sổ lỗi sai. Mỗi câu chỉ được chấm một lần.
- Game ghép cặp, XP, streak, dashboard, xuất/nhập dữ liệu.
- Giao diện thích nghi desktop và điện thoại.

## Giới hạn minh bạch

- Đây là **MVP** với khoảng 70 từ minh họa và bài tập tự biên soạn, chưa phải giáo trình HSK 1–6 hay HSK 3.0 hoàn chỉnh.
- Chưa có đăng nhập Supabase và đồng bộ nhiều thiết bị. Dữ liệu chỉ nằm trong localStorage của trình duyệt.
- Chưa tích hợp thanh toán, AI API trả phí hay nhận diện thứ tự nét.
- Bảng xếp hạng trực tuyến yêu cầu hệ thống xác thực người dùng.
- Không tự nhận bài tập là đề HSK chính thức.

## Cách xuất bản bằng GitHub Pages (giữ nguyên link)

1. Vào **Settings → Pages** trong repository này.
2. Mục **Build and deployment → Source**: chọn **Deploy from a branch** (nhánh `main`, thư mục `/ (root)`).
3. Vào tab **Actions**, kiểm tra job mặc định **pages build and deployment** chạy thành công sau mỗi lần cập nhật.
4. Khi trạng thái workflow thành công, mở **https://thanhhochub-commits.github.io/HSK/**.

Bạn cũng có thể chạy thử bằng `python3 -m http.server 8000` ở thư mục này, sau đó mở `http://localhost:8000`.

**Lưu ý kinh doanh:** GitHub Pages dành cho website tĩnh, không phù hợp làm hosting chính cho SaaS thương mại theo điều khoản GitHub. Khi thu tiền, nên dùng Cloudflare Pages và backend phù hợp, vẫn giữ GitHub để lưu mã nguồn.

**Bảo mật:** không lưu khóa API bí mật, mật khẩu, Supabase service-role key trong mã nguồn frontend hoặc repository.

## Mã nguồn

- `index.html`: trang HTML chính
- `styles.css`: giao diện responsive
- `app.js`: logic học và dữ liệu mẫu
- `favicon.svg`: icon gấu trúc
- GitHub Pages tự triển khai mã nguồn từ nhánh `main` (không cần workflow tùy chỉnh).
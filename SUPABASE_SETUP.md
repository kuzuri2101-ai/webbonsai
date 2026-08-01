# Cây Sao Rồi? — bật tài khoản thật + cộng đồng

Code đã có sẵn các trang:
- `signup.html`: đăng ký bằng email + mật khẩu.
- `login.html`: đăng nhập, Google OAuth và quên mật khẩu.
- `account.html`: tài khoản của tôi, hiển thị cây của người dùng.
- `community.html`: trang mọi người xem cây công khai.
- `share.html`: người đã đăng nhập chia sẻ cây.
- `reset.html`: đổi mật khẩu.
- `schema.sql`: database + RLS.

## 1. Tạo Supabase
Vào https://supabase.com/ và tạo một project mới.

## 2. Tạo database
Trong Supabase mở SQL Editor → New query → dán toàn bộ `schema.sql` → Run.

Schema tạo 2 bảng `profiles` và `plants`, bật Row Level Security. Cây công khai được mọi người xem; người dùng chỉ được sửa/xóa cây của chính họ.

## 3. Lấy Project URL + Publishable/anon key
Trong Supabase vào Project Settings → API. Lấy Project URL và Publishable key (hoặc anon key nếu project đang dùng kiểu key cũ).

Mở `supabase-config.js` và thay:
- `YOUR_SUPABASE_PROJECT_URL`
- `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY`

Không dùng `service_role` key ở frontend.

## 4. Email confirmation
Nếu bật xác nhận email, Supabase sẽ gửi email sau khi đăng ký. Có thể cấu hình URL chuyển hướng trong Auth → URL Configuration.

Đặt Site URL là domain Vercel của website, ví dụ `https://TEN-DU-AN.vercel.app`.

Thêm Redirect URLs:
- `https://TEN-DU-AN.vercel.app/login.html`
- `https://TEN-DU-AN.vercel.app/account.html`
- `https://TEN-DU-AN.vercel.app/reset.html`

## 5. Google Login
Trong Supabase → Authentication → Providers → Google, bật Google và nhập OAuth Client ID/Secret từ Google Cloud. Redirect URL OAuth của Supabase sẽ được hiển thị ngay trong phần cấu hình provider.

## 6. Vercel
Nếu Vercel đang kết nối với GitHub repo `kuzuri2101-ai/webbonsai`, các commit mới sẽ được deploy theo cấu hình hiện tại. Sau khi cấu hình Supabase, mở website và thử:

Đăng ký → xác nhận email (nếu bật) → Đăng nhập → Tài khoản → Chia sẻ cây → Cộng đồng.

## 7. Ý tưởng phát triển tiếp
Sau khi phần này chạy ổn, có thể thêm:
- ❤️ Thích cây
- 💬 Bình luận
- 👤 Trang cá nhân từng người
- 🔎 Tìm cây/người dùng
- 🖼️ Upload ảnh thật bằng Supabase Storage thay vì chỉ nhập link ảnh
- 🔔 Theo dõi người trồng cây
- 📅 Lịch chăm cây riêng cho từng tài khoản

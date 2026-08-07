# 🌳 Bách khoa Bonsai Việt

Nền tảng kiến thức và cộng đồng dành cho người chơi bonsai Việt Nam: kỹ thuật, cây, dáng, trường phái, nghệ nhân, tác phẩm và lịch triển lãm sinh vật cảnh.

## Tầm nhìn

Xây dựng một **bách khoa toàn thư kỹ thuật Bonsai Việt** có cấu trúc dữ liệu rõ ràng, nội dung chuyên sâu và có khả năng mở rộng thành cộng đồng + marketplace.

## 3 trụ cột sản phẩm

### 1. Thư viện kỹ thuật
- Kỹ thuật uốn cành bằng dây
- Cắt tỉa theo mùa
- Ghép rễ / ghép cành
- Làm lão hóa thân, vỏ, shari-jin
- Kỹ thuật theo từng loài cây
- Nội dung từng bước, ảnh/video thật

### 2. Lịch & bản đồ triển lãm
- Festival sinh vật cảnh
- Hội hoa xuân
- Triển lãm bonsai/cây cảnh tại các tỉnh
- Địa điểm, thời gian, đơn vị tổ chức
- Về sau có bản đồ và bộ lọc theo tỉnh/thời gian

### 3. Không gian tác phẩm & cộng đồng
- Thành viên đăng tác phẩm
- Phân loại theo cây, dáng, trường phái
- Bình chọn và góp ý
- Hồ sơ nghệ nhân / người chơi
- Về sau có marketplace cây bonsai thành phẩm

## Mô hình nội dung

```text
Cây ─────┐
         ├── Kỹ thuật
Dáng ────┤
         ├── Trường phái
         ├── Nghệ nhân
         ├── Tác phẩm
         └── Bài viết
```

Các quan hệ many-to-many được thiết kế để một nội dung có thể liên kết tới nhiều nội dung khác, tạo thành mạng knowledge graph và internal linking tốt cho SEO.

## Kiếm tiền dự kiến

1. Affiliate dụng cụ bonsai: dây kẽm, kéo, kìm, chậu, dụng cụ chuyên dụng.
2. Hợp tác nghệ nhân mở khóa học online/offline.
3. Marketplace bonsai thành phẩm giá trị cao.
4. Sau khi có traffic: quảng cáo và các hình thức tài trợ phù hợp.

## Công nghệ hiện tại

- Frontend: HTML/CSS/JavaScript vanilla, ưu tiên triển khai đơn giản và dễ bảo trì.
- Backend/Data: Supabase.
- Hosting/Deployment: Vercel.
- Source control: GitHub.

## Cấu trúc hiện tại

- `bonsai-home.html` — homepage Bách khoa Bonsai Việt
- `knowledge.html` — trang kiến thức
- `knowledge-page.js` — tải dữ liệu knowledge
- `admin.html` / `admin.js` — khu vực quản trị
- `admin-taxonomy.js` — quản lý taxonomy
- `admin-artists-works.js` — nghệ nhân & tác phẩm
- `articles-admin.html` / `articles-admin.js` — quản lý bài viết
- `vercel.json` — route homepage production
- `SUPABASE_SETUP.md` — hướng dẫn cấu hình Supabase

## Chạy production

Production hiện được triển khai bằng Vercel từ repository GitHub này. `vercel.json` route `/` tới `bonsai-home.html`.

## Quy tắc an toàn

- Không commit Supabase `service_role` key.
- Chỉ dùng publishable/anon key ở frontend khi RLS đã cấu hình đúng.
- Dữ liệu quản trị phải được bảo vệ bằng Authentication + RLS.
- Nội dung public chỉ nên hiển thị khi ở trạng thái `published`.

## Roadmap

### Phase 1 — Nền tảng
- [x] Homepage Bonsai Việt
- [x] Knowledge system
- [x] Taxonomy cơ bản
- [x] Related content
- [x] Breadcrumb / SEO metadata nền
- [x] Admin MVP
- [x] Vercel deployment

### Phase 2 — Knowledge hoàn chỉnh
- [ ] Cây
- [ ] Kỹ thuật
- [ ] Dáng
- [ ] Trường phái
- [ ] Nghệ nhân
- [ ] Tác phẩm
- [ ] Bài viết
- [ ] Tìm kiếm toàn site
- [ ] Bộ lọc theo loài / dáng / trường phái

### Phase 3 — SEO & Discovery
- [ ] URL SEO sạch
- [ ] Sitemap động
- [ ] Robots.txt
- [ ] Canonical hoàn chỉnh
- [ ] JSON-LD theo loại nội dung
- [ ] Open Graph / social preview
- [ ] Google Search Console

### Phase 4 — Triển lãm
- [ ] Lịch triển lãm toàn quốc
- [ ] Trang chi tiết sự kiện
- [ ] Bộ lọc tỉnh/thành
- [ ] Bản đồ
- [ ] Đăng sự kiện có kiểm duyệt

### Phase 5 — Cộng đồng
- [ ] Đăng tác phẩm
- [ ] Hồ sơ thành viên
- [ ] Bình chọn
- [ ] Bình luận / góp ý
- [ ] Hồ sơ nghệ nhân

### Phase 6 — Thương mại
- [ ] Affiliate dụng cụ
- [ ] Masterclass với nghệ nhân
- [ ] Marketplace bonsai thành phẩm

## Nguyên tắc phát triển

**Không chạy theo việc làm homepage đẹp trước.** Ưu tiên dữ liệu chuẩn → taxonomy → nội dung → liên kết → SEO → cộng đồng → thương mại.

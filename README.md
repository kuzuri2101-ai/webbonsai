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
- Thành viên đăng ảnh cây
- Phân loại theo cây, dáng, trường phái
- Bình chọn và góp ý
- Hồ sơ nghệ nhân / người chơi
- Về sau marketplace cây bonsai thành phẩm

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

Các quan hệ many-to-many tạo mạng knowledge graph và internal linking cho SEO.

## Kiếm tiền dự kiến

1. Affiliate dụng cụ bonsai.
2. Hợp tác nghệ nhân mở khóa học online/offline.
3. Marketplace bonsai thành phẩm giá trị cao.
4. Quảng cáo/tài trợ phù hợp khi traffic ổn định.

## Công nghệ

- Frontend: HTML/CSS/JavaScript vanilla.
- Backend/Data: Supabase.
- Hosting/Deployment: Vercel.
- Source control: GitHub.

## Các phần đã có

- `bonsai-home.html` — homepage Bách khoa Bonsai Việt
- `knowledge.html`, `knowledge-page.js` — knowledge system
- `admin.html`, `admin.js`, `admin-taxonomy.js` — Admin MVP
- `admin-artists-works.js` — nghệ nhân & tác phẩm
- `articles-admin.html`, `articles-admin.js` — bài viết
- Related content, breadcrumb, SEO metadata modules
- `vercel.json` — route `/` tới homepage
- `SUPABASE_SETUP.md` — hướng dẫn Supabase
- `docs/PROJECT-ROADMAP.md` — ý tưởng và roadmap chi tiết

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
- [ ] Search toàn site
- [ ] Bộ lọc theo entity

### Phase 3 — SEO & Discovery
- [ ] URL SEO sạch
- [ ] Sitemap động
- [ ] Robots.txt
- [ ] Canonical hoàn chỉnh
- [ ] JSON-LD theo loại nội dung
- [ ] Open Graph
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
- [ ] Bình luận/góp ý
- [ ] Hồ sơ nghệ nhân

### Phase 6 — Thương mại
- [ ] Affiliate dụng cụ
- [ ] Masterclass
- [ ] Marketplace bonsai thành phẩm

## An toàn

- Không commit Supabase `service_role` key.
- Frontend chỉ dùng publishable/anon key với RLS đúng.
- Admin phải có Authentication + RLS.
- Public chỉ đọc nội dung đã publish.

## Nguyên tắc phát triển

**Dữ liệu chuẩn → taxonomy → nội dung → liên kết → SEO → cộng đồng → thương mại.**

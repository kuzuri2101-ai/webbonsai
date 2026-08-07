# Bonsai Việt — Public Knowledge Pages

Các route public MVP cần triển khai tiếp:

- `/cay/{slug}` — hồ sơ loài cây
- `/ky-thuat/{slug}` — kỹ thuật + các bước
- `/dang/{slug}` — dáng cây
- `/truong-phai/{slug}` — trường phái
- `/nghe-nhan/{slug}` — hồ sơ nghệ nhân
- `/tac-pham/{slug}` — tác phẩm
- `/trien-lam/{slug}` — triển lãm + địa điểm
- `/bai-viet/{slug}` — bài viết SEO

Mỗi trang phải có breadcrumb, canonical URL, title/meta description, nội dung chính và các liên kết nội bộ liên quan. Chỉ hiển thị bản ghi PUBLISHED.

## Search

`knowledge-search.js` cung cấp tìm kiếm nhanh trên các bảng kiến thức public. UI dùng thuộc tính `[data-bonsai-search]` và `[data-search-results]`.

Ví dụ markup:

```html
<div class="bonsai-search" data-bonsai-search>
  <input type="search" placeholder="Tìm cây, kỹ thuật, dáng, nghệ nhân…" autocomplete="off">
  <div class="search-results" data-search-results></div>
</div>
```

Nên đặt module này ở header của website sau khi cấu hình Supabase URL/key qua `window.SUPABASE_URL` và `window.SUPABASE_ANON_KEY`.

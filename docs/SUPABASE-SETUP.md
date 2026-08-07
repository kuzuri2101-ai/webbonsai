# Kết nối Supabase cho Bonsai Việt

## 1. Tạo project Supabase

Trong Supabase, tạo project mới hoặc dùng project Bonsai Việt hiện có.

## 2. Lấy thông tin public

Vào Project Settings → API và lấy:

- Project URL
- Publishable key (ưu tiên) hoặc anon key legacy

Chỉ dùng public/publishable/anon key ở frontend. **Không dùng `service_role` key trong trình duyệt và không commit nó lên GitHub.**

## 3. Cấu hình `knowledge.html`

Thay hai placeholder:

```html
<meta name="supabase-url" content="YOUR_PROJECT_URL">
<meta name="supabase-anon-key" content="YOUR_PUBLISHABLE_OR_ANON_KEY">
```

bằng thông tin public của project.

## 4. Kiểm tra RLS

Các bảng public mà trang Knowledge đọc cần có policy `SELECT` cho role `anon` khi bản ghi có `status = 'PUBLISHED'`.

Không mở quyền INSERT/UPDATE/DELETE cho `anon`.

## 5. Các bảng Knowledge hiện được code sử dụng

- `bv_plants`
- `bv_techniques`
- `bv_technique_steps`
- `bv_plant_techniques`
- `bv_article_plants`
- `bv_articles`
- `bv_work_plants`
- `bv_works`
- `bv_article_techniques`
- `bv_work_techniques`

## 6. Kiểm tra sau deploy

Mở:

```text
/knowledge.html?type=plant&slug=sanh
```

Nếu có bản ghi `sanh` với `status = PUBLISHED`, trang phải tải dữ liệu từ Supabase.

Nếu chưa cấu hình key hoặc chưa có dữ liệu, trang sẽ báo trạng thái cấu hình thay vì lỗi JavaScript.

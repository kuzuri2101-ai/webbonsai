# Bách khoa Bonsai Việt — Product Roadmap

## Mục tiêu sản phẩm

Tạo một nền tảng chuyên sâu về bonsai Việt Nam, không chỉ là blog chăm cây. Hệ thống phải kết nối kiến thức kỹ thuật, văn hóa/trường phái, người chơi, nghệ nhân, tác phẩm và sự kiện thành một mạng dữ liệu có thể tìm kiếm.

## Kiến trúc nội dung

```text
                         BÁCH KHOA BONSAI VIỆT
                                  │
          ┌───────────────────────┼───────────────────────┐
          ↓                       ↓                       ↓
        KIẾN THỨC               CỘNG ĐỒNG              SỰ KIỆN
          │                       │                       │
   ┌──────┼──────┐          ┌─────┼─────┐          ┌─────┼─────┐
   ↓      ↓      ↓          ↓           ↓          ↓           ↓
  Cây   Dáng  Kỹ thuật   Tác phẩm   Nghệ nhân   Triển lãm   Bản đồ
   │      │      │          │           │          │           │
   └──────┴──────┴──────────┴───────────┴──────────┴───────────┘
                              ↓
                         TÌM KIẾM / SEO
                              ↓
                         TRAFFIC / CỘNG ĐỒNG
                              ↓
                     AFFILIATE / MASTERCLASS
                              ↓
                         MARKETPLACE
```

## Nội dung SEO ưu tiên

### Cây
- Sanh bonsai
- Tùng bonsai
- Mai bonsai
- Si bonsai
- Duối bonsai
- Linh sam
- Sam hương
- Nguyệt quế

### Kỹ thuật
- Cách uốn cành bonsai không làm gãy cành
- Cách chọn dây kẽm theo đường kính cành
- Khi nào tháo dây bonsai
- Cắt giật và nuôi cành chi cành
- Ghép cành / ghép rễ
- Làm lão hóa thân và vỏ
- Shari / jin
- Chăm cây sau khi tạo dáng
- Kỹ thuật theo mùa

### Dáng
- Trực
- Xiên
- Hoành
- Huyền
- Văn nhân
- Thác đổ
- Song thụ / đa thân
- Tam đa
- Long - Ly - Quy - Phụng

### Trường phái
- Bonsai Nhật
- Bonsai Việt truyền thống miền Bắc
- Bonsai Việt Nam Bộ
- Phong cách tự nhiên
- Lối chơi cây cổ truyền

## Luồng người dùng chính

### Người tìm kiến thức

```text
Google
  ↓
Bài kỹ thuật
  ↓
Loài cây
  ↓
Dáng phù hợp
  ↓
Trường phái
  ↓
Tác phẩm thực tế
  ↓
Nghệ nhân
```

### Người chơi bonsai

```text
Đăng nhập
  ↓
Đăng tác phẩm
  ↓
Chọn cây + dáng + trường phái
  ↓
Cộng đồng góp ý
  ↓
Bình chọn
  ↓
Hồ sơ tác phẩm / người chơi
```

### Người tìm triển lãm

```text
Triển lãm
  ↓
Chọn tỉnh / khoảng thời gian
  ↓
Danh sách sự kiện
  ↓
Bản đồ
  ↓
Chi tiết sự kiện
  ↓
Lưu / chia sẻ
```

## Data model định hướng

Các bảng lõi dự kiến:

- `bv_plants`
- `bv_techniques`
- `bv_forms`
- `bv_styles`
- `bv_artists`
- `bv_works`
- `bv_articles`
- `bv_exhibitions`
- `bv_locations`
- các bảng quan hệ many-to-many giữa những nhóm trên

Nguyên tắc: taxonomy và entity phải có slug ổn định; nội dung có trạng thái draft/published; public chỉ đọc dữ liệu được phép xuất bản.

## SEO architecture

Mục tiêu cuối:

```text
/cay/sanh
/ky-thuat/uon-canh-bang-day-kem
/dang/huyen
/truong-phai/bonsai-nhat
/nghe-nhan/...
/tac-pham/...
/bai-viet/...
/trien-lam/...
```

Mỗi trang entity cần:
- title duy nhất
- meta description
- canonical
- breadcrumb
- JSON-LD phù hợp
- internal links tới entity liên quan
- sitemap khi đã public

## Kiếm tiền

### Giai đoạn 1
Affiliate dụng cụ bonsai.

### Giai đoạn 2
Masterclass với nghệ nhân, workshop offline và online.

### Giai đoạn 3
Marketplace bonsai thành phẩm, ưu tiên cây có giá trị và nguồn gốc rõ ràng.

Không ưu tiên marketplace ngay từ đầu; traffic và trust phải đi trước.

## Nguyên tắc UX

- Giao diện rõ ràng, chữ dễ đọc, phù hợp cả người dùng trung niên.
- Ưu tiên nội dung và ảnh cây thật hơn hiệu ứng.
- Tìm kiếm và bộ lọc phải dễ dùng.
- Mobile-first nhưng desktop phải tốt cho việc đọc bài dài.
- Mỗi trang kiến thức phải có đường dẫn tiếp theo để người dùng khám phá mạng nội dung.

## Definition of Done cho public MVP

- Homepage Bonsai Việt ổn định.
- Knowledge pages đọc được dữ liệu Supabase.
- Admin có thể quản lý taxonomy và nội dung.
- Related content hoạt động.
- Search hoạt động.
- Authentication + RLS đúng.
- Không lộ secret.
- Mobile responsive.
- SEO metadata cơ bản.
- Vercel production build thành công.

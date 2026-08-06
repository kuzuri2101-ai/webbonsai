-- BONSAI VIET - safe starter data
-- Run after database/bonsai-schema.sql

insert into public.bv_plants (name, scientific_name, slug, short_description, description, difficulty, status)
values
('Sanh','Ficus microcarpa','sanh','Loài cây bonsai phổ biến, sức sống mạnh và dễ tạo rễ.','Sanh là một trong những loài cây quan trọng của thú chơi cây cảnh Việt Nam, phù hợp nhiều kỹ thuật tạo dáng.','BEGINNER','PUBLISHED'),
('Mai vàng','Ochna integerrima','mai-vang','Cây cảnh đặc trưng của Việt Nam, nổi bật vào dịp Tết.','Mai vàng có giá trị văn hóa cao và có thể tạo nhiều dáng bonsai đẹp.','INTERMEDIATE','PUBLISHED'),
('Linh sam','Antidesma acidum','linh-sam','Cây bonsai có cành linh hoạt và hoa đẹp.','Linh sam được ưa chuộng nhờ khả năng tạo hình và sức sinh trưởng tốt.','INTERMEDIATE','PUBLISHED'),
('Tùng la hán','Podocarpus macrophyllus','tung-la-han','Loài tùng có dáng thanh nhã và lá phù hợp bonsai.','Tùng la hán thích hợp với các bố cục cổ điển và hiện đại.','ADVANCED','PUBLISHED'),
('Duối','Streblus asper','duoi','Cây bản địa có khả năng tạo thân già và bộ rễ đẹp.','Duối gắn với nhiều dòng cây cảnh truyền thống tại Việt Nam.','INTERMEDIATE','PUBLISHED')
on conflict (slug) do update set name=excluded.name, status=excluded.status;

insert into public.bv_techniques (name, slug, category, difficulty, description, status)
values
('Uốn cành bằng dây','uon-canh-bang-day','WIRING','INTERMEDIATE','Dùng dây để định hướng cành theo bố cục mong muốn.','PUBLISHED'),
('Cắt tỉa cành','cat-tia-canh','PRUNING','BEGINNER','Loại bỏ cành thừa để xây dựng cấu trúc cây.','PUBLISHED'),
('Tạo nebari','tao-nebari','ROOT','ADVANCED','Xây dựng bộ rễ tỏa đều quanh gốc.','PUBLISHED'),
('Tạo lũa','tao-lua-bonsai','DEADWOOD','ADVANCED','Tạo phần gỗ chết mô phỏng cây cổ thụ trong tự nhiên.','PUBLISHED'),
('Thay chậu','thay-chau-bonsai','REPOTTING','INTERMEDIATE','Thay giá thể và điều chỉnh bộ rễ theo chu kỳ.','PUBLISHED')
on conflict (slug) do update set name=excluded.name, status=excluded.status;

insert into public.bv_forms (name, slug, description, difficulty, status)
values
('Dáng trực','dang-truc','Thân phát triển tương đối thẳng đứng.','BEGINNER','PUBLISHED'),
('Dáng xiên','dang-xien','Thân nghiêng về một phía nhưng tổng thể vẫn cân bằng.','INTERMEDIATE','PUBLISHED'),
('Dáng huyền','dang-huyen','Thân và cành rủ xuống dưới miệng chậu.','ADVANCED','PUBLISHED'),
('Dáng thác đổ','dang-thac-do','Thân chính hướng xuống như một dòng thác.','ADVANCED','PUBLISHED'),
('Dáng văn nhân','dang-van-nhan','Bố cục thanh mảnh, tối giản, nhấn mạnh đường thân.','ADVANCED','PUBLISHED')
on conflict (slug) do update set name=excluded.name, status=excluded.status;

insert into public.bv_styles (name, slug, style_type, country, description, status)
values
('Bonsai Việt truyền thống','bonsai-viet-truyen-thong','TRADITION','Vietnam','Nhấn mạnh thế cây, hình tượng và giá trị văn hóa Việt.','PUBLISHED'),
('Cây cảnh miền Bắc','cay-canh-mien-bac','REGIONAL','Vietnam','Dòng chơi cây truyền thống với trọng tâm là thân, thế và tán.','PUBLISHED'),
('Cây cảnh Nam Bộ','cay-canh-nam-bo','REGIONAL','Vietnam','Phong cách phù hợp khí hậu và các dòng cây nhiệt đới phía Nam.','PUBLISHED'),
('Bonsai Nhật Bản','bonsai-nhat-ban','STYLE','Japan','Nhấn mạnh tỷ lệ, đường thân, khoảng âm và vẻ tự nhiên.','PUBLISHED')
on conflict (slug) do update set name=excluded.name, status=excluded.status;

insert into public.bv_plant_techniques (plant_id, technique_id, difficulty, notes)
select p.id, t.id, 'BEGINNER', 'Sanh khỏe và phù hợp để học kỹ thuật cơ bản.'
from public.bv_plants p cross join public.bv_techniques t
where p.slug='sanh' and t.slug='cat-tia-canh'
on conflict do nothing;

insert into public.bv_plant_techniques (plant_id, technique_id, difficulty, notes)
select p.id, t.id, 'INTERMEDIATE', 'Theo dõi dây thường xuyên để tránh hằn cành.'
from public.bv_plants p cross join public.bv_techniques t
where p.slug='sanh' and t.slug='uon-canh-bang-day'
on conflict do nothing;

insert into public.bv_plant_techniques (plant_id, technique_id, difficulty, notes)
select p.id, t.id, 'INTERMEDIATE', 'Mai cần chọn thời điểm và cành phù hợp.'
from public.bv_plants p cross join public.bv_techniques t
where p.slug='mai-vang' and t.slug='uon-canh-bang-day'
on conflict do nothing;

insert into public.bv_plant_forms (plant_id, form_id, notes)
select p.id, f.id, 'Dáng mẫu để kiểm thử trang chi tiết cây.'
from public.bv_plants p cross join public.bv_forms f
where p.slug='sanh' and f.slug='dang-truc'
on conflict do nothing;

insert into public.bv_plant_styles (plant_id, style_id, notes)
select p.id, s.id, 'Dữ liệu mẫu cho liên kết trường phái.'
from public.bv_plants p cross join public.bv_styles s
where p.slug='sanh' and s.slug='bonsai-viet-truyen-thong'
on conflict do nothing;

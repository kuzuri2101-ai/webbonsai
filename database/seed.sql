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

insert into public.bv_techniques (name, slug, category, difficulty, description, tools_required, best_season, safety_notes, common_mistakes, expert_tips, status)
values
('Uốn cành bằng dây','uon-canh-bang-day','WIRING','INTERMEDIATE','Dùng dây để định hướng cành theo bố cục mong muốn.','Dây nhôm, kìm cắt dây, kìm uốn.','Khi cành đủ khỏe và còn độ dẻo phù hợp.','Không siết dây quá mạnh và phải kiểm tra dây định kỳ.','Quấn dây quá chặt hoặc uốn quá nhanh.','Đọc hướng phát triển tự nhiên của cành trước khi ép dáng.','PUBLISHED'),
('Cắt tỉa cành','cat-tia-canh','PRUNING','BEGINNER','Loại bỏ cành thừa để xây dựng cấu trúc cây.','Kéo cắt cành, kìm cắt lõm.','Theo chu kỳ sinh trưởng của từng loài.','Dụng cụ phải sạch và sắc.','Cắt quá nhiều trong một lần.','Xác định cành khung trước rồi mới xử lý cành nhỏ.','PUBLISHED'),
('Tạo nebari','tao-nebari','ROOT','ADVANCED','Xây dựng bộ rễ tỏa đều quanh gốc.','Kìm, dao ghép, dụng cụ xử lý rễ.','Theo đặc tính từng loài và chu kỳ thay chậu.','Không làm tổn thương quá nhiều rễ khỏe.','Chỉ tập trung thân mà bỏ qua bộ rễ.','Nebari đẹp thường cần được xây dựng từ sớm.','PUBLISHED'),
('Tạo lũa','tao-lua-bonsai','DEADWOOD','ADVANCED','Tạo phần gỗ chết mô phỏng cây cổ thụ trong tự nhiên.','Kìm jin, dao lũa, dụng cụ chà gỗ.','Tùy loài cây và điều kiện khô thoáng.','Phải phân biệt phần gỗ sống và phần có thể xử lý.','Tạo lũa quá đều hoặc quá nhân tạo.','Học hình thái deadwood từ cây già ngoài tự nhiên.','PUBLISHED'),
('Thay chậu','thay-chau-bonsai','REPOTTING','INTERMEDIATE','Thay giá thể và điều chỉnh bộ rễ theo chu kỳ.','Chậu, giá thể, kéo cắt rễ.','Theo mùa phù hợp với từng loài.','Không để rễ khô quá lâu.','Cắt rễ quá mạnh hoặc dùng giá thể bí.','Chuẩn bị toàn bộ vật liệu trước khi nhấc cây khỏi chậu.','PUBLISHED')
on conflict (slug) do update set name=excluded.name, status=excluded.status, category=excluded.category, difficulty=excluded.difficulty, description=excluded.description, tools_required=excluded.tools_required, best_season=excluded.best_season, safety_notes=excluded.safety_notes, common_mistakes=excluded.common_mistakes, expert_tips=excluded.expert_tips;

insert into public.bv_technique_steps (technique_id, step_number, title, description, warning)
select t.id, s.step_number, s.title, s.description, s.warning
from public.bv_techniques t
join (values
  ('uon-canh-bang-day',1,'Chọn cành','Chọn cành khỏe, có hướng phát triển phù hợp và đủ độ dẻo.','Không uốn cành đang yếu hoặc có dấu hiệu tổn thương.'),
  ('uon-canh-bang-day',2,'Chọn dây','Chọn đường kính dây phù hợp với cành và mục tiêu uốn.','Dây quá nhỏ dễ mất lực; dây quá lớn khó thao tác.'),
  ('uon-canh-bang-day',3,'Quấn dây','Quấn dây theo góc đều, giữ lực ổn định từ gốc cành lên ngọn.','Không siết dây sâu vào vỏ.'),
  ('uon-canh-bang-day',4,'Định hình','Uốn từng đoạn nhỏ theo đường cong mong muốn thay vì ép một lần.','Dừng lại nếu cành có dấu hiệu nứt hoặc bật vỏ.'),
  ('uon-canh-bang-day',5,'Theo dõi và tháo dây','Kiểm tra định kỳ và tháo dây trước khi dây ăn sâu vào vỏ.','Thời gian lưu dây phụ thuộc loài, tốc độ lớn và độ dày cành.'),
  ('cat-tia-canh',1,'Quan sát tổng thể','Xác định thân chính, cành khung và hướng phát triển trước khi cắt.','Không cắt theo cảm tính chỉ vì một cành đang dài.'),
  ('cat-tia-canh',2,'Đánh dấu cành cần bỏ','Ưu tiên cành chết, cành giao nhau, cành sai vị trí hoặc quá dày.','Giữ lại phương án dự phòng nếu chưa chắc chắn.'),
  ('cat-tia-canh',3,'Cắt đúng vị trí','Cắt gọn bằng dụng cụ sắc, tạo vết cắt phù hợp với loại cành.','Tránh làm dập mô sống.'),
  ('cat-tia-canh',4,'Theo dõi phản ứng','Theo dõi chồi mới và sức khỏe cây sau cắt.','Nếu cây suy, không tiếp tục cắt mạnh.'),
  ('tao-nebari',1,'Kiểm tra bộ rễ','Quan sát hướng rễ và xác định những rễ cần giữ để xây dựng mặt gốc.','Không xử lý quá nhiều rễ trong một lần.'),
  ('tao-nebari',2,'Sắp xếp rễ','Định hướng rễ tỏa đều quanh thân và loại bỏ rễ chồng chéo.','Luôn ưu tiên sức khỏe cây.'),
  ('tao-nebari',3,'Cố định','Cố định rễ ở vị trí mới bằng phương pháp phù hợp.','Không làm rễ bị gập hoặc đứt.'),
  ('tao-nebari',4,'Nuôi và kiểm tra','Cho cây thời gian hồi phục và kiểm tra sự phát triển của nebari qua từng lần thay chậu.','Nebari là quá trình dài hạn, không nên nóng vội.'),
  ('tao-lua-bonsai',1,'Xác định phần gỗ','Xác định vùng có thể tạo deadwood dựa trên cấu trúc thân và dòng sống.','Không xử lý phần có vai trò duy trì sự sống của cây.'),
  ('tao-lua-bonsai',2,'Bóc và tạo đường nét','Loại bỏ phần gỗ phù hợp rồi tạo đường nét tự nhiên.','Tránh tạo bề mặt quá phẳng hoặc đối xứng.'),
  ('tao-lua-bonsai',3,'Làm mềm dấu vết','Tinh chỉnh cạnh và chuyển tiếp để deadwood hòa với thân.','Không lạm dụng dụng cụ máy.'),
  ('tao-lua-bonsai',4,'Theo dõi lão hóa','Để thời gian, môi trường và chăm sóc tạo thêm vẻ tự nhiên cho gỗ.','Không cần cố làm cây trông già ngay lập tức.'),
  ('thay-chau-bonsai',1,'Chuẩn bị','Chuẩn bị chậu, lưới, dây cố định và giá thể trước khi thao tác.','Không để cây ngoài không khí quá lâu.'),
  ('thay-chau-bonsai',2,'Lấy cây ra','Nhấc cây khỏi chậu và kiểm tra bộ rễ.','Tránh kéo mạnh vào thân.'),
  ('thay-chau-bonsai',3,'Xử lý rễ','Loại bỏ phần rễ không cần thiết và điều chỉnh vị trí.','Mức độ cắt phụ thuộc loài và sức khỏe cây.'),
  ('thay-chau-bonsai',4,'Trồng lại','Đặt cây đúng vị trí, bổ sung giá thể và cố định chắc chắn.','Không để khoảng rỗng lớn quanh rễ.'),
  ('thay-chau-bonsai',5,'Hồi phục','Đặt cây ở điều kiện phù hợp và theo dõi sau thay chậu.','Tránh thúc cây quá mạnh ngay sau khi thay chậu.')
) as s(slug,step_number,title,description,warning) on s.slug=t.slug
on conflict (technique_id, step_number) do update set title=excluded.title, description=excluded.description, warning=excluded.warning;

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

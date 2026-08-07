-- Demo exhibition data for Bonsai Viet
-- Run after database/bonsai-schema.sql and replace sample details with verified official event information.

insert into public.bv_locations (name,address,province,district,latitude,longitude,description) values
('Khu triển lãm sinh vật cảnh Thái Nguyên','Thái Nguyên','Thái Nguyên',null,21.594423,105.848349,'Địa điểm mẫu cho dữ liệu phát triển tính năng.'),
('Công viên Tao Đàn','Quận 1','TP. Hồ Chí Minh','Quận 1',10.776889,106.690556,'Địa điểm mẫu cho dữ liệu phát triển tính năng.'),
('Công viên Thống Nhất','Hai Bà Trưng','Hà Nội','Hai Bà Trưng',21.016900,105.841000,'Địa điểm mẫu cho dữ liệu phát triển tính năng.')
on conflict do nothing;

insert into public.bv_events (name,slug,description,event_type,organizer,location_id,start_date,end_date,official_url,status)
select 'Ngày hội sinh vật cảnh Thái Nguyên','ngay-hoi-sinh-vat-canh-thai-nguyen','Dữ liệu mẫu — cần xác minh với ban tổ chức trước khi xuất bản.','Festival','Bonsai Việt',l.id,now()+interval '14 days',now()+interval '17 days',null,'DRAFT'
from public.bv_locations l where l.name='Khu triển lãm sinh vật cảnh Thái Nguyên' limit 1;

insert into public.bv_events (name,slug,description,event_type,organizer,location_id,start_date,end_date,official_url,status)
select 'Triển lãm cây cảnh thành phố','trien-lam-cay-canh-thanh-pho','Dữ liệu mẫu — cần xác minh với ban tổ chức trước khi xuất bản.','Exhibition','Bonsai Việt',l.id,now()+interval '30 days',now()+interval '33 days',null,'DRAFT'
from public.bv_locations l where l.name='Công viên Tao Đàn' limit 1;

insert into public.bv_events (name,slug,description,event_type,organizer,location_id,start_date,end_date,official_url,status)
select 'Hội cây cảnh mùa thu','hoi-cay-canh-mua-thu','Dữ liệu mẫu — cần xác minh với ban tổ chức trước khi xuất bản.','Exhibition','Bonsai Việt',l.id,now()+interval '45 days',now()+interval '48 days',null,'DRAFT'
from public.bv_locations l where l.name='Công viên Thống Nhất' limit 1;
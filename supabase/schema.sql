-- BACH KHOA BONSAI VIET
-- Run this file once in Supabase SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS and ON CONFLICT for seeds.

create extension if not exists pgcrypto;

create table if not exists public.bv_plants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  scientific_name text,
  short_description text,
  description text,
  difficulty text,
  sunlight text,
  watering text,
  soil text,
  growth_rate text,
  pruning_notes text,
  status text not null default 'DRAFT' check (status in ('DRAFT','PUBLISHED','ARCHIVED')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.bv_techniques (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text,
  difficulty text,
  best_season text,
  tools_required text,
  common_mistakes text,
  status text not null default 'DRAFT' check (status in ('DRAFT','PUBLISHED','ARCHIVED')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.bv_technique_steps (
  id uuid primary key default gen_random_uuid(),
  technique_id uuid not null references public.bv_techniques(id) on delete cascade,
  step_number integer not null,
  title text not null,
  content text,
  warning text,
  unique(technique_id, step_number)
);

create table if not exists public.bv_forms (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, description text, status text not null default 'PUBLISHED', created_at timestamptz not null default now()
);
create table if not exists public.bv_styles (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, description text, status text not null default 'PUBLISHED', created_at timestamptz not null default now()
);
create table if not exists public.bv_artists (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, biography text, region text, status text not null default 'PUBLISHED', created_at timestamptz not null default now()
);
create table if not exists public.bv_works (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, description text, artist_id uuid references public.bv_artists(id) on delete set null, status text not null default 'PUBLISHED', created_at timestamptz not null default now()
);
create table if not exists public.bv_articles (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, excerpt text, content text, status text not null default 'DRAFT', published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.bv_plant_techniques (plant_id uuid references public.bv_plants(id) on delete cascade, technique_id uuid references public.bv_techniques(id) on delete cascade, difficulty text, primary key (plant_id, technique_id));
create table if not exists public.bv_plant_forms (plant_id uuid references public.bv_plants(id) on delete cascade, form_id uuid references public.bv_forms(id) on delete cascade, primary key (plant_id, form_id));
create table if not exists public.bv_plant_styles (plant_id uuid references public.bv_plants(id) on delete cascade, style_id uuid references public.bv_styles(id) on delete cascade, primary key (plant_id, style_id));
create table if not exists public.bv_form_styles (form_id uuid references public.bv_forms(id) on delete cascade, style_id uuid references public.bv_styles(id) on delete cascade, primary key (form_id, style_id));
create table if not exists public.bv_artist_styles (artist_id uuid references public.bv_artists(id) on delete cascade, style_id uuid references public.bv_styles(id) on delete cascade, primary key (artist_id, style_id));
create table if not exists public.bv_work_plants (work_id uuid references public.bv_works(id) on delete cascade, plant_id uuid references public.bv_plants(id) on delete cascade, primary key (work_id, plant_id));
create table if not exists public.bv_work_techniques (work_id uuid references public.bv_works(id) on delete cascade, technique_id uuid references public.bv_techniques(id) on delete cascade, primary key (work_id, technique_id));
create table if not exists public.bv_work_forms (work_id uuid references public.bv_works(id) on delete cascade, form_id uuid references public.bv_forms(id) on delete cascade, primary key (work_id, form_id));
create table if not exists public.bv_work_styles (work_id uuid references public.bv_works(id) on delete cascade, style_id uuid references public.bv_styles(id) on delete cascade, primary key (work_id, style_id));
create table if not exists public.bv_article_plants (article_id uuid references public.bv_articles(id) on delete cascade, plant_id uuid references public.bv_plants(id) on delete cascade, primary key (article_id, plant_id));
create table if not exists public.bv_article_techniques (article_id uuid references public.bv_articles(id) on delete cascade, technique_id uuid references public.bv_techniques(id) on delete cascade, primary key (article_id, technique_id));
create table if not exists public.bv_article_forms (article_id uuid references public.bv_articles(id) on delete cascade, form_id uuid references public.bv_forms(id) on delete cascade, primary key (article_id, form_id));
create table if not exists public.bv_article_styles (article_id uuid references public.bv_articles(id) on delete cascade, style_id uuid references public.bv_styles(id) on delete cascade, primary key (article_id, style_id));

alter table public.bv_plants enable row level security;
alter table public.bv_techniques enable row level security;
alter table public.bv_technique_steps enable row level security;
alter table public.bv_forms enable row level security;
alter table public.bv_styles enable row level security;
alter table public.bv_artists enable row level security;
alter table public.bv_works enable row level security;
alter table public.bv_articles enable row level security;
alter table public.bv_plant_techniques enable row level security;
alter table public.bv_plant_forms enable row level security;
alter table public.bv_plant_styles enable row level security;
alter table public.bv_form_styles enable row level security;
alter table public.bv_artist_styles enable row level security;
alter table public.bv_work_plants enable row level security;
alter table public.bv_work_techniques enable row level security;
alter table public.bv_work_forms enable row level security;
alter table public.bv_work_styles enable row level security;
alter table public.bv_article_plants enable row level security;
alter table public.bv_article_techniques enable row level security;
alter table public.bv_article_forms enable row level security;
alter table public.bv_article_styles enable row level security;

-- Public read policies only expose published content.
do $$ begin
  create policy bv_plants_public_read on public.bv_plants for select to anon, authenticated using (status='PUBLISHED');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy bv_techniques_public_read on public.bv_techniques for select to anon, authenticated using (status='PUBLISHED');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy bv_steps_public_read on public.bv_technique_steps for select to anon, authenticated using (exists(select 1 from public.bv_techniques t where t.id=technique_id and t.status='PUBLISHED'));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy bv_forms_public_read on public.bv_forms for select to anon, authenticated using (status='PUBLISHED');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy bv_styles_public_read on public.bv_styles for select to anon, authenticated using (status='PUBLISHED');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy bv_artists_public_read on public.bv_artists for select to anon, authenticated using (status='PUBLISHED');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy bv_works_public_read on public.bv_works for select to anon, authenticated using (status='PUBLISHED');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy bv_articles_public_read on public.bv_articles for select to anon, authenticated using (status='PUBLISHED');
exception when duplicate_object then null; end $$;

-- Relation tables are safe to read only when the referenced content is public.
do $$ begin create policy bv_plant_techniques_read on public.bv_plant_techniques for select to anon, authenticated using (exists(select 1 from bv_plants p where p.id=plant_id and p.status='PUBLISHED') and exists(select 1 from bv_techniques t where t.id=technique_id and t.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_plant_forms_read on public.bv_plant_forms for select to anon, authenticated using (exists(select 1 from bv_plants p where p.id=plant_id and p.status='PUBLISHED') and exists(select 1 from bv_forms f where f.id=form_id and f.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_plant_styles_read on public.bv_plant_styles for select to anon, authenticated using (exists(select 1 from bv_plants p where p.id=plant_id and p.status='PUBLISHED') and exists(select 1 from bv_styles s where s.id=style_id and s.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_form_styles_read on public.bv_form_styles for select to anon, authenticated using (exists(select 1 from bv_forms f where f.id=form_id and f.status='PUBLISHED') and exists(select 1 from bv_styles s where s.id=style_id and s.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_artist_styles_read on public.bv_artist_styles for select to anon, authenticated using (exists(select 1 from bv_artists a where a.id=artist_id and a.status='PUBLISHED') and exists(select 1 from bv_styles s where s.id=style_id and s.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_work_plants_read on public.bv_work_plants for select to anon, authenticated using (exists(select 1 from bv_works w where w.id=work_id and w.status='PUBLISHED') and exists(select 1 from bv_plants p where p.id=plant_id and p.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_work_techniques_read on public.bv_work_techniques for select to anon, authenticated using (exists(select 1 from bv_works w where w.id=work_id and w.status='PUBLISHED') and exists(select 1 from bv_techniques t where t.id=technique_id and t.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_work_forms_read on public.bv_work_forms for select to anon, authenticated using (exists(select 1 from bv_works w where w.id=work_id and w.status='PUBLISHED') and exists(select 1 from bv_forms f where f.id=form_id and f.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_work_styles_read on public.bv_work_styles for select to anon, authenticated using (exists(select 1 from bv_works w where w.id=work_id and w.status='PUBLISHED') and exists(select 1 from bv_styles s where s.id=style_id and s.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_article_plants_read on public.bv_article_plants for select to anon, authenticated using (exists(select 1 from bv_articles a where a.id=article_id and a.status='PUBLISHED') and exists(select 1 from bv_plants p where p.id=plant_id and p.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_article_techniques_read on public.bv_article_techniques for select to anon, authenticated using (exists(select 1 from bv_articles a where a.id=article_id and a.status='PUBLISHED') and exists(select 1 from bv_techniques t where t.id=technique_id and t.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_article_forms_read on public.bv_article_forms for select to anon, authenticated using (exists(select 1 from bv_articles a where a.id=article_id and a.status='PUBLISHED') and exists(select 1 from bv_forms f where f.id=form_id and f.status='PUBLISHED')); exception when duplicate_object then null; end $$;
do $$ begin create policy bv_article_styles_read on public.bv_article_styles for select to anon, authenticated using (exists(select 1 from bv_articles a where a.id=article_id and a.status='PUBLISHED') and exists(select 1 from bv_styles s where s.id=style_id and s.status='PUBLISHED')); exception when duplicate_object then null; end $$;

insert into public.bv_plants (slug,name,scientific_name,short_description,description,difficulty,sunlight,watering,soil,growth_rate,pruning_notes,status) values
('sanh','Sanh','Ficus microcarpa','Loài cây nhiệt đới khỏe, phát triển mạnh, rất phổ biến trong bonsai Việt.','Sanh có sức sống tốt, thân nhanh phát triển và đáp ứng tốt với cắt giật, uốn cành và tạo rễ.','Dễ','Nắng sáng đến nắng đầy đủ','Tưới khi bề mặt giá thể se khô','Giá thể thoát nước tốt','Nhanh','Có thể cắt giật nhiều lần trong mùa sinh trưởng.','PUBLISHED'),
('mai-chieu-thuy','Mai chiếu thủy','Wrightia religiosa','Loài bonsai hoa nhỏ, lá nhỏ, phù hợp tạo tác phẩm tinh tế.','Mai chiếu thủy thường được chơi nhờ lá nhỏ, hoa thơm và khả năng tạo tán dày.','Trung bình','Nắng nhẹ đến nắng đầy đủ','Giữ ẩm vừa phải, tránh úng','Thoát nước tốt, giàu hữu cơ','Trung bình','Tỉa duy trì tán thường xuyên, tránh cắt quá mạnh khi cây yếu.','PUBLISHED'),
('linh-sam','Linh sam','Antidesma acidum','Cây lá nhỏ, thân già đẹp, được ưa chuộng trong bonsai Việt.','Linh sam có thể tạo thân già và chi cành mạnh, phù hợp nhiều dáng bonsai.','Trung bình','Nắng đầy đủ','Tưới đều nhưng không để úng','Thoát nước rất tốt','Trung bình','Theo dõi độ mạnh của chồi trước khi cắt giật.','PUBLISHED'),
('tung','Tùng','Podocarpus macrophyllus','Cây lá kim thường được tạo dáng theo phong cách bonsai cổ điển.','Tùng phù hợp với các tác phẩm cần cấu trúc cành rõ, thân chắc và cảm giác cổ thụ.','Khó','Nắng đầy đủ','Tưới vừa phải','Thoát nước tốt','Chậm','Tạo tán từ từ, tránh loại bỏ quá nhiều lá cùng lúc.','PUBLISHED'),
('si','Si','Ficus benjamina','Cây khỏe, dễ tạo rễ và phù hợp thực hành nhiều kỹ thuật bonsai.','Si có sức sống tốt, phù hợp người mới luyện cắt giật, nuôi cành và tạo rễ.','Dễ','Nắng sáng đến nắng đầy đủ','Tưới đều','Thoát nước tốt','Nhanh','Ưu tiên nuôi cây khỏe trước khi tạo tác mạnh.','PUBLISHED')
on conflict (slug) do update set name=excluded.name,description=excluded.description,status='PUBLISHED';

insert into public.bv_techniques (slug,name,description,category,difficulty,best_season,tools_required,common_mistakes,status) values
('uon-canh-bang-day','Uốn cành bằng dây','Kỹ thuật dùng dây để định hướng cành theo cấu trúc mong muốn mà hạn chế tổn thương mô.','Tạo dáng','Trung bình','Mùa sinh trưởng phù hợp từng loài','Dây nhôm, kìm cắt dây, kìm uốn','Quấn dây quá chặt, bẻ góc quá mạnh hoặc để dây hằn quá lâu.','PUBLISHED'),
('cat-giat','Cắt giật','Cắt lùi cành để tạo chuyển chi, kích chồi mới và xây cấu trúc tán.','Tạo chi cành','Trung bình','Theo mùa sinh trưởng của từng loài','Kéo cắt cành, keo liền sẹo','Cắt khi cây yếu hoặc cắt quá nhiều trong một lần.','PUBLISHED'),
('tao-lao-hoa-than','Tạo lão hóa thân','Tạo cảm giác thân già bằng kỹ thuật xử lý gỗ và vỏ có kiểm soát.','Tạo thân','Khó','Khi cây khỏe và thời tiết phù hợp','Dụng cụ tạo lũa, bàn chải, chất bảo vệ gỗ phù hợp','Làm tổn thương quá sâu hoặc xử lý khi cây đang suy yếu.','PUBLISHED'),
('ghep-canh','Ghép cành','Đưa một cành hoặc chồi phù hợp vào vị trí cần bổ sung trên cây.','Ghép','Khó','Tùy loài và thời điểm sinh trưởng','Dao ghép, băng ghép, dụng cụ vệ sinh','Mặt cắt không khớp, để khô mối ghép hoặc chăm sóc sai sau ghép.','PUBLISHED')
on conflict (slug) do update set name=excluded.name,description=excluded.description,status='PUBLISHED';

insert into public.bv_technique_steps (technique_id,step_number,title,content,warning)
select id,1,'Kiểm tra cành','Chọn cành khỏe, xác định hướng uốn và vị trí bắt đầu quấn dây.','Không uốn cành đang yếu hoặc có dấu hiệu bệnh.' from bv_techniques where slug='uon-canh-bang-day'
on conflict (technique_id,step_number) do update set title=excluded.title,content=excluded.content,warning=excluded.warning;
insert into public.bv_technique_steps (technique_id,step_number,title,content,warning)
select id,2,'Quấn dây','Quấn dây theo góc đều, giữ dây đủ chắc để điều khiển cành nhưng không siết vào vỏ.','Kiểm tra định kỳ để tháo dây trước khi dây ăn vào vỏ.' from bv_techniques where slug='uon-canh-bang-day'
on conflict (technique_id,step_number) do update set title=excluded.title,content=excluded.content,warning=excluded.warning;
insert into public.bv_technique_steps (technique_id,step_number,title,content,warning)
select id,3,'Uốn từng đoạn','Uốn từ từ theo từng đoạn nhỏ, quan sát phản ứng của cành sau mỗi lần điều chỉnh.','Không cố đạt góc cuối cùng trong một lần.' from bv_techniques where slug='uon-canh-bang-day'
on conflict (technique_id,step_number) do update set title=excluded.title,content=excluded.content,warning=excluded.warning;

insert into public.bv_forms(slug,name,description) values
('truc','Dáng trực','Thân hướng lên, tạo cảm giác vững và cân đối.'),('xien','Dáng xiên','Thân nghiêng, tạo cảm giác chuyển động nhưng vẫn có điểm tựa.'),('hoanh','Dáng hoành','Thân phát triển theo phương ngang, thường tạo cảm giác cổ thụ.'),('huyen','Dáng huyền','Cành hoặc thân đổ xuống thấp hơn mặt chậu.')
on conflict(slug) do update set name=excluded.name,description=excluded.description,status='PUBLISHED';

insert into public.bv_styles(slug,name,description) values
('bonsai-nhat','Bonsai Nhật','Hệ thống thẩm mỹ chú trọng cấu trúc thân, chi cành, khoảng trống và sự cân bằng.'),
('bonsai-viet-truyen-thong','Bonsai Việt truyền thống','Các lối chơi và quan niệm tạo hình phát triển trong văn hóa cây cảnh Việt Nam.'),
('tam-da','Tam đa','Lối tạo tác gắn với quan niệm Phúc, Lộc, Thọ trong cây cảnh.'),
('long-ly-quy-phung','Long - Ly - Quy - Phụng','Nhóm hình tượng linh vật thường xuất hiện trong nghệ thuật cây cảnh và tạo hình.')
on conflict(slug) do update set name=excluded.name,description=excluded.description,status='PUBLISHED';

insert into public.bv_plant_techniques(plant_id,technique_id,difficulty)
select p.id,t.id,t.difficulty from bv_plants p cross join bv_techniques t where p.slug in ('sanh','si') and t.slug in ('uon-canh-bang-day','cat-giat') on conflict do nothing;
insert into public.bv_plant_techniques(plant_id,technique_id,difficulty)
select p.id,t.id,t.difficulty from bv_plants p cross join bv_techniques t where p.slug in ('linh-sam','mai-chieu-thuy') and t.slug in ('uon-canh-bang-day','cat-giat','ghep-canh') on conflict do nothing;
insert into public.bv_plant_techniques(plant_id,technique_id,difficulty)
select p.id,t.id,t.difficulty from bv_plants p cross join bv_techniques t where p.slug in ('tung') and t.slug in ('uon-canh-bang-day','cat-giat','tao-lao-hoa-than') on conflict do nothing;

insert into public.bv_plant_forms(plant_id,form_id)
select p.id,f.id from bv_plants p cross join bv_forms f where p.slug in ('sanh','si') and f.slug in ('truc','xien','hoanh') on conflict do nothing;
insert into public.bv_plant_forms(plant_id,form_id)
select p.id,f.id from bv_plants p cross join bv_forms f where p.slug in ('linh-sam','mai-chieu-thuy') and f.slug in ('truc','xien','huyen') on conflict do nothing;

insert into public.bv_plant_styles(plant_id,style_id)
select p.id,s.id from bv_plants p cross join bv_styles s where p.slug in ('sanh','si','linh-sam','mai-chieu-thuy','tung') and s.slug in ('bonsai-nhat','bonsai-viet-truyen-thong') on conflict do nothing;

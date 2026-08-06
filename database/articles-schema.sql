-- BONSAI VIET - article SEO extensions
-- Run after database/bonsai-schema.sql

create table if not exists public.bv_article_plants (
  article_id bigint not null references public.bv_articles(id) on delete cascade,
  plant_id bigint not null references public.bv_plants(id) on delete cascade,
  primary key (article_id, plant_id)
);

create table if not exists public.bv_article_techniques (
  article_id bigint not null references public.bv_articles(id) on delete cascade,
  technique_id bigint not null references public.bv_techniques(id) on delete cascade,
  primary key (article_id, technique_id)
);

create table if not exists public.bv_article_forms (
  article_id bigint not null references public.bv_articles(id) on delete cascade,
  form_id bigint not null references public.bv_forms(id) on delete cascade,
  primary key (article_id, form_id)
);

create table if not exists public.bv_article_styles (
  article_id bigint not null references public.bv_articles(id) on delete cascade,
  style_id bigint not null references public.bv_styles(id) on delete cascade,
  primary key (article_id, style_id)
);

create table if not exists public.bv_article_works (
  article_id bigint not null references public.bv_articles(id) on delete cascade,
  work_id bigint not null references public.bv_works(id) on delete cascade,
  primary key (article_id, work_id)
);

create index if not exists bv_articles_slug_idx on public.bv_articles(slug);
create index if not exists bv_article_plants_plant_idx on public.bv_article_plants(plant_id);
create index if not exists bv_article_techniques_technique_idx on public.bv_article_techniques(technique_id);
create index if not exists bv_article_forms_form_idx on public.bv_article_forms(form_id);
create index if not exists bv_article_styles_style_idx on public.bv_article_styles(style_id);
create index if not exists bv_article_works_work_idx on public.bv_article_works(work_id);

alter table public.bv_article_plants enable row level security;
alter table public.bv_article_techniques enable row level security;
alter table public.bv_article_forms enable row level security;
alter table public.bv_article_styles enable row level security;
alter table public.bv_article_works enable row level security;

drop policy if exists "Public read article plant links" on public.bv_article_plants;
create policy "Public read article plant links" on public.bv_article_plants for select using (exists (select 1 from public.bv_articles a where a.id = article_id and a.status = 'PUBLISHED'));

drop policy if exists "Public read article technique links" on public.bv_article_techniques;
create policy "Public read article technique links" on public.bv_article_techniques for select using (exists (select 1 from public.bv_articles a where a.id = article_id and a.status = 'PUBLISHED'));

drop policy if exists "Public read article form links" on public.bv_article_forms;
create policy "Public read article form links" on public.bv_article_forms for select using (exists (select 1 from public.bv_articles a where a.id = article_id and a.status = 'PUBLISHED'));

drop policy if exists "Public read article style links" on public.bv_article_styles;
create policy "Public read article style links" on public.bv_article_styles for select using (exists (select 1 from public.bv_articles a where a.id = article_id and a.status = 'PUBLISHED'));

drop policy if exists "Public read article work links" on public.bv_article_works;
create policy "Public read article work links" on public.bv_article_works for select using (exists (select 1 from public.bv_articles a where a.id = article_id and a.status = 'PUBLISHED'));

-- Editors can manage all article relationship records.
drop policy if exists "Editors manage article plant links" on public.bv_article_plants;
create policy "Editors manage article plant links" on public.bv_article_plants for all using (public.bv_is_editor()) with check (public.bv_is_editor());

drop policy if exists "Editors manage article technique links" on public.bv_article_techniques;
create policy "Editors manage article technique links" on public.bv_article_techniques for all using (public.bv_is_editor()) with check (public.bv_is_editor());

drop policy if exists "Editors manage article form links" on public.bv_article_forms;
create policy "Editors manage article form links" on public.bv_article_forms for all using (public.bv_is_editor()) with check (public.bv_is_editor());

drop policy if exists "Editors manage article style links" on public.bv_article_styles;
create policy "Editors manage article style links" on public.bv_article_styles for all using (public.bv_is_editor()) with check (public.bv_is_editor());

drop policy if exists "Editors manage article work links" on public.bv_article_works;
create policy "Editors manage article work links" on public.bv_article_works for all using (public.bv_is_editor()) with check (public.bv_is_editor());

-- ==========================================================
-- TESTIMONIES OF PRAISE: ADOTOPOC RESOURCES & ANALYTICS MIGRATION
-- Run this in your Supabase SQL Editor: https://huiytazoiiqrebugdbds.supabase.co
-- ==========================================================

create table if not exists adotopoc_resources (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  category text not null check (category in ('video','graphic','ecard','photo','other')),
  event_name text default 'ADOTOPOC 2026',
  event_date date default '2026-09-05',
  thumbnail_url text,
  file_url text not null,
  file_type text,
  file_size_bytes bigint,
  tags text[],
  status text default 'published' check (status in ('published','draft')),
  views integer default 0,
  downloads integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table adotopoc_resources enable row level security;

-- Public can read all published resources
drop policy if exists Public read published on adotopoc_resources;
create policy Public read published on adotopoc_resources for select using (status = 'published');

-- Authenticated users (admin) have full CRUD
drop policy if exists Authenticated manage on adotopoc_resources;
create policy Authenticated manage on adotopoc_resources for all to authenticated using (true);

-- Anonymous users can increment counts
drop policy if exists Anon update counts on adotopoc_resources;
create policy Anon update counts on adotopoc_resources for update to anon using (true);

-- Event tracking table for audit & analytics
create table if not exists adotopoc_resource_events (
  id bigint generated always as identity primary key,
  resource_id bigint references adotopoc_resources(id) on delete cascade,
  event_type text check (event_type in ('view','download')),
  device_type text,
  created_at timestamptz default now()
);

alter table adotopoc_resource_events enable row level security;

drop policy if exists Public insert events on adotopoc_resource_events;
create policy Public insert events on adotopoc_resource_events for insert with check (true);

drop policy if exists Authenticated read events on adotopoc_resource_events;
create policy Authenticated read events on adotopoc_resource_events for select to authenticated using (true);

-- Atomic RPC function for incrementing view count
create or replace function increment_adotopoc_view(p_resource_id bigint, p_device_type text default 'unknown')
returns void language plpgsql security definer as 
begin
  update adotopoc_resources
  set views = coalesce(views, 0) + 1,
      updated_at = now()
  where id = p_resource_id;

  insert into adotopoc_resource_events (resource_id, event_type, device_type, created_at)
  values (p_resource_id, 'view', p_device_type, now());
end;
;

-- Atomic RPC function for incrementing download count
create or replace function increment_adotopoc_download(p_resource_id bigint, p_device_type text default 'unknown')
returns void language plpgsql security definer as 
begin
  update adotopoc_resources
  set downloads = coalesce(downloads, 0) + 1,
      updated_at = now()
  where id = p_resource_id;

  insert into adotopoc_resource_events (resource_id, event_type, device_type, created_at)
  values (p_resource_id, 'download', p_device_type, now());
end;
;

-- ==========================================================
-- TESTIMONIES OF PRAISE: LIVE STREAM VIEWER TRACKING
-- Run once in the Supabase SQL Editor. Safe to re-run.
-- Creates (if missing) stream_sessions + stream_viewers, the RPC
-- functions used by /live, and read access for the Admin dashboard.
-- ==========================================================

create table if not exists stream_sessions (
  id bigint generated always as identity primary key,
  title text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists stream_viewers (
  id bigint generated always as identity primary key,
  session_id bigint not null references stream_sessions(id) on delete cascade,
  name text,
  group_size integer not null default 1,
  joined_at timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  left_at timestamptz
);

alter table stream_sessions enable row level security;
alter table stream_viewers enable row level security;

-- Only signed-in admins can read the raw tables (visitors go through the functions below)
drop policy if exists "Authenticated read stream_sessions" on stream_sessions;
create policy "Authenticated read stream_sessions" on stream_sessions
  for select to authenticated using (true);

drop policy if exists "Authenticated read stream_viewers" on stream_viewers;
create policy "Authenticated read stream_viewers" on stream_viewers
  for select to authenticated using (true);

-- Functions are (re)built using whatever type the id columns actually have
do $do$
declare
  sid text := (select format_type(atttypid, atttypmod) from pg_attribute
               where attrelid = 'public.stream_sessions'::regclass and attname = 'id');
  vid text := (select format_type(atttypid, atttypmod) from pg_attribute
               where attrelid = 'public.stream_viewers'::regclass and attname = 'id');
begin
  execute 'drop function if exists public.get_or_create_stream_session(text)';
  execute format($f$
    create function public.get_or_create_stream_session(p_title text)
    returns %1$s language plpgsql security definer set search_path = public as $b$
    declare v_id %1$s;
    begin
      select id into v_id from stream_sessions
        where ended_at is null and title = p_title
        order by started_at desc limit 1;
      if v_id is null then
        insert into stream_sessions (title) values (p_title) returning id into v_id;
      end if;
      return v_id;
    end $b$;
  $f$, sid);

  execute format('drop function if exists public.join_stream_session(%s, text, integer)', sid);
  execute format($f$
    create function public.join_stream_session(p_session_id %1$s, p_name text default null, p_group_size integer default 1)
    returns %2$s language plpgsql security definer set search_path = public as $b$
    declare v_id %2$s;
    begin
      insert into stream_viewers (session_id, name, group_size, joined_at, last_seen)
      values (p_session_id, p_name, greatest(coalesce(p_group_size, 1), 1), now(), now())
      returning id into v_id;
      return v_id;
    end $b$;
  $f$, sid, vid);

  execute format('drop function if exists public.heartbeat_stream_viewer(%s)', vid);
  execute format($f$
    create function public.heartbeat_stream_viewer(p_viewer_id %1$s)
    returns void language sql security definer set search_path = public as $b$
      update stream_viewers set last_seen = now() where id = p_viewer_id and left_at is null;
    $b$;
  $f$, vid);

  execute format('drop function if exists public.leave_stream_session(%s)', vid);
  execute format($f$
    create function public.leave_stream_session(p_viewer_id %1$s)
    returns void language sql security definer set search_path = public as $b$
      update stream_viewers set left_at = now() where id = p_viewer_id and left_at is null;
    $b$;
  $f$, vid);

  execute format('drop function if exists public.get_stream_viewer_count(%s)', sid);
  execute format($f$
    create function public.get_stream_viewer_count(p_session_id %1$s)
    returns integer language sql security definer stable set search_path = public as $b$
      select coalesce(sum(group_size), 0)::integer from stream_viewers
      where session_id = p_session_id and left_at is null
        and last_seen > now() - interval '45 seconds';
    $b$;
  $f$, sid);
  execute 'grant execute on function public.get_or_create_stream_session(text) to anon, authenticated';
  execute format('grant execute on function public.get_stream_viewer_count(%s) to anon, authenticated', sid);
  execute format('grant execute on function public.join_stream_session(%s, text, integer) to anon, authenticated', sid);
  execute format('grant execute on function public.heartbeat_stream_viewer(%s) to anon, authenticated', vid);
  execute format('grant execute on function public.leave_stream_session(%s) to anon, authenticated', vid);
end
$do$;

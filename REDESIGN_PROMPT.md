# Testimonies of Praise — Full Redesign Prompt (Repo-Aware)

**GitHub repo:** `https://github.com/Y24KL/testimoniesofpraiseweb`

---

## WHAT ALREADY EXISTS — READ THIS BEFORE TOUCHING ANYTHING

This is a **static HTML/CSS/JS site** with no build step, no React, no npm. Do not assume a React/Next.js structure exists — it does not yet. The redesign migrates it into React.

**Current file structure:**
```
index.html          — homepage (hero, carousel, testimony form)
live.html           — live stream page with chat panel
live.js             — legacy stream JS (superseded by inline script in live.html)
main.js             — homepage JS (Swiper carousel, view tracking, testimony form)
admin/
  index.html        — Decap CMS content manager (git-based, GitHub OAuth)
  analytics.html    — custom admin dashboard (login-gated, 4 tabs)
  config.yml        — Decap CMS schema
data/
  videos.json       — testimony video list (title, url, poster)
  stream.json       — live stream config (status, youtubeVideoId, streamUrl, offlineVideoUrl, heading, description)
  settings.json     — hero title, subtitle, heroVideo, social links
images/             — static images including logo
oauth-provider/     — small Node.js server on Render handling GitHub OAuth for the CMS
```

**CMS:** Decap CMS (git-based). Admins log in at `/admin`, authenticate via GitHub OAuth through `testimoniesofpraise-oauth.onrender.com`, and edit `data/*.json` files directly in the GitHub repo. **This must be preserved exactly as-is** — do not replace the CMS.

**Database:** Supabase project at `https://huiytazoiiqrebugdbds.supabase.co`

Existing tables:
- `video_views` — tracks plays per video URL
- `testimonies` — full_name, zone, message, created_at
- `chat_messages` — name, message, created_at (live stream chat)
- `stream_sessions` — title, started_at, ended_at
- `stream_viewers` — session_id, name, group_size, joined_at, last_seen, left_at
- `prayer_requests` — name, request, created_at
- `daily_words` — title, body, scripture, created_at
- `push_tokens` — token, platform, updated_at

**Anon key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1aXl0YXpvaWlxcmVidWdkYmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjIyODksImV4cCI6MjEwMzU5ODI4OX0.ttS6WDmfrv9I1VRNcRI7EGAmjjK9DRLM9_eiDuHcuz4`

**Formspree endpoint:** `https://formspree.io/f/meepnpbb` (testimony form backup)

**Hosting:** Render (static site, auto-deploys on push to `main`)

**Admin dashboard** (`/admin/analytics.html`) is a custom-built login-gated page (Supabase Auth email/password) with 4 tabs:
- Video Analytics
- Live Stream (viewer count, sessions)
- Testimonies
- Prayer Requests

This dashboard must be **preserved and extended**, not replaced.

**Brand colors (extract from existing CSS):**
- Primary: `#4B006E` (deep purple)
- Accent: `#F5C518` (gold)
- Dark background: `#000000`
- Text: `#FFFFFF`
- Muted text: `#999999`
- Success: `#7CF3B4`
- Error: `#FF6B6B`

---

## THE REDESIGN GOAL

Transform this static site into a **premium React-based immersive experience** while keeping every existing feature working. The site should feel cinematic, spiritual, modern, and emotionally resonant — like a top-tier digital agency built it for a major ministry platform.

---

## TECHNOLOGY STACK

- **React** (Vite — not Next.js, keeping it static-deployable to Render)
- **GSAP + ScrollTrigger** — all scroll animations
- **Lenis** — smooth scrolling (already installed)
- **React Three Fiber / Three.js** — selective 3D elements only where they add genuine value
- **React Bits** — UI components where appropriate
- **Supabase JS client** — same project, same tables
- **Decap CMS** — kept exactly as-is in `/admin/`

**Do NOT use:** Next.js (breaks static Render deploy), random animation libraries when GSAP suffices, heavy 3D scenes on mobile.

---

## LENIS + GSAP INTEGRATION

```js
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Respect `prefers-reduced-motion` — disable animations for users who request it.

---

## PAGES TO BUILD

### `/` — Homepage
- Cinematic hero: full-screen background video (from `data/settings.json` → `heroVideo`), headline from `heroTitle`, subtitle from `heroSubtitle`, two CTAs ("Watch Live Now" → `/live`, "Share Your Testimony" → scroll to form), GSAP entrance animation, scroll indicator
- Live banner: auto-appears when `data/stream.json` → `status === true`
- Testifiers & Recaps: video carousel from `data/videos.json`, each card has a share button that copies `/#[slug]` to clipboard, clicking opens the video
- Testimony submission form: Full Name (required), Zone (required), Testimony (required, min 10 chars) — submits to both Supabase `testimonies` table AND Formspree `meepnpbb`. Success: animated checkmark. Error: shake animation
- On page load with a `#[video-slug]` hash: scroll to carousel, slide to that video, pulse it gold

### `/live` — Live Stream
- Reads `data/stream.json`
- If `status: false`: show offline screen with `offlineVideoUrl` playing in background (muted by default, "Tap for sound" button)
- If `status: true`: embed YouTube (extract ID from full URL or bare ID — accept all formats: `watch?v=`, `/live/`, `youtu.be/`, `embed/`) or fall back to HLS `.m3u8` via `streamUrl`
- Live chat panel: reads/writes `chat_messages` table, polls every 4s, name + message both required
- Prayer request form: name + request both required, writes to `prayer_requests` table, success animation
- Viewer tracking: on load when live, call `get_or_create_stream_session(title)` then `join_stream_session(session_id, name, group_size)`, heartbeat every 20s, `leave_stream_session` on page hide

### `/admin/analytics.html` — Admin Dashboard (EXTEND, DO NOT REPLACE)
Currently has 4 tabs. Add a 5th tab: **ADOTOPOC Resources** showing:
- Total resources uploaded
- Top downloaded
- Top viewed
- Recent uploads
- Per-resource view/download counts

### `/adotopoc` — ADOTOPOC Section
Full details below.

---

## ADOTOPOC — A Day of Testimonies of Praise, Outreaches and Crusades

**Event:** 5 September 2026

New Supabase tables needed:

```sql
create table adotopoc_resources (
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
create policy "Public read published" on adotopoc_resources for select using (status = 'published');
create policy "Authenticated manage" on adotopoc_resources for all to authenticated using (true);

create table adotopoc_resource_events (
  id bigint generated always as identity primary key,
  resource_id bigint references adotopoc_resources(id) on delete cascade,
  event_type text check (event_type in ('view','download')),
  device_type text,
  created_at timestamptz default now()
);
alter table adotopoc_resource_events enable row level security;
create policy "Public insert events" on adotopoc_resource_events for insert with check (true);
create policy "Authenticated read events" on adotopoc_resource_events for select to authenticated using (true);
```

---

## ANIMATIONS — REUSABLE COMPONENTS TO BUILD

```
AnimatedText        — word/char split text reveal on scroll
RevealOnScroll      — fade+translate up, configurable delay/stagger
ParallaxImage       — scroll-speed ratio via GSAP
MagneticButton      — cursor-following hover on CTAs
TiltCard            — 3D tilt on mouse move (video cards, resource cards)
SmoothScroll        — Lenis provider wrapper
PageTransition      — GSAP timeline on route change
```

---

## NAVIGATION

- Floating glass nav on desktop, compact on scroll (GSAP)
- Links: HOME / TESTIFIERS / LIVE / ADOTOPOC / SHARE TESTIMONY
- CTA button: "SHARE YOUR TESTIMONY" (gold, pill shape)
- Mobile: animated hamburger → full-screen menu overlay

---

## WHAT MUST NOT BREAK

1. Decap CMS at `/admin/` — GitHub OAuth login, all 3 collections (videos, live stream, settings)
2. Testimony form → Formspree + Supabase dual-write
3. Live stream toggle via `data/stream.json`
4. Video view tracking via `increment_video_view` Supabase RPC
5. Live chat (`chat_messages` table)
6. Stream viewer tracking (sessions + heartbeat)
7. Admin dashboard login (Supabase Auth) and all 4 existing tabs
8. Shareable video links via `#[slug]` hash

---

## DEPLOYMENT

The site must remain deployable as a **static site on Render** (no server-side rendering). Use Vite with `vite build` → `dist/` folder served statically. The `/admin/` folder and `data/*.json` files stay in the repo root as-is — they are not part of the React build output, just served alongside it.

**Render build settings:**
- Build command: `npm run build`
- Publish directory: `dist`

---

## ENVIRONMENT VARIABLES

```
VITE_SUPABASE_URL=https://huiytazoiiqrebugdbds.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_FORMSPREE_ID=meepnpbb
```

# CONNECTO — Multi-Business Digital Profiles & Engagement Platform
**Flagship Profile:** FreCo Cafe  
**Location:** Shop No. 4, 5, 6, A-1, Saraf Choudhary Nagar CHSL, Mahatma Jyotiba Phule Road, Thakur Complex, Kandivali East, Mumbai, Maharashtra 400101  
**Identity:** Mumbai's Ultimate Anime Cafe  
**Themes:** Specialty Coffee, Artisan Ice Cream, Manga Vault, Anime Culture, Game Nights  
**Tagline:** Eat. Play. Read. Repeat.  

---

## 1. Platform Architecture & Tech Stack
- **Framework:** Next.js 15 (App Router with Multi-Tenant Slug Routing: `/b/[slug]`)
- **Language:** TypeScript 5 (Strict Mode enabled)
- **Styling:** Tailwind CSS 3 (Japanese-inspired aesthetic: Charcoal `#0b0c0e`, Warm Cream `#fdfbf7`, Restrained Lacquer Crimson `#e63946`)
- **Animations:** Motion for React (`motion` & `framer-motion`)
- **Icons:** Lucide React (`lucide-react`) + Custom SVG brand marks
- **QR Code Engine:** `qrcode.react` (High-density error-corrected QR generation with PNG print download)
- **Backend / Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security, Storage)
- **Data Architecture:** Central Multi-Business Store (`src/lib/store/businessStore.ts`) supporting tenant slugs, analytics tracking, and session persistence in prototype mode.

---

## 2. Completed Tasks

### Phase 1: Flagship Public Profile (FreCo Cafe)
- [x] Initialized workspace and installed Node.js LTS v24.20.0 and npm 11.19.0 via winget.
- [x] Configured Next.js 15 App Router, TypeScript, and Tailwind CSS.
- [x] Built all flagship sections: Navbar, Hero, Story, Menu Preview, Manga & Gaming, Gallery, Location & Hours, and Footer.
- [x] Marked unverified hours and menu prices strictly with `[Price TBD]` and `[Unverified Placeholder]` flags.
- [x] Verified zero errors via `npm run build` and started local dev server on `http://localhost:3000`.

### Phase A: Multi-Tenant Architecture & Owner Dashboard
- [x] Created multi-business dynamic slug route: `/b/[slug]` (e.g. `http://localhost:3000/b/freco-cafe`).
- [x] Preserved the existing FreCo Cafe public profile at `/` with zero visual regressions.
- [x] Built the private Owner Dashboard (`/dashboard`) with navigation for all 12 modules:
  1. Overview (KPI summary, quick operations, recent activity)
  2. Business Profile Editor (Live editing of name, tagline, identity with session persistence)
  3. Menu / Products / Services (Categorized listing)
  4. Gallery Management
  5. Social & Contact Links
  6. Opening Hours & Amenities
  7. Offers & Coupons (Digital promo codes)
  8. Events & Schedules (Game nights and trivia)
  9. Reviews & Feedback
  10. QR Code Generator (Downloadable print-ready PNG/SVG)
  11. Analytics & Scans (Date-filtered traffic, link clicks, peak-hour visual chart)
  12. Loyalty Management (Points per visit, reward thresholds, duplicate-transaction safeguard notes)

### Phase B: Stable QR Code & Engagement Analytics
- [x] Generated high-resolution QR code pointing strictly to the public profile: `${origin}/b/freco-cafe?src=qr`.
- [x] Guaranteed security isolation: The QR code never points to the private dashboard.
- [x] Source attribution: Implemented `?src=qr` detection on `/b/[slug]` to attribute table scans separately from organic web visits.
- [x] Outbound link tracking: Mapped clicks for Google Maps directions, Instagram visits, phone, and WhatsApp.
- [x] Peak-hour traffic visualization (11:00 AM – 11:00 PM).
- [x] Compliance & data integrity disclaimer: *"Scans and pageviews measure digital engagements, not verified unique customers or proof of physical footfall."*

### Phase C: Backend Preparation & Supabase Integration
- [x] Installed `@supabase/supabase-js` and `qrcode.react`.
- [x] Expanded idempotent schema draft `supabase/migrations/001_initial_schema.sql`; it is prepared but has not been applied.
  - Profiles table (linked to `auth.users`, roles: `owner`, `admin`, `customer`).
  - Businesses table (multi-tenant core, slug, theme_config, address, contact).
  - Menu items, events, gallery items, offers, and analytics events tables.
  - Strict Row Level Security (RLS) policies:
    - Public visitors can only SELECT published businesses and items without logging in.
    - Owners can only view and update their own assigned businesses (`owner_id = auth.uid()`).
    - Admins have multi-business access.
    - Public can log analytics events.
- [x] Created `.env.example` with clear instructions on where `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` will go.
- [x] Supabase client helper checks for public URL/anon-key configuration and uses the browser-safe client; no service-role key is used.
- [x] Owner sign-in requires Supabase Auth; demo credentials and local owner-session claims have been removed.
- [x] Menu price reads/writes use `menu_items`; current dashboard profile/contact/hours/events/offers/gallery saves use business `profile_data`. Live behavior is not verified because no Supabase project configuration is present.

---

## 3. Files Created & Managed
- `PROJECT_STATUS.md` — Master project tracker, roadmap, and test logs.
- `package.json` — Added `@supabase/supabase-js` and `qrcode.react`.
- `.env.example` — Supabase environment template.
- `supabase/migrations/001_initial_schema.sql` — PostgreSQL schema with Row Level Security.
- `src/lib/supabase/client.ts` — Safe Supabase client initializer with configuration check.
- `src/lib/store/businessStore.ts` — Central multi-tenant business state & analytics tracker.
- `src/app/b/[slug]/page.tsx` — Dynamic public business profile with QR attribution (`?src=qr`).
- `src/app/dashboard/page.tsx` — Full Owner Dashboard (12 modules, QR download, analytics, profile editor).
- `src/app/page.tsx` — Root public showcase profile.
- `src/data/frecoData.ts` — Central typed data file.
- `src/components/*` — UI components for FreCo Cafe profile.

---

## 4. Current Status & Discoveries
- **Status:** Existing profile and dashboard UI are preserved. Schema and Supabase persistence plumbing are prepared; live Supabase behavior is not verified.
- **Configuration:** `.env.local` is missing. No Supabase URL/key, applied schema, or owner account is configured.
- **Owner access:** No public signup or demo login is available. Auth users must be invited/created in Supabase and assigned to a business by an administrator.
- **Local mode:** Public routes retain the existing FreCo demo fallback. The dashboard requires configured Supabase Auth and an assigned account.
- The dashboard module list above describes the preserved UI, not twelve verified persistent workflows. Normalized reviews, loyalty, analytics, branches, and other module forms remain follow-up work.

---

## 5. Important Decisions Made
1. **Multi-Business by Design:** Implemented `/b/[slug]` dynamic routing from day one so CONNECTO can serve FreCo Cafe and any future business without architectural rewrites.
2. **Strict Security on QR Codes:** QR codes always encode the public profile URL with `?src=qr`. Under no circumstances will a QR code point to administrative or dashboard endpoints.
3. **Data Integrity on Scans:** Analytics explicitly disclose that online scans measure digital engagement, avoiding false claims of footfall or unique headcounts.
4. **Zero Secrets in Frontend:** `.env.example` highlights that only the Supabase public URL and anon key go to the frontend; the `service_role` key is strictly kept off the client.

---

## 6. Test Results & Bug Resolutions
- Earlier baseline `npm run build`: **PASSED** before this integration work; current build verification is pending.
  - Static route `/`: **Prerendered (111 kB JS)**
  - Dynamic route `/b/[slug]`: **Server-rendered on demand (111 kB JS)**
  - Static route `/dashboard`: **Prerendered (122 kB JS)**
  - TypeScript validation: **Zero type errors**
  - Tailwind bundling: **Zero errors**
- Next.js Dev Server: **ACTIVE (HTTP 200 responses verified)**
- Previous dev-server HTTP checks are historical and do not verify the new database workflow.
- **Resolved Bug (Missing Styling / Unstyled HTML):**
  - *Symptom:* Browser showed raw unstyled HTML (Times New Roman, blue underlined links, raw oversized images).
  - *Root Cause:* Running `next build` while `next dev` was concurrently running overwritten `.next` compilation chunks, causing `/_next/static/css/app/layout.css` to return `404 Not Found`.
  - *Fix:* Terminated conflicting background process, removed stale `.next` cache directory, and restarted clean development server.
  - *Verification:* Verified via automated request that `layout.css` now returns **HTTP 200 with 41,109 bytes of compiled Tailwind CSS**. Verified both `/`, `/b/freco-cafe?src=qr`, and `/dashboard` render with 200 OK and full styles.

---

## 7. Next Steps & Milestones
- [x] **Milestone 1:** Inspect workspace & setup prerequisites.
- [x] **Milestone 2:** Build and test Phase 1 FreCo Cafe public profile.
- [x] **Milestone 3:** Run local development server (`npm run dev`) and preview in browser (`http://localhost:3000`).
- [x] **Milestone 4 (Phase A):** Build private Owner Dashboard (`/dashboard`) with all 12 modules.
- [x] **Milestone 5 (Phase B):** Stable QR Code generator with mobile Wi-Fi phone targeting & private engagement analytics.
- [x] **Original UI milestone:** Owner login and dashboard screens were created; their former demo-session behavior has been removed.
- [x] **Milestone 6:** Owner login uses Supabase Auth; live sign-in is unverified without project configuration.
- [x] **Milestone 7:** Public business API is read-only; unauthenticated disk writes were removed.
- [x] **Milestone 8:** Schema draft and RLS policies are prepared; migration has not been applied.
- [ ] **Milestone 9:** Configure Supabase, apply the migration manually, invite an owner, assign FreCo, and test menu price persistence end to end.

---

## 8. Future Roadmap
1. Public business profile (Phase 1 — COMPLETED & VERIFIED).
2. Multi-tenant Owner Dashboard (Phase A — COMPLETED & VERIFIED).
3. QR Code generation & analytics tracking (Phase B — COMPLETED & VERIFIED).
4. Supabase database, RLS migration & Auth (Phase C — SCHEMA CREATED, PENDING CREDENTIALS).
5. Customer reviews and Google review links.
6. Offer claiming and expiry.
7. Loyalty points linked to purchase transactions with duplicate-transaction safeguards.
8. Branch/store locator.
9. Platform-admin controls for onboarding new businesses and assigning owners.
10. Testing, security review, deployment, and documentation.
## 9. Current Verification (2026-10-15)
- Migration static check: **PASSED** for policy-drop idempotency and RLS enablement on all 16 created public tables. Live PostgreSQL execution was unavailable because `psql` is not installed.
- `npm exec tsc -- --noEmit --pretty false`: **PASSED**.
- `npm run build`: **BLOCKED** by `EINVAL` reading `.next/server/app/page.js`; the existing `next dev` and `next start` processes were left untouched. The generated route artifact is a OneDrive reparse point.
- Menu price edit/save/refresh/public-read workflow: **NOT RUN**. `.env.local`, a Supabase project, an applied migration, and an assigned owner account are unavailable.
- Next manual action: create/configure the Supabase project; disable public signup in Auth settings; run `supabase/migrations/001_initial_schema.sql` once in SQL Editor; add only the project URL and anon key to `.env.local`; invite an owner; promote a trusted administrator using SQL; assign that owner to `freco-cafe`; then test price edit, refresh, and public display. Never put a service-role key in the app.

# ParcPlayMTL

*An open, community-driven map of Montreal's sport fields and eco-friendly parks — built to help residents find, verify, and share fields that support active living and sustainable access.*

**Pioneered with 18 fields across 18 boroughs**, *originally designed and implemented by the City of Montreal.* This project starts from that official city dataset and expands it with live community contributions, eco-scores, and real access details.

> *Live site: [Your Vercel Domain]*

---

### 1. Why This Project?

*Montreal has world-class green space, but finding accurate info is scattered.* This platform centralizes what actually matters when you want to play:

- *Real access info* — free vs permit, hours, surface type
- *Eco-friendly score* — natural drainage, pesticide-free maintenance, native plantings, LED lighting, water management
- *Sustainable transport* — STM metro/bus, BIXI and bike racks, car parking policy
- *Community verification* — seeded city data vs real-person reports

---

### 2. The 18 Pioneers

- *The platform launched with **18 foundational fields**, one per borough, curated from the City of Montreal's official open data*
- *These 18 are marked as **Seeded** in the app*
- *Examples:*
  - *Parc Jeanne-Mance (Le Plateau-Mont-Royal)*
  - *Parc Laurier (Le Plateau-Mont-Royal)*
  - *Parc Jarry (Villeray–Saint-Michel–Parc-Extension)*
  - *Parc La Fontaine (Le Plateau-Mont-Royal)*
  - *+ 14 more across Montreal*
- *Each includes official address, borough, surface, and eco-notes from city records*
- *All new fields added by users are marked **Real Person***

---

### 3. Features

- *Interactive map with 18+ fields*
- *Filter by:*
  - *eco-score*
  - *borough*
  - *surface*
  - *access*
- *Detail modals with contact, website, transit*
- *Vote system for verification*
- *Add new field flow — guest or registered*
- *Supabase persistence for Seeded vs Real contributions*
- *Activity feed*
- *Fully responsive, offline-preview support*

---

### 4. Tech Stack

- *Next.js 14.2.35 — patched, secure*
- *React 18, Tailwind CSS*
- *Supabase — Postgres + RLS for live data*
- *Static export compatible for Vercel*

---

### 5. Quick Start

- *Install and run:*
  ```bash
  npm install
  npm run dev
  ```
- *Build for Vercel:*
  ```bash
  npm run build
  # out/ folder contains static files
  ```

---

### 6. Supabase Setup

*Optional, for live persistence*

- *Create project at supabase.com*
- *Run `supabase.sql` in SQL Editor*
- *Add env vars in Vercel:*
  - *`NEXT_PUBLIC_SUPABASE_URL`*
  - *`NEXT_PUBLIC_SUPABASE_ANON_KEY`*
- *Or connect via Settings ⚙️ modal in the app — stores keys in localStorage*

- *SQL creates:*
  - *`fields`*
  - *`field_votes`*
  - *`activity_logs`*
  - *RLS policies: allow all for anon (community map)*

---

### 7. Project Structure

- *`app/`*
  - *`page.tsx` — Main map + fields + modals + Supabase wiring*
  - *`layout.tsx`*
  - *`globals.css`*
- *`supabase.sql` — Tables + RLS*
- *`index.html` — Standalone drag-drop version (no build needed)*

---

### 8. Contributing

- *Add fields via the UI*
- *Seeded fields are protected*
- *New fields require address, borough, and access info*
- *All contributions are logged in activity*

---

### 9. Credits

- *Foundational data: **City of Montreal Open Data Portal***
- ***18 pioneering fields designed and implemented by the City of Montreal across 18 boroughs***
- *Built as a community eco-sport infrastructure project*

---

### 10. License

*MIT — Free to use, remix, and share for Montreal communities.*

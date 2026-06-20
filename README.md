# NOHCHICHO Anthology

A small static website presenting a Chechen poetry anthology, hosted on GitHub Pages
at **poem.nekalo.de**. Poems are stored in Supabase and loaded by the page at runtime,
with offline copies built in so the site always works.

## Pages
- `index.html` — Home
- `library.html` — Library
- `search.html` — Discovery / search
- `poem.html` — The reader: one sliding window with all poems, searchable, each slide
  with its own background motif

## How the poems work
- The reader loads poems from Supabase (table `poems`) using a **publishable** key.
- Config lives in `assets/poems.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`). The
  publishable key is safe to be public.
- `assets/poems.js` also holds `FALLBACK_POEMS` — shown only if Supabase is unreachable.
- `assets/anthology.js` is the slider engine (you normally don't edit this).

### Add or edit a poem
Easiest: in Supabase → Table Editor → `poems` → Insert row.
- `tags` example: `["Modern Resistance","Exile"]`
- `stanzas` example (a list of stanzas, each a list of lines):
  ```json
  [
    ["Line 1","Line 2","Line 3","Line 4"],
    ["Line 1","Line 2","Line 3","Line 4"]
  ]
  ```
- `sort_order` controls the order; `motif` is any Material Symbols icon name
  (e.g. `terrain`, `castle`, `landscape`, `shield`).

The change appears on the next page load — no redeploy needed.

## Hosting (GitHub Pages)
- This repo is served directly by GitHub Pages (no build step).
- `.nojekyll` tells Pages to serve files as-is (needed for the `assets/` folder).
- `CNAME` sets the custom domain to `poem.nekalo.de`.

To update the site itself (not the poems), edit the files and push — GitHub Pages
redeploys automatically within a minute or two.

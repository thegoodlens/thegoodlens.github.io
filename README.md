# The Good Lens

A photo-essay journal — plain HTML/CSS/JS, no build step, hosted free on
GitHub Pages. No comments, no view counts, no login — by design.

## Deploying

Same as before: create/reuse a repo named `your-username.github.io`, upload
everything in this folder (`index.html`, `about.html`, `.nojekyll`, `entries/`,
`assets/`), turn on Pages in Settings, done.

## Publishing a new entry — the whole workflow

**1. Duplicate the template**
Go into `entries/`, open `_template.html`, and save a copy with a new name —
lowercase, hyphens, no spaces, e.g. `entries/the-rain-taught-me.html`.

**2. Write it**
Open your new file and fill in the marked `EDIT` spots:

- **`data-entry-file`** on the `<body>` tag — must exactly match the
  filename you just saved (e.g. `the-rain-taught-me.html`). This is what
  connects the page to its tags and its "More to read" section.
- **Hero banner** — image, date, title, and a one/two-sentence description
  (shown as a subtitle on the banner). "Time to read" fills itself in
  automatically from the word count — leave that part alone.
- **Body** — plain paragraphs, an inline photo with caption, a blockquote for
  a quoted or pivotal line, and numbered photo-moment blocks — used in any
  order, any combination. Delete whatever you don't need for that entry.

The two sample entries already in `entries/` (`flower-crushed-still-fragrant.html`
— flowing style, and `seven-mornings.html` — numbered-moment style) are full
working examples if you want to see one filled in before you start.

**3. Add your photos**
Upload image files into `assets/images/` (Add file → Upload files), then
point each `<img src="...">` at `../assets/images/yourfile.jpg`.

**4. Add ONE entry to `assets/js/entries-data.js`**
This is the only other file you touch. Copy one of the existing objects in
the list and edit it:

```js
{
  file: "the-rain-taught-me.html",
  title: "The Rain Taught Me",
  date: "2026-08-02",
  dateDisplay: "August 2, 2026",
  thumb: "assets/images/yourfile.jpg",
  tags: ["gratitude", "grace"]
}
```

This one entry is what makes the piece appear on the homepage grid, gives it
its tags, and lets it show up in "More to read" on other entries (and lets
other entries show up on its own). Nothing else needs updating — no
homepage HTML to touch, no cross-linking between specific entries to keep
in sync.

**5. Commit, done.**

## What each entry page includes

- **Full-bleed hero banner** — the entry's photo fills the top of the page,
  with the date, reading time, title, and description overlaid on it.
- **Reading progress bar** — a thin line at the top that fills in as you
  scroll through the piece.
- **Tags** — filled in automatically from `entries-data.js`, shown just
  below the hero.
- **"More to read"** — up to 3 other entries, automatically chosen by how
  many tags they share with the one you're reading (ties broken by newest
  first). If nothing shares a tag yet, it just shows other recent entries
  instead — there's always something there once you have 2+ entries.

## Tags

Freeform — there's no fixed list, and they now live in exactly one place:
`entries-data.js`. Both the small tag row on the entry page and the "More to
read" matching pull from there — you never type a tag twice.

## Light / dark mode

A small sun/moon icon, top-right on every page — no text label. Remembers
your choice (browser local storage) and otherwise follows the visitor's
system preference on first visit. Over an entry's hero photo, the icon and
"About" link start out white for legibility, then shift to the normal theme
color once you scroll past the hero. The header and footer stay fixed in
place while scrolling, on every page.

## File map

```
index.html                                homepage — built from entries-data.js
about.html                                about page (placeholder text — write your own)
assets/js/entries-data.js                 the entry index — add one entry here per post
entries/_template.html                    duplicate this for every new entry
entries/flower-crushed-still-fragrant.html   sample — flowing essay style
entries/seven-mornings.html               sample — numbered photo-moment style
assets/css/main.css                       all styling, incl. light/dark themes
assets/js/main.js                         theme toggle, homepage grid, related
                                           posts, reading time, progress bar
.nojekyll                                 tells GitHub Pages not to run a build
```

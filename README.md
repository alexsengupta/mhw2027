# IMHWS-1 — mhw2027.org (static site)

A static replacement for the Wix site at https://www.mhw2027.org. Seven pages, no
build step, no framework, no database. Open `index.html` in a browser and it works.

This exists so colleagues can review the site at a public URL before it goes live,
and so the site itself can eventually be served from here rather than from Wix.

## Files

```
index.html          Home: tagline, themes, dates, countdown, key-dates rail
scope.html          Scope & themes: what the symposium covers
keynotes.html       Keynote speakers (both currently marked invitation pending)
keydates.html       Key dates: the same rail plus a full milestone breakdown
mhws.html           MHWs: live daily map, infographic, Explore Our Findings
contact.html        Venue, organising team, campus photo, map, email
perth.html          Perth & things to do: filterable, banded by travel time
assets/css/site.css All styling. One file, commented by section.
assets/js/site.js   Countdown and live map loader. Degrades safely without JS.
assets/img/         Logos and favicon (SVG, so sharp at any size)
assets/img/perth/   Card photos for the Perth page (see IMAGES.md)
assets/img/speakers/ Keynote portraits, cropped square
assets/img/perth-montage.jpg  Banner on the Perth page
assets/img/og-card.jpg        Social preview card, 1200x630
IMAGES.md           How to source and credit the Perth page images
.nojekyll           Tells GitHub Pages to serve files as-is
```

## What still needs doing

**Image licensing.** Every photograph on the site is currently a placeholder.
`IMAGES.md` holds the full clearance checklist, file by file, with what each
filename says about where it came from. That has to be worked through before the
site goes live on mhw2027.org.

**One image slot is still empty:** `assets/img/ocean-texture.jpg`, the photographic
background behind "Explore Our Findings" on the MHWs page. It falls back to a plain
tint, so nothing looks broken.

**Two keynotes are marked "Invitation pending."** Those chips are the only thing
telling a reader that Hobday and Frölicher have not yet accepted. Do not remove one
until that person has agreed in writing and approved their biography and photograph.

Two other decisions worth making before launch:

1. **Expressions of interest.** The button opens a pre-filled email to
   IMHWS2027@gmail.com. That works everywhere and costs nothing, but it loses people
   using webmail without a configured mail client, and replies have to be transcribed
   by hand. A hosted form (Formspree, Tally, Google Forms) would collect structured
   responses straight into a sheet.
2. **Fonts.** Plus Jakarta Sans loads from Google Fonts. German courts have found
   that embedding Google Fonts this way can breach GDPR, because visitors' IP
   addresses reach Google without consent. With European attendees, self-hosting the
   font files is the safer choice.

## Viewing it locally

Double-clicking `index.html` mostly works, but some browsers restrict local pages.
Serving the folder avoids all of that:

```bash
cd site
python3 -m http.server 8000
```

Then open http://localhost:8000

## Publishing to GitHub Pages

### Before anything else: publish the right folder

**The repository must be this `site/` folder, never its parent.** `MyMHW_conference/`
also contains `mhw_community/`, which holds several thousand researchers' email
addresses harvested from Web of Science and OpenAlex. GitHub Pages on a free account
requires a **public** repository, so committing the parent folder would publish that
mailing list to the open internet, permanently and searchably. Treat this as the one
step that cannot be undone.

Sanity check before the first push: `git status` should list only HTML, CSS, JS,
images and the two markdown files. If you see a `.csv`, `.xlsx` or anything under
`mhw_community/`, stop.

### Step 0 — clear the broken repository

A `.git` folder exists here, created through the Cowork sandbox mount, which cannot
delete its own lock files. It is stuck, and its single commit is a superseded
snapshot worth nothing. Start clean, in **Terminal on your Mac** rather than through
Cowork:

```bash
cd ~/Library/CloudStorage/OneDrive-UNSW/"My Projects"/OceanXtremes/MyMHW_conference/site
rm -rf .git
```

Run every git command below in Terminal too. Git through the sandbox mount fails on
lock files, which is what broke the first attempt.

### Step 1 — tell git who you are

Once per machine, not once per repository:

```bash
git config --global user.name  "Alex Sengupta"
git config --global user.email "alex.sengupta.aus@gmail.com"
```

### Step 2 — first commit

```bash
git init
git branch -M main
git add -A
git status          # read this properly before continuing
git commit -m "IMHWS-1 symposium site"
```

### Step 3 — create the repository on github.com

New repository, named something like `mhw2027`. **Public.** Do not tick
"Add a README", ".gitignore" or "Choose a licence" — this folder already has what it
needs and those would collide.

### Step 4 — push

```bash
git remote add origin https://github.com/<your-username>/mhw2027.git
git push -u origin main
```

GitHub stopped accepting account passwords for pushes. When prompted you need a
personal access token, not your password. If that sounds like a nuisance, use
**GitHub Desktop** instead: Add → Add Existing Repository → choose this folder →
Publish repository. It handles sign-in, creates the repository and pushes, and is
the easier path if you do not use git regularly.

### Step 5 — turn Pages on

In the repository: **Settings → Pages**. Source: *Deploy from a branch*. Branch:
`main`, folder `/ (root)`. Save. A minute later the site is at

```
https://<your-username>.github.io/mhw2027/
```

That is the URL to circulate for review.

### Publishing a change afterwards

```bash
git add -A && git commit -m "what changed" && git push
```

Live in under a minute. GitHub keeps every version, so anything can be rolled back.

### A caution about OneDrive

This folder sits inside OneDrive. Cloud sync clients and git are a well-known bad
combination: OneDrive can sync `.git` internals while git is mid-write and corrupt
the repository. It is survivable here because the site is small and GitHub holds a
complete copy, but if you hit strange git errors later, this is the first thing to
suspect. The clean fix is to keep the working copy somewhere like `~/Projects/` and
let OneDrive hold only your source photographs and documents.

## Notes on how it is built

- **It deliberately mirrors the live Wix site** rather than the original mockup, so
  reviewers compare like for like. Colours were sampled from screenshots of the
  published pages: nav links `#0052ca`, body text pure black, button `#ffad3d`,
  section rules `#95bcfd`, live-feed eyebrow `#df2a2f`. The countdown uses the live
  site's single-line `369d 9h 29m 12s` format rather than boxes.
- **The live map** loads straight from
  `timesareachangin.com/MarineHeatwaves/MHWlive/latest.png` with a `?_=YYYY-MM-DD`
  cache-buster, so each visitor fetches at most once per UTC day. No iframe is
  involved, which is why it sizes itself correctly here and never did in Wix. If the
  host is unreachable the card collapses to a short message with a direct link
  instead of leaving a broken image and 900px of blank space.
- **The countdown** targets `2027-09-20T00:00:00+08:00`. Perth is UTC+8 and does not
  observe daylight saving, so that offset is stable.
- **Page names are real words.** The Wix site serves these at `/blank-2` and
  `/blank-3`, which is poor for search and confusing to share. This is the one place
  the static site deliberately differs from live.
- **The express-interest button opens a pre-filled email.** On Wix it points at
  `/home`, which goes nowhere.
- **The Contact map** is a plain Google Maps embed, which needs no API key.
- **The Perth page is grouped by travel time from the venue**, not by activity,
  because the practical question is whether something fits an afternoon, a Saturday
  or an extended stay. Activity tags then filter across all four bands.
- **The activity filter is progressive.** The filter bar is marked `hidden` in the
  HTML and revealed by JavaScript, so without JS visitors see all seventeen cards
  and no dead controls.
- **Penguin Island is deliberately excluded** from the day trips. It closes to
  visitors from the June long weekend to October for little penguin breeding, which
  covers the symposium dates. It appears instead as a "cross this off" note, since
  most Perth guides list it without the seasonal caveat.
- **"Coming soon" is a `<span class="soon">`, never a disabled link.** A link that
  goes nowhere is worse than no link: it looks clickable, it is announced as a link
  by screen readers, and it wastes the reader's attention. When a destination exists,
  swap the span for `<a class="go" href="...">`. There are ten of these on the Key
  dates page at present.
- **Keynote biographies collapse.** Each one sits in a native
  `<details class="bio">`, so the page reads as a scannable list of names and
  affiliations and the prose is one click away. It needs no JavaScript, screen
  readers announce it correctly, and Chrome and Safari will open a closed panel to
  reveal a Ctrl+F match. The only thing JavaScript does is open every panel before
  printing, because a closed `<details>` hides its contents in a way CSS cannot
  override. The Wix Studio equivalent is the **Accordion** element.
- **The eight-node rail is duplicated** between `index.html` and `keydates.html`.
  There is no build step, so changing one means changing the other; both carry a
  comment saying so. Once real dates land you may prefer the home page to show only
  the next two or three milestones and link through, which removes the duplication.
- **The social preview card** (`assets/img/og-card.jpg`) is what appears when
  anyone posts a link to the site in Slack, Bluesky, LinkedIn or an email client. It
  is the Perth montage above a navy band carrying the logo and dates. Note that
  `og:image` must be an absolute URL, and it currently points at
  `https://www.mhw2027.org/...`. That is correct for launch but means previews will
  not render while the site is being reviewed on a `github.io` address — point it at
  the review URL temporarily if that matters.
- **The montage is 1000 px wide**, so the Perth banner is capped at 1000 px and never
  upscaled. On a retina laptop it is effectively a 500 px image stretched to 1000, so
  it will look slightly soft. If the montage source still exists, re-exporting it at
  2400 px and re-saving both derivatives fixes that permanently.
- **Logos are SVG**, so they stay sharp on any display and the whole site is under
  200 KB before the three photographs are added.

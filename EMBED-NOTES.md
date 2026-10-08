# Embedding the Perth "things to do" section into Wix

`perth-embed.html` is the "Find something to do" section of `perth.html` with the
site header, footer and navigation stripped out, so it can sit inside an iframe on
mhw2027.org. It is marked `noindex` because `perth.html` is the canonical copy.

Live at:

```
https://alexsengupta.github.io/mhw2027/perth-embed.html
```

Verified at 1280px, 768px and 390px: 17 cards, 17 images, none broken, filter bar
working, no horizontal overflow, no JavaScript errors.

---

## Step 1 — Add the iframe in Wix

1. On the Perth page, below your "September in Western Australia" panel, add an
   **IFrame** element (Add panel → Quick Add → IFrame).
2. In its settings choose **Website address**, and enter the URL above.
3. Set its width to stretch full width of the section.
4. Give it a provisional height of **4900px** (the desktop content height). This is a
   placeholder; step 2 makes it adjust itself.
5. Note the element's **ID** — probably `html1`. You need it for step 2.

At this point it will work, but the height will be wrong at other screen widths.

## Step 2 — Make it resize itself

An iframe cannot size itself to its content, so the embedded page measures itself and
sends its height to the host page. Without this you get either an inner scrollbar or a
tall empty box on mobile.

The embedded page already does its half. Add the Wix half in **Page Code** for the
Perth page:

```js
$w.onReady(function () {
  $w("#html1").onMessage((event) => {
    const data = event.data;
    if (data && data.type === "imhws-height" && data.height > 0) {
      $w("#html1").height = data.height;
    }
  });
});
```

Change `#html1` if your iframe has a different ID.

The embedded page sends its height on load, on window resize, when an image finishes
loading, and when someone uses the activity filter — which changes how many cards are
showing and therefore how tall the page is.

## Step 3 — Check it

- Desktop, tablet and phone widths. No scrollbar should appear inside the frame.
- Click a filter chip. The frame should shrink or grow to match.
- Click through to one of the external sites. Links carry `target="_blank"`, so they
  should open in a new tab rather than inside the frame.

Expected content heights, as a sanity check: about **4800px** at 1280 wide, **6500px**
at 768, **10700px** at 390.

---

## Things worth knowing

**The content is not part of your site for search.** Google indexes an iframe's
contents against the source URL, not the host page. So this section will not help
mhw2027.org rank for anything, and the text will not appear in site search. For
tourist information that is an acceptable trade; it would not be for your scope or
dates pages.

**It is not editable in the Wix editor.** Changing a card means editing
`perth.html`, regenerating `perth-embed.html`, and pushing to GitHub. That is fine
for this page — it is the least likely content to need changing — but it is the
reason not to do this for anything about the symposium itself.

**The images still are not cleared.** `IMAGES.md` lists most of the seventeen as
needing permission or replacement. Embedding publishes them from a different URL; it
does not change the licensing position. That work still has to happen before launch.

**If GitHub Pages goes down, the section disappears.** Not likely, but it is now a
second dependency for one page on your site.

**Keep the two files in sync.** `perth-embed.html` is generated from `perth.html`.
If you edit the cards, edit `perth.html` and regenerate, rather than editing both and
letting them drift.


---

# The key dates timeline widget

`timeline-embed.html` is a self-contained widget. No external CSS, no
framework, nothing shared with the rest of the site.

```
https://alexsengupta.github.io/mhw2027/timeline-embed.html
```

## What it does that a static list does not

It works out today's date and shows where you are in the cycle:

- The rail **fills to the current date**, animating on load. The fill is
  proportional to elapsed time, not to how many nodes have passed.
- Milestones already gone are **filled navy and muted**.
- The next one due is **ringed green, labelled NEXT, and pulses gently**.
- The symposium itself is **red**.
- A line underneath reads "Next: First circular — about 40 days away".
- The **unfilled part of the rail is a pale version of the same gradient**, so the
  colour is always present and simply lights up as the fill reaches it.
- The symposium dot **bursts every six and a half seconds** — twelve particles and a
  shockwave ring. Decorative, hidden from screen readers, and switched off entirely
  for anyone whose system asks for reduced motion.

None of that needs maintaining. It recalculates on every page load, so the
highlight moves down the rail by itself as the year goes on.

Horizontal on desktop, vertical on screens under 900px. Anyone whose system
asks for reduced motion gets the finished state immediately rather than
nothing.

## Updating the dates

One array at the top of the script, near the foot of the file:

```js
var MILESTONES = [
  { show:"Late 2026",  label:"First circular",  date:"2026-11-15" },
  ...
];
```

- `show` is what the reader sees. Write it however you like.
- `label` is the milestone name.
- `date` is used only to work out what is past and where the fill reaches.
  For a vague entry like "Late 2026", put your best estimate — it never
  appears on screen.
- `kind:"event"` marks the symposium itself, which gets the red treatment.

Add or remove entries freely; the layout adjusts. Keep them in date order.

## Embedding it in Wix

Exactly as for the Perth embed:

1. Add an **IFrame** element, Website address, paste the URL above.
2. Width: stretch. Height: 330 as a starting point.
3. Note its ID.
4. In the page code, inside `$w.onReady`:

```js
$w("#html2").onMessage((event) => {
  const data = event.data;
  if (data && data.type === "imhws-height" && data.height > 0) {
    $w("#html2").height = data.height;
  }
});
```

Change `#html2` to whatever the iframe's actual ID is. If you already have
the Perth one on another page, each page needs its own copy of this with its
own ID.

5. Set the containing section's height to **Auto**.

Expected heights: about **310px** on desktop, **620px** on a phone.

## Worth knowing

**It lives on both the Home and Dates pages**, so embed the same URL twice
rather than making two copies. One file, one place to edit.

**The dates are currently placeholders** matching the indicative timeline.
When the first circular fixes them, update the array once and both pages
change.


---

# The community graphics (map and interests)

Two self-contained widgets built from the expressions-of-interest form:

```
https://alexsengupta.github.io/mhw2027/community-map-embed.html
https://alexsengupta.github.io/mhw2027/community-interests-embed.html
```

Both read `data/signups.json` and contain no personal data. How to refresh that file
from a new form export is in `tools/README-signups.md`.

## What they do

**Map.** The numbers of people, countries and continents count up, then an arc
draws in from each country to Perth, with circles sized by number of people.
Small sparks keep travelling along the arcs into Perth, busier from countries
with more people, and Perth pulses like the symposium dot on the timeline.
Hover or tap a circle or a country name for its count. Below the map is a list
of every country with its count, which is also the text version for screen
readers. On phones it shows the top twelve and a "Show all" button. The map is
centred on 150°E, so Europe and Africa sit to the left, the Americas to the
right, and everything converges on Western Australia.

**Interests.** Two bar charts side by side, areas of interest and disciplines,
which grow when they scroll into view. Hover or tap a bar on one side and the
other side redraws for just those people, with a thin tick marking the overall
figure, so you can see, for example, that physical oceanographers are
over-represented among people interested in MHW processes. Groups under 20
people are flagged as small. On phones the two charts stack.

Both stop animating when scrolled off-screen, and show the finished state with
no motion for anyone whose system asks for reduced motion.

## Embedding in Wix

The same as the timeline: an IFrame element with the URL, width stretched,
section height Auto, and the height listener in the page code, once per iframe:

```js
$w.onReady(function () {
  ["#html3", "#html4"].forEach((id) => {
    $w(id).onMessage((event) => {
      const data = event.data;
      if (data && data.type === "imhws-height" && data.height > 0) {
        $w(id).height = data.height;
      }
    });
  });
});
```

Change the IDs to match your iframes. If the page already has an `onReady` for
the timeline, put the loop inside that one rather than adding a second.

Starting heights, which the listener then corrects:

| Widget | Desktop (1280) | Tablet (768) | Phone (390) |
|---|---|---|---|
| Map | 730 | 610 | 450 |
| Interests | 615 | 620 | 1095 |

## Worth knowing

**Country is inferred, not asked.** It comes from the email domain and the
institution, so it is where someone's institution is, not necessarily where
they will travel from. If you add a country question to the form, the AI step
in the README is no longer needed.

**Countries with one person.** Combined with the public speaker and organiser
lists, a single-person country could occasionally point to a specific person.
The risk is low, since there are no names, but bear it in mind if anyone asks
to be left off.

**Wording assumes a growing list.** The map footnote says "received up to
<date>", which updates itself from the JSON. If sign-ups close, nothing needs
changing.

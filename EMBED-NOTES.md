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

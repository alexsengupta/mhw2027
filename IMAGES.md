# Images for the Perth page

Seventeen cards on `perth.html` each have an image slot. Until a file appears the
card shows a labelled dashed placeholder, so the page is never broken and no code
changes when you add one.

## What I could and could not do

Wikimedia Commons is **cache-only** from the sandbox this site was built in: file
pages cannot be fetched, so licence and author metadata could not be read. None of my
web tools return binary data either, so the image files themselves could not be
downloaded regardless. Search *does* reach Commons, so the table below points at real
pages I confirmed exist rather than guessed URLs.

An attribution list I cannot verify would be worse than none — a wrong credit is a
licence breach, not a typo — so the credits stay for you to copy from each file page,
which takes about a minute each.

## The one thing that makes this easy

**Everything hosted on Wikimedia Commons is already freely licensed.** Commons does
not accept non-commercial or no-derivatives material, so there is no risk of picking
an image you are not allowed to use. The only obligation is attribution, and for
share-alike licences, that any modified version carries the same licence. Cropping
and resizing count as modification, so keep any crops CC BY-SA if the original is.

## How to credit a file, in four steps

1. Open the file page on Commons.
2. Click **Use this file** (the icon under the image).
3. Copy the **Attribution** string it generates. It already contains the author name
   and licence in the form the licence requires.
4. Paste it into the card's `data-credit` attribute in `perth.html`, put the file page
   URL in `data-credit-url`, and write a real description into `data-alt`.

The credit then renders as a small line under the photo automatically.

```html
<div class="shot-slot"
     data-shot="rottnest.jpg"
     data-alt="Turquoise bay with limestone headland at Rottnest Island"
     data-credit="Photo: A. Photographer / CC BY-SA 4.0"
     data-credit-url="https://commons.wikimedia.org/wiki/File:Example.jpg">
```

Leave `data-credit` empty for your own photos, or put your own name in it.

## Save files to `assets/img/perth/`

Crop to roughly **3:2 landscape** and export at about **1200 x 800**, under 250 KB.

## Where to look

✓ = a Commons category I confirmed exists. ~ = a search, because no single tidy
category covers it. Categories are much better than searches: they are curated, and
browsing one shows you everything available on the subject at once.

| Save as | Subject | Where to look | |
|---|---|---|---|
| `perth/kings-park.jpg` | Kings Park wildflowers | [category](https://commons.wikimedia.org/wiki/Category:Flora_in_Kings_Park,_Western_Australia) | ✓ |
| `perth/matilda-bay.jpg` | Swan River foreshore | [category](https://commons.wikimedia.org/wiki/Category:Swan_River,_Western_Australia) | ✓ |
| `perth/uwa.jpg` | Winthrop Hall, UWA | [category](https://commons.wikimedia.org/wiki/Category:Winthrop_Hall) | ✓ |
| `perth/mettams.jpg` | Perth coast reef / snorkelling | [search](https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Marmion+Marine+Park+reef) | ~ |
| `perth/fremantle.jpg` | Fremantle streetscape | [category](https://commons.wikimedia.org/wiki/Category:Fremantle_(suburb)) | ✓ |
| `perth/boola-bardip.jpg` | WA Museum Boola Bardip | [search](https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Western+Australian+Museum+Perth) | ~ |
| `perth/whales.jpg` | Humpback whale | [category](https://commons.wikimedia.org/wiki/Category:Megaptera_novaeangliae) | ✓ |
| `perth/swan-valley.jpg` | Swan Valley | [category](https://commons.wikimedia.org/wiki/Category:Swan_Valley) | ✓ |
| `perth/rottnest.jpg` | Rottnest Island coast | [category](https://commons.wikimedia.org/wiki/Category:Coastline_of_Rottnest) | ✓ |
| `perth/bibbulmun.jpg` | Bibbulmun Track | [category](https://commons.wikimedia.org/wiki/Category:Bibbulmun_track) | ✓ |
| `perth/john-forrest.jpg` | John Forrest National Park | [category](https://commons.wikimedia.org/wiki/Category:John_Forrest_National_Park) | ✓ |
| `perth/yanchep.jpg` | Yanchep National Park | [category](https://commons.wikimedia.org/wiki/Category:Yanchep_National_Park) | ✓ |
| `perth/dive-charter.jpg` | Diving in Western Australia | [search](https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=scuba+diving+Western+Australia) | ~ |
| `perth/cape-to-cape.jpg` | Margaret River coast | [category](https://commons.wikimedia.org/wiki/Category:Margaret_River) | ✓ |
| `perth/ningaloo.jpg` | Ningaloo Reef | [category](https://commons.wikimedia.org/wiki/Category:Ningaloo_Reef) | ✓ |
| `perth/esperance.jpg` | Lucky Bay, Cape Le Grand | [search](https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Cape+Le+Grand+Lucky+Bay) | ~ |
| `perth/karijini.jpg` | Karijini gorges | [search](https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Karijini+National+Park+gorge) | ~ |


## Clearance checklist — must be completed before go-live

Every photograph on the site is listed here. All are treated as **placeholders**
until the Source-status column reads cleared. Tick nothing off from memory: check
each one, then write the credit into the page.

Where a credit is needed it goes into the card's `data-credit` and `data-credit-url`
attributes in `perth.html`, and renders as a caption under the photo automatically.

**Legend.** `commons` = downloaded from a Wikimedia Commons category, so freely
licensed but still requiring attribution. `web` = saved from a tourism, government
or operator website, so almost certainly all-rights-reserved and needing either
written permission or replacement. `own` = produced for this site.

| File | Slot | Source evidence | Status |
|---|---|---|---|
| `perth/kings-park.jpg` | Kings Park | commons — Flora in Kings Park | credit needed |
| `perth/rottnest.jpg` | Rottnest | commons — CSIRO ScienceImage 11315 | credit needed |
| `perth/bibbulmun.jpg` | Bibbulmun | commons — Bibbulmun track | credit needed |
| `perth/uwa.jpg` | UWA campus | commons — University of WA | credit needed |
| `perth/whales.jpg` | Whale watching | commons — Megaptera novaeangliae | credit needed |
| `perth/ningaloo.jpg` | Ningaloo | commons — Ningaloo Reef | credit needed |
| `perth/matilda-bay.jpg` | Matilda Bay | web — parks naming, photographer R. Pendreigh | permission or replace |
| `perth/mettams.jpg` | Mettams Pool | web — parks naming, photographer R. Deepchand | permission or replace |
| `perth/yanchep.jpg` | Yanchep | web — DBCA filename | permission or replace |
| `perth/john-forrest.jpg` | John Forrest | web — source unknown | permission or replace |
| `perth/fremantle.jpg` | Fremantle | web — blog, pre-sized 900x600 | permission or replace |
| `perth/boola-bardip.jpg` | WA Museum | web — source unknown, also low resolution | permission or replace |
| `perth/swan-valley.jpg` | Swan Valley | web — tour operator CMS filename | permission or replace |
| `perth/cape-to-cape.jpg` | Margaret River | web — source unknown | permission or replace |
| `perth/esperance.jpg` | Lucky Bay | web — source unknown | permission or replace |
| `perth/karijini.jpg` | Karijini | web — source unknown | permission or replace |
| `perth/dive-charter.jpg` | Dive charters | web — source unknown | permission or replace |
| `uwa-campus.jpg` | Contact page | web — UWA "Seekers Space" banner | ask UWA Marketing |
| `perth-montage.jpg` | Perth page banner | montage, component sources unknown | confirm with the maker |
| `og-card.jpg` | Social preview | derived from `perth-montage.jpg` | inherits the above |
| `mhw-infographic.jpg` | MHWs page | IMHW Working Group | confirm permission |
| `favicon.svg` | Browser tab | own — drawn for this site | cleared |
| `logo-banner.svg`, `mhw-group.svg`, `themes.svg` | Branding | own — symposium artwork | cleared |

### Two useful shortcuts

**DBCA and Tourism WA both run media libraries** and routinely grant use to
non-commercial academic events. One email naming the symposium, the dates and the
UWA venue would likely clear the parks images in a single request: Matilda Bay,
Mettams, Yanchep, John Forrest, and possibly Lucky Bay and Karijini.

**UWA Marketing** can supply campus imagery, almost certainly including a better
version of the Winthrop Hall banner, and will want the symposium promoted anyway.

### Held back

`wreck2.jpg.webp` is not used anywhere. It carries a PERTH SCUBA watermark. Do not
crop the watermark out to make it usable — removing rights-management information
from a work is an aggravating factor rather than a fix. It sits in
`photo-originals/` if you want to ask Perth Scuba for a clean copy.

### Originals

The files these were processed from are in `MyMHW_conference/photo-originals/`,
outside the site folder so they stay out of the repository. Keep them until this
checklist is complete: the original filenames are the only remaining record of
where several of these came from.

## A better option than any of this

Photographs taken by you, Thomas, Dan or anyone else on the committee will look
better than stock, need no attribution research, and carry no licence risk at all.
Given the organising team works on this coastline, you almost certainly have stronger
images of Rottnest, Ningaloo and the Perth reefs than Commons does. Use the same
slots; just leave `data-credit` empty or set it to your own name.

## Photos to avoid

Do not take images from Tourism WA, Destination Perth, the Rottnest Island Authority,
DBCA, tour operators or Google Images. They are copyrighted, a symposium website is
public and institution-linked, and unlicensed use of tourism photography is noticed
more often than people expect. Linking to those sites is fine and already done
throughout the page.

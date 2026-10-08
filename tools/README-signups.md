# Updating the community graphics

Two widgets on the site draw on the expressions-of-interest form:

| Widget | File | Shows |
|---|---|---|
| Community map | `community-map-embed.html` | Headline numbers, a world map with arcs into Perth, and the country list |
| Community interests | `community-interests-embed.html` | Linked bar charts of areas of interest and disciplines |

Both read **`data/signups.json`**. To update them you only replace that file. Neither
HTML file needs editing.

`signups.json` holds **counts only**: no names, emails, institutions or comments. The
repository is public, so that is the only form of the data that should go into it.
`.gitignore` blocks `.csv` and `.xlsx` files in this folder as a safety net, but keep
the raw export outside `site/` anyway.

---

## The update, step by step

### 1. Export the form

Download the submissions CSV from the Wix form and save it in
`MyMHW_conference/website analytics/`. **Not** in `site/`.

### 2. Add a Country column (AI step)

The form does not ask for country, so it has to be worked out from each person's
institution and email domain. Give Claude the CSV with this prompt:

> This is the latest export from the IMHWS-1 expressions-of-interest form. Add a
> `Country` column next to `Institution` with your best guess of the country each
> person is based in. Use the email domain's country code where there is one
> (.au, .uk, .de and so on), treat .edu and .gov as United States, and use the
> institution name for gmail-type addresses and generic domains. Search the web for
> any that are still unclear. Use these spellings, which the map knows:
> "United States", "United Kingdom", "South Korea", "Côte d'Ivoire",
> "United Arab Emirates", "Hong Kong". Every row must have a country. Don't add
> your reasoning to the file, but list the uncertain ones for me in chat.
> Save it as `MHW interest with country.csv` in the same folder, then run
> `site/tools/build_signups_json.py` on it to regenerate `site/data/signups.json`.

Check the list of uncertain ones it gives you. Fix any wrong ones in the CSV before
going on (or ask Claude to fix them and re-run step 3).

### 3. Build the JSON

If Claude did not already run it for you:

```bash
cd "MyMHW_conference/site"
python3 tools/build_signups_json.py "../website analytics/MHW interest with country.csv"
```

It accepts `.csv` or `.xlsx`, and needs `pandas` (plus `openpyxl` for `.xlsx`). It
prints a one-line summary, for example:

```
Wrote data/signups.json: 218 people, 34 countries, latest submission 2026-10-08.
```

What the script does to the data:

- **Removes duplicates.** If the same email address appears twice, only the latest
  submission counts. The October 2026 export had 230 rows from 218 people.
- **Tidies categories.** "Climate Scientist" is merged into "Climate Science". Any
  free-text "Other: ..." answer is counted as "Other".
- **Counts multiple choices properly.** People can tick several interests and
  disciplines, so the percentages add to more than 100%.
- **Warns** if any row has no country. Those are counted as "Unknown" and left off
  the map.

### 4. Check it locally (optional, 30 seconds)

The widgets load the JSON with `fetch`, which browsers block for files opened
directly from disk. Run a throwaway local server instead:

```bash
cd "MyMHW_conference/site"
python3 -m http.server 8000
```

Then open <http://localhost:8000/community-map-embed.html> and
<http://localhost:8000/community-interests-embed.html>. Press Ctrl-C to stop.

If a new country appears, open the browser console on the map page. A line saying
`No map position for "<name>"` means it needs adding to the `PLACES` table near the
top of the script in `community-map-embed.html`. Copy an existing line and give
longitude, latitude and continent. Until then that country is still counted in the
headline numbers and the list; it just has no circle on the map.

### 5. Publish

Commit and push only `data/signups.json` (plus `community-map-embed.html` if you
added a country):

```bash
git add data/signups.json
git commit -m "Update sign-up graphics"
git push
```

GitHub Pages updates within a minute or two, and the Wix pages pick it up on the next
load. Nothing needs changing in Wix.

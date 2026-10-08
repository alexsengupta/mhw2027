#!/usr/bin/env python3
"""
Build data/signups.json for the IMHWS-1 community graphics.

Input : the expressions-of-interest export WITH a Country column added
        (CSV or XLSX). See tools/README-signups.md for how to add Country.
Output: data/signups.json  (aggregate counts only: no names, no emails,
        no institutions, no comments)

Usage:
    python3 tools/build_signups_json.py "MHW interest with country.csv"
    python3 tools/build_signups_json.py input.xlsx --out data/signups.json

Needs pandas (and openpyxl for .xlsx input).
"""
import argparse, json, os, sys
from collections import Counter, defaultdict
from datetime import date
import pandas as pd

# Fixed category lists. Anything the form returns that is not on these lists
# (the free-text "Other: ..." answers) is counted as "Other". The order here
# is only a tie-break; the graphics sort by count.
INTERESTS = [
    "Marine ecosystem impacts",
    "Extreme events and climate variability",
    "Marine heatwave processes",
    "Adaptation, risk assessment and management responses",
    "Forecasting and prediction",
    "Fisheries and aquaculture impacts",
]
DISCIPLINES = [
    "Marine Biology", "Physical Oceanography", "Climate Science",
    "Conservation", "Biological Oceanography", "Management", "Social Science",
]
# Spelling variants the form has produced, mapped to the canonical name.
ALIASES = {"climate scientist": "Climate Science"}


def find_col(df, *words):
    for c in df.columns:
        if all(w in c.lower() for w in words):
            return c
    sys.exit(f"Could not find a column containing {words!r}. Columns: {list(df.columns)}")


def split(cell, canon):
    lookup = {c.lower(): c for c in canon}
    out = set()
    for part in str(cell or "").split(";"):
        p = part.strip()
        if not p:
            continue
        p = ALIASES.get(p.lower(), p)
        out.add(lookup.get(p.lower(), "Other"))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("infile")
    here = os.path.dirname(os.path.abspath(__file__))
    ap.add_argument("--out", default=os.path.join(here, "..", "data", "signups.json"))
    a = ap.parse_args()

    if a.infile.lower().endswith((".xlsx", ".xls")):
        df = pd.read_excel(a.infile, dtype=str)
    else:
        df = pd.read_csv(a.infile, dtype=str, encoding="utf-8-sig")
    df = df.fillna("")

    c_country = find_col(df, "country")
    c_email = find_col(df, "email")
    c_int = find_col(df, "interest")
    c_dis = find_col(df, "discipline")
    c_date = next((c for c in df.columns if "date" in c.lower()), None)

    # One person, one entry: keep the most recent submission per email.
    if c_date:
        df = df.sort_values(c_date)
    df["_key"] = df[c_email].str.strip().str.lower()
    blank = df["_key"] == ""
    df = pd.concat([df[~blank].drop_duplicates("_key", keep="last"), df[blank]])

    missing = (df[c_country].str.strip() == "").sum()
    if missing:
        print(f"WARNING: {missing} row(s) have no Country; counted as 'Unknown'.")

    countries = Counter(df[c_country].str.strip().replace("", "Unknown"))
    interests, disciplines = Counter(), Counter()
    cross = defaultdict(Counter)          # cross[interest][discipline] = people
    i_both, d_both = Counter(), Counter() # people per category who answered both questions
    n_int = n_dis = n_both = multi_dis = 0
    total_int_picks = 0
    for _, r in df.iterrows():
        I, D = split(r[c_int], INTERESTS), split(r[c_dis], DISCIPLINES)
        interests.update(I); disciplines.update(D)
        if I: n_int += 1; total_int_picks += len(I)
        if D: n_dis += 1
        if len(D) > 1: multi_dis += 1
        if I and D:
            n_both += 1
            i_both.update(I); d_both.update(D)
            for i in I:
                for d in D:
                    cross[i][d] += 1

    updated = date.today().isoformat()
    if c_date:
        updated = str(df[c_date].max())[:10]

    out = {
        "updated": updated,
        "total": int(len(df)),
        "countries": dict(countries.most_common()),
        "interests": dict(interests.most_common()),
        "disciplines": dict(disciplines.most_common()),
        "answered_interest": n_int,
        "answered_discipline": n_dis,
        "answered_both": n_both,
        "mean_interests": round(total_int_picks / n_int, 2) if n_int else 0,
        "multi_discipline": multi_dis,
        "cross": {i: dict(c) for i, c in cross.items()},
        "interest_n_both": dict(i_both),
        "discipline_n_both": dict(d_both),
    }
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"Wrote {a.out}: {out['total']} people, {len(countries)} countries, "
          f"latest submission {updated}.")


if __name__ == "__main__":
    main()

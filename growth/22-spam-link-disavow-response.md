# 22 - Spam Link Injection Response (Disavow)

> **Status:** Response prepared 2026-08-11 · Subscription cancelled · Disavow file staged — **needs manual submission by site owner** (Search Console login required).

## 1. What happened

- A paid "link building"/PBN service (SEOExpress.org or similar) was active on `pilotstack.online`.
- It injected spam links from a rapidly growing network of throwaway domains (`*.shop`, `*.website`, `*.site`, `*.store`, `seonix.agency`, ...).
- Ahrefs backlink count grew 292 → 348 → 369 within minutes — an active, scripted campaign adding new domains continuously.
- **Action taken: subscription cancelled.** Residual pushes may continue briefly (billing-cycle lag), which the monitoring plan below covers.

## 2. Deliverables

| File | Purpose |
|---|---|
| `growth/disavow-links.txt` | Google Disavow file (plain text). Upload this to Search Console. |
| `growth/22-spam-link-disavow-response.md` | This document — submission instructions + monitoring plan. |

## 3. How to submit the disavow file (manual, ~10 minutes)

Disavow requires your Google account + Search Console access — it is **not** automatable. Do this yourself:

1. Go to **Google Search Console** → [Disavow Links tool](https://search.google.com/search-console/disavow-links) (Settings → Disavow Links, or the direct link above).
2. Choose the property: **`https://www.pilotstack.online/`** (the domain property `pilotstack.online` also works — pick whichever has the most link data).
3. Click **Disavow links** → confirm you're making a decision based on your own judgment.
4. Click **Upload disavow list** → select `growth/disavow-links.txt` → **Submit**.
5. You'll get a confirmation message. Google does **not** review or approve it; the file takes effect as a suggestion, and processing happens over the following weeks (links must be recrawled first).
6. Keep a copy of the exact file you uploaded (rename a backup, e.g. `disavow-links-2026-08-11.txt`).

### Critical rules

- **Do NOT include wildcards** (`*.store`, regex, etc.) — Google disavow doesn't support them; only exact `domain:` entries or full URLs are accepted. This is why the `.store` domains must be listed one per line.
- **Before submitting, finish step 4 of the file prep:** add every `*.store` domain from the Ahrefs export (rows whose anchor text matches the "back when my eCommerce store..." template) into the commented section of `growth/disavow-links.txt`, one `domain:` line each.
- **Re-uploads REPLACE the old file, they don't merge.** Every time you submit an updated file (new spam domains discovered), it must contain **all previous entries plus the new ones**. Never submit a partial list.
- Disavow is a last resort signal — appropriate here because these PBN sites will never remove links on request. It tells Google to ignore them; it does not remove links from Ahrefs' report.

## 4. Monitoring plan (first 4 weeks)

The campaign was still adding domains at cancellation — expect 1–3 more waves before it fully stops.

### Weekly checklist (every Monday, starting 2026-08-17)

1. **Ahrefs Backlinks report** → filter to **"New"** backlinks since last week.
2. Check each new referring domain:
   - Flag as spam if: throwaway TLD (`*.shop`, `*.site`, `*.store`, `*.xyz`...), template PBN content ("back when my eCommerce store..."), same anchor text repeated across domains, no real visitors/DR < 5.
3. **Search Console → Links report** → review "Top linking sites" for any of the same domains (GSC may lag Ahrefs by days, but catch things Ahrefs hasn't).
4. If new spam domains are found:
   - Append `domain:<new-spam-domain>` lines to `growth/disavow-links.txt` (keep ALL existing lines).
   - Re-upload the full file via the Disavow Links tool.
   - Add them to the log below.

### Week 5+ (2026-09-15 onward)

- Switch to monthly checks if no new spam domains appeared for 2 consecutive weeks.
- **Do not delete the disavow file** — leave it in place; Google recommends keeping disavow lists active as long as the spam exists.

### Spam domain log

| Date found | Domain | Source (Ahrefs/GSC) | Added to disavow |
|---|---|---|---|
| 2026-08-11 | rankyour.website | Ahrefs export | Yes |
| 2026-08-11 | backlinkshop.shop | Ahrefs export | Yes |
| 2026-08-11 | seolinkkart.shop | Ahrefs export | Yes |
| 2026-08-11 | rankmall.shop | Ahrefs export | Yes |
| 2026-08-11 | seokart.shop | Ahrefs export | Yes |
| 2026-08-11 | ranklinkerpro.shop | Ahrefs export | Yes |
| 2026-08-11 | linkgrowthstudio.shop | Ahrefs export | Yes |
| 2026-08-11 | rankseocollective.shop | Ahrefs export | Yes |
| 2026-08-11 | organicrankservice.shop | Ahrefs export | Yes |
| 2026-08-11 | pageseoservice.shop | Ahrefs export | Yes |
| 2026-08-11 | itxoft-results-focused-seo.site | Ahrefs export | Yes |
| 2026-08-11 | optimize-instant.website | Ahrefs export | Yes |
| 2026-08-11 | seonix.agency | Ahrefs export | Yes |
| 2026-08-11 | (add `.store` template domains here) | Ahrefs export | Pending — step 4 above |

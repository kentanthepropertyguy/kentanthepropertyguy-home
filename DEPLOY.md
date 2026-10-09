# Deploying kentanthepropertyguy.com (Groundwork R1.1)

Nothing in this guide should be done until Ken approves it. Steps marked **APPROVAL** change something live.

## What stays untouched

- DNS records for `tools`, `lucernegrand`, `units.thomsonreserve` and any other subdomain
- The `ken-property-tools` (Groundwork) repository and all microsite repositories

## DNS today (for rollback)

Checked 9 Oct 2026. Nameservers: Exabytes (ns184/185/186.mschosting.com).

| Type | Host | Current value |
|---|---|---|
| A | @ (kentanthepropertyguy.com) | 185.199.108.153 |
| CNAME | www | kentanthepropertyguy.com |

---

## Part A – Checks (no changes)

**A1. Make sure no other repo has claimed the domain.**
In each of your GitHub repositories (ken-property-tools and each microsite repo), open **Settings → Pages** and look at **Custom domain**. None should say `kentanthepropertyguy.com` or `www.kentanthepropertyguy.com`. Each should show its own subdomain only.

## Part B – Protect the domain (APPROVAL: adds one DNS record)

**B1.** On GitHub, click your profile picture → **Settings → Pages** (in the left menu, under "Code, planning, and automation") → **Add a domain** → enter `kentanthepropertyguy.com` → **Add domain**.
GitHub shows a TXT record: a host starting `_github-pages-challenge-kentanthepropertyguy` and a value.

**B2.** In Exabytes DNS management for kentanthepropertyguy.com, add that TXT record exactly as shown. Change nothing else.

**B3.** Back on GitHub, click **Verify**. (It can take a few minutes to an hour. Keep the TXT record permanently.)

This stops anyone else from attaching your domain to their own GitHub site.

## Part C – Create the repository (no live change)

**C1.** GitHub → **+** → **New repository**. Owner: kentanthepropertyguy. Name: `kentanthepropertyguy-home`. Visibility: **Public**. Tick nothing else. **Create repository**.

**C2.** On the empty repo page click **uploading an existing file**. Drag in everything from the extracted ZIP folder: `index.html`, `404.html`, `CNAME`, `robots.txt`, `sitemap.xml`, `README.md`, `DEPLOY.md`, `.nojekyll` and the `assets` folder. Commit to `main`.
(If `.nojekyll` doesn't upload, that's fine. The site doesn't need it.)

**C3.** Check the repo shows `assets/ken-portrait.jpg` and `assets/favicon.svg`.

## Part D – Go live on the apex domain (APPROVAL: this is the deploy)

**D1.** Repo **Settings → Pages**. Source: **Deploy from a branch**. Branch: `main`, folder `/ (root)`. **Save**.

**D2.** Under **Custom domain**, enter `kentanthepropertyguy.com` and **Save**.
Because your apex already points at GitHub, http://kentanthepropertyguy.com will start showing the homepage within a few minutes. HTTPS comes after Part E.

## Part E – Correct the DNS (APPROVAL: changes production DNS)

In Exabytes DNS management for kentanthepropertyguy.com:

**E1.** Keep the existing A record `@ → 185.199.108.153`. Add three more A records for `@`:
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

**E2.** (Recommended) Add four AAAA records for `@`:
- 2606:50c0:8000::153
- 2606:50c0:8001::153
- 2606:50c0:8002::153
- 2606:50c0:8003::153

**E3.** Edit the `www` CNAME so it points to `kentanthepropertyguy.github.io` (instead of `kentanthepropertyguy.com`).

Leave the TTL at Exabytes' default. Do not touch any other record.

## Part F – HTTPS

**F1.** Repo **Settings → Pages**. Wait until the custom domain shows **DNS check successful**. GitHub then requests a certificate (usually under an hour, can take up to 24 hours).

**F2.** When the **Enforce HTTPS** box becomes available, tick it.

## Part G – Final checks

- https://kentanthepropertyguy.com/ shows the homepage with a padlock
- https://www.kentanthepropertyguy.com/ redirects to https://kentanthepropertyguy.com/
- http://kentanthepropertyguy.com/ redirects to https
- https://kentanthepropertyguy.com/anything shows the friendly 404 page
- Groundwork, Lucerne Grand and Thomson Reserve still open normally
- Optional: add `https://kentanthepropertyguy.com/` to Google Search Console and submit `sitemap.xml`

## Rollback

- To take the homepage offline: repo **Settings → Pages → Custom domain → Remove**. The domain returns to its previous state.
- To undo the DNS changes: delete the three added A records and the AAAA records, and set `www` back to CNAME `kentanthepropertyguy.com`.
- Neither affects Groundwork or the microsites.

# kentanthepropertyguy-home

Personal-brand homepage for **Ken Tan · The Property Guy** at https://kentanthepropertyguy.com/ (Groundwork R1.1).

Plain static files on GitHub Pages. No framework, build step or dependencies.

| File | Purpose |
|---|---|
| `index.html` | The homepage (all styles inline) |
| `404.html` | Friendly "page not found" page |
| `CNAME` | Tells GitHub Pages to serve `kentanthepropertyguy.com` |
| `robots.txt`, `sitemap.xml` | Search engine files |
| `.nojekyll` | Serve files as-is |
| `assets/ken-portrait.jpg` | Ken's approved portrait (unaltered) |
| `assets/favicon.svg` | Browser tab icon |

This repo is separate from Groundwork (`ken-property-tools`) and the development microsites. Nothing here changes them.

## Adding a development

In `index.html`, find the comment `TO ADD A DEVELOPMENT`. Copy one `<a class="dev" ...> … </a>` block, paste it after the last one, then change:

- `href` – the live microsite URL
- `data-project` – a short lowercase name, e.g. `hougang-central`
- the tag line, the name, the one-line description and the "View …" text

Only link pages that are already live.

## Analytics

At the bottom of `index.html`:

- `GA_ID` – currently the existing Groundwork GA4 stream. To report the homepage separately, create a new web stream in the same GA4 property and paste its `G-…` ID here.
- `PIXEL_ID` – the existing Meta Pixel.

Events: `whatsapp_click`, `tiktok_click`, `groundwork_click`, `development_click` (GA4), and `Contact` (Meta, on WhatsApp clicks). They record only which button was clicked. No message text or personal details are sent.

## Updating the sitemap

When the page changes, update `<lastmod>` in `sitemap.xml` to the new date.

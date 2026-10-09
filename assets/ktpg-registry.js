/* Ken Tan · The Property Guy — development registry reader (ktpg.registry/1), v1.0.0
   One small, dependency-free script shared by the homepage, Groundwork and every microsite.
   Copy it into each site unchanged (do not load it from another site), then call KTPGRegistry.load().

   Rules every site gets for free:
   - Only entries with status "published", a valid https://<name>.kentanthepropertyguy.com/ address,
     a name and a card are returned. Anything else is skipped, so a bad entry can never show a broken link.
   - If the registry cannot be loaded in 4 seconds, or is invalid, load() resolves with source "fallback"
     and the page keeps whatever it already shows. It never throws and never empties a page.
   - The registry carries no pricing; nothing here reads or shows prices. */
(function (root) {
  'use strict';
  var URL_DEFAULT = 'https://kentanthepropertyguy.com/developments.json';
  var HOST_RE = /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.kentanthepropertyguy\.com\/$/;
  var STAGES = { 'pre-launch': 1, 'new-launch': 1, 'completed': 1 };

  function str(v, max) { return typeof v === 'string' && v.trim() && v.length <= max; }

  function valid(p) {
    return !!(p && p.status === 'published' && typeof p.id === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id) &&
      typeof p.url === 'string' && HOST_RE.test(p.url) && str(p.name, 60) && STAGES[p.stage] &&
      p.card && str(p.card.tag, 40) && str(p.card.text, 140) && typeof p.order === 'number');
  }

  function load(opts) {
    opts = opts || {};
    var url = opts.url || URL_DEFAULT, ms = opts.timeout || 4000;
    var fallback = { source: 'fallback', entries: opts.fallback || null };
    if (typeof fetch !== 'function') return Promise.resolve(fallback);
    var timer, timeout = new Promise(function (res) { timer = setTimeout(function () { res(null); }, ms); });
    var req = fetch(url, { cache: 'no-cache', credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    return Promise.race([req, timeout]).then(function (doc) {
      clearTimeout(timer);
      if (!doc || doc.schema !== 'ktpg.registry/1' || !Array.isArray(doc.projects)) return fallback;
      var list = doc.projects.filter(valid).sort(function (a, b) { return a.order - b.order; });
      if (!list.length) return fallback;
      return { source: 'registry', entries: list, updated_on: doc.updated_on || null };
    });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Homepage: the same markup as the existing Development Guides cards (a.dev > span.tag, h3, p, span.go). */
  function homeCardsHTML(entries) {
    return entries.map(function (p) {
      return '<a class="dev" href="' + esc(p.url) + '" data-track="development" data-project="' + esc(p.id) + '">' +
        '<span class="tag">' + esc(p.card.tag) + '</span><h3>' + esc(p.name) + '</h3><p>' + esc(p.card.text) + '</p>' +
        '<span class="go">' + esc(p.card.cta || ('View ' + p.name)) + ' ›</span></a>';
    }).join('');
  }

  /* Groundwork: entries in the shape of data/research/sites.json "sites". */
  function toGroundworkSites(entries) {
    return entries.map(function (p) {
      return { id: p.groundwork_id || p.id, name: p.name, aliases: p.aliases || [], url: p.url, status: 'configured',
        host: p.url.replace(/^https:\/\//, '').replace(/\/$/, ''), stage: p.stage, tagline: p.tagline || p.card.text };
    });
  }

  root.KTPGRegistry = { URL: URL_DEFAULT, version: '1.0.0', load: load, valid: valid, homeCardsHTML: homeCardsHTML,
    toGroundworkSites: toGroundworkSites, esc: esc };
})(typeof window !== 'undefined' ? window : this);

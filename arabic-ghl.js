/* GHL Multi-language + RTL  |  ضعه على GitHub واستدعِه عبر jsDelivr في Agency Custom JS */
(function () {
  'use strict';
  if (window.__bqI18n) return;
  window.__bqI18n = true;

  const CFG = {
    API: 'https://script.google.com/macros/s/AKfycbzA-YzZsCnGcZbsVAJXjrIUVn0EyxYECabCS30AIFh9zZfp7TR5MzIZdXnfvSVRlHsTtg/exec',
    KEY: 'bq_lang',
    LANGS: { en: 'English', ar: 'العربية', fr: 'Français', es: 'Español', de: 'Deutsch', pt: 'Português', tr: 'Türkçe', it: 'Italiano' },
    RTL: ['ar', 'he', 'fa', 'ur'],
    // عدّل هذا السيلكتور بعد فحص الصفحة (Inspect) لو السايدبار عندك id مختلف
    SIDEBAR: '#sidebar-v2, .hl_nav-header, #sidebar',
  };

  const loc = (location.pathname.match(/\/location\/([A-Za-z0-9]+)/) || [])[1];
  if (!loc) return;

  const $lang = () => localStorage.getItem(CFG.KEY) || 'en';
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const cacheKey = (l) => 'bq_cache_' + l;

  /* ---------- 1) التحقق من الصلاحية (مع كاش ساعة) ---------- */
  async function authorized() {
    try {
      const c = JSON.parse(sessionStorage.getItem('bq_auth_' + loc) || 'null');
      if (c && Date.now() - c.t < 3600e3) return c.ok;
    } catch (e) {}
    try {
      const r = await fetch(`${CFG.API}?action=check&loc=${loc}`);
      const j = await r.json();
      sessionStorage.setItem('bq_auth_' + loc, JSON.stringify({ ok: !!j.active, t: Date.now() }));
      return !!j.active;
    } catch (e) { return false; }
  }

  /* ---------- 2) زر تبديل اللغة (قائمة لغات) ---------- */
  function mountSwitcher(rtl) {
    if (document.getElementById('bq-switch')) return;
    const box = document.createElement('div');
    box.id = 'bq-switch';
    box.innerHTML = `<button id="bq-btn">🌐 ${CFG.LANGS[$lang()]}</button><div id="bq-menu" hidden>${
      Object.entries(CFG.LANGS).map(([k, v]) => `<div data-l="${k}">${v}</div>`).join('')}</div>`;
    document.body.appendChild(box);
    box.querySelector('#bq-btn').onclick = () => { const m = box.querySelector('#bq-menu'); m.hidden = !m.hidden; };
    box.querySelector('#bq-menu').onclick = (e) => {
      const l = e.target.dataset.l; if (!l) return;
      localStorage.setItem(CFG.KEY, l); location.reload();
    };
  }

  function injectCSS(rtl) {
    if (document.getElementById('bq-css')) return;
    const s = document.createElement('style'); s.id = 'bq-css';
    s.textContent = `
      #bq-switch{position:fixed;bottom:16px;${rtl ? 'left' : 'right'}:16px;z-index:999999;font:14px system-ui,sans-serif}
      #bq-btn{background:#111827;color:#fff;border:0;border-radius:999px;padding:10px 16px;cursor:pointer;box-shadow:0 4px 14px #0004}
      #bq-menu{position:absolute;bottom:48px;${rtl ? 'left' : 'right'}:0;background:#fff;color:#111;border-radius:10px;box-shadow:0 8px 24px #0003;overflow:hidden;min-width:140px}
      #bq-menu div{padding:9px 14px;cursor:pointer} #bq-menu div:hover{background:#f3f4f6}
      ${rtl ? `
      html.bq-rtl body, html.bq-rtl input, html.bq-rtl textarea, html.bq-rtl button{font-family:'Cairo','Tajawal',system-ui,sans-serif}
      html.bq-rtl ${CFG.SIDEBAR}{right:0!important;left:auto!important}
      html.bq-rtl input, html.bq-rtl textarea{text-align:right}
      html.bq-rtl input[type=email], html.bq-rtl input[type=tel], html.bq-rtl input[type=url]{direction:ltr;text-align:right}
      ` : ''}`;
    document.head.appendChild(s);
  }

  /* ---------- 3) الترجمة ---------- */
  let dict = {}, pending = new Set(), sending = false, queued = false, lang = 'en';
  const nodeRec = new WeakMap(); // node -> {src,out}
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA', 'SVG']);
  const hasWords = (s) => /[A-Za-z]{2,}/.test(s) && !/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(s) && !/^https?:/.test(s);

  function t(src) {
    const k = norm(src);
    if (dict[k]) return dict[k];
    if (hasWords(k) && k.length < 300) pending.add(k);
    return null;
  }

  function translateTree(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || SKIP.has(p.tagName.toUpperCase()) || p.closest('#bq-switch,[contenteditable="true"]')) return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim().length > 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    let n;
    while ((n = w.nextNode())) {
      const rec = nodeRec.get(n);
      if (rec && n.nodeValue === rec.out) continue; // ترجمناه قبل كده
      const out = t(n.nodeValue);
      if (out) {
        const lead = n.nodeValue.match(/^\s*/)[0], trail = n.nodeValue.match(/\s*$/)[0];
        const val = lead + out + trail;
        nodeRec.set(n, { src: n.nodeValue, out: val });
        n.nodeValue = val;
      }
    }
    root.querySelectorAll && root.querySelectorAll('[placeholder],[title],[aria-label]').forEach((el) => {
      ['placeholder', 'title', 'aria-label'].forEach((a) => {
        const v = el.getAttribute(a); if (!v || el.dataset['bq' + a]) return;
        const out = t(v); if (out) { el.setAttribute(a, out); el.dataset['bq' + a] = '1'; }
      });
    });
  }

  async function flushPending() {
    if (sending || !pending.size || !CFG.API) return;
    sending = true;
    const batch = [...pending].slice(0, 40); batch.forEach((s) => pending.delete(s));
    try {
      const r = await fetch(CFG.API, { method: 'POST', body: JSON.stringify({ loc, lang, strings: batch }) }); // text/plain => بدون preflight
      const map = await r.json();
      Object.assign(dict, map.translations || {});
      localStorage.setItem(cacheKey(lang), JSON.stringify(dict));
      schedule();
    } catch (e) { /* نحاول لاحقًا */ }
    sending = false;
    if (pending.size) setTimeout(flushPending, 500);
  }

  let apiTimer;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      translateTree(document.body);
      clearTimeout(apiTimer); apiTimer = setTimeout(flushPending, 700);
    });
  }

  /* ---------- 4) التشغيل ---------- */
  (async function init() {
    lang = $lang();
    if (!(await authorized())) return;
    const rtl = CFG.RTL.includes(lang);
    const start = () => {
      injectCSS(rtl); mountSwitcher(rtl);
      if (lang === 'en') return;
      document.documentElement.lang = lang;
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      document.documentElement.classList.toggle('bq-rtl', rtl);
      try { dict = JSON.parse(localStorage.getItem(cacheKey(lang)) || '{}'); } catch (e) {}
      schedule();
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true });
    };
    document.body ? start() : document.addEventListener('DOMContentLoaded', start);
  })();
})();

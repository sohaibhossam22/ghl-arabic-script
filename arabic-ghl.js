/* GHL Multi-language + RTL  |  ضعه على GitHub واستدعِه عبر jsDelivr في Agency Custom JS */
(function () {
  'use strict';
  if (window.__bqI18n) return;
  window.__bqI18n = true;

  const CFG = {
    API: 'https://script.google.com/macros/s/AKfycbyIxwE4AXDF55t9osyLaIqgwxoAtHH9xqLqt-is5C3fnINH6iiociHo0I1eW-hlyHe_oA/exec',
    USE_AI: false, // خليها false = قاموس ثابت فقط بدون Gemini. true = يترجم الناقص بالـ AI
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

  /* ---------- قاموس عربي مدمج (زوّد عليه براحتك) ---------- */
  const AR = {
 "Launch Pad": "لوحة الإطلاق",
 "Dashboard": "لوحة التحكم",
 "Conversations": "المحادثات",
 "Calendars": "التقويمات",
 "Calendar": "التقويم",
 "Contacts": "جهات الاتصال",
 "Opportunities": "الفرص",
 "Payments": "المدفوعات",
 "AI Agents": "وكلاء الذكاء الاصطناعي",
 "Marketing": "التسويق",
 "Automation": "الأتمتة",
 "Automations": "الأتمتة",
 "Sites": "المواقع",
 "Memberships": "العضويات",
 "Reputation": "السمعة",
 "Reporting": "التقارير",
 "Settings": "الإعدادات",
 "App Marketplace": "متجر التطبيقات",
 "Mobile App": "تطبيق الجوال",
 "Search": "بحث",
 "What's new": "الجديد",
 "Companies": "الشركات",
 "Tasks": "المهام",
 "Custom Fields": "الحقول المخصصة",
 "Bulk Actions": "إجراءات جماعية",
 "Smart Lists": "القوائم الذكية",
 "Restore": "استعادة",
 "Manage Smart Lists": "إدارة القوائم الذكية",
 "Import": "استيراد",
 "Export": "تصدير",
 "Add Contact": "إضافة جهة اتصال",
 "Search Contacts": "بحث في جهات الاتصال",
 "Manage fields": "إدارة الحقول",
 "Phone": "الهاتف",
 "Email": "البريد الإلكتروني",
 "Business name": "اسم النشاط التجاري",
 "Created": "تاريخ الإنشاء",
 "Last activity": "آخر نشاط",
 "Tags": "الوسوم",
 "Name": "الاسم",
 "Prev": "السابق",
 "Next": "التالي",
 "Previous": "السابق",
 "Save": "حفظ",
 "Cancel": "إلغاء",
 "Delete": "حذف",
 "Edit": "تعديل",
 "Add": "إضافة",
 "Create": "إنشاء",
 "Update": "تحديث",
 "Submit": "إرسال",
 "Close": "إغلاق",
 "Confirm": "تأكيد",
 "Apply": "تطبيق",
 "Filter": "تصفية",
 "Filters": "عوامل التصفية",
 "More filters": "المزيد من عوامل التصفية",
 "Sort": "ترتيب",
 "View": "عرض",
 "Back": "رجوع",
 "Done": "تم",
 "Send": "إرسال",
 "Reply": "رد",
 "Loading...": "جارٍ التحميل...",
 "All": "الكل",
 "None": "لا شيء",
 "Yes": "نعم",
 "No": "لا",
 "Status": "الحالة",
 "Active": "نشط",
 "Inactive": "غير نشط",
 "Draft": "مسودة",
 "Published": "منشور",
 "Open": "مفتوح",
 "Won": "مكسوبة",
 "Lost": "مخسورة",
 "Abandoned": "متروكة",
 "Pending": "قيد الانتظار",
 "Completed": "مكتمل",
 "Overdue": "متأخر",
 "Today": "اليوم",
 "Yesterday": "أمس",
 "Tomorrow": "غدًا",
 "This week": "هذا الأسبوع",
 "This month": "هذا الشهر",
 "Last 7 days": "آخر 7 أيام",
 "Last 30 days": "آخر 30 يومًا",
 "Unread": "غير مقروء",
 "Recents": "الأحدث",
 "Starred": "المميزة بنجمة",
 "Inbox": "صندوق الوارد",
 "Team Inbox": "صندوق الفريق",
 "Manual Actions": "إجراءات يدوية",
 "Templates": "القوالب",
 "Snippets": "المقتطفات",
 "Trigger Links": "روابط التشغيل",
 "Pipelines": "مسارات المبيعات",
 "Pipeline": "مسار المبيعات",
 "Opportunity status": "حالة الفرص",
 "Opportunity value": "قيمة الفرص",
 "Conversion rate": "معدل التحويل",
 "Funnel": "القمع التسويقي",
 "Stages distribution": "توزيع المراحل",
 "Lead source report": "تقرير مصادر العملاء المحتملين",
 "Source": "المصدر",
 "Total leads": "إجمالي العملاء المحتملين",
 "Total value": "القيمة الإجمالية",
 "Google Analytics count": "إحصاءات Google Analytics",
 "No data found": "لا توجد بيانات",
 "No results found": "لا توجد نتائج",
 "Go to manual actions": "الانتقال إلى الإجراءات اليدوية",
 "Invoices": "الفواتير",
 "Invoices & Estimates": "الفواتير وعروض الأسعار",
 "Estimates": "عروض الأسعار",
 "Subscriptions": "الاشتراكات",
 "Transactions": "المعاملات",
 "Products": "المنتجات",
 "Coupons": "القسائم",
 "Orders": "الطلبات",
 "Documents & Contracts": "المستندات والعقود",
 "Proposals": "العروض",
 "Forms": "النماذج",
 "Surveys": "الاستبيانات",
 "Funnels": "مسارات التحويل",
 "Websites": "المواقع الإلكترونية",
 "Workflows": "سير العمل",
 "Workflow": "سير العمل",
 "Campaigns": "الحملات",
 "Emails": "رسائل البريد",
 "Social Planner": "مخطط التواصل الاجتماعي",
 "Reviews": "التقييمات",
 "Reports": "التقارير",
 "Team": "الفريق",
 "My Staff": "فريق العمل",
 "Business Profile": "ملف النشاط التجاري",
 "Integrations": "التكاملات",
 "Phone Numbers": "أرقام الهاتف",
 "Custom Values": "القيم المخصصة",
 "Labs": "المختبر",
 "Audit Logs": "سجل التدقيق",
 "Send an SMS": "إرسال رسالة نصية",
 "Call": "اتصال",
 "Note": "ملاحظة",
 "Notes": "ملاحظات",
 "First name": "الاسم الأول",
 "Last name": "اسم العائلة",
 "Full name": "الاسم الكامل",
 "Address": "العنوان",
 "City": "المدينة",
 "Country": "الدولة",
 "Company": "الشركة",
 "Date": "التاريخ",
 "Time": "الوقت",
 "Type": "النوع",
 "Assigned to": "مُسند إلى",
 "Owner": "المالك",
 "Description": "الوصف",
 "Title": "العنوان",
 "Amount": "المبلغ",
 "Select": "اختيار",
 "Choose": "اختر",
 "Upload": "رفع",
 "Download": "تنزيل",
 "Copy": "نسخ",
 "Share": "مشاركة",
 "Preview": "معاينة",
 "Publish": "نشر",
 "Enable": "تفعيل",
 "Disable": "تعطيل",
 "Log out": "تسجيل الخروج",
 "Logout": "تسجيل الخروج",
 "Profile": "الملف الشخصي",
 "Help": "مساعدة",
 "Support": "الدعم",
 "Notifications": "الإشعارات",
 "Resolve": "حل",
 "Rows per page": "عدد الصفوف في الصفحة",
 "per page": "في الصفحة"
};
  const DL = {}; Object.keys(AR).forEach((k) => { DL[k.toLowerCase()] = AR[k]; });

  /* ---------- 3) الترجمة ---------- */
  let dict = {}, pending = new Set(), sending = false, queued = false, lang = 'en';
  const nodeRec = new WeakMap(); // node -> {src,out}
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA', 'SVG']);
  const hasWords = (s) => /[A-Za-z]{2,}/.test(s) && !/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(s) && !/^https?:/.test(s);

  function t(src) {
    const k = norm(src);
    if (dict[k]) return dict[k];
    if (lang === 'ar' && DL[k.toLowerCase()]) return DL[k.toLowerCase()];
    if (CFG.USE_AI && hasWords(k) && k.length < 300) pending.add(k);
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
    const done = (window.__bqAttr = window.__bqAttr || new WeakMap());
    root.querySelectorAll && root.querySelectorAll('[placeholder],[title],[aria-label]').forEach((el) => {
      ['placeholder', 'title', 'aria-label'].forEach((a) => {
        const v = el.getAttribute(a); if (!v) return;
        const rec = done.get(el) || {};
        if (rec[a] === v) return;
        const out = t(v);
        if (out) { el.setAttribute(a, out); rec[a] = out; done.set(el, rec); }
      });
    });
  }

  async function flushPending() {
    if (!CFG.USE_AI || sending || !pending.size || !CFG.API) return;
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

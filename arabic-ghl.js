(async function() {
  const API_URL = 'https://script.google.com/macros/s/AKfycbxaJQdvfg5OoqwwSsg_DOaBBgOkND-sJIifine-OcmP51SHIIonsPNMRGk79aqnq1TG/exec';

  function getLocationId() {
    const match = window.location.pathname.match(/\/location\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  const locationId = getLocationId();
  if (!locationId) return;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.allowedLocations && data.allowedLocations.includes(locationId)) {
      initRTL();
      initTranslation();
    }
  } catch (error) {
    console.error("Error validating license:", error);
  }

  function initRTL() {
    const style = document.createElement('style');
    // تعديلات CSS أقوى لضبط المسافات والقائمة الجانبية
    style.innerHTML = `
      body, #app { direction: rtl !important; }
      
      /* ضبط القائمة الجانبية لتكون على اليمين بالكامل */
      .sidebar-v2-location, #sidebar-v2, .hl_sidebar { 
        right: 0 !important; 
        left: auto !important; 
        border-left: 1px solid #e5e7eb !important; 
        border-right: none !important; 
      }
      
      /* ضبط محاذاة أيقونات القائمة الجانبية */
      .sidebar-v2-location nav a, .hl_sidebar nav a {
        justify-content: flex-start !important;
        padding-right: 15px !important;
      }
      
      /* ضبط المحتوى الأساسي عشان يقفل المسافة البيضا */
      .hl_wrapper, .hl_wrapper--inner, #app > div > div.flex.h-screen.overflow-hidden > div.relative.flex.flex-col.flex-1.overflow-y-auto.overflow-x-hidden { 
        margin-right: 240px !important; 
        margin-left: 0 !important; 
        width: calc(100% - 240px) !important;
      }
      
      /* الهيدر العلوي */
      .hl_header {
        right: 240px !important;
        left: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function initTranslation() {
    const dictionary = {
      "Dashboard": "لوحة التحكم",
      "Conversations": "المحادثات",
      "Calendars": "التقويم",
      "Calendar": "التقويم",
      "Contacts": "جهات الاتصال",
      "Opportunities": "الفرص",
      "Payments": "المدفوعات",
      "Marketing": "التسويق",
      "Automations": "الأتمتة",
      "Sites": "المواقع",
      "Settings": "الإعدادات",
      "Launch Pad": "لوحة الإطلاق",
      "Launchpad": "لوحة الإطلاق",
      "Reporting": "التقارير",
      "Reputation": "السمعة",
      "App Marketplace": "سوق التطبيقات",
      "Mobile App": "تطبيق الموبايل"
    };

    // دالة ترجمة أكثر شمولاً بتبحث داخل الـ innerHTML للعناصر
    function translateSidebar() {
        const sidebarLinks = document.querySelectorAll('a, span, p, div.text-sm, div.text-base');
        sidebarLinks.forEach(link => {
            if(link.childNodes.length > 0) {
                link.childNodes.forEach(node => {
                    if(node.nodeType === Node.TEXT_NODE) {
                        let text = node.nodeValue.trim();
                        if (dictionary[text]) {
                            node.nodeValue = node.nodeValue.replace(text, dictionary[text]);
                        }
                    }
                })
            }
        });
    }

    // تشغيل الترجمة فوراً وكل ثانية لمدة 5 ثواني عشان نضمن إن القائمة حملت بالكامل
    translateSidebar();
    let counter = 0;
    const interval = setInterval(() => {
        translateSidebar();
        counter++;
        if(counter > 5) clearInterval(interval);
    }, 1000);

    const observer = new MutationObserver(() => {
        translateSidebar();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
})();

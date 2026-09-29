
(async function() {
  // 1. رابط الـ API الخاص بيك اللي بيقرأ من جوجل شيت
  const API_URL = 'https://script.google.com/macros/s/AKfycbxaJQdvfg5OoqwwSsg_DOaBBgOkND-sJIifine-OcmP51SHIIonsPNMRGk79aqnq1TG/exec';

  // 2. استخراج رقم الحساب (Location ID) من الرابط
  function getLocationId() {
    const match = window.location.pathname.match(/\/location\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  const locationId = getLocationId();
  if (!locationId) return; // لو إنت في الداشبورد الرئيسية للوكالة، مفيش حاجة هتتغير

  try {
    // 3. التحقق من الصلاحية
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.allowedLocations && data.allowedLocations.includes(locationId)) {
      console.log("تم تفعيل الواجهة العربية لهذا الحساب!");
      initRTL();
      initTranslation();
    } else {
      console.log("هذا الحساب غير مفعل له ميزة الواجهة العربية.");
    }
  } catch (error) {
    console.error("Error validating translation license:", error);
  }

  // 4. قلب الاتجاه (RTL Injection)
  function initRTL() {
    const style = document.createElement('style');
    // تعديلات مبدئية لقلب الواجهة، ممكن تحتاج تظبيط أكتر بناءً على الكلاسات وقت التجربة
    style.innerHTML = `
      body, #app, .hl_wrapper { direction: rtl !important; text-align: right !important; }
      .hl_sidebar { right: 0 !important; left: auto !important; border-left: 1px solid #e5e7eb; border-right: none !important; }
      .hl_wrapper { margin-right: 240px !important; margin-left: 0 !important; }
      .hl_header { margin-right: 240px !important; margin-left: 0 !important; }
    `;
    document.head.appendChild(style);
  }

  // 5. الترجمة الفورية باستخدام MutationObserver
  function initTranslation() {
    const dictionary = {
      "Dashboard": "لوحة التحكم",
      "Conversations": "المحادثات",
      "Calendars": "التقويم",
      "Contacts": "جهات الاتصال",
      "Opportunities": "الفرص",
      "Payments": "المدفوعات",
      "Marketing": "التسويق",
      "Automations": "الأتمتة",
      "Sites": "المواقع",
      "Settings": "الإعدادات",
      "Launchpad": "لوحة الإطلاق",
      "Reporting": "التقارير"
    };

    function translateNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue.trim();
        if (dictionary[text]) {
          node.nodeValue = node.nodeValue.replace(text, dictionary[text]);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") {
        node.childNodes.forEach(child => translateNode(child));
      }
    }

    // تطبيق الترجمة على المحتوى اللي حمل بالفعل
    translateNode(document.body);

    // مراقبة أي عناصر جديدة تظهر (React DOM Updates)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => translateNode(node));
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
})();

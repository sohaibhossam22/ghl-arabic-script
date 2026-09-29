(async function () {

    /* =========================================================
       BeatApp Arabic UI
       RTL + Translation + Location Authorization
       ========================================================= */

    const API_URL =
        'https://script.google.com/macros/s/AKfycbxaJQdvfg5OoqwwSsg_DOaBBgOkND-sJIifine-OcmP51SHIIonsPNMRGk79aqn1TG/exec';


    /* =========================================================
       1. GET LOCATION ID
       ========================================================= */

    function getLocationId() {

        const match = window.location.pathname.match(
            /\/location\/([a-zA-Z0-9_-]+)/
        );

        return match ? match[1] : null;
    }


    const locationId = getLocationId();

    if (!locationId) {
        console.log('[BeatApp Arabic] Location ID not found.');
        return;
    }


    /* =========================================================
       2. LICENSE / AUTHORIZATION CHECK
       ========================================================= */

    try {

        const response = await fetch(API_URL, {
            cache: 'no-store'
        });


        if (!response.ok) {
            throw new Error(
                `License API returned ${response.status}`
            );
        }


        const data = await response.json();


        if (
            !data.allowedLocations ||
            !Array.isArray(data.allowedLocations)
        ) {

            console.log(
                '[BeatApp Arabic] Invalid authorization response.'
            );

            return;
        }


        const isAllowed =
            data.allowedLocations.includes(locationId);


        if (!isAllowed) {

            console.log(
                '[BeatApp Arabic] Arabic UI is not enabled for this location.'
            );

            return;
        }


        console.log(
            '[BeatApp Arabic] Arabic UI enabled for:',
            locationId
        );


        /* =====================================================
           3. START ARABIC MODE
           ===================================================== */

        initRTL();

        initTranslation();


    } catch (error) {

        console.error(
            '[BeatApp Arabic] License validation failed:',
            error
        );

    }


    /* =========================================================
       4. RTL / LAYOUT
       ========================================================= */

    function initRTL() {

        /*
         * Prevent duplicate style injection
         */

        if (document.getElementById('beatapp-arabic-style')) {
            return;
        }


        const style = document.createElement('style');

        style.id = 'beatapp-arabic-style';


        style.textContent = `

        /* =====================================================
           GLOBAL RTL
           ===================================================== */

        html.beatapp-arabic,
        html.beatapp-arabic body {

            direction: rtl !important;

        }


        /* =====================================================
           APP ROOT
           ===================================================== */

        html.beatapp-arabic #app {

            direction: rtl !important;

            width: 100% !important;

            max-width: 100% !important;

        }


        /* =====================================================
           SIDEBAR
           ===================================================== */

        html.beatapp-arabic .sidebar-v2-location,
        html.beatapp-arabic #sidebar-v2,
        html.beatapp-arabic .hl_sidebar {

            left: auto !important;

            right: 0 !important;

            direction: rtl !important;

        }


        /* =====================================================
           SIDEBAR NAV
           ===================================================== */

        html.beatapp-arabic
        .sidebar-v2-location nav,

        html.beatapp-arabic
        #sidebar-v2 nav,

        html.beatapp-arabic
        .hl_sidebar nav {

            direction: rtl !important;

        }


        /* =====================================================
           SIDEBAR LINKS
           ===================================================== */

        html.beatapp-arabic
        .sidebar-v2-location nav a,

        html.beatapp-arabic
        #sidebar-v2 nav a,

        html.beatapp-arabic
        .hl_sidebar nav a {

            direction: rtl !important;

            text-align: right !important;

            justify-content: flex-start !important;

        }


        /* =====================================================
           REMOVE THE OLD 240px OFFSET
           ===================================================== */

        html.beatapp-arabic
        .hl_wrapper,

        html.beatapp-arabic
        .hl_wrapper--inner {

            margin-right: 0 !important;

            margin-left: 0 !important;

            width: 100% !important;

            max-width: 100% !important;

        }


        /* =====================================================
           MAIN CONTENT
           ===================================================== */

        html.beatapp-arabic
        .hl_main,

        html.beatapp-arabic
        .hl_main-content {

            direction: rtl !important;

        }


        /* =====================================================
           HEADER
           ===================================================== */

        html.beatapp-arabic
        .hl_header {

            left: 0 !important;

            right: 0 !important;

            direction: rtl !important;

        }


        /* =====================================================
           INPUTS
           ===================================================== */

        html.beatapp-arabic input,

        html.beatapp-arabic textarea,

        html.beatapp-arabic select {

            direction: rtl !important;

            text-align: right !important;

        }


        /* =====================================================
           DROPDOWNS
           ===================================================== */

        html.beatapp-arabic
        [role="dialog"],

        html.beatapp-arabic
        [role="menu"],

        html.beatapp-arabic
        [role="listbox"] {

            direction: rtl !important;

            text-align: right !important;

        }


        /* =====================================================
           BUTTONS
           ===================================================== */

        html.beatapp-arabic button {

            direction: rtl;

        }


        /* =====================================================
           COMMON TEXT ALIGNMENT
           ===================================================== */

        html.beatapp-arabic
        .text-left {

            text-align: right !important;

        }


        html.beatapp-arabic
        .text-right {

            text-align: left !important;

        }


        /* =====================================================
           TOOLTIPS
           ===================================================== */

        html.beatapp-arabic
        [role="tooltip"] {

            direction: rtl !important;

            text-align: right !important;

        }

        `;


        document.head.appendChild(style);


        /*
         * Add RTL class
         */

        document.documentElement.classList.add(
            'beatapp-arabic'
        );


        /*
         * Set HTML language
         */

        document.documentElement.lang = 'ar';


        document.documentElement.dir = 'rtl';


        console.log(
            '[BeatApp Arabic] RTL enabled.'
        );

    }


    /* =========================================================
       5. TRANSLATION SYSTEM
       ========================================================= */

    function initTranslation() {


        /* =====================================================
           TRANSLATION DICTIONARY
           ===================================================== */

        const dictionary = {

            /* -------------------------------------------------
               SIDEBAR
               ------------------------------------------------- */

            "Launch Pad":
                "لوحة البداية",

            "Launchpad":
                "لوحة البداية",

            "Dashboard":
                "لوحة التحكم",

            "Conversations":
                "المحادثات",

            "Calendar":
                "التقويم",

            "Calendars":
                "التقويم",

            "Contacts":
                "جهات الاتصال",

            "Opportunities":
                "الفرص",

            "Payments":
                "المدفوعات",

            "AI Agents":
                "وكلاء الذكاء الاصطناعي",

            "Marketing":
                "التسويق",

            "Automations":
                "الأتمتة",

            "Sites":
                "المواقع",

            "Settings":
                "الإعدادات",

            "Reporting":
                "التقارير",

            "Reputation":
                "السمعة",

            "App Marketplace":
                "سوق التطبيقات",

            "Mobile App":
                "تطبيق الهاتف",


            /* -------------------------------------------------
               SEARCH / COMMON
               ------------------------------------------------- */

            "Search":
                "بحث",

            "New":
                "جديد",

            "Save":
                "حفظ",

            "Cancel":
                "إلغاء",

            "Close":
                "إغلاق",

            "Edit":
                "تعديل",

            "Delete":
                "حذف",

            "Create":
                "إنشاء",

            "Add":
                "إضافة",

            "Back":
                "رجوع",

            "Next":
                "التالي",

            "Previous":
                "السابق",

            "Apply":
                "تطبيق",

            "Clear":
                "مسح",

            "Select":
                "اختيار",

            "Select All":
                "تحديد الكل",

            "Loading...":
                "جاري التحميل...",


            /* -------------------------------------------------
               DASHBOARD
               ------------------------------------------------- */

            "Opportunity status":
                "حالة الفرص",

            "Opportunity value":
                "قيمة الفرص",

            "Conversion rate":
                "معدل التحويل",

            "All pipelines":
                "جميع مسارات المبيعات",

            "Funnel":
                "مسار المبيعات",

            "Stages distribution":
                "توزيع المراحل",

            "Total revenue":
                "إجمالي الإيرادات",

            "Won revenue":
                "الإيرادات المكتسبة",

            "Last 30 days":
                "آخر 30 يوم",

            "Last 7 days":
                "آخر 7 أيام",

            "Last 90 days":
                "آخر 90 يوم",

            "Today":
                "اليوم",

            "Yesterday":
                "أمس",

            "This week":
                "هذا الأسبوع",

            "This month":
                "هذا الشهر",


            /* -------------------------------------------------
               OPPORTUNITIES
               ------------------------------------------------- */

            "Open":
                "مفتوحة",

            "Won":
                "مكتسبة",

            "Lost":
                "خاسرة",

            "Open -":
                "مفتوحة -",


            /* -------------------------------------------------
               CONVERSATIONS
               ------------------------------------------------- */

            "All Caught Up!":
                "لا توجد محادثات جديدة",

            "You don't have any unread Team inbox conversations right now.":
                "ليس لديك أي محادثات غير مقروءة في صندوق الفريق حاليًا.",

            "View All Team inbox Conversations":
                "عرض جميع محادثات صندوق الفريق",

            "No conversation selected":
                "لم يتم اختيار محادثة",

            "Select a conversation from the list to view contact details.":
                "اختر محادثة من القائمة لعرض تفاصيل جهة الاتصال.",


            /* -------------------------------------------------
               CONVERSATION ACTIONS
               ------------------------------------------------- */

            "Manual Actions":
                "الإجراءات اليدوية",

            "Trigger Links":
                "روابط التشغيل",

            "Snippets":
                "المقاطع الجاهزة",

            "Analytics":
                "التحليلات",


            /* -------------------------------------------------
               CONTACTS
               ------------------------------------------------- */

            "Contact":
                "جهة اتصال",

            "Contacts":
                "جهات الاتصال",

            "First Name":
                "الاسم الأول",

            "Last Name":
                "اسم العائلة",

            "Phone":
                "الهاتف",

            "Email":
                "البريد الإلكتروني",

            "Address":
                "العنوان",

            "Company":
                "الشركة",

            "Tags":
                "العلامات",

            "Notes":
                "الملاحظات",


            /* -------------------------------------------------
               CALENDAR
               ------------------------------------------------- */

            "Appointment":
                "موعد",

            "Appointments":
                "المواعيد",

            "Book Appointment":
                "حجز موعد",

            "Schedule":
                "الجدول",

            "Available":
                "متاح",

            "Unavailable":
                "غير متاح",


            /* -------------------------------------------------
               AUTOMATIONS
               ------------------------------------------------- */

            "Workflow":
                "سير العمل",

            "Workflows":
                "سير العمل",

            "Trigger":
                "المشغّل",

            "Action":
                "الإجراء",

            "Actions":
                "الإجراءات",

            "Conditions":
                "الشروط",

            "Published":
                "منشور",

            "Draft":
                "مسودة",


            /* -------------------------------------------------
               NOTIFICATIONS
               ------------------------------------------------- */

            "Notifications":
                "الإشعارات",

            "Notification":
                "إشعار",

            "View":
                "عرض",

            "View All":
                "عرض الكل"

        };


        /* =====================================================
           NORMALIZE TEXT
           ===================================================== */

        function normalize(text) {

            return text
                .replace(/\s+/g, ' ')
                .trim();

        }


        /* =====================================================
           TRANSLATE TEXT NODE
           ===================================================== */

        function translateTextNode(node) {

            const original =
                normalize(node.nodeValue);


            if (!original) {
                return;
            }


            const translated =
                dictionary[original];


            if (!translated) {
                return;
            }


            if (original === translated) {
                return;
            }


            node.nodeValue =
                node.nodeValue.replace(
                    original,
                    translated
                );

        }


        /* =====================================================
           WALK DOM
           ===================================================== */

        function walk(root) {

            const walker =
                document.createTreeWalker(

                    root,

                    NodeFilter.SHOW_TEXT,

                    {

                        acceptNode(node) {

                            const parent =
                                node.parentElement;


                            if (!parent) {

                                return NodeFilter.FILTER_REJECT;

                            }


                            /*
                             * Don't translate scripts/styles
                             */

                            if (

                                parent.tagName === 'SCRIPT' ||

                                parent.tagName === 'STYLE' ||

                                parent.tagName === 'NOSCRIPT'

                            ) {

                                return NodeFilter.FILTER_REJECT;

                            }


                            return NodeFilter.FILTER_ACCEPT;

                        }

                    }

                );


            const nodes = [];


            while (walker.nextNode()) {

                nodes.push(
                    walker.currentNode
                );

            }


            nodes.forEach(
                translateTextNode
            );

        }


        /* =====================================================
           MAIN TRANSLATION
           ===================================================== */

        function translatePage() {

            if (
                !document.body
            ) {
                return;
            }


            walk(document.body);

        }


        /* =====================================================
           PERFORMANCE CONTROL
           ===================================================== */

        let translationQueued = false;


        function scheduleTranslation() {

            if (translationQueued) {
                return;
            }


            translationQueued = true;


            requestAnimationFrame(() => {

                translationQueued = false;

                translatePage();

            });

        }


        /* =====================================================
           INITIAL TRANSLATION
           ===================================================== */

        translatePage();


        /*
         * Small delayed scans because HighLevel
         * loads some components asynchronously.
         */

        setTimeout(
            translatePage,
            500
        );


        setTimeout(
            translatePage,
            1500
        );


        setTimeout(
            translatePage,
            3000
        );


        /* =====================================================
           MUTATION OBSERVER
           ===================================================== */

        const observer =
            new MutationObserver(() => {

                scheduleTranslation();

            });


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );


        console.log(
            '[BeatApp Arabic] Translation system initialized.'
        );

    }

})();

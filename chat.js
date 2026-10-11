/* =========================================================
   Arvand School 1
   Chat Widget JavaScript
   ========================================================= */


   document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DOM Elements
       ===================================================== */

    const chatBubble =
        document.querySelector("#chatBubble");

    const chatWindow =
        document.querySelector("#chatWindow");

    const chatClose =
        document.querySelector("#chatClose");

    const chatBody =
        document.querySelector("#chatBody");

    const chatForm =
        document.querySelector("#chatForm");

    const chatInput =
        document.querySelector("#chatInput");

    const chatSuggestions =
        document.querySelector("#chatSuggestions");


    /* =====================================================
       Knowledge Base
       ===================================================== */

    const knowledge = [

        /* ============ سلام و احوال‌پرسی ============ */

        {
            keywords: ["سلام", "درود", "وقت بخیر", "خسته نباشید"],
            answer: "سلام! 👋 چطور می‌تونم کمکتون کنم؟"
        },

        {
            keywords: ["ممنون", "مرسی", "متشکر", "سپاس"],
            answer: "خواهش می‌کنم. سؤال دیگه‌ای دارید؟"
        },

        {
            keywords: ["خداحافظ", "بای", "خدانگهدار"],
            answer: "موفق باشید. روز خوبی داشته باشید."
        },


        /* ============ درباره مدرسه ============ */

        {
            keywords: ["ساعت", "زمان", "ساعتی", "چه موقع"],
            answer: "روزهای دوشنبه و سه‌شنبه از ۷:۳۰ تا ۱۳:۴۰ و بقیه روزها از ۷:۳۰ تا ۱۲:۱۵."
        },

        {
            keywords: ["آدرس", "کجا", "مکان", "موقعیت"],
            answer: "منطقه بسیجیان، نیلوفر ۵."
        },

        {
            keywords: ["شماره", "تماس", "تلفن"],
            answer: "۰۵۸۳۶۳۶۰۸۸۴"
        },

        {
            keywords: ["چند دانش‌آموز", "تعداد دانش‌آموز", "چند نفر"],
            answer: "دبیرستان اروند بیشتر از ۲۴۰ نفر دانش‌آموز دارد."
        },

        {
            keywords: ["ابتدایی", "راهنمایی", "کنار هم"],
            answer: "دو مدرسه‌ی ابتدایی و راهنمایی کنار هم هستن، اما کادر و محیط هر دو مدرسه جدا است."
        },


        /* ============ درباره ثبت‌نام ============ */

        {
            keywords: ["ثبت‌نام", "ثبت نام", "پیش‌ثبت‌نام", "پیش ثبت نام", "نام‌نویسی"],
            answer: "از طریق سایت امکان ثبت‌نام نیست. برای پیش‌ثبت‌نام و ثبت‌نام با مدیریت در ارتباط باشید: ۰۵۸۳۶۳۶۰۸۸۴"
        },


        /* ============ درباره امکانات ============ */

        {
            keywords: ["کلاس", "تعداد کلاس"],
            answer: "۹ کلاس مجهز به امکانات لازم و اولیه."
        },

        {
            keywords: ["کارگاه", "فناوری"],
            answer: "اتاق کارگاه فناوری."
        },

        {
            keywords: ["آزمایشگاه", "ازمایشگاه"],
            answer: "آزمایشگاه و وسایل آزمایشگاه."
        },

        {
            keywords: ["پروژکتور", "دیتا", "ویدیو پروژکتور"],
            answer: "دو عدد دیتا پروژکتور برای ارائه‌های کلاسی."
        },

        {
            keywords: ["ورزش", "سالن", "زنگ ورزش"],
            answer: "برگزاری زنگ ورزش در نزدیک‌ترین سالن ورزشی."
        },

        {
            keywords: ["امکانات", "چه امکاناتی"],
            answer: "۹ کلاس مجهز، اتاق کارگاه فناوری، آزمایشگاه، دو دیتا پروژکتور، و برگزاری زنگ ورزش در سالن ورزشی نزدیک."
        },


        /* ============ درباره کادر ============ */

        {
            keywords: ["مدیر", "ارزمان‌زاده", "ارزمان زاده"],
            answer: "آقای رضا ارزمان‌زاده، مدیر مجموعه."
        },

        {
            keywords: ["معاون پرورشی", "حسن‌زاده", "حسن زاده"],
            answer: "آقای حسن‌زاده، معاون پرورشی."
        },

        {
            keywords: ["معاون آموزشی", "رجب‌زاده", "رجب زاده"],
            answer: "آقای رجب‌زاده، معاون آموزشی."
        },

        {
            keywords: ["معاون اجرایی", "آلخانیان", "خانم آلخانیان"],
            answer: "سرکار خانم آلخانیان، معاون اجرایی."
        },

        {
            keywords: ["انفورماتیک", "ملکی", "کامپیوتر"],
            answer: "آقای ملکی، مسئول انفورماتیک."
        },

        {
            keywords: ["مربی پرورشی", "نیرومند", "نیرو مند"],
            answer: "آقای نیرومند، مربی پرورشی."
        },

        {
            keywords: ["معلم", "تعداد معلم", "دبیر"],
            answer: "بیشتر از ۲۵ معلم."
        },

        {
            keywords: ["کادر", "عوامل", "کارکنان"],
            answer: "مدیر: آقای رضا ارزمان‌زاده\nمعاون پرورشی: آقای حسن‌زاده\nمعاون آموزشی: آقای رجب‌زاده\nمعاون اجرایی: سرکار خانم آلخانیان\nمسئول انفورماتیک: آقای ملکی\nمربی پرورشی: آقای نیرومند\nمعلمان: بیشتر از ۲۵ نفر"
        }

    ];


    /* =====================================================
       Helpers
       ===================================================== */

    function normalizeText(text) {

        return (text || "")
            .toString()
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();

    }


    function findAnswer(question) {

        const normalized =
            normalizeText(question);

        if (!normalized) {
            return "";
        }

        for (const item of knowledge) {

            for (const keyword of item.keywords) {

                const normalizedKeyword =
                    normalizeText(keyword);

                if (normalized.includes(normalizedKeyword)) {
                    return item.answer;
                }

            }

        }

        return "متأسفم، متوجه نشدم. لطفاً سؤالتون رو واضح‌تر بپرسید یا با مدرسه تماس بگیرید: ۰۵۸۳۶۳۶۰۸۸۴";

    }


    function scrollToBottom() {

        if (!chatBody) {
            return;
        }

        chatBody.scrollTop = chatBody.scrollHeight;

    }


    function addMessage(text, sender) {

        if (!chatBody) {
            return;
        }

        const message =
            document.createElement("div");

        message.className =
            "chat-message chat-message-" + sender;

        const textEl =
            document.createElement("span");

        textEl.className = "chat-message-text";
        textEl.textContent = text;

        message.appendChild(textEl);
        chatBody.appendChild(message);

        scrollToBottom();

    }


    function addBotMessage(text) {
        addMessage(text, "bot");
    }


    function addUserMessage(text) {
        addMessage(text, "user");
    }


    /* =====================================================
       Open / Close
       ===================================================== */

    function openChat() {

        if (!chatWindow) {
            return;
        }

        chatWindow.classList.add("open");

        if (chatInput) {
            setTimeout(() => chatInput.focus(), 250);
        }

    }


    function closeChat() {

        if (!chatWindow) {
            return;
        }

        chatWindow.classList.remove("open");

    }


    function toggleChat() {

        if (!chatWindow) {
            return;
        }

        if (chatWindow.classList.contains("open")) {
            closeChat();
        } else {
            openChat();
        }

    }


    if (chatBubble) {
        chatBubble.addEventListener("click", toggleChat);
    }


    if (chatClose) {
        chatClose.addEventListener("click", closeChat);
    }


    /* =====================================================
       Suggestions
       ===================================================== */

    if (chatSuggestions) {

        chatSuggestions
            .querySelectorAll(".chat-suggestion")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const question =
                        button.dataset.question ||
                        button.textContent.trim();

                    handleQuestion(question);

                });

            });

    }


    /* =====================================================
       Send Message
       ===================================================== */

    function handleQuestion(question) {

        if (!question) {
            return;
        }

        addUserMessage(question);

        const answer =
            findAnswer(question);

        setTimeout(() => {
            addBotMessage(answer);
        }, 350);

    }


    if (chatForm) {

        chatForm.addEventListener("submit", event => {

            event.preventDefault();

            if (!chatInput) {
                return;
            }

            const question =
                chatInput.value.trim();

            if (!question) {
                return;
            }

            chatInput.value = "";

            handleQuestion(question);

        });

    }


    /* =====================================================
       Welcome Message
       ===================================================== */

    const welcomeText =
        "سلام! 👋\nمن دستیار دبیرستان اروند  هستم.\nچطور می‌تونم کمکتون کنم؟";

    addBotMessage(welcomeText);

});
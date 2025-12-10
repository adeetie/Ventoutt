// mentalbot.js – Core chatbot implementation (Bundled for file:// compatibility)
console.log("mentalbot.js loading...");

// ============================================================
// UTILS (Merged from utils.js)
// ============================================================

// Simple DOM element creator
function createElement(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'class') el.className = value;
        else if (key === 'style') Object.assign(el.style, value);
        else el.setAttribute(key, value);
    });
    children.forEach(child => {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child instanceof Node) el.appendChild(child);
    });
    return el;
}

// Fetch JSON with error handling
async function fetchJson(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Network error: ${resp.status}`);
    return resp.json();
}

// Debounce function
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Simple logger
const log = console.log.bind(console);


// ============================================================
// CONVERSATION CONTENT
// ============================================================

const CRISIS_KEYWORDS = [
    "suicide",
    "kill myself",
    "end my life",
    "want to die",
    "self-harm",
    "hurt myself",
];

const CONTENT = {
    // Sticky Disclaimers
    disclaimer: {
        desktop: `Disclaimer: Our coaching sessions are led by qualified psychologists based in India and are offered for psychoeducation, emotional support, and personal development. Coaching is not therapy, does not include diagnosis or treatment, and may not be a regulated mental-health service in your region. For licensed therapy or clinical care, please use the verified therapy resources provided. If you feel unsafe or in crisis, contact local emergency services or crisis helplines immediately.`,
        mobile: `Coaching is not therapy. No diagnosis or treatment. For therapy or crisis care, use external verified resources.`,
        usAddition: `Coaching provided through this platform is not licensed therapy in the United States.`
    },

    // Entry conversation
    entry: {
        welcome: `Hi, I'm here to explain the different kinds of support available.\nYou don't need to know what you need right now — many people feel unsure at first.\n\nIf you're comfortable sharing, what are you feeling at the moment?`,
    },

    // Neutral reflection
    reflection: `Thank you for sharing that.\nPeople experience these feelings in many different ways, and there isn't one meaning behind them.\n\nI can share some general information about the types of support available here. You can explore any of them at your own pace.`,

    // Service Explanations
    venting: {
        explanation: `Venting is a space to express what you're feeling to a trained listener.\nThe purpose is emotional release and the experience of being heard.\n\nVenting does not include advice, diagnosis, treatment, or psychological analysis.\nIt is simply a private, supportive space to talk.`
    },

    coaching: {
        explanation: `Coaching is a guided, skill-building conversation led by qualified psychologists based in India.\n\nIt focuses on:\n• emotional awareness\n• managing overthinking\n• relationship patterns\n• building confidence & clarity\n• personal growth tools\n\nCoaching is not therapy and does not involve diagnosis or medical treatment.`,
        usAddition: `\n\nFor users in the United States, coaching is offered as psychoeducation and emotional guidance only. It is not licensed clinical therapy.`
    },

    therapy: {
        explanation: `Therapy is provided by licensed mental-health professionals who diagnose and treat mental-health conditions.\n\nWe do not provide therapy inside this chat.\nInstead, we redirect you to verified external therapy platforms where you can connect with licensed professionals.`
    },

    // Crisis
    crisis: {
        message: `I'm really sorry that you're feeling this way.\nThis chat cannot provide crisis support.\n\nPlease reach out to immediate, real-time help through your local emergency services or suicide prevention helplines.`
    },

    unsafe: {
        message: `I'm really glad you reached out, but this space can't provide crisis support.\nPlease contact your local emergency services or suicide prevention helplines immediately.`
    },

    // FAQ
    faq: {
        intro: `You're welcome to ask questions.\nI can share general information, but I can't provide personal or clinical advice.`,
        isVentingSafe: `Venting is designed to be a supportive emotional expression space.\nListeners are trained to respect boundaries, maintain confidentiality, and avoid judgment.\n\nVenting is not a substitute for therapy, medical care, or crisis intervention.`,
        whoAreCoaches: `Our coaching sessions are led by qualified psychologists based in India.\nThey are trained in psychology and emotional support.\n\nCoaching focuses on guidance and skill-building, not on therapy, diagnosis, or treatment.`,
        isThisTherapy: `No.\nVenting and coaching are not therapy.\n\nTherapy involves licensed professionals who diagnose and treat mental-health conditions.\nWe provide external links to verified therapy platforms for that purpose.`,
        privacyChats: `Conversations on this platform are designed to be private and confidential.\n\nConfidentiality may only be limited if there is an immediate safety risk that requires emergency intervention.`,
        feelWorse: `People process emotions in different ways.\nSome feel relief immediately, while others feel stirred before feeling lighter.\n\nIf you ever feel overwhelmed or unsafe, please reach out to local emergency or crisis services.`,
        areLicensed: `Our psychologists are qualified under Indian professional standards.\n\nThey may not be licensed as therapists in your specific country or region.`,
        stayAnonymous: `Yes, you can engage with this platform without sharing personal identifying information unless required for booking or safety purposes.`,
        somethingElse: `I can share general information, but I can't help with personal diagnosis or medical advice.\nIf your question involves safety or crisis, please use the crisis resources.`
    }
};

const BUTTONS = {
    feelings: [
        { label: "Overwhelmed / stressed", action: "feeling_overwhelmed" },
        { label: "Sad / low", action: "feeling_sad" },
        { label: "Confused / stuck", action: "feeling_confused" },
        { label: "Numb / disconnected", action: "feeling_numb" },
        { label: "Not sure", action: "feeling_unsure" },
        { label: "I'd rather not say", action: "feeling_notsay" }
    ],
    serviceOptions: [
        { label: "What is Venting?", action: "explain_venting" },
        { label: "What is Coaching?", action: "explain_coaching" },
        { label: "What is Therapy?", action: "explain_therapy" },
        { label: "What if I feel unsafe?", action: "crisis" },
        { label: "I have a question", action: "faq_menu" }
    ],
    ventingOptions: [
        { label: "Start Venting", action: "start_venting" },
        { label: "Learn about Coaching", action: "explain_coaching" },
        { label: "Learn about Therapy", action: "explain_therapy" },
        { label: "I have a question", action: "faq_menu" }
    ],
    coachingOptions: [
        { label: "Book Coaching", action: "book_coaching" },
        { label: "Learn about Venting", action: "explain_venting" },
        { label: "Learn about Therapy", action: "explain_therapy" },
        { label: "I have a question", action: "faq_menu" }
    ],
    therapyOptions: [
        { label: "View Therapy Resources", action: "view_therapy" },
        { label: "Learn about Coaching", action: "explain_coaching" },
        { label: "Learn about Venting", action: "explain_venting" },
        { label: "I have a question", action: "faq_menu" }
    ],
    crisisOnly: [
        { label: "Open Crisis Helplines", action: "open_helplines" }
    ],
    faqMenu: [
        { label: "Is venting safe?", action: "faq_venting_safe" },
        { label: "Who are your coaches?", action: "faq_coaches" },
        { label: "Is this therapy?", action: "faq_therapy" },
        { label: "Will my chats stay private?", action: "faq_privacy" },
        { label: "What if I feel worse while talking?", action: "faq_feel_worse" },
        { label: "Are your psychologists licensed?", action: "faq_licensed" },
        { label: "Can I stay anonymous?", action: "faq_anonymous" },
        { label: "Something else", action: "faq_something_else" }
    ],
    contactOptions: [
        { label: "WhatsApp", action: "contact_whatsapp" },
        { label: "Instagram", action: "contact_instagram" },
        { label: "Telegram", action: "contact_telegram" },
        { label: "Twitter", action: "contact_twitter" },
        { label: "Email", action: "contact_email" },
        { label: "Phone Call", action: "contact_phone" }
    ],
    universal: [
        { label: "Start Venting", action: "start_venting" },
        { label: "Book Coaching", action: "book_coaching" },
        { label: "View Therapy Resources", action: "view_therapy" },
        { label: "Crisis Helplines", action: "open_helplines" },
        { label: "Ask another question", action: "faq_menu" }
    ]
};

// ============================================================
// MAIN CHATBOT OBJECT
// ============================================================

const MB = {
    state: "collapsed",
    conversationPhase: "initial",
    userRegion: null,
    userFeeling: null,

    on: function (event, handler) {
        if (!this._handlers) this._handlers = {};
        if (!this._handlers[event]) this._handlers[event] = [];
        this._handlers[event].push(handler);
    },
    emit: function (event, payload) {
        if (this._handlers && this._handlers[event]) {
            this._handlers[event].forEach((fn) => fn(payload));
        }
        if (typeof window !== "undefined" && window.dataLayer) {
            window.dataLayer.push({ event: `chatbot_${event}`, ...payload });
        }
    },

    init: function () {
        this.shell = document.getElementById("mentalbot-shell");
        this.bar = document.getElementById("mentalbot-bar");
        this.panel = document.getElementById("mentalbot-panel");
        this.disclaimer = document.getElementById("mentalbot-disclaimer");
        this.msgArea = document.getElementById("mentalbot-messages");
        this.btnArea = document.getElementById("mentalbot-buttons");
        this.inputArea = document.getElementById("mentalbot-input-area");
        this.input = document.getElementById("mentalbot-input");
        this.sendBtn = document.getElementById("mentalbot-send");
        this.closeBtn = document.getElementById("mentalbot-close");
        this.overlay = document.getElementById("mentalbot-overlay");

        if (this.msgArea) {
            this.msgArea.addEventListener("scroll", () => this.handleScroll());
        }

        if (this.bar) this.bar.addEventListener("click", () => this.toggle());
        if (this.sendBtn) this.sendBtn.addEventListener("click", () => this.handleUserSend());
        if (this.input) this.input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.handleUserSend();
        });

        if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.close());
        if (this.overlay) this.overlay.addEventListener("click", () => this.close());

        this.updateAria();
        this.geoDetect();
        this.updateDisclaimer();
        this.geoDetect();
        this.updateDisclaimer();

        // Ensure input is enabled so users can type immediately
        this.enableInput();

        this.conversationPhase = "initial";
        this.addBotMessage(CONTENT.entry.welcome, {
            buttons: BUTTONS.feelings
        });

        console.log("MB Initialized");

        // URL Routing Check
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('chatbot') === 'open') {
            // Slight delay to allow render
            setTimeout(() => this.toggle(true), 500);
        }
    },

    handleScroll: function () {
        if (!this.disclaimer || !this.msgArea) return;
        if (this.msgArea.scrollTop > 5) {
            this.disclaimer.classList.add("hidden");
        } else {
            this.disclaimer.classList.remove("hidden");
        }
    },

    getCurrentTime: function () {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    },

    getAvatar: function (type) {
        if (type === "bot") {
            return `
            <div class="avatar" style="background:#E8E8E8; display:flex; align-items:center; justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>`;
        } else {
            return `
            <div class="avatar" style="background:#C0F1C6; display:flex; align-items:center; justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>`;
        }
    },

    showTyping: function () {
        if (document.getElementById("mb-typing")) return;
        const typingMsg = createElement("div", { class: "msg-container bot-container", id: "mb-typing" });
        typingMsg.innerHTML = `
            <div class="msg-header">
                ${this.getAvatar("bot")}
                <span class="name">Mentor</span>
            </div>
            <div class="bot-msg typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        if (this.msgArea) {
            this.msgArea.appendChild(typingMsg);
            this.msgArea.scrollTop = this.msgArea.scrollHeight;
        }
    },

    hideTyping: function () {
        const el = document.getElementById("mb-typing");
        if (el) el.remove();
    },

    updateAria: function () {
        if (!this.bar || !this.panel) return;
        const expanded = this.state !== "collapsed";
        this.bar.setAttribute("aria-expanded", expanded);
        this.panel.setAttribute("aria-hidden", !expanded);
    },

    toggle: function (forceOpen) {
        if (forceOpen === true) {
            this.state = "collapsed"; // Will flip to expanded below
        } else if (forceOpen === false) {
            this.state = "expanded"; // Will flip to collapsed
        }

        if (this.state === "collapsed") {
            this.state = "expanded";
            this.showMobileOverlay();
        } else {
            this.state = "collapsed";
            this.hideMobileOverlay();
        }
        if (this.shell) this.shell.className = this.state;
        this.updateAria();
        this.emit(this.state);
    },

    openFull: function () {
        this.state = "full";
        if (this.shell) this.shell.className = "full";
        this.showMobileOverlay();
        this.updateAria();
        this.emit("full");
    },

    backToExpanded: function () {
        this.state = "expanded";
        if (this.shell) this.shell.className = "expanded";
        this.updateAria();
        this.emit("expanded");
        this.conversationPhase = "reflection";
        if (this.msgArea) this.msgArea.innerHTML = "";
        this.addBotMessage(CONTENT.reflection, {
            buttons: BUTTONS.serviceOptions
        });
        this.disableInput(true);
    },

    close: function () {
        this.state = "collapsed";
        if (this.shell) this.shell.className = "collapsed";
        this.hideMobileOverlay();
        this.updateAria();
        this.emit("collapsed");
    },

    addBotMessage: function (text, options = {}) {
        this.showTyping();
        setTimeout(() => {
            try {
                this.hideTyping();

                const container = createElement("div", { class: "msg-container bot-container" });

                const header = `
                    <div class="msg-header">
                        ${this.getAvatar("bot")}
                        <span class="name">Mentor</span>
                        <span class="time">${this.getCurrentTime()}</span>
                    </div>
                `;

                const bubble = createElement("div", { class: "bot-msg" }, text);

                container.innerHTML = header;
                container.appendChild(bubble);

                if (this.msgArea) {
                    this.msgArea.appendChild(container);
                    this.msgArea.scrollTop = this.msgArea.scrollHeight;
                }

                if (options.buttons && Array.isArray(options.buttons)) {
                    this.renderButtons(options.buttons);
                }
                this.emit("botMessage", { text, options });
            } catch (err) {
                console.error("Error in addBotMessage:", err);
            }
        }, 600);
    },

    addUserMessage: function (text) {
        const container = createElement("div", { class: "msg-container user-container" });
        const header = `
            <div class="msg-header">
                <span class="time">${this.getCurrentTime()}</span>
                <span class="name">You</span>
                ${this.getAvatar("user")}
            </div>
        `;
        const bubble = createElement("div", { class: "user-msg" }, text);
        container.innerHTML = header;
        container.appendChild(bubble);

        if (this.msgArea) {
            this.msgArea.appendChild(container);
            this.msgArea.scrollTop = this.msgArea.scrollHeight;
        }
        this.emit("userMessage", { text });
    },

    renderButtons: function (buttons) {
        if (!this.btnArea) return;
        this.btnArea.innerHTML = "";
        if (this.state === "full" && this.conversationPhase !== "crisis") {
            const backBtn = createElement(
                "button",
                { "data-action": "back", "class": "back-btn" },
                "← Back"
            );
            backBtn.addEventListener("click", () => this.handleButtonAction("back", "Back"));
            this.btnArea.appendChild(backBtn);
        }
        buttons.forEach((b) => {
            const btn = createElement(
                "button",
                { "data-action": b.action },
                b.label
            );
            btn.addEventListener("click", () => this.handleButtonAction(b.action, b.label));
            this.btnArea.appendChild(btn);
        });
    },

    handleButtonAction: function (action, label) {
        // Echo selection as user message (unless it's 'back' or internal navigation that shouldn't appear?)
        // User requested: "when user chooses an option it should be sent like the text message"
        if (label && action !== "back") {
            this.addUserMessage(label);
        }

        // Contact Actions
        if (action.startsWith("contact_")) {
            const platform = action.replace("contact_", "");
            let url = "";
            switch (platform) {
                case "whatsapp": url = "https://wa.me/1234567890"; break;
                case "instagram": url = "https://instagram.com/ventoutt"; break;
                case "telegram": url = "https://t.me/ventoutt"; break;
                case "twitter": url = "https://twitter.com/ventoutt"; break;
                case "email": url = "mailto:support@ventoutt.com"; break;
                case "phone": url = "tel:+911234567890"; break;
            }
            if (url) window.open(url, "_blank");
            return;
        }

        if (action.startsWith("feeling_")) {
            this.userFeeling = action.replace("feeling_", "");
            this.conversationPhase = "reflection";
            this.addBotMessage(CONTENT.reflection, { buttons: BUTTONS.serviceOptions });
            this.disableInput(true);
            return;
        }
        if (action === "explain_venting") {
            this.openFull();
            this.conversationPhase = "explanation";
            if (this.msgArea) this.msgArea.innerHTML = "";
            this.addBotMessage(CONTENT.venting.explanation, { buttons: BUTTONS.ventingOptions });
            this.disableInput(true);
            return;
        }
        if (action === "explain_coaching") {
            this.openFull();
            this.conversationPhase = "explanation";
            if (this.msgArea) this.msgArea.innerHTML = "";
            let txt = CONTENT.coaching.explanation;
            if (this.userRegion === "US") txt += CONTENT.coaching.usAddition;
            this.addBotMessage(txt, { buttons: BUTTONS.coachingOptions });
            this.disableInput(true);
            return;
        }
        if (action === "explain_therapy") {
            this.openFull();
            this.conversationPhase = "explanation";
            if (this.msgArea) this.msgArea.innerHTML = "";
            this.addBotMessage(CONTENT.therapy.explanation, { buttons: BUTTONS.therapyOptions });
            this.disableInput(true);
            return;
        }
        if (action === "faq_menu") {
            this.conversationPhase = "faq";
            this.addBotMessage(CONTENT.faq.intro, { buttons: BUTTONS.faqMenu });
            this.disableInput(true);
            return;
        }
        if (action.startsWith("faq_")) {
            const faqKey = action.replace("faq_", "");
            let responseText = "";
            // Mapping existing keys... handling simplified for brevity
            // Note: mapping is same as before, no logic change
            if (faqKey === "venting_safe") responseText = CONTENT.faq.isVentingSafe;
            else if (faqKey === "coaches") responseText = CONTENT.faq.whoAreCoaches;
            else if (faqKey === "therapy") responseText = CONTENT.faq.isThisTherapy;
            else if (faqKey === "privacy") responseText = CONTENT.faq.privacyChats;
            else if (faqKey === "feel_worse") responseText = CONTENT.faq.feelWorse;
            else if (faqKey === "licensed") responseText = CONTENT.faq.areLicensed;
            else if (faqKey === "anonymous") responseText = CONTENT.faq.stayAnonymous;
            else if (faqKey === "something_else") responseText = CONTENT.faq.somethingElse;

            this.addBotMessage(responseText, { buttons: BUTTONS.universal });
            this.disableInput(true);
            return;
        }
        if (action === "crisis") {
            this.crisisRedirect();
            return;
        }

        switch (action) {
            case "start_venting": window.location.href = "demo-venting.html"; break;
            case "book_coaching": window.location.href = "demo-coaching.html"; break;
            case "view_therapy": window.location.href = "demo-therapy.html"; break;
            case "open_helplines": window.open("https://www.988lifeline.org/", "_blank"); break;
            case "back": this.backToExpanded(); break;
            default: log("Unknown action", action);
        }
    },

    handleUserSend: function () {
        if (!this.input) return;
        const txt = this.input.value.trim();
        if (!txt) return;
        this.addUserMessage(txt);
        this.input.value = "";
        if (this.containsCrisisKeywords(txt)) {
            this.crisisRedirect();
            return;
        }

        // Fallback: Show Contact Options
        const fallbackMsg = "I'm not sure about that. To ensure you get the right help, you can contact us directly on:";
        this.addBotMessage(fallbackMsg, { buttons: BUTTONS.contactOptions });
    },

    containsCrisisKeywords: function (text) {
        const lower = text.toLowerCase();
        return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
    },

    crisisRedirect: function () {
        this.conversationPhase = "crisis";
        this.addBotMessage(CONTENT.crisis.message, { buttons: BUTTONS.crisisOnly });
        this.disableInput(true);
        this.emit("crisisRedirect");
    },

    disableInput: function (keepVisible = false) {
        if (!keepVisible) {
            if (this.input) this.input.disabled = true;
            if (this.sendBtn) this.sendBtn.disabled = true;
            if (this.inputArea) this.inputArea.style.opacity = "0.7";
        }
    },

    // Kept for signature compatibility if needed, but not used in Borcelle style really
    enableInput: function () {
        if (this.inputArea) this.inputArea.style.display = "flex";
        if (this.input) this.input.disabled = false;
        if (this.sendBtn) this.sendBtn.disabled = false;
        if (this.inputArea) this.inputArea.style.opacity = "1";
    },

    updateDisclaimer: function () {
        if (!this.disclaimer) return;
        let text = CONTENT.disclaimer.desktop;
        if (this.userRegion === "US") {
            text += " " + CONTENT.disclaimer.usAddition;
        }
        this.disclaimer.textContent = text;
        this.disclaimer.classList.remove("hidden");
    },

    geoDetect: async function () {
        try {
            const data = await fetchJson("https://ipapi.co/json/");
            this.userRegion = data.country_code;
            this.updateDisclaimer();
            this.emit("geoDetected", { country: this.userRegion });
        } catch (e) {
            log("Geo detection failed", e);
        }
    },

    showMobileOverlay: function () {
        if (window.innerWidth <= 768 && this.overlay) {
            this.overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    },

    hideMobileOverlay: function () {
        if (this.overlay) {
            this.overlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    },
};

console.log("mentalbot.js initialization logic reached");

// Initialize
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => MB.init());
} else {
    MB.init();
}

window.MB = MB;
console.log("mentalbot.js loaded completely");

/* mentalbot.js - Production Script Implementation */

// ===========================================
// CONTENT DICTIONARY
// ===========================================
const CONTENT = {
    disclaimer: {
        text: `Disclaimer: Our coaching sessions are led by qualified psychologists based in India and are offered for psychoeducation, emotional support, and personal development.\nCoaching is not therapy, does not include diagnosis or treatment, and may not be a regulated mental-health service in your region.\nFor licensed therapy or clinical care, please use the verified therapy resources provided.\nIf you feel unsafe or in crisis, contact local emergency services or crisis helplines immediately.`,
        usAddition: `\n\nCoaching provided through this platform is not licensed therapy in the United States.`
    },
    opening: {
        message: `Hi, I’m here to explain the different kinds of support available.\nYou don’t need to know what you need right now — many people feel unsure at first.\n\nIf you’re comfortable sharing, what are you feeling at the moment?`
    },
    reflection: {
        message: `Thank you for sharing that.\nPeople experience these feelings in many different ways, and there isn’t one meaning behind them.\n\nI can share some general information about the types of support available here. You can explore any of them at your own pace.`
    },
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
    crisis: {
        response: `I’m really sorry that you’re feeling this way.\nThis chat cannot provide crisis support.\n\nPlease reach out to immediate, real-time help through your local emergency services or suicide prevention helplines.`,
        unsafeKeywordResponse: `I’m really glad you reached out, but this space can’t provide crisis support.\nPlease contact your local emergency services or suicide prevention helplines immediately.`
    },
    faq: {
        intro: `You’re welcome to ask questions.\nI can share general information, but I can’t provide personal or clinical advice.`,
        safety: `Venting is designed to be a supportive emotional expression space.\nListeners are trained to respect boundaries, maintain confidentiality, and avoid judgment.\n\nVenting is not a substitute for therapy, medical care, or crisis intervention.`,
        coaches: `Our coaching sessions are led by qualified psychologists based in India.\nThey are trained in psychology and emotional support.\n\nCoaching focuses on guidance and skill-building, not on therapy, diagnosis, or treatment.`,
        therapyDiff: `No.\nVenting and coaching are not therapy.\n\nTherapy involves licensed professionals who diagnose and treat mental-health conditions.\nWe provide external links to verified therapy platforms for that purpose.`,
        privacy: `Conversations on this platform are designed to be private and confidential.\n\nConfidentiality may only be limited if there is an immediate safety risk that requires emergency intervention.`,
        worse: `People process emotions in different ways.\nSome feel relief immediately, while others feel stirred before feeling lighter.\n\nIf you ever feel overwhelmed or unsafe, please reach out to local emergency or crisis services.`,
        license: `Our psychologists are qualified under Indian professional standards.\n\nThey may not be licensed as therapists in your specific country or region.`,
        anon: `Yes, you can engage with this platform without sharing personal identifying information unless required for booking or safety purposes.`,
        other: `I can share general information, but I can’t help with personal diagnosis or medical advice.\nIf your question involves safety or crisis, please use the crisis resources.`
    },
    fallback: `I can help you explore Venting, Coaching, or Therapy. What would you like to know?`
};

// ===========================================
// BUTTON SETS
// ===========================================
const BUTTONS = {
    feelings: [
        { label: "Overwhelmed / stressed", action: "feeling_picked" },
        { label: "Sad / low", action: "feeling_picked" },
        { label: "Confused / stuck", action: "feeling_picked" },
        { label: "Numb / disconnected", action: "feeling_picked" },
        { label: "Not sure", action: "feeling_picked" },
        { label: "I’d rather not say", action: "feeling_picked" }
    ],
    reflection: [
        { label: "What is Venting?", action: "explain_venting" },
        { label: "What is Coaching?", action: "explain_coaching" },
        { label: "What is Therapy?", action: "explain_therapy" },
        { label: "What if I feel unsafe?", action: "crisis_mode" },
        { label: "I have a question", action: "faq_intro" }
    ],
    venting: [
        { label: "Start Venting", action: "goto_venting" },
        { label: "Learn about Coaching", action: "explain_coaching" },
        { label: "Learn about Therapy", action: "explain_therapy" },
        { label: "I have a question", action: "faq_intro" }
    ],
    coaching: [
        { label: "Book Coaching", action: "goto_coaching" },
        { label: "Learn about Venting", action: "explain_venting" },
        { label: "Learn about Therapy", action: "explain_therapy" },
        { label: "I have a question", action: "faq_intro" }
    ],
    therapy: [
        { label: "View Therapy Resources", action: "goto_therapy" },
        { label: "Learn about Coaching", action: "explain_coaching" },
        { label: "Learn about Venting", action: "explain_venting" },
        { label: "I have a question", action: "faq_intro" }
    ],
    crisis: [
        { label: "Open Crisis Helplines", action: "goto_helpline" }
    ],
    faqMenu: [
        { label: "Is venting safe?", action: "faq_safety" },
        { label: "Who are your coaches?", action: "faq_coaches" },
        { label: "Is this therapy?", action: "faq_therapyDiff" },
        { label: "Will my chats stay private?", action: "faq_privacy" },
        { label: "What if I feel worse?", action: "faq_worse" },
        { label: "Are your psychologists licensed?", action: "faq_license" },
        { label: "Can I stay anonymous?", action: "faq_anon" },
        { label: "Something else", action: "faq_other" }
    ],
    universal: [
        { label: "Start Venting", action: "goto_venting" },
        { label: "Book Coaching", action: "goto_coaching" },
        { label: "View Therapy Resources", action: "goto_therapy" },
        { label: "Crisis Helplines", action: "goto_helpline" },
        { label: "Ask another question", action: "faq_intro" }
    ]
};

const CRISIS_KEYWORDS = ["suicide", "kill myself", "end my life", "want to die", "self-harm", "hurt myself"];

// ===========================================
// MAIN CLASS
// ===========================================
const MB = {
    isOpen: false,
    userRegion: null,

    init() {
        this.rebuildDOM();
        this.cacheDOM();
        this.bindEvents();
        this.detectRegion();

        // Initial Messages
        // We need to wait for region detection ideally, but we can update disclaimer layout later.
        // Or just render base disclaimer first.
        this.addDisclaimer();
        this.addBotMessage(CONTENT.opening.message, BUTTONS.feelings);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('chatbot') === 'open') {
            setTimeout(() => this.toggle(true), 500);
        }

        // Auto-open after 20 seconds
        setTimeout(() => {
            if (!this.isOpen) this.toggle(true);
        }, 20000); // 20000ms = 20s
    },

    rebuildDOM() {
        const shell = document.getElementById('mentalbot-shell') || this.createShell();
        const panel = shell.querySelector('#mentalbot-panel') || document.createElement('div');
        panel.id = 'mentalbot-panel';
        panel.innerHTML = '';

        const header = document.createElement('div');
        header.id = 'mentalbot-header';
        header.innerHTML = `
            <span class="header-title">Message</span>
            <button id="mentalbot-close" aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
        `;

        const messages = document.createElement('div');
        messages.id = 'mentalbot-messages';

        const inputArea = document.createElement('div');
        inputArea.id = 'mentalbot-input-area';
        inputArea.innerHTML = `
            <input id="mentalbot-input" type="text" placeholder="Type a message...">
            <button id="mentalbot-send">
                <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg> 
            </button>
        `;

        panel.appendChild(header);
        panel.appendChild(messages);
        panel.appendChild(inputArea);
        if (!shell.contains(panel)) shell.appendChild(panel);

        if (!document.getElementById('mentalbot-bar')) {
            const bar = document.createElement('button');
            bar.id = 'mentalbot-bar';
            bar.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
            shell.appendChild(bar);
        }
    },

    createShell() {
        const el = document.createElement('div');
        el.id = 'mentalbot-shell';
        el.className = 'collapsed';
        document.body.appendChild(el);
        return el;
    },

    cacheDOM() {
        this.dom = {
            shell: document.getElementById('mentalbot-shell'),
            close: document.getElementById('mentalbot-close'),
            trigger: document.getElementById('mentalbot-bar'),
            messages: document.getElementById('mentalbot-messages'),
            input: document.getElementById('mentalbot-input'),
            send: document.getElementById('mentalbot-send'),
            overlay: document.getElementById('mentalbot-overlay')
        };
    },

    bindEvents() {
        this.dom.trigger.addEventListener('click', () => this.toggle());
        this.dom.close.addEventListener('click', () => this.close());
        this.dom.send.addEventListener('click', () => this.handleSend());
        this.dom.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });

        if (!this.dom.overlay) {
            const sv = document.createElement('div');
            sv.id = 'mentalbot-overlay';
            document.body.appendChild(sv);
            this.dom.overlay = sv;
        }
        this.dom.overlay.addEventListener('click', () => this.close());
    },

    toggle(force) {
        if (typeof force === 'boolean') this.isOpen = force;
        else this.isOpen = !this.isOpen;

        const shell = this.dom.shell;
        if (this.isOpen) {
            shell.classList.remove('collapsed');
            if (window.innerWidth <= 480) this.dom.overlay.style.display = 'block';
        } else {
            shell.classList.add('collapsed');
            this.dom.overlay.style.display = 'none';
        }
    },

    close() { this.toggle(false); },

    // Location Detection for US Compliance
    detectRegion() {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                this.userRegion = data.country_code; // 'US', 'IN', etc.
                if (this.userRegion === 'US') {
                    // Update disclaimer if already rendered
                    const disc = document.querySelector('.mb-disclaimer-block');
                    if (disc && !disc.innerText.includes('United States')) {
                        disc.innerText += CONTENT.disclaimer.usAddition;
                    }
                }
            })
            .catch(err => console.log('Geo detect failed, assuming global.', err));
    },

    addDisclaimer() {
        const div = document.createElement('div');
        div.className = 'mb-disclaimer-block';
        div.innerText = CONTENT.disclaimer.text;
        this.dom.messages.appendChild(div);
    },

    addBotMessage(text, buttons = []) {
        this.showTyping();

        setTimeout(() => {
            this.removeTyping();

            const group = document.createElement('div');
            group.className = 'bot-group';

            const bubble = document.createElement('div');
            bubble.className = 'mb-bubble bot-msg';

            // Convert newlines to breaks if needed, or rely on white-space: pre-wrap
            // Using innerText mostly works, but if we need formatting let's use:
            bubble.innerText = text;

            const time = document.createElement('span');
            time.className = 'mb-time';
            time.textContent = this.getTime();

            group.appendChild(bubble);
            group.appendChild(time);

            this.dom.messages.appendChild(group);
            this.scrollToBottom();

            if (buttons.length > 0) {
                this.addButtons(buttons);
            }
        }, 600); // 600ms typing delay
    },

    addUserMessage(text) {
        this.removeButtons();

        const group = document.createElement('div');
        group.className = 'user-group';

        const bubble = document.createElement('div');
        bubble.className = 'mb-bubble user-msg';
        bubble.innerText = text;

        const time = document.createElement('span');
        time.className = 'mb-time';
        time.textContent = this.getTime();

        group.appendChild(bubble);
        group.appendChild(time);

        this.dom.messages.appendChild(group);
        this.scrollToBottom();
    },

    addButtons(buttons) {
        const c = document.createElement('div');
        c.className = 'mb-options-group';
        c.id = 'mb-active-buttons';

        buttons.forEach(b => {
            const btn = document.createElement('button');
            btn.className = 'mb-option-btn';
            btn.textContent = b.label;
            btn.onclick = () => this.handleAction(b.action, b.label);
            c.appendChild(btn);
        });

        this.dom.messages.appendChild(c);
        this.scrollToBottom();
    },

    removeButtons() {
        const el = document.getElementById('mb-active-buttons');
        if (el) el.remove();
    },

    handleAction(action, label) {
        this.addUserMessage(label);

        // Core Flow Logic
        if (action === 'feeling_picked') {
            this.addBotMessage(CONTENT.reflection.message, BUTTONS.reflection);
            return;
        }

        if (action === 'explain_venting') {
            this.addBotMessage(CONTENT.venting.explanation, BUTTONS.venting);
            return;
        }

        if (action === 'explain_coaching') {
            let msg = CONTENT.coaching.explanation;
            if (this.userRegion === 'US') {
                msg += CONTENT.coaching.usAddition;
            }
            this.addBotMessage(msg, BUTTONS.coaching);
            return;
        }

        if (action === 'explain_therapy') {
            this.addBotMessage(CONTENT.therapy.explanation, BUTTONS.therapy);
            return;
        }

        if (action === 'crisis_mode') {
            this.addBotMessage(CONTENT.crisis.response, BUTTONS.crisis);
            return;
        }

        if (action === 'faq_intro') {
            this.addBotMessage(CONTENT.faq.intro, BUTTONS.faqMenu);
            return;
        }

        if (action.startsWith('faq_')) {
            const key = action.replace('faq_', '');
            const answer = CONTENT.faq[key] || CONTENT.fallback; // e.g. faq.safety
            this.addBotMessage(answer, BUTTONS.universal);
            return;
        }

        // External Links
        if (action === 'goto_venting') { window.location.href = 'demo-venting.html'; return; }
        if (action === 'goto_coaching') { window.location.href = 'demo-coaching.html'; return; }
        if (action === 'goto_therapy') { window.location.href = 'demo-therapy.html'; return; }
        if (action === 'goto_helpline') { window.open('https://findahelpline.com/', '_blank'); return; }

        // Fallback
        this.addBotMessage(CONTENT.fallback, BUTTONS.reflection);
    },

    handleSend() {
        const txt = this.dom.input.value.trim();
        if (!txt) return;
        this.dom.input.value = '';
        this.addUserMessage(txt);

        // Crisis Check
        const lower = txt.toLowerCase();
        const isCrisis = CRISIS_KEYWORDS.some(kw => lower.includes(kw));

        if (isCrisis) {
            this.addBotMessage(CONTENT.crisis.unsafeKeywordResponse, BUTTONS.crisis);
        } else {
            // General "I don't understand" but helpful fallback
            setTimeout(() => {
                this.addBotMessage(CONTENT.fallback, BUTTONS.reflection);
            }, 600);
        }
    },

    showTyping() {
        const t = document.createElement('div');
        t.className = 'typing-bubble';
        t.id = 'mb-typing';
        t.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        this.dom.messages.appendChild(t);
        this.scrollToBottom();
    },

    removeTyping() {
        const t = document.getElementById('mb-typing');
        if (t) t.remove();
    },

    scrollToBottom() {
        this.dom.messages.scrollTop = this.dom.messages.scrollHeight;
    },

    getTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    }
};

document.addEventListener('DOMContentLoaded', () => MB.init());
window.MB = MB;

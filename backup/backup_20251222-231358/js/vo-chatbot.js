/**
 * VentOutt Chatbot (Refactored)
 * Loads HTML and manages Chat Interaction.
 */
(function () {
    'use strict';

    const COMPONENT_PATH = 'components/vo-chatbot.html';

    // Content Definitions
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
        fallback: `I can help you explore Venting, Coaching, or Therapy. What would you like to know?`,
        faq: {
            intro: `You’re welcome to ask questions.\nI can share general information, but I can’t provide personal or clinical advice.`
        }
    };

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
            { label: "What if I feel unsafe?", action: "crisis_mode" }
        ],
        venting: [
            { label: "Start Venting", action: "goto_venting" },
            { label: "Learn about Coaching", action: "explain_coaching" }
        ],
        coaching: [
            { label: "Book Coaching", action: "goto_coaching" },
            { label: "Learn about Venting", action: "explain_venting" }
        ],
        therapy: [
            { label: "View Therapy Resources", action: "goto_therapy" },
            { label: "Learn about Coaching", action: "explain_coaching" }
        ],
        crisis: [
            { label: "Open Crisis Helplines", action: "goto_helpline" }
        ],
        universal: [
            { label: "Back to Start", action: "restart" }
        ]
    };

    const CRISIS_KEYWORDS = ["suicide", "kill myself", "end my life", "want to die", "self-harm", "hurt myself"];

    // Main Class
    const VoChatbot = {
        isOpen: false,
        userRegion: 'IN', // default
        dom: {},

        load() {
            if (document.querySelector('.vo-chatbot')) return;

            fetch(COMPONENT_PATH)
                .then(res => res.text())
                .then(html => {
                    const container = document.createElement('div');
                    container.innerHTML = html;
                    document.body.appendChild(container);
                    // Slight delay to ensure DOM injection
                    setTimeout(() => this.init(), 50);
                })
                .catch(e => console.error(e));
        },

        init() {
            this.cacheDOM();
            this.bindEvents();
            this.detectRegion();

            // Initial Content
            this.addDisclaimer();
            this.addBotMessage(CONTENT.opening.message, BUTTONS.feelings);

            // Auto-open logic
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('chatbot') === 'open') {
                setTimeout(() => this.toggle(true), 500);
            }

            // Timer auto-open
            setTimeout(() => { if (!this.isOpen) this.toggle(true); }, 20000);
        },

        cacheDOM() {
            this.dom = {
                wrapper: document.querySelector('.vo-chatbot'),
                trigger: document.querySelector('.vo-chatbot__trigger'),
                panel: document.querySelector('.vo-chatbot__panel'),
                close: document.querySelector('.vo-chatbot__close'),
                messages: document.querySelector('.vo-chatbot__messages'),
                input: document.querySelector('.vo-chatbot__input'),
                send: document.querySelector('.vo-chatbot__send'),
                overlay: document.querySelector('.vo-chatbot__overlay')
            };
        },

        bindEvents() {
            if (!this.dom.trigger) return;

            this.dom.trigger.addEventListener('click', () => this.toggle());
            this.dom.close.addEventListener('click', () => this.close());
            this.dom.overlay.addEventListener('click', () => this.close());

            this.dom.send.addEventListener('click', () => this.handleSend());
            this.dom.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSend();
            });
        },

        toggle(force) {
            if (typeof force === 'boolean') this.isOpen = force;
            else this.isOpen = !this.isOpen;

            if (this.isOpen) {
                this.dom.wrapper.classList.add('open');
            } else {
                this.dom.wrapper.classList.remove('open');
            }
        },

        close() { this.toggle(false); },

        detectRegion() {
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    this.userRegion = data.country_code;
                    if (this.userRegion === 'US') {
                        const disc = document.querySelector('.vo-chatbot__disclaimer');
                        if (disc) disc.innerText += CONTENT.disclaimer.usAddition;
                    }
                })
                .catch(() => { });
        },

        // Messaging Logic
        addDisclaimer() {
            const div = document.createElement('div');
            div.className = 'vo-chatbot__disclaimer';
            div.innerText = CONTENT.disclaimer.text;
            this.dom.messages.appendChild(div);
        },

        addBotMessage(text, buttons = []) {
            this.showTyping();
            setTimeout(() => {
                this.removeTyping();

                const group = document.createElement('div');
                group.className = 'vo-chatbot__group--bot';

                const bubble = document.createElement('div');
                bubble.className = 'vo-chatbot__bubble vo-chatbot__bubble--bot';
                bubble.innerText = text;

                const time = document.createElement('span');
                time.className = 'vo-chatbot__time';
                time.textContent = this.getTime();

                group.appendChild(bubble);
                group.appendChild(time);
                this.dom.messages.appendChild(group);
                this.scrollToBottom();

                if (buttons.length > 0) this.addButtons(buttons);
            }, 600);
        },

        addUserMessage(text) {
            this.removeButtons();

            const group = document.createElement('div');
            group.className = 'vo-chatbot__group--user';

            const bubble = document.createElement('div');
            bubble.className = 'vo-chatbot__bubble vo-chatbot__bubble--user';
            bubble.innerText = text;

            const time = document.createElement('span');
            time.className = 'vo-chatbot__time';
            time.textContent = this.getTime();

            group.appendChild(bubble);
            group.appendChild(time);
            this.dom.messages.appendChild(group);
            this.scrollToBottom();
        },

        addButtons(buttons) {
            const c = document.createElement('div');
            c.className = 'vo-chatbot__options';
            c.id = 'vo-active-buttons';

            buttons.forEach(b => {
                const btn = document.createElement('button');
                btn.className = 'vo-chatbot__option-btn';
                btn.textContent = b.label;
                btn.onclick = () => this.handleAction(b.action, b.label);
                c.appendChild(btn);
            });
            this.dom.messages.appendChild(c);
            this.scrollToBottom();
        },

        removeButtons() {
            const el = document.getElementById('vo-active-buttons');
            if (el) el.remove();
        },

        handleAction(action, label, isTyped = false) {
            if (!isTyped && label) this.addUserMessage(label);

            if (action === 'feeling_picked') {
                this.addBotMessage(CONTENT.reflection.message, BUTTONS.reflection);
            } else if (action === 'explain_venting') {
                this.addBotMessage(CONTENT.venting.explanation, BUTTONS.venting);
            } else if (action === 'explain_coaching') {
                let msg = CONTENT.coaching.explanation;
                if (this.userRegion === 'US') msg += CONTENT.coaching.usAddition;
                this.addBotMessage(msg, BUTTONS.coaching);
            } else if (action === 'explain_therapy') {
                this.addBotMessage(CONTENT.therapy.explanation, BUTTONS.therapy);
            } else if (action === 'crisis_mode') {
                this.addBotMessage(CONTENT.crisis.response, BUTTONS.crisis);
            } else if (action === 'goto_venting') {
                window.location.href = 'venting.html';
            } else if (action === 'goto_coaching') {
                window.location.href = 'coaching.html';
            } else if (action === 'goto_therapy') {
                window.location.href = 'therapy.html';
            } else if (action === 'goto_helpline') {
                window.open('https://findahelpline.com/', '_blank');
            } else {
                this.addBotMessage(CONTENT.fallback, BUTTONS.reflection);
            }
        },

        handleSend() {
            const txt = this.dom.input.value.trim();
            if (!txt) return;
            this.dom.input.value = '';

            this.addUserMessage(txt);

            // Basic Keyword Detection
            const lower = txt.toLowerCase();
            if (CRISIS_KEYWORDS.some(kw => lower.includes(kw))) {
                this.addBotMessage(CONTENT.crisis.unsafeKeywordResponse, BUTTONS.crisis);
                return;
            }

            // Fallback Logic
            setTimeout(() => {
                this.addBotMessage(CONTENT.fallback, BUTTONS.reflection);
            }, 600);
        },

        showTyping() {
            const t = document.createElement('div');
            t.className = 'vo-chatbot__typing';
            t.id = 'vo-typing';
            t.innerHTML = '<div class="vo-chatbot__dot"></div><div class="vo-chatbot__dot"></div><div class="vo-chatbot__dot"></div>';
            this.dom.messages.appendChild(t);
            this.scrollToBottom();
        },

        removeTyping() {
            const t = document.getElementById('vo-typing');
            if (t) t.remove();
        },

        scrollToBottom() {
            this.dom.messages.scrollTop = this.dom.messages.scrollHeight;
        },

        getTime() {
            return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => VoChatbot.load());
    } else {
        VoChatbot.load();
    }
})();

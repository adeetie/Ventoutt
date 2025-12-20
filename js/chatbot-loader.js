/**
 * Chatbot Component Loader
 * Loads the chatbot HTML structure and then initializes the chatbot logic
 */

(function () {
    'use strict';

    function loadChatbot() {
        // Check if chatbot already exists to prevent double loading
        if (document.getElementById('mentalbot-shell')) return;

        fetch('components/chatbot.html')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load chatbot component');
                return response.text();
            })
            .then(html => {
                // Inject HTML at the end of body
                const container = document.createElement('div');
                container.innerHTML = html;
                document.body.appendChild(container);

                // Load the chatbot logic script dynamically
                loadChatbotScript();
            })
            .catch(err => console.error('Error loading chatbot:', err));
    }

    function loadChatbotScript() {
        const script = document.createElement('script');
        script.src = 'js/chatbot.js';
        script.onload = () => {
            // Initialize if MB object exists and hasn't been initialized by the script itself
            // chatbot.js currently calls MB.init() on DOMContentLoaded.
            // Since DOMContentLoaded has likely passed, we might need to manually init.
            if (window.MB && typeof window.MB.init === 'function') {
                // Check if already initialized (by checking if listeners are bound? simplistic check)
                // Actually MB.init calls rebuildDOM which checks if elements exist.
                // existing chatbot.js init call runs on DOMContentLoaded.
                // If we are late, it won't run. So we run it here.
                window.MB.init();
            }
        };
        document.body.appendChild(script);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadChatbot);
    } else {
        loadChatbot();
    }

})();

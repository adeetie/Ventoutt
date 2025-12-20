/**
 * Popups Loader
 * Loads popup HTML components and initializes their logic (Scroll Popup & Entry Modal)
 */

(function () {
    'use strict';

    function loadPopups() {
        // Prevent double loading
        if (document.getElementById('scroll-popup') && document.getElementById('entry-popup-overlay')) return;

        fetch('components/popups.html')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load popups component');
                return response.text();
            })
            .then(html => {
                const container = document.createElement('div');
                container.id = 'popups-component-container';
                container.innerHTML = html;
                document.body.appendChild(container);

                // Initialize Logic
                initEntryModal();
                initScrollPopup();
            })
            .catch(err => console.error('Error loading popups:', err));
    }

    /**
     * Entry Modal Logic
     * Shows a centered modal on the homepage after a delay, once per session.
     */
    function initEntryModal() {
        // Only run on Homepage
        const path = window.location.pathname;
        const isHome = path.endsWith("index.html") || path === "/" || path.endsWith("/");
        if (!isHome) return;

        // Check Session
        if (sessionStorage.getItem("entryModalShown")) return;

        const overlay = document.getElementById("entry-popup-overlay");
        const closeBtn = document.getElementById("entry-popup-close");
        if (!overlay || !closeBtn) return;

        // Show after 1s delay
        setTimeout(() => {
            overlay.classList.add("active");
            sessionStorage.setItem("entryModalShown", "true");
        }, 1000);

        closeBtn.addEventListener("click", () => {
            overlay.classList.remove("active");
        });

        // Close on background click? (Optional, commonly expected)
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.classList.remove("active");
            }
        });
    }

    /**
     * Scroll Popup Logic
     * Shows a bottom popup when scrolling past 80% of the page.
     */
    function initScrollPopup() {
        const popup = document.getElementById("scroll-popup");
        const closeBtn = document.getElementById("close-popup");
        if (!popup) return;

        const pageKey = "popupShown_" + window.location.pathname;
        let hasShown = sessionStorage.getItem(pageKey) === "true";

        // Scroll Listener
        window.addEventListener("scroll", () => {
            // Uncomment to enforce one-time show per session:
            // if (hasShown) return;

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            if (scrollHeight <= clientHeight) return; // Don't show if no scroll

            const scrollPercent = (scrollTop + clientHeight) / scrollHeight;

            if (scrollPercent > 0.8) {
                showPopup();
            }
        });

        function showPopup() {
            // If entry modal is currently active, maybe don't show scroll popup?
            // But let's keep logic simple.
            popup.classList.add("show");
            hasShown = true;
            sessionStorage.setItem(pageKey, "true");
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                popup.classList.remove("show");
            });
        }
    }

    // Init on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPopups);
    } else {
        loadPopups();
    }

})();

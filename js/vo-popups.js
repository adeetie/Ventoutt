/**
 * VentOutt Popups (Refactored)
 * Loads Scroll Popup and Entry Modal logic.
 */

(function () {
    'use strict';

    const COMPONENT_PATH = 'components/vo-popups.html';

    function loadPopups() {
        if (document.getElementById('vo-popup-scroll')) return;

        fetch(COMPONENT_PATH)
            .then(res => res.text())
            .then(html => {
                const container = document.createElement('div');
                container.id = 'vo-popups-container';
                container.innerHTML = html;
                document.body.appendChild(container);

                initEntryModal();
                initScrollPopup();
            })
            .catch(e => console.error(e));
    }

    // 1. Entry Modal
    function initEntryModal() {
        // Run only on homepage
        const path = window.location.pathname;
        const isHome = path.endsWith("index.html") || path === "/" || path.endsWith("/");
        if (!isHome) return;

        if (sessionStorage.getItem("voEntryModalShown")) return;

        const overlay = document.getElementById("vo-modal-entry");
        const closeBtn = document.querySelector(".vo-modal-entry__close");

        if (!overlay) return;

        // Show after 2s
        setTimeout(() => {
            overlay.classList.add("active");
            sessionStorage.setItem("voEntryModalShown", "true");
        }, 2000);

        if (closeBtn) {
            closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
        }
    }

    // 2. Scroll Popup
    function initScrollPopup() {
        const popup = document.getElementById("vo-popup-scroll");
        const closeBtn = document.querySelector(".vo-popup-scroll__close");

        if (!popup) return;

        let popupDismissed = false; // Track if user clicked "Not now"

        window.addEventListener("scroll", () => {
            // Don't show if user already dismissed
            if (popupDismissed) return;

            // Logic: if scrolled > 80%
            const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollTotal <= 0) return;

            const scrollPercent = window.scrollY / scrollTotal;

            if (scrollPercent > 0.8) {
                // Check if entry modal is active?
                const entry = document.getElementById("vo-modal-entry");
                if (entry && entry.classList.contains('active')) return;

                popup.classList.add("show");
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                popup.classList.remove("show");
                popupDismissed = true; // Prevent popup from showing again until page refresh
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPopups);
    } else {
        loadPopups();
    }
})();

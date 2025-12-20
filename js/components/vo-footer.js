/**
 * Footer Component Loader
 * Dynamically loads the footer component (including CTA) into all pages
 */

(function () {
    'use strict';

    /**
     * Load footer component HTML
     */
    function loadFooter() {
        fetch('components/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load footer component');
                }
                return response.text();
            })
            .then(html => {
                // Create container
                const footerContainer = document.createElement('div');
                footerContainer.id = 'footer-component';
                footerContainer.innerHTML = html;

                // Insert before the Scripts or at the end of body
                // We want it to be the last visual element
                const bodyElement = document.body;

                // If there are scripts at the end, insert before them to be safe, 
                // or just appendChild which puts it at the end (scripts usually run anyway)
                // However, we ideally want it before the scripts tags if they are at the bottom
                // BUT, visually it just needs to be at the bottom.

                // Let's look for the first script tag that is NOT inside head
                // and insert before it? No, that might break things if scripts are scattered.

                // Safest approach: Append to body. If scripts are at bottom of body, 
                // the footer will be above them if they are DOM elements (script tags are invisible).
                // So appending to body is fine.

                bodyElement.appendChild(footerContainer);

                // Initialize any footer-specific functionality if needed
                // (Currently footer is static links and styles)
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }

})();

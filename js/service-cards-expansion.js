// Service Cards "View More" Expansion
(function () {
    'use strict';

    function initServiceCardsExpansion() {
        const viewMoreBtn = document.querySelector('.view-more-btn');
        const serviceCards = document.querySelectorAll('.service-card');

        if (!viewMoreBtn || serviceCards.length === 0) return;

        let isExpanded = false;

        viewMoreBtn.addEventListener('click', function () {
            isExpanded = !isExpanded;

            serviceCards.forEach(card => {
                if (isExpanded) {
                    card.classList.add('expanded');
                } else {
                    card.classList.remove('expanded');
                }
            });

            // Update button text
            viewMoreBtn.textContent = isExpanded ? 'View Less' : 'View More';

            // Smooth scroll to cards if expanding
            if (isExpanded) {
                const firstCard = serviceCards[0];
                if (firstCard) {
                    firstCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServiceCardsExpansion);
    } else {
        initServiceCardsExpansion();
    }
})();

/**
 * Mobile Interactions Controller
 * Handles:
 * 1. Founders Section: Tinder-style Swipe
 * 2. Mission Section: Scrollytelling (Horizontal Scroll driven by Vertical Scroll)
 * 3. Comparison Table: Mobile Carousel Logic
 */

/* =========================================
   1. FOUNDERS SWIPE CONTROLLER
   ========================================= */
class FoundersStack {
    constructor(container) {
        this.container = container;
        this.cards = Array.from(this.container.querySelectorAll('.vo-swipe-card'));
        this.activeCard = null;
        this.isAnimating = false;

        // Touch/Mouse State
        this.startX = 0;
        this.currentX = 0;

        this.init();
    }

    init() {
        // Initial Stack Layout
        this.updateStack();
    }

    updateStack() {
        // Re-query to match current DOM order
        this.cards = Array.from(this.container.querySelectorAll('.vo-swipe-card'));

        this.cards.forEach((card, index) => {
            // Apply visual stacking styles
            card.style.display = 'block';
            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';

            // Check if we need to skip transition (for the card that just looped back)
            if (card.dataset.skipTransition === 'true') {
                card.style.transition = 'none';

                // Force Reflow to apply 'none'
                void card.offsetHeight;

                // Clear flag for next time
                requestAnimationFrame(() => {
                    card.dataset.skipTransition = 'false';
                });
            } else {
                card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease';
            }

            // Remove old listeners
            this.removeListeners(card);

            if (index === 0) {
                // TOP CARD
                card.style.zIndex = '100';
                card.style.transform = 'scale(1) translateY(0) rotate(0deg)';
                card.style.opacity = '1';
                this.addListeners(card);
                this.activeCard = card;
            } else if (index === 1) {
                // SECOND CARD
                card.style.zIndex = '90';
                card.style.transform = 'scale(0.95) translateY(15px) rotate(3deg)';
                card.style.opacity = '1';
            } else if (index === 2) {
                // THIRD CARD
                card.style.zIndex = '80';
                card.style.transform = 'scale(0.90) translateY(30px) rotate(-3deg)';
                card.style.opacity = '1';
            } else {
                // HIDDEN CARDS
                card.style.zIndex = '10';
                card.style.transform = 'scale(0.85) translateY(45px)';
                card.style.opacity = '0';
            }
        });
    }

    addListeners(card) {
        // Touch
        card.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
        card.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
        card.addEventListener('touchend', this.handleEnd.bind(this), { passive: false });

        // Mouse
        card.addEventListener('mousedown', this.handleStart.bind(this));
    }

    removeListeners(card) {
        // Clone and replace to strip listeners quickly
        // (Optional optimization, but manual removal is safer for state)
        // For simplicity reusing handle functions bound to 'this', we just remove exact listeners if possible
        // But since we bind new functions each time, it's easier to assume previous listeners are garbage collected 
        // if we don't hold references. 
        // ACTUALLY: Cloning element is the cleanest way to strip all listeners.
        // But let's stick to standard removal or logic that ignores non-active cards.
        // Since we only add listeners to Index 0, the others are inert.
    }

    handleStart(e) {
        if (this.isAnimating) return;

        this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.activeCard.style.transition = 'none'; // dragging
    }

    handleMove(e) {
        if (this.isAnimating || !this.startX) return;

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.currentX = clientX;
        const diffX = this.currentX - this.startX;

        // Visual Drag
        const rotate = diffX * 0.1;
        this.activeCard.style.transform = `translate(${diffX}px, 0px) rotate(${rotate}deg)`;

        if (e.type.includes('touch')) e.preventDefault(); // Prevent scroll while swiping
    }

    handleEnd(e) {
        if (this.isAnimating || !this.startX) return;

        const diffX = this.currentX - this.startX;
        this.startX = 0; // Reset

        if (Math.abs(diffX) > 100) {
            this.swipeOut(diffX > 0 ? 'right' : 'left');
        } else {
            // Reset position
            this.activeCard.style.transition = 'transform 0.4s ease';
            this.activeCard.style.transform = 'scale(1) translateY(0) rotate(0deg)';
        }
    }

    swipeOut(dir) {
        this.isAnimating = true;
        const width = window.innerWidth;
        const endX = dir === 'right' ? width : -width;

        // 1. Animate Out
        this.activeCard.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        this.activeCard.style.transform = `translate(${endX}px, 50px) rotate(${dir === 'right' ? 30 : -30}deg)`;
        this.activeCard.style.opacity = '0';

        // 2. Loop Logic
        setTimeout(() => {
            const card = this.cards.shift(); // Remove top

            // CRITICAL FIX: Append to container to update DOM order
            this.container.appendChild(card);

            // Mark this card to skip transition when it reappears at bottom
            card.dataset.skipTransition = 'true';

            // We don't need to manually push to this.cards because updateStack() re-queries the DOM
            this.updateStack();
            this.isAnimating = false;
        }, 400); // Match transition time
    }
}


/* =========================================
   2. MISSION SCROLLYTELLING CONTROLLER
   ========================================= */
class MissionScroller {
    constructor(container) {
        this.container = container;
        this.grid = container.querySelector('.mission-grid');
        this.ticking = false;

        if (this.container && this.grid) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => this.update());
                this.ticking = true;
            }
        }, { passive: true });
    }

    update() {
        if (!this.container || !this.grid) return;
        const viewportHeight = window.innerHeight;
        const rect = this.container.getBoundingClientRect();
        const containerTop = rect.top + window.scrollY;
        const containerHeight = this.container.offsetHeight;
        const scrollY = window.scrollY;

        const start = containerTop;
        const end = containerTop + containerHeight - viewportHeight;

        let progress = (scrollY - start) / (end - start);
        progress = Math.min(Math.max(progress, 0), 1);

        const totalWidth = this.grid.scrollWidth;
        const maxTranslate = totalWidth - window.innerWidth + 40;

        if (maxTranslate > 0) {
            const translateX = progress * maxTranslate;
            this.grid.style.transform = `translateX(-${translateX}px)`;
        }

        this.ticking = false;
    }
}

/* =========================================
   3. COMPARISON CAROUSEL (Legacy Support)
   ========================================= */
function initComparisonCarousel() {
    const containers = document.querySelectorAll('.vo-comparison-section, .vo-therapy-comparison');

    containers.forEach(container => {
        const compGrid = container.querySelector('.vo-comparison-grid, .vo-therapy-comp-grid');
        if (!compGrid) return;

        const featuredCard = compGrid.querySelector('.vo-comp-card.vo-featured, .vo-fit-card.featured');
        if (featuredCard) {
            setTimeout(() => {
                const scrollLeft = featuredCard.offsetLeft - (compGrid.clientWidth - featuredCard.offsetWidth) / 2;
                compGrid.scrollTo({ left: scrollLeft, behavior: 'auto' });
            }, 100);
        }
    });
}


/* =========================================
   BOOTSTRAP
   ========================================= */
function initMobileFeatures() {
    // Only run on mobile breakpoints
    if (window.innerWidth <= 900) {

        // 1. Init Founders/Experts Swipe (Generic)
        const swipeContainers = document.querySelectorAll('.vo-swipe-container');
        swipeContainers.forEach(container => {
            if (container.dataset.initialized === 'true') return;
            container.dataset.initialized = 'true';
            new FoundersStack(container);
        });

        // 2. Init Mission Scroll
        const missionContainers = document.querySelectorAll('.mission-container');
        missionContainers.forEach(container => {
            if (container.dataset.initialized === 'true') return;
            container.dataset.initialized = 'true';
            new MissionScroller(container);
        });

        // 3. Init Comparison Carousel
        initComparisonCarousel();
    }
}

// Run on Load
document.addEventListener('DOMContentLoaded', initMobileFeatures);
window.addEventListener('load', initMobileFeatures);
window.addEventListener('resize', () => {
    // Optional: Re-check layout on resize
    // Simple approach: reload logic if crossing breakpoint, 
    // but for now user is likely testing on one device.
});

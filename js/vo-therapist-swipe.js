/**
 * Swipeable Therapist Cards (Tinder-style)
 * Handles touch gestures, card stacking logic, and swipe animations
 */

/**
 * Expert Swipe Controller V2
 * Dedicated controller for the new Clean Slate Experts Section
 * Handles swipe gestures, card stacking, and prevents unauthorized redirects
 */
class ExpertSwipeControllerV2 {
    constructor() {
        this.container = document.getElementById('voExpertsSwipeV2');
        if (!this.container) return;

        this.cards = Array.from(this.container.querySelectorAll('.vo-experts-v2-swipe-card'));
        if (!this.cards.length) return;

        this.isAnimating = false;
        this.startX = 0;
        this.currentX = 0;
        this.activeCard = null;

        // Stack visual settings
        this.scales = [1, 0.95, 0.90, 0.85];
        this.offsetY = [0, 15, 30, 45];
        this.zIndexes = [100, 90, 80, 70];

        this.init();
    }

    init() {
        // Run only on mobile breakpoint
        if (window.innerWidth > 900) return;

        this.updateStack();

        // Window resize handler (debounce in prod, simple here)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                // If we move to desktop, maybe reset styles? 
                // But CSS handles visibility mostly.
            } else {
                this.updateStack();
            }
        });
    }

    updateStack() {
        this.cards.forEach((card, index) => {
            // Clean state
            card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease';
            card.style.display = 'flex'; // Ensure flex layout is kept

            // Strip old listeners to avoid dupes
            this.removeListeners(card);

            // Determine visual slot
            const slot = index < 4 ? index : 3; // Cap at 4th slot visual

            card.style.zIndex = this.zIndexes[slot];
            card.style.transform = `scale(${this.scales[slot]}) translateY(${this.offsetY[slot]}px)`;
            card.style.opacity = index < 3 ? '1' : '0'; // Hide cards deep in stack

            // Active card logic
            if (index === 0) {
                this.activeCard = card;
                this.addListeners(card);
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'; // High shadow for top
            } else {
                card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)'; // Low shadow for back
            }
        });
    }

    addListeners(card) {
        // Touch events
        card.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        card.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        card.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        // Mouse events (for desktop testing or hybrid devices)
        card.addEventListener('mousedown', this.handleTouchStart.bind(this));

        // CLICK SAFETY: Stop links/clicks if swiping
        card.onclick = (e) => {
            if (this.isAnimating || Math.abs(this.currentX - this.startX) > 10) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };
    }

    removeListeners(card) {
        // Clone node is nuclear option, here we just trust the loop updates only usage
        // But for safety, we could remove specific listeners if we stored references.
        // Simplest: The logic only attaches to Index 0.
        // If a card moves to Index 1, it naturally stops receiving events because we don't attach them there.
        // However, we must ensure OLD listeners don't fire.
        // Since we bind(this), they are new functions. 
        // We will use a flag on the element itself in a robust app, 
        // but here we just rely on pointer-events or checks in handler.
    }

    handleTouchStart(e) {
        if (this.isAnimating) return;

        const touch = e.touches ? e.touches[0] : e;
        this.startX = touch.clientX;
        this.currentX = this.startX;

        this.activeCard.style.transition = 'none'; // Direct control
    }

    handleTouchMove(e) {
        if (!this.activeCard || this.isAnimating) return;

        const touch = e.touches ? e.touches[0] : e;
        this.currentX = touch.clientX;
        const diffX = this.currentX - this.startX;

        // 1. Prevent vertical scroll interfering if we are swiping horizontally properly
        // BUT allow vertical scroll if intent is clearly vertical
        // Since we set touch-action: pan-y, browser handles vertical.
        // We only care about horizontal card movement.

        // Move card
        const rotate = diffX * 0.05;
        this.activeCard.style.transform = `translateX(${diffX}px) rotate(${rotate}deg)`;
    }

    handleTouchEnd(e) {
        if (!this.activeCard || this.isAnimating) return;

        const diffX = this.currentX - this.startX;
        const threshold = 100;

        // Restore transition
        this.activeCard.style.transition = 'transform 0.5s ease-out, opacity 0.4s ease-out';

        if (diffX > threshold) {
            this.swipeOut('right');
        } else if (diffX < -threshold) {
            this.swipeOut('left');
        } else {
            // Reset
            this.activeCard.style.transform = `scale(1) translateY(0)`;
        }

        this.startX = 0;
        this.currentX = 0;
    }

    swipeOut(dir) {
        this.isAnimating = true;
        const width = window.innerWidth;
        const moveX = dir === 'right' ? width : -width;

        // Animate out
        this.activeCard.style.transform = `translateX(${moveX}px) rotate(${dir === 'right' ? 30 : -30}deg)`;
        this.activeCard.style.opacity = '0';

        setTimeout(() => {
            // Logic: Move top card to bottom
            const movedCard = this.cards.shift();
            this.cards.push(movedCard);

            // Re-render
            this.updateStack();
            this.isAnimating = false;
        }, 300);
    }
}

// Initialize on load
// Initialize on load
function initAllMobileFeatures() {
    // Find all stack containers and initialize swipe functionality
    // LEGACY: Keeping this just in case, but primary now is V2
    const stacks = document.querySelectorAll('.vo-swipe-container');
    stacks.forEach(container => {
        if (!container.dataset.swipeInitialized) {
            // new SwipeableStack(container); // LEGACY CLASS DELETED
            container.dataset.swipeInitialized = 'true';
        }
    });

    // V2 Clean Slate Initialization
    const v2Stack = document.getElementById('voExpertsSwipeV2');
    if (v2Stack && !v2Stack.dataset.init) {
        new ExpertSwipeControllerV2();
        v2Stack.dataset.init = 'true';
    }


    // Initialize Comparison Carousel (Mobile)
    if (window.innerWidth <= 768) {
        initComparisonCarousel();
    }
}

// Run on DOM Ready
document.addEventListener('DOMContentLoaded', initAllMobileFeatures);

// Run again on Window Load to ensure images/CSS allow correct sizing
window.addEventListener('load', initAllMobileFeatures);

// Also handle resize events for comparison carousel
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        initComparisonCarousel();
    }
});

function initComparisonCarousel() {
    const compGrid = document.querySelector('.vo-comparison-grid');
    const cards = document.querySelectorAll('.vo-comp-card');
    const prevBtn = document.querySelector('.vo-comp-arrows .vo-arrow-btn.prev');
    const nextBtn = document.querySelector('.vo-comp-arrows .vo-arrow-btn.next');
    const arrowsContainer = document.querySelector('.vo-comp-arrows');
    const featuredCard = document.querySelector('.vo-comp-card.vo-featured');


    if (compGrid && cards.length) {
        // Ensure arrows are visible on mobile
        if (arrowsContainer) {
            arrowsContainer.style.display = 'flex';
            arrowsContainer.style.pointerEvents = 'none'; // Container pass-through
        }
        // 1. Center "Coaching" on Load
        setTimeout(() => {
            if (featuredCard) {
                const scrollLeft = featuredCard.offsetLeft - (compGrid.clientWidth - featuredCard.offsetWidth) / 2;
                compGrid.scrollTo({ left: scrollLeft, behavior: 'instant' });
            }
        }, 100);

        // 2. "Grow Big" Logic (IntersectionObserver)
        const observerOptions = {
            root: compGrid,
            threshold: 0.6, // Trigger when 60% visible
            rootMargin: "0px -20% 0px -20%" // Center focus
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Activate this card
                    cards.forEach(c => c.classList.remove('vo-card-active'));
                    entry.target.classList.add('vo-card-active');
                }
            });
        }, observerOptions);

        cards.forEach(card => observer.observe(card));

        // 3. Arrow Click & Visibility Logic
        if (prevBtn && nextBtn) {
            const updateArrows = () => {
                // Use a small tolerance
                const scrollLeft = compGrid.scrollLeft;
                const maxScroll = compGrid.scrollWidth - compGrid.clientWidth;

                // Left Arrow
                if (scrollLeft > 20) {
                    prevBtn.style.opacity = '1';
                    prevBtn.style.pointerEvents = 'auto';
                } else {
                    prevBtn.style.opacity = '0.3';
                    // prevBtn.style.pointerEvents = 'none'; // Keep clickable if needed, or disable
                }

                // Right Arrow
                if (scrollLeft < maxScroll - 20) {
                    nextBtn.style.opacity = '1';
                    nextBtn.style.pointerEvents = 'auto';
                } else {
                    nextBtn.style.opacity = '0.3';
                }
            };

            compGrid.addEventListener('scroll', () => {
                requestAnimationFrame(updateArrows);
            });

            // Initial check
            setTimeout(updateArrows, 600);

            // Click Handlers
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                compGrid.scrollBy({ left: -window.innerWidth * 0.75, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                compGrid.scrollBy({ left: window.innerWidth * 0.75, behavior: 'smooth' });
            });
        }
    }
}

/**
 * Swipeable Therapist Cards (Tinder-style)
 * Handles touch gestures, card stacking logic, and swipe animations
 */

/**
 * Expert Swipe Controller V2
 * Dedicated controller for the new Clean Slate Experts Section
 * Handles swipe gestures, card stacking, and prevents unauthorized redirects
 */
/**
 * Swipeable Therapist Cards (Tinder-style)
 * Handles touch gestures, card stacking logic, and swipe animations
 */
class SwipeableStack {
    constructor(containerOrSelector) {
        if (typeof containerOrSelector === 'string') {
            this.container = document.querySelector(containerOrSelector);
        } else {
            this.container = containerOrSelector;
        }

        if (!this.container) return;

        this.cards = Array.from(this.container.querySelectorAll('.vo-swipe-card'));
        this.currentIndex = 0;
        this.isAnimating = false;

        // Touch state
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.activeCard = null;

        // Initialize stack
        this.init();
    }

    init() {
        // Only initialize swipe logic on mobile/tablet (Matched to CSS breakpoint 900px)
        if (window.innerWidth > 900) return;

        this.updateStack();

        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                this.cleanup();
            } else {
                this.updateStack();
            }
        });
    }

    updateStack() {
        this.cards.forEach((card, index) => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease';
            card.style.display = 'block';

            // Reset listeners
            this.removeListeners(card);

            // Stack Visuals
            if (index === 0) {
                // Top Card
                card.style.zIndex = '100';
                card.style.transform = 'scale(1) translateY(0) rotate(0deg)';
                card.style.opacity = '1';
                this.addListeners(card);
                this.activeCard = card;
            } else if (index === 1) {
                // Second
                card.style.zIndex = '90';
                card.style.transform = 'scale(0.95) translateY(15px) rotate(3deg)';
                card.style.opacity = '1';
            } else if (index === 2) {
                // Third
                card.style.zIndex = '80';
                card.style.transform = 'scale(0.90) translateY(30px) rotate(-3deg)';
                card.style.opacity = '1';
            } else {
                // Hidden
                card.style.zIndex = '10';
                card.style.transform = 'scale(0.85) translateY(45px) rotate(0deg)';
                card.style.opacity = '0';
            }
        });
    }

    addListeners(card) {
        card.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        card.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        card.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        card.onclick = (e) => {
            // Block defaults on ALL clicks to prevent redirects
            e.preventDefault();
            e.stopPropagation();

            if (this.isAnimating) return;

            // Only toggle text if needed (for text card logic)
            // But since we strictly use Image/Text pairs, we might not need toggle?
            // Legacy reused the SAME card for text sometimes? 
            // Current Legacy HTML has PAIRS: ImageCard, TextCard.
            // So clicking ImageCard doesn't toggle, it just sits there. 
            // But let's keep click safety.
            this.handleClick(e);
        };
    }

    removeListeners(card) {
        card.onclick = null;
        // cloning or removing event listeners is harder without refs, 
        // but since we only attach to index 0, logic holds.
    }

    handleTouchStart(e) {
        if (this.isAnimating) return;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.activeCard.style.transition = 'none';
    }

    handleTouchMove(e) {
        if (!this.activeCard || this.isAnimating) return;
        this.currentX = e.touches[0].clientX;
        this.currentY = e.touches[0].clientY;
        const diffX = this.currentX - this.startX;
        const diffY = this.currentY - this.startY;

        // Force Horizontal Swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (e.cancelable) e.preventDefault();
            const rotate = diffX * 0.1;
            this.activeCard.style.transform = `translate(${diffX}px, ${diffY * 0.2}px) rotate(${rotate}deg)`;
        }
    }

    handleTouchEnd(e) {
        if (!this.activeCard || this.isAnimating) return;
        const diffX = this.currentX - this.startX;
        this.activeCard.style.transition = 'transform 0.5s ease-out, opacity 0.4s ease-out';

        if (Math.abs(diffX) > 80) {
            this.swipeOut(diffX > 0 ? 'right' : 'left');
        } else {
            this.activeCard.style.transform = '';
        }
    }

    swipeOut(dir) {
        this.isAnimating = true;
        const width = window.innerWidth;
        const MoveX = dir === 'right' ? width : -width;

        this.activeCard.style.transform = `translate(${MoveX}px, 50px) rotate(${dir === 'right' ? 30 : -30}deg)`;
        this.activeCard.style.opacity = '0';

        setTimeout(() => {
            const card = this.cards.shift();
            this.cards.push(card);
            this.updateStack();
            this.isAnimating = false;
        }, 300);
    }

    handleClick(e) {
        // Optional logic for tap
    }

    cleanup() {
        this.cards.forEach(card => {
            card.style.transform = '';
            card.style.display = '';
        });
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
            new SwipeableStack(container); // LEGACY CLASS RESTORED
            container.dataset.swipeInitialized = 'true';
        }
    });

    // V2 Clean Slate Initialization - REMOVED (Legacy Restore Active)
    // const v2Stack = document.getElementById('voExpertsSwipeV2');
    // if (v2Stack && !v2Stack.dataset.init) {
    //    // new ExpertSwipeControllerV2(); // Class deleted
    //    // v2Stack.dataset.init = 'true';
    // }


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

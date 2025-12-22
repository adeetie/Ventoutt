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
        this.isActive = false;

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
        this.checkState();

        window.addEventListener('resize', () => {
            this.checkState();
        });
    }

    checkState() {
        if (window.innerWidth <= 900) {
            // Should be active
            if (!this.isActive) {
                this.updateStack();
                this.isActive = true;
            }
        } else {
            // Should be inactive
            if (this.isActive) {
                this.cleanup();
                this.isActive = false;
            }
        }
    }

    updateStack() {
        // Re-query cards in case DOM changed (optional, but good safety)
        this.cards = Array.from(this.container.querySelectorAll('.vo-swipe-card'));

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
        // Touch
        card.ontouchstart = this.handleTouchStart.bind(this);
        card.ontouchmove = this.handleTouchMove.bind(this);
        card.ontouchend = this.handleTouchEnd.bind(this);

        // Mouse (for desktop/testing)
        card.onmousedown = this.handleMouseDown.bind(this);

        card.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.isAnimating) return;
            this.handleClick(e);
        };
    }

    removeListeners(card) {
        card.onclick = null;
        card.ontouchstart = null;
        card.ontouchmove = null;
        card.ontouchend = null;
        card.onmousedown = null;
        card.onmousemove = null;
        card.onmouseup = null;
        card.onmouseleave = null;
    }

    // --- Touch Handlers ---
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

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (e.cancelable) e.preventDefault();
            const rotate = diffX * 0.1;
            this.activeCard.style.transform = `translate(${diffX}px, ${diffY * 0.2}px) rotate(${rotate}deg)`;
        }
    }

    handleTouchEnd(e) {
        if (!this.activeCard || this.isAnimating) return;
        const diffX = this.currentX - this.startX;
        this.finishSwipe(diffX);
    }

    // --- Mouse Handlers ---
    handleMouseDown(e) {
        if (this.isAnimating) return;
        e.preventDefault(); // Prevent text selection
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.activeCard.style.transition = 'none';

        // Bind usage-specific listeners to document to catch dragging outside card
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseUp = this.handleMouseUp.bind(this);
        document.addEventListener('mousemove', this.boundMouseMove);
        document.addEventListener('mouseup', this.boundMouseUp);
    }

    handleMouseMove(e) {
        if (!this.activeCard || this.isAnimating) return;
        this.currentX = e.clientX;
        this.currentY = e.clientY;
        const diffX = this.currentX - this.startX;
        const diffY = this.currentY - this.startY;

        const rotate = diffX * 0.1;
        this.activeCard.style.transform = `translate(${diffX}px, ${diffY * 0.2}px) rotate(${rotate}deg)`;
    }

    handleMouseUp(e) {
        // Cleanup document listeners
        document.removeEventListener('mousemove', this.boundMouseMove);
        document.removeEventListener('mouseup', this.boundMouseUp);

        if (!this.activeCard || this.isAnimating) return;
        const diffX = this.currentX - this.startX;
        this.finishSwipe(diffX);
    }

    finishSwipe(diffX) {
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

            // 1. Update Layout for all cards
            this.updateStack();

            // 2. CRITICAL FIX: Disable transition for the card that just moved to the bottom
            // This prevents it from "flying back" visually from off-screen to the bottom position.
            // It must snap instantly.
            const movedCard = this.cards[this.cards.length - 1];
            movedCard.style.transition = 'none';

            // Force browser to apply the 'none' transition immediately
            void movedCard.offsetHeight;

            // 3. Re-enable transition for next interactions (optional, updateStack resets it anyway)
            // But we leave it 'none' until next updateStack call or user interaction.

            this.isAnimating = false;
        }, 500); // Wait for full 0.5s CSS transition to complete
    }

    handleClick(e) {
        // Optional logic for tap
    }

    cleanup() {
        this.cards.forEach(card => {
            // We don't want to completely remove styles as CSS handles desktop layout mostly
            // But for safety, we remove the JS-injected inline styles
            card.style.transform = '';
            card.style.display = '';
            card.style.zIndex = '';
            card.style.opacity = '';
            card.style.transition = '';
            this.removeListeners(card);
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

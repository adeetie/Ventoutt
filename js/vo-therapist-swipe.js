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
        // Only initialize swipe logic on mobile/tablet
        if (window.innerWidth > 768) return;

        // Add event listeners to the top card
        this.updateStack();

        // Listen for resize to disable/enable
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.cleanup();
            } else {
                this.updateStack();
            }
        });
    }

    updateStack() {
        this.cards.forEach((card, index) => {
            // Reset styles first for everyone to ensure clean state
            card.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s ease';
            card.style.display = 'block'; // Always block in infinite loop

            // Remove listeners from all cards first
            this.removeListeners(card);

            // Stack Visuals
            if (index === 0) {
                // Top Card (Active)
                card.style.zIndex = '100';
                card.style.transform = 'scale(1) translateY(0) rotate(0deg)';
                card.style.opacity = '1';
                card.style.opacity = '1';
                card.style.backgroundColor = 'white';
                // card.classList.remove('vo-text-card'); // DISABLED: We now use permanent text cards, do not strip class

                // Activate interaction
                this.addListeners(card);
                this.activeCard = card;
            } else if (index === 1) {
                // Second Card (Visible "In Back") - First Blue
                card.style.zIndex = '90';
                card.style.transform = 'scale(0.95) translateY(15px) rotate(3deg)';
                card.style.opacity = '1';
                card.style.backgroundColor = '#CBE6F6';
            } else if (index === 2) {
                // Third Card (Peeking) - Second Blue
                card.style.zIndex = '80';
                card.style.transform = 'scale(0.90) translateY(30px) rotate(-3deg)';
                card.style.opacity = '1';
                card.style.backgroundColor = '#9CCDE8';
            } else {
                // Others hidden behind the stack
                card.style.zIndex = '10';
                card.style.transform = 'scale(0.85) translateY(45px) rotate(0deg)';
                card.style.opacity = '0'; // Hide deeper cards
            }
        });
    }

    addListeners(card) {
        card.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        card.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        card.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        // Click to flip disabled as we are using separate text cards now
        // card.addEventListener('click', this.handleClick.bind(this));
    }

    removeListeners(card) {
        // In this implementation, we simply don't add listeners to non-active cards.
        // But to be safe if we were reusing elements strictly:
        // Use cloneNode(true) to strip listeners OR just rely on logic. 
        // Since we are re-assigning listeners only to index 0, logic holds.
    }

    handleTouchStart(e) {
        if (this.isAnimating) return;

        // ALLOW swipe even on details (since "Details Card" is fully swipable now)
        // Previous check for .vo-expert-details blocked interaction on the new card type

        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.activeCard.style.transition = 'none'; // Disable transition for drag
    }

    handleTouchMove(e) {
        if (!this.activeCard || this.isAnimating) return;

        this.currentX = e.touches[0].clientX;
        this.currentY = e.touches[0].clientY;

        const diffX = this.currentX - this.startX;
        const diffY = this.currentY - this.startY;

        // Check if movement is mostly horizontal (Swipe) or vertical (Scroll)
        const isHorizontal = Math.abs(diffX) > Math.abs(diffY);
        const isVertical = Math.abs(diffY) > Math.abs(diffX);

        if (isHorizontal) {
            // It's a swipe: blocks scroll and moves card
            if (e.cancelable) e.preventDefault();

            const rotate = diffX * 0.1;
            this.activeCard.style.transform = `translate(${diffX}px, ${diffY * 0.2}px) rotate(${rotate}deg)`;
            // Reduced Y movement during swipe for cleaner feel
        } else {
            // It's a scroll: do nothing, let browser handle page scroll
            return;
        }
    }

    handleTouchEnd(e) {
        if (!this.activeCard || this.isAnimating) return;

        const diffX = this.currentX - this.startX;
        const diffY = this.currentY - this.startY;
        const threshold = -80; // Slightly easier threshold

        this.activeCard.style.transition = 'transform 0.5s ease-out, opacity 0.4s ease-out';

        if (diffY < threshold) {
            this.swipeOut();
        } else {
            this.activeCard.style.transform = '';
        }

        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
    }

    swipeOut() {
        this.isAnimating = true;
        this.activeCard.classList.add('vo-swipe-out-left');

        setTimeout(() => {
            // INFINITE LOOP LOGIC:
            // Take the swiped card (index 0)
            const swipedCard = this.cards.shift();

            // Clean it up
            swipedCard.classList.remove('vo-swipe-out-left');
            // swipedCard.classList.remove('vo-text-card'); // DISABLED: Stick to permanent classes
            swipedCard.style.transform = '';
            swipedCard.style.opacity = '0'; // Initially hidden as it goes to back
            swipedCard.style.zIndex = '0';

            // Move it to the end of the array
            this.cards.push(swipedCard);

            // Re-render stack
            this.updateStack();

            this.isAnimating = false;
        }, 300);
    }

    handleClick(e) {
        // If clicking on a link or button, don't toggle
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

        // Toggle the text card mode
        if (this.activeCard) {
            this.activeCard.classList.toggle('vo-text-card');
        }
    }

    cleanup() {
        // Reset all for desktop
        this.cards.forEach(card => {
            card.style.transform = '';
            card.style.display = '';
            card.classList.remove('vo-swipe-out-left');
        });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Find all stack containers and initialize swipe functionality
    const stacks = document.querySelectorAll('.vo-swipe-container');
    stacks.forEach(container => {
        // Pass the element directly to support multiple instances
        new SwipeableStack(container);
    });

    // Initialize Comparison Carousel (Mobile) - only once, independent of swipe containers
    if (window.innerWidth <= 768) {
        initComparisonCarousel();
    }

    // Also handle resize events for comparison carousel
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            // Re-init only if not already initialized
            const compGrid = document.querySelector('.vo-comparison-grid');
            const arrows = document.querySelector('.vo-comp-arrows');
            if (compGrid && arrows && !arrows.dataset.initialized) {
                initComparisonCarousel();
            }
        }
    });
}); // End of DOMContentLoaded

function initComparisonCarousel() {
    const compGrid = document.querySelector('.vo-comparison-grid');
    const cards = document.querySelectorAll('.vo-comp-card');
    const prevBtn = document.querySelector('.vo-comp-arrows .vo-arrow-btn.prev');
    const nextBtn = document.querySelector('.vo-comp-arrows .vo-arrow-btn.next');
    const arrowsContainer = document.querySelector('.vo-comp-arrows');
    const featuredCard = document.querySelector('.vo-comp-card.vo-featured');


    if (compGrid && cards.length) {
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

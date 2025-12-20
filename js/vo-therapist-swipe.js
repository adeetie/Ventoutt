/**
 * Swipeable Therapist Cards (Tinder-style)
 * Handles touch gestures, card stacking logic, and swipe animations
 */

class SwipeableStack {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
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
            // Reset styles first
            card.style.transform = '';
            card.style.opacity = '';
            card.style.zIndex = '';
            card.style.backgroundColor = ''; // Reset
            card.style.transition = 'transform 0.4s ease, opacity 0.4s ease'; // Smooth auto-adjust

            // Remove listeners from all cards first
            this.removeListeners(card);

            if (index < this.currentIndex) {
                // Previously swiped cards (Hidden)
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
                // Calculate visual stack position (0 = top, 1 = behind, etc)
                const stackIndex = index - this.currentIndex;

                // Stack Visuals
                if (stackIndex === 0) {
                    // Top Card (Main)
                    card.style.zIndex = '100';
                    card.style.transform = 'scale(1) translateY(0)';
                    card.style.opacity = '1';
                    // Ensure photo is main, background doesn't matter as much but keep clean
                    card.style.backgroundColor = 'white';

                    // Activate interaction
                    this.addListeners(card);
                    this.activeCard = card;
                } else if (stackIndex === 1) {
                    // Second Card (Visible "In Back") - Blue tint
                    card.style.zIndex = '90';
                    card.style.transform = 'scale(0.95) translateY(15px)';
                    card.style.opacity = '1';
                    // Set to the blue color from reference
                    card.style.backgroundColor = '#CBE6F6';
                } else if (stackIndex === 2) {
                    // Third Card (Peeking) - Slightly darker/lighter blue
                    card.style.zIndex = '80';
                    card.style.transform = 'scale(0.90) translateY(30px)';
                    card.style.opacity = '1';
                    card.style.backgroundColor = '#9CCDE8';
                } else {
                    // Others hidden in stack
                    card.style.zIndex = '10';
                    card.style.transform = 'scale(0.85) translateY(45px)';
                    card.style.opacity = '0';
                }
            }
        });
    }

    addListeners(card) {
        card.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        card.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        card.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }

    removeListeners(card) {
        // Cleaning up listeners (clone node is a crude but effective way, or use named references)
        // For this implementation, we rely on the state check in handlers
    }

    handleTouchStart(e) {
        if (this.isAnimating) return;
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

        // Only move if swipe is predominantly vertical (swiping UP)
        // and greater than horizontal movement to avoid blocking scroll (optional)
        // For tinder style, we usually follow finger exactly

        // If swiping DOWN (positive diffY), let page scroll normally (don't preventDefault)
        if (diffY > 0) return;

        // If swiping UP, capture it
        if (Math.abs(diffY) > Math.abs(diffX) && diffY < 0) {
            if (e.cancelable) e.preventDefault();

            // Move card
            const rotate = diffX * 0.1; // Slight rotation based on X
            this.activeCard.style.transform = `translate(${diffX}px, ${diffY}px) rotate(${rotate}deg)`;
        }
    }

    handleTouchEnd(e) {
        if (!this.activeCard || this.isAnimating) return;

        const diffX = this.currentX - this.startX;
        const diffY = this.currentY - this.startY;

        // Threshold for swipe
        const threshold = -100; // Swipe up distance

        this.activeCard.style.transition = 'transform 0.5s ease-out, opacity 0.4s ease-out';

        if (diffY < threshold) {
            // Swiped UP successfully
            this.swipeOut();
        } else {
            // Snap back
            this.activeCard.style.transform = '';
        }

        // Reset touch coordinates (fixes potential bug where tap triggers weirdness)
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
    }

    swipeOut() {
        this.isAnimating = true;

        // Add swipe-out class for animation
        this.activeCard.classList.add('vo-swipe-out-left');



        // Wait for animation
        setTimeout(() => {
            this.currentIndex++;

            if (this.currentIndex >= this.cards.length) {
                // Stack is empty - reveal final content
                const finalContent = this.container.querySelector('.vo-swipe-final-content');
                if (finalContent) {
                    finalContent.style.display = 'flex';
                    // Optional: Fade in
                    finalContent.style.opacity = '0';
                    requestAnimationFrame(() => {
                        finalContent.style.transition = 'opacity 0.5s ease';
                        finalContent.style.opacity = '1';
                    });
                }
            } else {
                this.updateStack();
            }

            this.isAnimating = false;
        }, 300); // Wait for transition
    }

    resetStackLoop() {
        this.currentIndex = 0;
        this.cards.forEach(card => {
            card.classList.remove('vo-swipe-out-left');
            card.style.display = 'block';
        });
        this.updateStack();
    }

    cleanup() {
        // Reset all for desktop
        this.cards.forEach(card => {
            card.style.transform = '';
            card.style.display = '';
            card.classList.remove('vo-swipe-out-left');
            // Remove listeners (optional if we check window width in handlers)
        });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Find all stack containers
    const stacks = document.querySelectorAll('.vo-swipe-container');
    stacks.forEach(container => {
        // We can scope the init by ID if needed, using class for now
        new SwipeableStack('.vo-swipe-container');
        // Initialize Comparison Carousel (Mobile)
        if (window.innerWidth <= 768) {
            initComparisonCarousel();
        }
    });
}); // End of DOMContentLoaded

function initComparisonCarousel() {
    const compGrid = document.querySelector('.vo-comparison-grid');
    const cards = document.querySelectorAll('.vo-comp-card');
    const prevBtn = document.querySelector('.vo-arrow-btn.prev');
    const nextBtn = document.querySelector('.vo-arrow-btn.next');
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

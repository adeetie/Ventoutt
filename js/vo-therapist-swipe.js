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

            // Remove listeners from all cards first
            this.removeListeners(card);

            if (index < this.currentIndex) {
                // Already swiped cards (ensure they are gone)
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
                // Calculate visual stack position
                const stackIndex = index - this.currentIndex;

                // Add listeners only to the top card
                if (stackIndex === 0) {
                    this.addListeners(card);
                    this.activeCard = card;
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

            // Loop back to start if at end? Or just stop?
            // "users can swipe all cards while scrolling downwards"
            // Usually we loop or just hide. Let's loop for infinite feel if desired, 
            // or if the user wants to see them while scrolling down, maybe just hide.
            // Let's implement LOOP for better UX if they run out.

            if (this.currentIndex >= this.cards.length) {
                // Reset stack loop
                this.resetStackLoop();
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
    });
});

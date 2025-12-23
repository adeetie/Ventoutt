/**
 * VO Mobile V3 - Isolated Logic
 * Dedicated script for Founders Swipe and Mission Scrollytelling
 * Generated for "Clean Slate" request.
 */

(function () {
    console.log('VO V3: Mobile Script Loaded');

    // CONFIG
    const MOBILE_BREAKPOINT = 900;

    // --- 1. FOUNDERS SWIPE ENGINE (V3) ---
    class FoundersSwipeV3 {
        constructor() {
            this.container = document.querySelector('.vo-founders-stack-v3');
            if (!this.container) return;

            this.cards = Array.from(this.container.querySelectorAll('.vo-founder-card-v3'));
            this.isAnimating = false;
            this.startX = 0;
            this.currentX = 0;

            console.log('VO V3: Founders Stack initialized', this.cards.length);
            this.init();
        }

        init() {
            this.updateStack();

            // Interaction Listeners (Bound to Container for delegation or Cards directly)
            // Binding to cards allows for easier drag tracking
            this.cards.forEach(card => {
                card.addEventListener('touchstart', this.onStart.bind(this), { passive: false });
                card.addEventListener('touchmove', this.onMove.bind(this), { passive: false });
                card.addEventListener('touchend', this.onEnd.bind(this), { passive: false });

                // Desktop testing
                card.addEventListener('mousedown', this.onStart.bind(this));
            });

            // Mouse up/move need to be on window for better drag
            window.addEventListener('mousemove', this.onMove.bind(this));
            window.addEventListener('mouseup', this.onEnd.bind(this));
        }

        updateStack() {
            // Re-query valid cards from DOM order
            const currentCards = Array.from(this.container.querySelectorAll('.vo-founder-card-v3'));

            currentCards.forEach((card, index) => {
                // Clear inline transforms from drags
                card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s';
                card.style.display = 'flex';

                if (index === 0) {
                    // TOP CARD
                    card.style.zIndex = '100';
                    card.style.transform = 'scale(1) translateY(0) rotate(0deg)';
                    card.style.opacity = '1';
                    card.classList.add('active');
                } else if (index === 1) {
                    // SECOND
                    card.style.zIndex = '90';
                    card.style.transform = 'scale(0.95) translateY(12px) rotate(2deg)';
                    card.style.opacity = '1';
                    card.classList.remove('active');
                } else if (index === 2) {
                    // THIRD
                    card.style.zIndex = '80';
                    card.style.transform = 'scale(0.90) translateY(24px) rotate(-2deg)';
                    card.style.opacity = '1';
                    card.classList.remove('active');
                } else {
                    // HIDDEN
                    card.style.zIndex = '10';
                    card.style.transform = 'scale(0.85) translateY(36px)';
                    card.style.opacity = '0';
                    card.classList.remove('active');
                }
            });
        }

        onStart(e) {
            if (this.isAnimating) return;
            const target = e.target.closest('.vo-founder-card-v3');
            if (!target || !target.classList.contains('active')) return;

            this.activeCard = target;
            this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            this.activeCard.style.transition = 'none';
        }

        onMove(e) {
            if (!this.activeCard || this.isAnimating) return;

            // Safety check for mouse
            if (e.type.includes('mouse') && e.buttons === 0) {
                this.activeCard = null;
                return;
            }

            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const diffX = clientX - this.startX;
            const rotate = diffX * 0.08;

            this.activeCard.style.transform = `translate(${diffX}px, 0) rotate(${rotate}deg)`;

            if (e.type.includes('touch')) e.preventDefault(); // Lock scroll
        }

        onEnd(e) {
            if (!this.activeCard) return;

            const currentTransform = new WebKitCSSMatrix(this.activeCard.style.transform);
            const diffX = currentTransform.m41; // TranslateX

            if (Math.abs(diffX) > 100) {
                // Swipe Out
                this.swipeOut(diffX > 0 ? 1 : -1);
            } else {
                // Snap Back
                this.activeCard.style.transition = 'transform 0.3s ease';
                this.activeCard.style.transform = 'scale(1) translateY(0) rotate(0deg)';
            }

            this.activeCard = null;
        }

        swipeOut(direction) {
            this.isAnimating = true;
            const card = this.activeCard;
            const screenW = window.innerWidth;
            const endX = direction * (screenW + 200);

            // Animate away
            card.style.transition = 'transform 0.3s ease-in, opacity 0.3s';
            card.style.transform = `translate(${endX}px, 50px) rotate(${direction * 30}deg)`;
            card.style.opacity = '0';

            setTimeout(() => {
                // 1. Move DOM Element to Bottom of Stack
                this.container.appendChild(card);

                // 2. Reset Styles INSTANTLY (Transition None)
                card.style.transition = 'none';
                card.style.transform = 'scale(0.85) translateY(36px)';
                card.style.opacity = '0';

                // 3. Force Layout/Reflow to ensure 'none' applies
                void card.offsetHeight;

                // 4. Update the visual stack for everyone
                this.updateStack();

                this.isAnimating = false;
            }, 300);
        }
    }


    // --- 2. MISSION SCROLLYTELLING ENGINE (V3) ---
    class MissionScrollV3 {
        constructor() {
            this.container = document.querySelector('.vo-mission-scroll-v3');
            this.track = document.querySelector('.vo-mission-track-v3');
            this.cards = document.querySelectorAll('.vo-mission-card-v3');

            if (!this.container || !this.track) return;

            console.log('VO V3: Mission Scroll initialized with cards:', this.cards.length);
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => {
                if (window.innerWidth > MOBILE_BREAKPOINT) return;
                requestAnimationFrame(() => this.onScroll());
            });
        }

        onScroll() {
            // Container Stats
            const rect = this.container.getBoundingClientRect();
            // rect.top is the distance from viewport top to container top.
            // When container enters viewport from bottom, rect.top is window.innerHeight (approx)
            // When container is scrolled past, rect.top becomes negative.

            const winH = window.innerHeight;
            const containerH = this.container.offsetHeight;

            // Total distance the container will be "sticky" for
            const stickyDistance = containerH - winH;

            // SCROLLED amount: how far have we pushed the container UP past the snap point?
            // The sticky starts when rect.top <= 0.
            let scrolled = -rect.top;

            if (scrolled < 0) scrolled = 0;
            if (scrolled > stickyDistance) scrolled = stickyDistance;

            let progress = 0;
            if (stickyDistance > 0) {
                progress = scrolled / stickyDistance;
            }

            // progress is 0 to 1
            const trackWidth = this.track.scrollWidth;
            const viewportWidth = window.innerWidth;
            const totalTravel = trackWidth - viewportWidth + 40; // +Padding

            if (totalTravel > 0) {
                const moveX = progress * totalTravel;
                this.track.style.transform = `translateX(-${moveX}px)`;
            }
        }
    }

    // --- INITIALIZATION ---
    function initV3() {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            new FoundersSwipeV3();
            new MissionScrollV3();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initV3);
    } else {
        initV3();
    }

    // Safety Re-init on Load
    window.addEventListener('load', initV3);

    // Optional: Re-check on Resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            // Could re-instantiate if needed, but existing instances usually stay valid
        }
    });

})();

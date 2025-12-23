/**
 * FULL SITE PREVIEW - STANDALONE JS
 * Contains all JS needed for full-site-preview.html
 * Handles multi-instance initialization for all interactive components
 */

(function () {
    'use strict';

    console.log('[Full Preview Fix] Script loaded');

    /* =========================================
       1. HERO SLIDESHOW
       ========================================= */
    const initHeroSlideshow = () => {
        const heroSections = document.querySelectorAll('.vo-hero');

        heroSections.forEach(section => {
            if (section.dataset.previewInit === 'true') return;
            section.dataset.previewInit = 'true';

            const slides = section.querySelectorAll('.vo-hero-slide');
            if (slides.length === 0) return;

            let currentSlide = 0;
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 3000);
        });

        console.log('[Full Preview Fix] Hero slideshows initialized');
    };

    /* =========================================
       2. DYNAMIC GREETING (Typewriter Effect)
       ========================================= */
    const initDynamicGreeting = () => {
        const greetings = document.querySelectorAll('.vo-hero__greeting');

        const words = ['hello...', 'hola...', 'bonjour...', 'ciao...', 'namaste...', 'hallo...'];

        greetings.forEach(el => {
            if (el.dataset.previewInit === 'true') return;
            el.dataset.previewInit = 'true';

            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            const type = () => {
                const currentWord = words[wordIndex];

                if (isDeleting) {
                    el.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    el.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                }

                let typeSpeed = isDeleting ? 50 : 100;

                if (!isDeleting && charIndex === currentWord.length) {
                    typeSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typeSpeed = 500;
                }

                setTimeout(type, typeSpeed);
            };

            setTimeout(type, 1000);
        });

        console.log('[Full Preview Fix] Dynamic greetings initialized');
    };

    /* =========================================
       3. EXPANDING GALLERY (Mobile Tap)
       ========================================= */
    const initExpandingGallery = () => {
        const cards = document.querySelectorAll('.vo-gallery-card');

        cards.forEach(card => {
            if (card.dataset.previewInit === 'true') return;
            card.dataset.previewInit = 'true';

            card.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    cards.forEach(c => c.classList.remove('expanded'));
                    card.classList.add('expanded');
                }
            });
        });

        console.log('[Full Preview Fix] Expanding gallery initialized');
    };

    /* =========================================
       4. TESTIMONIALS MARQUEE
       ========================================= */
    const initTestimonials = () => {
        const marquees = document.querySelectorAll('.marquee-inner');

        marquees.forEach(marquee => {
            if (marquee.dataset.previewInit === 'true') return;
            marquee.dataset.previewInit = 'true';

            // Clone cards for infinite scroll
            const cards = marquee.querySelectorAll('.vo-testimonial-card');
            if (cards.length < 2) return;

            cards.forEach(card => {
                const clone = card.cloneNode(true);
                marquee.appendChild(clone);
            });

            // Animate
            let position = 0;
            const speed = 0.5;

            const animate = () => {
                position -= speed;
                const cardWidth = cards[0].offsetWidth + 12;
                const resetPoint = cardWidth * cards.length;

                if (Math.abs(position) >= resetPoint) {
                    position = 0;
                }

                marquee.style.transform = `translateX(${position}px)`;
                requestAnimationFrame(animate);
            };

            animate();
        });

        console.log('[Full Preview Fix] Testimonials marquee initialized');
    };

    /* =========================================
       5. EXPERT CARD SWIPE (Mobile)
       ========================================= */
    const initExpertSwipe = () => {
        const containers = document.querySelectorAll('.vo-swipe-container');

        containers.forEach(container => {
            if (container.dataset.previewInit === 'true') return;
            container.dataset.previewInit = 'true';

            const cards = container.querySelectorAll('.vo-swipe-card');
            if (cards.length === 0) return;

            let startX = 0;
            let currentX = 0;
            let isDragging = false;

            const updateStack = () => {
                const visibleCards = container.querySelectorAll('.vo-swipe-card:not(.vo-swipe-out-left)');
                visibleCards.forEach((card, i) => {
                    card.style.zIndex = visibleCards.length - i;
                    if (i === 0) {
                        card.style.transform = 'scale(1) translateY(0)';
                        card.style.opacity = '1';
                    } else if (i === 1) {
                        card.style.transform = 'scale(0.95) translateY(16px)';
                        card.style.opacity = '0.8';
                    } else if (i === 2) {
                        card.style.transform = 'scale(0.9) translateY(32px)';
                        card.style.opacity = '0.6';
                    } else {
                        card.style.opacity = '0';
                        card.style.pointerEvents = 'none';
                    }
                });
            };

            const getTopCard = () => container.querySelector('.vo-swipe-card:not(.vo-swipe-out-left)');

            const handleTouchStart = (e) => {
                const card = getTopCard();
                if (!card) return;
                isDragging = true;
                startX = e.touches[0].clientX;
                card.style.transition = 'none';
            };

            const handleTouchMove = (e) => {
                if (!isDragging) return;
                const card = getTopCard();
                if (!card) return;
                currentX = e.touches[0].clientX - startX;
                const rotate = currentX * 0.1;
                card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
            };

            const handleTouchEnd = () => {
                if (!isDragging) return;
                isDragging = false;
                const card = getTopCard();
                if (!card) return;

                card.style.transition = 'transform 0.3s ease';

                if (currentX < -80) {
                    // Swipe left - dismiss
                    card.classList.add('vo-swipe-out-left');
                    setTimeout(() => {
                        card.remove();
                        container.appendChild(card);
                        card.classList.remove('vo-swipe-out-left');
                        updateStack();
                    }, 500);
                } else {
                    // Snap back
                    card.style.transform = 'scale(1) translateY(0)';
                }
                currentX = 0;
            };

            container.addEventListener('touchstart', handleTouchStart, { passive: true });
            container.addEventListener('touchmove', handleTouchMove, { passive: true });
            container.addEventListener('touchend', handleTouchEnd);

            updateStack();
        });

        console.log('[Full Preview Fix] Expert swipe initialized');
    };

    /* =========================================
       6. LOVE CARDS (JS-based Sticky Stack)
       ========================================= */
    const initLoveCards = () => {
        const section = document.querySelector('.fp-love-section');
        const container = document.querySelector('.fp-love-container');
        const cards = document.querySelectorAll('.fp-love-card');

        if (!section || !container || cards.length === 0) return;
        if (section.dataset.previewInit === 'true') return;
        section.dataset.previewInit = 'true';

        const updateCards = () => {
            const sectionRect = section.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const STICK_TOP = window.innerWidth <= 767 ? 60 : 120;
            const cardHeight = cards[0].offsetHeight || 400;

            // Check if we're within the section
            const inSection = sectionRect.top < STICK_TOP && sectionRect.bottom > STICK_TOP + cardHeight;

            if (!inSection) {
                // Reset all cards to normal flow
                cards.forEach(card => {
                    card.style.position = '';
                    card.style.top = '';
                    card.style.left = '';
                    card.style.width = '';
                    card.style.zIndex = '';
                });
                return;
            }

            // Calculate which cards should be stacked
            const scrollIntoSection = -sectionRect.top;
            const cardSpacing = window.innerHeight * 0.6;

            cards.forEach((card, index) => {
                const cardTrigger = index * cardSpacing;
                const shouldBeFixed = scrollIntoSection >= cardTrigger;

                if (shouldBeFixed) {
                    card.style.position = 'fixed';
                    card.style.top = STICK_TOP + 'px';
                    card.style.left = containerRect.left + 'px';
                    card.style.width = containerRect.width + 'px';
                    card.style.zIndex = String(100 + index);
                } else {
                    card.style.position = '';
                    card.style.top = '';
                    card.style.left = '';
                    card.style.width = '';
                    card.style.zIndex = '';
                }
            });
        };

        window.addEventListener('scroll', updateCards, { passive: true });
        window.addEventListener('resize', updateCards);
        updateCards();

        console.log('[Full Preview Fix] Love cards initialized');
    };

    /* =========================================
       INITIALIZATION
       ========================================= */
    const init = () => {
        initHeroSlideshow();
        initDynamicGreeting();
        initExpandingGallery();
        initTestimonials();
        initExpertSwipe();
        initLoveCards();
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also run on full load for safety
    window.addEventListener('load', init);

})();

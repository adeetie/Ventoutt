/**
 * main.js - Global JavaScript
 * Handles all non-common component functionality:
 * - Homepage-specific features (Hero, Why People Love, Stats, etc.)
 * - Page-specific interactions
 * - Global utilities
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    console.log('[Main.js] Loaded - Global Functionality');

    /* =========================================
       Homepage Hero Slideshow
       ========================================= */
    const initHeroSlideshow = () => {
        const slides = document.querySelectorAll('.vo-hero-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        const slideInterval = 3000;

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, slideInterval);

        console.log('[Main.js] Hero slideshow initialized');
    };

    /* =========================================
       Dynamic Greeting (Typewriter Effect)
       ========================================= */
    const initDynamicGreeting = () => {
        const greetingEl = document.getElementById('dynamic-hello');
        if (!greetingEl) return;

        const hellos = [
            'hello..',
            'नमस्ते..',     // Hindi
            'hola..',        // Spanish
            'こんにちは..',   // Japanese
            'bonjour..',    // French
            'ciao..',       // Italian
            'hallo..',      // German
            'olá..'         // Portuguese
        ];

        let msgIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentText = hellos[msgIndex];

            if (isDeleting) {
                greetingEl.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                greetingEl.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                msgIndex = (msgIndex + 1) % hellos.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        greetingEl.style.opacity = 1;
        greetingEl.style.transition = 'none';
        type();

        console.log('[Main.js] Dynamic greeting initialized');
    };

    /* =========================================
       Expanding Gallery (Mobile Interaction)
       ========================================= */
    const initExpandingGallery = () => {
        const galleryCards = document.querySelectorAll('.vo-gallery-card');
        if (galleryCards.length === 0 || window.innerWidth > 900) return;

        galleryCards.forEach(card => {
            const handleExpand = (e) => {
                if (e.target.classList.contains('vo-gallery-link')) {
                    return;
                }

                const isExpanded = card.classList.contains('expanded');
                galleryCards.forEach(c => c.classList.remove('expanded'));

                if (!isExpanded) {
                    card.classList.add('expanded');
                    setTimeout(() => {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }, 100);
                }
            };

            card.addEventListener('click', handleExpand);
        });

        console.log('[Main.js] Expanding gallery initialized');
    };

    /* =========================================
       Stats Counter Animation (Odometer Effect)
       ========================================= */
    const initStatsCounter = () => {
        const odometerElements = document.querySelectorAll('[data-odometer]');
        if (odometerElements.length === 0) return;

        const odometerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    if (element.dataset.started === 'true') return;
                    element.dataset.started = 'true';

                    let currentValue = parseFloat(element.textContent.replace(/[^0-9.]/g, '')) || 0;
                    const incrementRate = parseFloat(element.getAttribute('data-increment')) || 1;
                    const incrementPerFrame = incrementRate / 60;

                    const updateDisplay = () => {
                        currentValue += incrementPerFrame;
                        element.textContent = Math.floor(currentValue).toLocaleString('en-US');

                        if (incrementRate > 0) {
                            requestAnimationFrame(updateDisplay);
                        }
                    };

                    if (incrementRate > 0) {
                        requestAnimationFrame(updateDisplay);
                    }
                }
            });
        }, { threshold: 0.5 });

        odometerElements.forEach(el => odometerObserver.observe(el));

        console.log('[Main.js] Stats counter initialized');
    };

    /* =========================================
       Find Your Right Fit Interaction
       ========================================= */
    const initFindYourFit = () => {
        const fitTrack = document.getElementById('voFitTrack');
        const fitFeatured = document.getElementById('fitFeatured');
        const prevBtn = document.querySelector('.vo-fit-arrow.prev');
        const nextBtn = document.querySelector('.vo-fit-arrow.next');

        if (!fitTrack || !fitFeatured) return;

        // Initial center on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                fitFeatured.scrollIntoView({
                    behavior: 'auto',
                    block: 'nearest',
                    inline: 'center'
                });
            }, 300);
        }

        // Arrow navigation
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                fitTrack.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });

            nextBtn.addEventListener('click', () => {
                fitTrack.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
        }

        // Dynamic mobile scaling
        if (window.innerWidth <= 1024) {
            const fitCards = document.querySelectorAll('.vo-fit-card');

            const observerOptions = {
                root: fitTrack,
                rootMargin: '0px -30% 0px -30%',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        fitCards.forEach(c => c.classList.remove('scale-active'));
                        entry.target.classList.add('scale-active');
                    }
                });
            }, observerOptions);

            fitCards.forEach(card => observer.observe(card));
        }

        console.log('[Main.js] Find Your Fit initialized');
    };

    /* =========================================
       Expert Slideshow (Blob Fade)
       ========================================= */
    const initExpertBlobFade = () => {
        const blobSlides = document.querySelectorAll('.vo-blob-slide');
        if (blobSlides.length === 0) return;

        let currentBlob = 0;
        setInterval(() => {
            blobSlides[currentBlob].classList.remove('active');
            currentBlob = (currentBlob + 1) % blobSlides.length;
            blobSlides[currentBlob].classList.add('active');
        }, 4000); // 4 seconds per slide

        console.log('[Main.js] Expert blob fade initialized');
    };

    /* =========================================
       Footer Content Integrity Check
       ========================================= */
    const initFooterCheck = () => {
        const checkFooter = setInterval(() => {
            const footerContent = document.querySelector('.vo-footer-columns'); // Assuming this class
            if (footerContent) {
                clearInterval(checkFooter);
                if (footerContent.children.length < 2) {
                    console.warn('VO-Footer: Potential rendering issue. Verify flex-wrap or HTML structure.');
                    footerContent.style.display = 'flex';
                }
            }
        }, 500);
        setTimeout(() => clearInterval(checkFooter), 5000);
    };

    /* =========================================
       Why People Love Ventoutt (Tab Interaction)
       ========================================= */
    const initWhyPeopleLove = () => {
        const points = document.querySelectorAll('.why-love-point');
        const images = document.querySelectorAll('.why-love-photo');

        if (points.length === 0 || images.length === 0) return;

        points.forEach((point, index) => {
            point.addEventListener('mouseenter', () => { // Hover for desktop
                // Remove active class from all
                points.forEach(p => p.classList.remove('active'));
                images.forEach(img => img.classList.remove('active'));

                // Add to current
                point.classList.add('active');
                if (images[index]) {
                    images[index].classList.add('active');
                }
            });

            point.addEventListener('click', () => { // Click for mobile
                points.forEach(p => p.classList.remove('active'));
                images.forEach(img => img.classList.remove('active'));

                point.classList.add('active');
                if (images[index]) {
                    images[index].classList.add('active');
                }
            });
        });

        console.log('[Main.js] Why People Love interaction initialized');
    };

    // Initialize all homepage features
    initHeroSlideshow();
    initDynamicGreeting();
    initExpandingGallery();
    initStatsCounter();
    initFindYourFit();
    initExpertBlobFade();
    initFooterCheck();
    initWhyPeopleLove();
});

/* =========================================
   Common Challenges Toggle Global Function
   ========================================= */
window.toggleVoChallengesList = function () {
    const expanded = document.querySelector('.vo-challenges-expanded');
    const initial = document.querySelector('.vo-challenges-initial');
    const toggleText = document.getElementById('voToggleText');
    const btn = document.getElementById('voToggleChallenges');

    if (!expanded || !initial || !toggleText || !btn) {
        console.error('VO: Toggle elements not found');
        return;
    }

    if (expanded.style.display === 'none') {
        expanded.style.display = 'grid';
        initial.style.display = 'none';
        toggleText.textContent = 'See Less';
        btn.classList.add('expanded');
    } else {
        expanded.style.display = 'none';
        initial.style.display = 'grid';
        toggleText.textContent = 'See More';
        btn.classList.remove('expanded');
    }
};

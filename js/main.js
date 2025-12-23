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
        const sections = document.querySelectorAll('.vo-hero');
        sections.forEach(section => {
            if (section.dataset.initialized === 'true') return;
            section.dataset.initialized = 'true';

            const slides = section.querySelectorAll('.vo-hero-slide');
            if (slides.length === 0) return;

            let currentSlide = 0;
            const slideInterval = 3000;

            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, slideInterval);
        });
        console.log('[Main.js] Hero slideshows initialized');
    };

    /* =========================================
       Dynamic Greeting (Typewriter Effect)
       ========================================= */
    const initDynamicGreeting = () => {
        const greetingEls = document.querySelectorAll('#dynamic-hello, .dynamic-greeting');

        greetingEls.forEach(greetingEl => {
            if (greetingEl.dataset.initialized === 'true') return;
            greetingEl.dataset.initialized = 'true';

            const hellos = [
                'hello..', 'नमस्ते..', 'hola..', 'こんにちは..',
                'bonjour..', 'ciao..', 'hallo..', 'olá..'
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
        });
        console.log('[Main.js] Dynamic greetings initialized');
    };

    /* =========================================
       Expanding Gallery (Mobile Interaction)
       ========================================= */
    /* Redundant functions migrated to pages.js: initExpandingGallery, initStatsCounter, initFindYourFit */

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
        const sections = document.querySelectorAll('.why-love-section');

        sections.forEach(section => {
            if (section.dataset.initialized === 'true') return;
            section.dataset.initialized = 'true';

            const points = section.querySelectorAll('.why-love-point');
            const images = section.querySelectorAll('.why-love-photo');

            if (points.length === 0 || images.length === 0) return;

            points.forEach((point, index) => {
                const activate = () => {
                    points.forEach(p => p.classList.remove('active'));
                    images.forEach(img => img.classList.remove('active'));

                    point.classList.add('active');
                    if (images[index]) {
                        images[index].classList.add('active');
                    }
                };

                point.addEventListener('mouseenter', activate);
                point.addEventListener('click', activate);
            });
        });
        console.log('[Main.js] Why People Love interactions initialized');
    };

    // Initialize all homepage features
    initHeroSlideshow();
    initDynamicGreeting();
    initExpertBlobFade();
    initFooterCheck();
    initWhyPeopleLove();
});

/* =========================================
   Common Challenges Toggle Global Function
   ========================================= */
window.toggleVoChallengesList = function (btn) {
    const section = btn ? btn.closest('.vo-specs-section') : document.querySelector('.vo-specs-section');
    if (!section) return;

    const expanded = section.querySelector('.vo-challenges-expanded');
    const initial = section.querySelector('.vo-challenges-list:not(.vo-challenges-expanded)');
    const toggleText = section.querySelector('.vo-see-more-btn span, #voToggleText');
    const toggleBtn = btn || section.querySelector('.vo-see-more-btn');

    if (!expanded || !initial || !toggleText || !toggleBtn) {
        console.error('VO: Toggle elements not found');
        return;
    }

    if (expanded.style.display === 'none') {
        expanded.style.display = 'grid';
        initial.style.display = 'none';
        toggleText.textContent = 'See Less';
        toggleBtn.classList.add('expanded');
    } else {
        expanded.style.display = 'none';
        initial.style.display = 'grid';
        toggleText.textContent = 'See More';
        toggleBtn.classList.remove('expanded');
    }
};

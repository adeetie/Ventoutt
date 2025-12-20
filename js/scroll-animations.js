// Smooth Scroll Reveal Animation Script
(function () {
    'use strict';

    // Intersection Observer for scroll reveals
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Don't unobserve - allow re-triggering on scroll
            } else {
                // Remove revealed class when out of view to allow re-animation
                entry.target.classList.remove('revealed');
            }
        });
    }, observerOptions);

    // Function to initialize scroll reveals
    function initScrollReveal() {
        // Select all elements that should animate on scroll
        const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');

        revealElements.forEach(el => {
            observer.observe(el);
        });

        // Auto-add scroll-reveal to common sections
        const autoRevealSelectors = [
            '.service-card',
            '.stat-card',
            '.testimonial-card',
            '.mission-card',
            '.feature-card',
            '.blog-card',
            '.faq-item',
            '.specialization-card',
            '.founder-card',
            '.comp-card'
        ];

        autoRevealSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, index) => {
                if (!el.classList.contains('scroll-reveal')) {
                    el.classList.add('scroll-reveal');
                    el.style.transitionDelay = `${index * 0.1}s`;
                    observer.observe(el);
                }
            });
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        initScrollReveal();
    }

    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a[href^="#"]');
        if (target && target.getAttribute('href') !== '#') {
            e.preventDefault();
            const id = target.getAttribute('href').substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

})();

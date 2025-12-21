/**
 * VentOutt Homepage Logic (vo-index.js)
 * Consolidated logic for all interactive elements on the homepage.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* =========================================
       1. Global Init & Debug
       ========================================= */
    console.log('VO-Index: Initializing homepage logic...');

    /* =========================================
       1b. Dynamic Greeting (Language Switcher)
       ========================================= */
    const greetingEl = document.getElementById('dynamic-hello');
    if (greetingEl) {
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
        let currentHello = 0;

        setInterval(() => {
            greetingEl.style.opacity = 0;
            setTimeout(() => {
                currentHello = (currentHello + 1) % hellos.length;
                greetingEl.textContent = hellos[currentHello];
                greetingEl.style.opacity = 1;
            }, 500);
        }, 3000);

        // Ensure initial transition support
        greetingEl.style.transition = 'opacity 0.5s ease-in-out';
    }

    /* =========================================
       2. Hero Slideshow (Homepage)
       ========================================= */
    const heroSlides = document.querySelectorAll('.vo-hero-slide');
    if (heroSlides.length > 1) {
        let currentSlide = 0;

        const rotateSlides = () => {
            // Remove active class from current slide
            heroSlides[currentSlide].classList.remove('active');

            // Move to next slide
            currentSlide = (currentSlide + 1) % heroSlides.length;

            // Add active class to new slide
            heroSlides[currentSlide].classList.add('active');
        };

        // Auto-rotate every 5 seconds
        setInterval(rotateSlides, 5000);
    }

    /* =========================================
       3. Service Cards Touch Expansion (Mobile)
       ========================================= */
    const galleryCards = document.querySelectorAll('.vo-gallery-card');
    if (galleryCards.length > 0 && window.innerWidth <= 768) {
        galleryCards.forEach(card => {
            // Handle both touch and click events
            const handleExpand = (e) => {
                // Don't interfere with link clicks
                if (e.target.classList.contains('vo-gallery-link')) {
                    return;
                }

                // Toggle expanded state
                const isExpanded = card.classList.contains('expanded');

                // Remove expanded from all cards
                galleryCards.forEach(c => c.classList.remove('expanded'));

                // If card wasn't expanded, expand it
                if (!isExpanded) {
                    card.classList.add('expanded');

                    // Scroll the card into view smoothly
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
            card.addEventListener('touchstart', (e) => {
                // Prevent default to avoid double-firing with click
                if (e.target.classList.contains('vo-gallery-link')) {
                    return;
                }
                e.preventDefault();
                handleExpand(e);
            }, { passive: false });
        });
    }

    /* =========================================
       4. FAQ Toggle Logic
       ========================================= */
    // Using standard details/summary, but we can add smooth animation if needed.
    // CSS handles the toggle icon rotation.


    /* =========================================
       4. Stats Counter Animation (Two Types)
       ========================================= */
    /* =========================================
       4. Stats Counter Animation (Original Logic)
       ========================================= */
    const odometerElements = document.querySelectorAll('[data-odometer]');

    if (odometerElements.length > 0) {
        const odometerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Prevent double start
                    if (element.dataset.started === 'true') return;
                    element.dataset.started = 'true';

                    let currentValue = parseFloat(element.textContent.replace(/,/g, '')) || 0;
                    const incrementRate = parseFloat(element.getAttribute('data-increment')) || 1;
                    const incrementPerFrame = incrementRate / 60; // Approx 60fps

                    const updateDisplay = () => {
                        currentValue += incrementPerFrame;
                        element.textContent = Math.floor(currentValue).toLocaleString('en-US');
                        requestAnimationFrame(updateDisplay);
                    };

                    requestAnimationFrame(updateDisplay);
                    odometerObserver.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        odometerElements.forEach(el => odometerObserver.observe(el));
    }

    /* =========================================
       4b. Experts Slideshow (Blob Fade)
       ========================================= */
    const blobSlides = document.querySelectorAll('.vo-blob-slide');
    if (blobSlides.length > 0) {
        let currentBlob = 0;
        setInterval(() => {
            blobSlides[currentBlob].classList.remove('active');
            currentBlob = (currentBlob + 1) % blobSlides.length;
            blobSlides[currentBlob].classList.add('active');
        }, 4000); // 4 seconds per slide
    }


    /* =========================================
       5. 3D Testimonial Loop & Video Logic
       ========================================= */
    // Migrated to vo-marquee.js to separate concerns.

    /* =========================================
       6. Scroll Scroll Reveal
       ========================================= */
    // Auto-tag sections that aren't already tagged
    // Exclude sticky section (.vo-why-love-section) to prevent transform breaking position:sticky
    // Exclude experts section (.experts-section) to prevent transform interfering with swipe/touch behaviors
    document.querySelectorAll('main section:not(.vo-why-love-section):not(.experts-section)').forEach(sec => {
        sec.classList.add('vo-reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.vo-reveal').forEach(el => revealObserver.observe(el));


    /* =========================================
       7. Footer Content Integrity Check
       ========================================= */
    // Monitor footer injection to ensure columns render
    const checkFooter = setInterval(() => {
        if (typeof footerContent !== 'undefined' && footerContent) {
            clearInterval(checkFooter);
            if (footerContent.children.length < 2) {
                console.warn('VO-Footer: Potential rendering issue. Verify flex-wrap or HTML structure.');
                // Attempt to force display if hidden
                footerContent.style.display = 'flex';
                Array.from(footerContent.children).forEach(child => {
                    child.style.display = 'block';
                    child.style.opacity = '1';
                });
            }
        }
    }, 500);
    // Stop checking after 5s
    setTimeout(() => clearInterval(checkFooter), 5000);

    /* =========================================
       9. Expert Pointers Auto-Scroll (Cloned Loop)
       ========================================= */
    const pointersTrack = document.getElementById('expertPointersTrack');
    if (pointersTrack) {
        const originals = Array.from(pointersTrack.children);
        // Clone 3 sets for smooth infinite loop
        for (let i = 0; i < 3; i++) {
            originals.forEach(item => pointersTrack.appendChild(item.cloneNode(true)));
        }

        // Calculate scroll width
        const itemWidth = originals[0] ? originals[0].getBoundingClientRect().width : 280;
        const gap = 20;
        const scrollDist = (itemWidth + gap) * originals.length;

        pointersTrack.style.setProperty('--scroll-distance', `${scrollDist}px`);

        // Duration ~ 40px/s
        const dur = scrollDist / 40;
        pointersTrack.style.animation = `pointer-scroll ${dur}s linear infinite`;

        pointersTrack.addEventListener('mouseenter', () => pointersTrack.style.animationPlayState = 'paused');
        pointersTrack.addEventListener('mouseleave', () => pointersTrack.style.animationPlayState = 'running');
    }

    /* =========================================
       10. Bubble Arrow Carousel Logic (General)
       ========================================= */
    const carousels = document.querySelectorAll('.vo-carousel-wrapper');
    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.vo-carousel-track');
        const prevBtn = wrapper.querySelector('.vo-bubble-arrow.prev');
        const nextBtn = wrapper.querySelector('.vo-bubble-arrow.next');

        if (!track || !prevBtn || !nextBtn) return;

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -320, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: 320, behavior: 'smooth' });
        });
    });

});

/* =========================================
   8. Common Challenges Toggle Global Function
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
        // Show expanded, Hide initial
        expanded.style.display = 'grid'; // Using grid layout
        initial.style.display = 'none';
        toggleText.textContent = 'See Less';
        btn.classList.add('expanded');
    } else {
        // Hide expanded, Show initial
        expanded.style.display = 'none';
        initial.style.display = 'grid'; // Using grid layout
        toggleText.textContent = 'See More';
        btn.classList.remove('expanded');
    }
};

/* Mobile Menu Logic moved to js/vo-header.js */

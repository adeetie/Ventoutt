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

                    // Parse start value (should be 0 usually, or current text)
                    // We'll increment from 0 up to infinity or just run continuous?
                    // "Original logic" in counter-animation.js was: currentValue += incrementPerFrame; indefinitely?
                    // Yes, lines 13 "currentValue += incrementPerFrame" inside updateDisplay() loops forever.
                    // But WAIT, standard odometers usually stop at a value. 
                    // However, original file was "Continuous Odometer Counter".
                    // The HTML has "36610" as text. 
                    // Let's replicate the continuous behavior if interpreted from logic, 
                    // OR if it's meant to count UP TO the value. 
                    // Re-reading counter-animation.js: 
                    // "createOdometer(element, startValue, incrementRate)"
                    // startValue = parseFloat(element.textContent...)
                    // It starts FROM the text content and increments forever? 
                    // That implies it's a "live" tracker simulation.

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

    // Handle "Standard" stats (Countries, Stars) separately?
    // User requested NO animation ("shuffle") for these blocks. 
    // They are already statically populated in HTML.
    // Logic removed to keep them static.

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
       5. Testimonials Video Handling (YouTube)
       ========================================= */
    const carouselWrapper = document.querySelector('.vo-testimonials-wrapper');
    if (carouselWrapper) {
        const track = carouselWrapper.querySelector('.vo-testimonials-track');
        let isPaused = false;
        let controller = null;

        const setRunning = (running) => {
            if (!track) return;
            isPaused = !running;
            track.style.setProperty('animation-play-state', running ? 'running' : 'paused', 'important');
        };

        const toggleBy = (el) => {
            if (!isPaused) {
                controller = el;
                setRunning(false);
            } else {
                if (controller === el) {
                    setRunning(true);
                    controller = null;
                } else {
                    controller = el;
                    // Switch controller
                }
            }
        };

        // Text cards pause on click
        const textCards = carouselWrapper.querySelectorAll('.vo-testimonial-card:not(:has(iframe))');
        textCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleBy(card);
            });
        });

        // Hover behavior
        carouselWrapper.addEventListener('mouseenter', () => setRunning(false));
        carouselWrapper.addEventListener('mouseleave', () => setRunning(true));


        // Initialize YouTube API
        const iframes = carouselWrapper.querySelectorAll('iframe[src*="youtube.com/embed"]');
        iframes.forEach((ifr, idx) => {
            if (!ifr.id) ifr.id = `vo-yt-frame-${idx}`;
            try {
                const u = new URL(ifr.src, window.location.href);
                if (!u.searchParams.has('enablejsapi')) {
                    u.searchParams.set('enablejsapi', '1');
                    u.searchParams.set('origin', window.location.origin);
                    ifr.src = u.toString();
                }
            } catch (e) { }
        });

        function subscribeToYTEvents() {
            iframes.forEach(ifr => {
                if (ifr.contentWindow) {
                    ifr.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: ifr.id }), '*');
                    ifr.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'], id: ifr.id }), '*');
                }
            });
        }

        window.addEventListener('message', (e) => {
            let data;
            try { data = JSON.parse(e.data); } catch { return; }
            if (!data || data.event !== 'onStateChange' || data.info === undefined) return;
            if (data.info === 1) setRunning(false); // Playing
        });

        window.addEventListener('load', () => setTimeout(subscribeToYTEvents, 1500));
    }

    /* =========================================
       6. Scroll Scroll Reveal
       ========================================= */
    const revealElements = document.querySelectorAll('.vo-reveal');
    const sections = document.querySelectorAll('section');

    // Auto-tag sections that aren't already tagged
    document.querySelectorAll('main section').forEach(sec => {
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
        if (footerContent) {
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


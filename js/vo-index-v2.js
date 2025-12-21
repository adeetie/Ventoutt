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
       5. 3D Testimonial Loop & Video Logic
       ========================================= */
    /* =========================================
       5. JS-Driven Marquee Testimonial Loop
       ========================================= */
    const initTestimonials = () => {
        const marquee = document.querySelector('.marquee');
        const marqueeInner = document.querySelector('.marquee-inner');

        if (!marquee || !marqueeInner) return;

        // 1. Setup Clones
        // We need enough content to scroll infinitely. 
        // Simple approach: Clone the original set once, giving us [A, B, C, ... A, B, C ...]
        // When we scroll past the end of the first set, we jump back to proper start.

        const originals = Array.from(marqueeInner.children);
        if (originals.length === 0) return;

        // Clone them
        originals.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            marqueeInner.appendChild(clone);
        });

        // 2. Animation Logic
        let currentTx = 0;
        const speed = 0.6; // Slower, smoother speed
        let isPaused = false;
        let animationId;

        // Concave 3D Settings
        const perspective = 1000;

        const updateCards3D = () => {
            const viewportCenter = marquee.offsetWidth / 2;
            const allCards = marqueeInner.children;

            Array.from(allCards).forEach(card => {
                // Get position relative to the moving track
                // We can't trust getBoundingClientRect because of the transform? 
                // Actually getBoundingClientRect works but might be jittery if we read/write in loop.
                // Better: calculate relative pos.
                // But simply reading `rect` is easiest for prototypes.

                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const dist = cardCenter - viewportCenter;

                // Normalize distance (-1 to 1 approx across screen)
                const norm = dist / viewportCenter; // -1 (left edge) to 1 (right edge)

                // Concave Effect (Surround/Bowtie):
                const rotateY = norm * -30; // Reduced rotation for tighter look

                // Depth Strategy: Minimal pushback to just curve slightly
                const z = (1 - Math.abs(norm)) * -60;

                // Apply transform
                card.style.transform = `perspective(${perspective}px) rotateY(${rotateY}deg) translateZ(${z}px)`;
                card.style.zIndex = Math.round(Math.abs(norm) * 100) + 10; // Base 10
            });
        };

        const calculateScrollWidth = () => {
            // Total width is roughly half the inner width (after cloning)
            // Safety check
            if (marqueeInner.scrollWidth === 0) return 0;
            return marqueeInner.scrollWidth / 2;
        };

        let scrollLimit = calculateScrollWidth();

        window.addEventListener('resize', () => {
            scrollLimit = calculateScrollWidth();
        });

        const animate = () => {
            if (!isPaused) {
                currentTx -= speed;

                // Infinite Loop Reset
                if (Math.abs(currentTx) >= scrollLimit) {
                    currentTx = 0;
                }

                marqueeInner.style.transform = `translate3d(${currentTx}px, 0, 0)`;

                // Update 3D visual for every frame
                updateCards3D();
            }
            animationId = requestAnimationFrame(animate);
        };

        // Start
        animationId = requestAnimationFrame(animate);

        // 3. Pause functionality
        marquee.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        marquee.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        // 4. Video Interaction & Fixes
        const allCards = marqueeInner.querySelectorAll('.vo-testimonial-card');
        allCards.forEach((card, index) => {
            // Fix Loop Video Clones: Reset SRC to ensure loading
            const iframe = card.querySelector('iframe');
            if (iframe) {
                iframe.id = `vo-yt-frame-marquee-${index}`;
                // Convert shorts/ to embed/ if needed for better thumbnail support
                let src = iframe.src;
                if (src.includes('/shorts/')) {
                    src = src.replace('/shorts/', '/embed/');
                }
                // Ensure params
                const u = new URL(src);
                u.searchParams.set('enablejsapi', '1');
                u.searchParams.set('rel', '0');
                u.searchParams.set('modestbranding', '1');
            }
        });

        // Inject YT API listeners
        const iframes = marqueeInner.querySelectorAll('iframe');
        const injectYTEvents = () => {
            iframes.forEach(ifr => {
                try {
                    // Ensure enablejsapi
                    const u = new URL(ifr.src);
                    if (!u.searchParams.has('enablejsapi')) {
                        u.searchParams.set('enablejsapi', '1');
                        ifr.src = u.toString();
                    }
                    // Send events
                    if (ifr.contentWindow) {
                        ifr.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: ifr.id }), '*');
                        ifr.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'], id: ifr.id }), '*');
                    }
                } catch (e) { }
            });
        };
        // Give iframes a moment to load
        setTimeout(injectYTEvents, 2000);
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTestimonials);
    } else {
        initTestimonials();
    }

    /* =========================================
       6. Scroll Scroll Reveal
       ========================================= */
    /* =========================================
       6. Scroll Scroll Reveal
       ========================================= */
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


/* Mobile Menu Logic (Appended for Index V2/V3) */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.vo-mobile-header__hamburger');
    const overlay = document.querySelector('.vo-mobile-menu');
    const closeBtn = document.querySelector('.vo-mobile-menu__close');
    const backdrop = document.querySelector('.vo-mobile-menu__backdrop');
    const sections = document.querySelectorAll('.vo-mobile-menu__section');

    if (hamburger && overlay) {
        const openMenu = () => {
            overlay.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            overlay.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        };

        hamburger.addEventListener('click', openMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (backdrop) backdrop.addEventListener('click', closeMenu);

        // Sections (Accordions)
        sections.forEach(section => {
            const header = section.querySelector('.vo-mobile-menu__item-header');
            if (header) {
                header.addEventListener('click', () => {
                    section.classList.toggle('active');
                    const chevron = section.querySelector('.vo-mobile-menu__chevron');
                    if (chevron) {
                         // Chevron rotation handled by CSS .section.active .chevron
                    }
                });
            }
        });

        // Close on link click
        const links = document.querySelectorAll('.vo-mobile-menu__link, .vo-mobile-menu__sublink');
        links.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 100);
            });
        });
    }
});


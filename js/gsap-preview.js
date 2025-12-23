/**
 * GSAP PREVIEW ANIMATIONS
 * Centralized GSAP logic for full-site-preview.html
 */

(function () {
    'use strict';

    /* =========================================
       4. WHY PEOPLE LOVE VENTOUTT (Vertical Stack)
       ========================================= */
    function initLoveAnimations() {
        const section = document.querySelector('.fp-love-section');
        const container = document.querySelector('.fp-love-container');
        const cards = Array.from(document.querySelectorAll('.fp-love-card'));

        if (!section || !container || cards.length === 0) return;

        console.log("[GSAP Preview] Love Section found, animating stack...");

        // Strategy: Pin the section, animate cards sliding up one by one.
        // We set z-index manually to ensure correct stacking order (bottom in HTML = top visible).
        // Actually, normally HTML order: last one is on top.
        // So simply revealing them from bottom works perfectly.

        // Initial State: All cards except the first one are moved down
        // On mobile, we might want a simple scroll, but let's try the stack there too for premium feel.

        // Z-Index setup:
        cards.forEach((card, i) => {
            card.style.zIndex = i + 1;
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top", // When section top hits viewport top
                end: `+=${(cards.length + 0.5) * 100}%`, // Added 50% extra buffer
                pin: true,
                scrub: 1, // Smooth scrubbing
                anticipatePin: 1,
                refreshPriority: 10 // Calculate FIRST to ensure spacing pushes down next sections
            }
        });

        // Skip the first card (it's already there acting as the base)
        // Animate subsequent cards into view
        cards.forEach((card, i) => {
            if (i === 0) return;

            // Start from 100% down (off screen relative to container)
            gsap.set(card, { yPercent: 100 });

            tl.to(card, {
                yPercent: 0,
                duration: 1,
                ease: "none" // Linear movement for scrubbing
            });
        });

        // Add a small hold at the end so the last card stays readable for a moment
        tl.to({}, { duration: 0.5 });
    }


    /* =========================================
       5. EXPERTS SECTION (Interactable Stack)
       Note: Implementation moved to bottom of file
       ========================================= */
    // Duplicate removed


    // Helper to safely run inits
    const safeInit = (fn, name) => {
        try {
            if (typeof fn === 'function') {
                fn();
                console.log(`[GSAP Preview] ${name} initialized`);
            } else {
                console.warn(`[GSAP Preview] ${name} is not a function`);
            }
        } catch (e) {
            console.error(`[GSAP Preview] Error initializing ${name}:`, e);
        }
    };

    // Initialize all
    const initAll = () => {
        gsap.registerPlugin(ScrollTrigger);
        console.log("[GSAP Preview] Starting Initialization...");

        safeInit(initHeroAnimations, 'Hero');
        safeInit(initGalleryAnimations, 'Gallery');
        safeInit(initTestimonialsAnimations, 'Testimonials');
        safeInit(initLoveAnimations, 'Love');
        safeInit(initExpertsAnimations, 'Experts');
        safeInit(initFitAnimations, 'Fit');
        safeInit(initHowAnimations, 'How');
        safeInit(initBlogsAnimations, 'Blogs');
        safeInit(initSpecsAnimations, 'Specializations');
        safeInit(initChallengeLogic, 'Challenges');
        safeInit(initFaqLogic, 'FAQ');

        // Refresh ScrollTrigger after all inits to ensure positions are correct
        setTimeout(() => ScrollTrigger.refresh(), 500);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    /* =========================================
       1. HERO SECTION
       ========================================= */
    function initHeroAnimations() {
        const heroSection = document.querySelector('.vo-hero');
        if (!heroSection) return;

        console.log("[GSAP Preview] Hero found, animating...");

        const greeting = document.querySelector('.vo-hero__greeting');
        const title = document.querySelector('.vo-hero__title');
        const desc = document.querySelector('.vo-hero__description');
        const btn = document.querySelector('.vo-btn--hero-new');
        const visual = document.querySelector('.vo-hero__visual');
        const doodles = document.querySelectorAll('.vo-doodle path');

        // Master Timeline
        const tl = gsap.timeline({
            defaults: { ease: "power3.out", duration: 1 }
        });

        // 1. Greeting (Staggered Typewriter-ish Reveal)
        // Instead of complex splitting, we'll do a simple fade/slide up for now, 
        // effectively revealing it.
        // 1. Greeting (Staggered Typewriter-ish Reveal)
        tl.to(greeting, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            onComplete: () => startTypewriter(greeting)
        });

        // 2. Title & Desc & Btn (Staggered)
        tl.to([title, desc, btn], {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.8
        }, "-=0.4");

        // 3. Visual (Scale In)
        tl.to(visual, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)"
        }, "-=0.8");

        // 4. Doodles (Draw In)
        if (doodles.length > 0) {
            tl.to(doodles, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: "power2.inOut",
                stagger: 0.2
            }, "-=1");
        }

        // 5. Slideshow (Infinite Loop)
        initHeroSlideshow();
    }

    function startTypewriter(el) {
        const words = ['hello...', 'hola...', 'bonjour...', 'ciao...', 'namaste...', 'hallo...'];
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

        type();
    }

    function initHeroSlideshow() {
        const slides = document.querySelectorAll('.vo-hero-slide');
        if (slides.length < 2) return;

        let current = 0;

        // Use a recursive delayed call for the loop to allow GSAP control
        function nextSlide() {
            const next = (current + 1) % slides.length;

            const tl = gsap.timeline();

            // Fade out current
            tl.to(slides[current], {
                opacity: 0,
                duration: 1,
                zIndex: 1
            });

            // Fade in next
            tl.to(slides[next], {
                opacity: 1,
                duration: 1,
                zIndex: 2
            }, "<"); // Run at start of previous

            current = next;

            // Schedule next transition
            gsap.delayedCall(3, nextSlide);
        }

        // Start the loop after initial delay
        gsap.delayedCall(3, nextSlide);
    }

    /* =========================================
       2. GALLERY SECTION
       ========================================= */
    function initGalleryAnimations() {
        const section = document.querySelector('.vo-help-section');
        if (!section) return;

        console.log("[GSAP Preview] Gallery found, animating...");

        const title = section.querySelector('.vo-section-title');
        const subtitle = section.querySelector('.vo-section-subtitle');
        const cards = section.querySelectorAll('.vo-gallery-card');
        const quiz = section.querySelector('.vo-quiz-prompt');

        // Animation Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // Start when top of section is 80% down viewport
                toggleActions: "play none none reverse"
            }
        });

        // 1. Header Reveal
        tl.to([title, subtitle], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });

        // 2. Cards Stagger In (from bottom)
        tl.to(cards, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out"
        }, "-=0.4");

        // 3. Quiz Prompt Fade In
        tl.to(quiz, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.2");

        // Mobile Interaction (Click to Expand)
        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    cards.forEach(c => c.classList.remove('expanded'));
                    card.classList.add('expanded');
                }
            });
        });
    }

    /* =========================================
       3. TESTIMONIALS SECTION (3D Continuous Loop)
       ========================================= */
    function initTestimonialsAnimations() {
        const section = document.querySelector('.vo-testimonials-section');
        if (!section) return;

        console.log("[GSAP Preview] Testimonials found, animating with 3D effect...");

        const title = section.querySelector('.vo-testimonials-title');
        const marqueeInner = section.querySelector('.marquee-inner');

        // 1. Reveal Title
        gsap.to(title, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });

        // 2. Clone cards for seamless loop
        const cardsOriginal = Array.from(marqueeInner.querySelectorAll('.vo-testimonial-card'));
        const cardWidth = cardsOriginal[0].offsetWidth + 12; // Width + margin (approx)
        const totalWidth = cardWidth * cardsOriginal.length;

        // Ensure enough clones to fill screen + buffer
        const clonesNeeded = 4; // Duplicate entire set 4 times for safety
        for (let i = 0; i < clonesNeeded; i++) {
            cardsOriginal.forEach(card => {
                const clone = card.cloneNode(true);
                marqueeInner.appendChild(clone);
            });
        }

        const cardsAll = marqueeInner.querySelectorAll('.vo-testimonial-card');

        // 3. Infinite Horizontal Movement
        const scrollDuration = 20; // Adjust for speed

        gsap.to(marqueeInner, {
            x: -totalWidth, // Move left by one original set width
            duration: scrollDuration,
            ease: "none",
            repeat: -1
        });

        // 4. 3D Perspective Logic (The "Prototype" Look)
        // We attach this to GSAP's ticker to update every frame without layout thrashing
        // ONLY on desktop (> 900px) to prevent mobile glitching/performance issues
        gsap.ticker.add(() => {
            if (window.innerWidth <= 900) {
                // On mobile, ensure flat transform
                cardsAll.forEach(card => {
                    card.style.transform = 'none';
                    card.style.zIndex = 1;
                });
                return;
            }

            const viewportCenter = window.innerWidth / 2;
            const perspective = 1000;

            cardsAll.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;

                // Calculate distance from center
                const dist = cardCenter - viewportCenter;
                const norm = dist / viewportCenter; // -1 (left edge) to 1 (right edge) approx

                // Apply 3D rotation based on position
                const rotateY = norm * -30;
                const z = (1 - Math.abs(norm)) * -60;

                // Apply transform directly (perserving existing movement from parent)
                card.style.transform = `perspective(${perspective}px) rotateY(${rotateY}deg) translateZ(${z}px)`;

                // Dynamic Z-Index for stacking context
                const zIndex = Math.round(100 - Math.abs(norm) * 50);
                card.style.zIndex = zIndex;
            });
        });

        // Interaction
        section.addEventListener('mouseenter', () => gsap.globalTimeline.timeScale(0.2));
        section.addEventListener('mouseleave', () => gsap.globalTimeline.timeScale(1));
    }


    /* =========================================
       5. EXPERTS SECTION (Interactable Stack)
       ========================================= */
    function initExpertsAnimations() {
        const section = document.querySelector('.vo-experts-v2-section');
        if (!section) return;

        console.log("[GSAP Preview] Experts Section found, initializing...");

        // Desktop Animations: Simple Stagger In
        const desktopCards = section.querySelectorAll('.vo-experts-v2-card');
        if (window.innerWidth > 900) {
            gsap.from(desktopCards, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
            return;
        }

        // Mobile Animations: Full Swipe Logic (Replanted for GSAP)
        const swipeContainer = section.querySelector('.vo-swipe-container');
        if (swipeContainer && window.innerWidth <= 900) {

            // Internal Class for managing the stack
            class SwipeDeck {
                constructor(container) {
                    this.container = container;
                    this.cards = Array.from(container.querySelectorAll('.vo-swipe-card'));
                    this.isAnimating = false;
                    this.startX = 0;
                    this.currentX = 0;
                    this.activeCard = null;

                    this.init();
                }

                init() {
                    this.updateStack();
                }

                updateStack() {
                    // Re-query in case order changed (looping)
                    this.cards = Array.from(this.container.querySelectorAll('.vo-swipe-card'));

                    this.cards.forEach((card, i) => {
                        // Reset styles to base state
                        card.style.display = 'block';
                        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';

                        // Clean listeners from all, add only to top
                        this.removeListeners(card);

                        if (i === 0) {
                            // Top Card
                            this.activeCard = card;
                            this.addListeners(card);
                            gsap.to(card, {
                                scale: 1,
                                y: 0,
                                rotation: 0,
                                opacity: 1,
                                zIndex: 100,
                                duration: 0.5,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                            });
                        } else if (i === 1) {
                            // Second Card (Reference Look: Tilted Right + Down)
                            gsap.to(card, {
                                scale: 0.95,
                                y: 15,
                                rotation: 3,
                                opacity: 1,
                                zIndex: 90,
                                duration: 0.5,
                                boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
                            });
                        } else if (i === 2) {
                            // Third Card (Reference Look: Tilted Left + Further Down)
                            gsap.to(card, {
                                scale: 0.90,
                                y: 30,
                                rotation: -3,
                                opacity: 1,
                                zIndex: 80,
                                duration: 0.5,
                                boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                            });
                        } else {
                            // Hidden Cards
                            gsap.to(card, {
                                scale: 0.85,
                                y: 45,
                                rotation: 0,
                                opacity: 0,
                                zIndex: 10,
                                duration: 0.5,
                                boxShadow: "none"
                            });
                        }
                    });
                }

                addListeners(card) {
                    // Touch
                    card.ontouchstart = (e) => this.handleStart(e);
                    card.ontouchmove = (e) => this.handleMove(e);
                    card.ontouchend = (e) => this.handleEnd(e);
                    // Mouse
                    card.onmousedown = (e) => this.handleStart(e);
                }

                removeListeners(card) {
                    card.ontouchstart = null;
                    card.ontouchmove = null;
                    card.ontouchend = null;
                    card.onmousedown = null;
                    card.onmousemove = null;
                    card.onmouseup = null;
                    card.onmouseleave = null;
                }

                handleStart(e) {
                    if (this.isAnimating) return;
                    this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                    this.activeCard.style.transition = 'none'; // dragging

                    if (e.type.includes('mouse')) {
                        document.onmousemove = (e) => this.handleMove(e);
                        document.onmouseup = (e) => this.handleEnd(e);
                    }
                }

                handleMove(e) {
                    if (!this.startX) return;
                    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                    this.currentX = clientX;
                    const diffX = this.currentX - this.startX;

                    // Drag Effect
                    const rotate = diffX * 0.1;
                    gsap.set(this.activeCard, {
                        x: diffX,
                        rotation: rotate
                    });
                }

                handleEnd(e) {
                    if (!this.startX) return;
                    const diffX = this.currentX - this.startX;
                    this.startX = 0;

                    // Cleanup global mouse listeners
                    document.onmousemove = null;
                    document.onmouseup = null;

                    if (Math.abs(diffX) > 100) {
                        this.swipeOut(diffX > 0 ? 1 : -1);
                    } else {
                        // Reset
                        gsap.to(this.activeCard, {
                            x: 0,
                            rotation: 0,
                            duration: 0.4,
                            ease: "back.out(1.7)"
                        });
                    }
                }

                swipeOut(dir) {
                    this.isAnimating = true;
                    const endX = dir * window.innerWidth * 1.5;

                    gsap.to(this.activeCard, {
                        x: endX,
                        rotation: dir * 30,
                        opacity: 0,
                        duration: 0.5,
                        ease: "power1.in",
                        onComplete: () => {
                            // Cycle Card
                            this.container.appendChild(this.activeCard);
                            // Reset state for when it comes back
                            gsap.set(this.activeCard, { x: 0, rotation: 0 });

                            this.isAnimating = false;
                            this.updateStack();
                        }
                    });
                }
            }

            // Initialize Deck
            new SwipeDeck(swipeContainer);
        }
    }


    /* =========================================
       6c. BLOGS SECTION
       ========================================= */
    function initBlogsAnimations() {
        const section = document.querySelector('.vo-blogs-section');
        if (!section) return;

        console.log("[GSAP Preview] Blogs found, initializing...");

        const cards = section.querySelectorAll('.vo-blog-card');
        const list = section.querySelector('.vo-blogs-grid');
        const prevBtn = section.querySelector('.prev');
        const nextBtn = section.querySelector('.next');

        // Reveal Animation
        gsap.from(cards, {
            scrollTrigger: {
                trigger: section,
                start: "top 75%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });

        // Carousel Logic
        if (prevBtn && nextBtn && list) {
            // Remove inline handlers
            prevBtn.removeAttribute('onclick');
            nextBtn.removeAttribute('onclick');

            const getScrollAmt = () => {
                // Return dynamic width of first card + gap
                const card = list.querySelector('.vo-blog-card');
                return card ? card.offsetWidth + 24 : 320;
            };

            prevBtn.addEventListener('click', () => {
                list.scrollBy({ left: -getScrollAmt(), behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                list.scrollBy({ left: getScrollAmt(), behavior: 'smooth' });
            });
        }
    }


    /* =========================================
       10. SPECIALIZATIONS SECTION logic
       ========================================= */
    function initSpecsAnimations() {
        // Simple scroll logic for the specs carousel arrow (Mobile mostly, or if desktop needs it)
        const nextBtn = document.querySelector('.vo-specs-section .next');
        const list = document.querySelector('.vo-specs-grid');

        if (nextBtn && list) {
            nextBtn.removeAttribute('onclick');
            nextBtn.addEventListener('click', () => {
                // Scroll one width
                list.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }
    }

    /* =========================================
       11. CHALLENGES TOGGLE logic
       ========================================= */
    function initChallengeLogic() {
        const toggleBtn = document.getElementById('voToggleChallenges');
        const hiddenSection = document.querySelector('.vo-challenges-expanded');
        const toggleText = document.getElementById('voToggleText');
        const chevronLeft = document.querySelector('.chevron-left');
        const chevronRight = document.querySelector('.chevron-right');

        if (!toggleBtn || !hiddenSection) return;

        // Remove inline
        toggleBtn.removeAttribute('onclick');

        let isExpanded = false;

        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;

            if (isExpanded) {
                // Expand
                gsap.set(hiddenSection, { display: 'block', height: 'auto' });
                gsap.from(hiddenSection, { height: 0, duration: 0.5, ease: "power2.out" });

                if (toggleText) toggleText.textContent = "See Less";
                // Rotate chevrons explicitly if needed, or CSS rotation
                if (chevronLeft) gsap.to(chevronLeft, { rotation: -90, duration: 0.3 });
                if (chevronRight) gsap.to(chevronRight, { rotation: 90, duration: 0.3 });

            } else {
                // Collapse
                gsap.to(hiddenSection, {
                    height: 0,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        hiddenSection.style.display = 'none';
                    }
                });

                if (toggleText) toggleText.textContent = "See More";
                if (chevronLeft) gsap.to(chevronLeft, { rotation: 0, duration: 0.3 });
                if (chevronRight) gsap.to(chevronRight, { rotation: 0, duration: 0.3 });
            }
        });
    }

    /* =========================================
       12. FAQ SECTION logic
       ========================================= */
    function initFaqLogic() {
        const details = document.querySelectorAll('.vo-faq-item');

        details.forEach((targetDetail) => {
            targetDetail.addEventListener("click", () => {
                // Close other details that are not targetDetail
                details.forEach((detail) => {
                    if (detail !== targetDetail) {
                        detail.removeAttribute("open");
                    }
                });
            });
        });
    }

    /* =========================================
       6. COMPARISON SECTION (Fit Check)
       ========================================= */
    function initFitAnimations() {
        const sections = document.querySelectorAll('.vo-fit-section');

        sections.forEach(section => {
            if (section.dataset.initialized === 'true') return;
            section.dataset.initialized = 'true';

            // Desktop Animation: Stagger In
            const fitCards = section.querySelectorAll('.vo-fit-card');
            if (window.innerWidth > 1024) {
                gsap.from(fitCards, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 75%"
                    },
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out"
                });
            }

            // Mobile Interaction (Original Logic Ported)
            const fitTrack = section.querySelector('.vo-fit-track');
            const fitFeatured = section.querySelector('.vo-fit-card.featured');
            const prevBtn = section.querySelector('.vo-fit-arrow.prev');
            const nextBtn = section.querySelector('.vo-fit-arrow.next');

            if (fitTrack && fitFeatured) {
                // Auto Scroll to Featured on Mobile
                if (window.innerWidth <= 768) {
                    // Small delay to ensure layout is ready
                    setTimeout(() => {
                        fitFeatured.scrollIntoView({
                            behavior: 'auto',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }, 500);
                }

                if (prevBtn && nextBtn) {
                    prevBtn.addEventListener('click', () => {
                        fitTrack.scrollBy({ left: -300, behavior: 'smooth' });
                    });
                    nextBtn.addEventListener('click', () => {
                        fitTrack.scrollBy({ left: 300, behavior: 'smooth' });
                    });
                }

                // Intersection Observer for highlighting center card
                if (window.innerWidth <= 1024) {
                    const observerOptions = {
                        root: fitTrack,
                        rootMargin: '0px -30% 0px -30%', // Highlight effectively when center
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
            }
        });
    }


    /* =========================================
       7. HOW IT WORKS (Scrollytelling)
       ========================================= */
    function initHowAnimations() {
        const wrappers = document.querySelectorAll('.how-scroll-wrapper');

        wrappers.forEach((wrapper, i) => {
            // Unique ID for triggers
            const id = `how-${i}`;

            if (wrapper.dataset.initialized === 'true') return;
            wrapper.dataset.initialized = 'true';

            const progress = wrapper.querySelector('.how-timeline-progress');
            const dots = Array.from(wrapper.querySelectorAll('.how-dot'));
            const cards = Array.from(wrapper.querySelectorAll('.how-card'));

            // 1. Initial State
            // Set all to inactive first
            gsap.set(cards, { opacity: 0.5, y: 30 });
            gsap.set(dots, { scale: 1, backgroundColor: "#ccc" });

            // IMMEDIATELY set the first one to active so it's visible before scrolling
            if (cards[0]) gsap.set(cards[0], { opacity: 1, y: 0 });
            if (dots[0]) gsap.set(dots[0], { scale: 1.3, backgroundColor: "#1B4B43" });
            if (cards[0]) cards[0].classList.add('active');
            if (dots[0]) dots[0].classList.add('active');

            // 2. Master Timeline (Pinned & Scrubs)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.1,
                    pin: ".how-sticky-content",
                    anticipatePin: 1
                }
            });

            // 3. Progress Bar Animation
            if (window.innerWidth >= 900) {
                // Desktop: Horizontal Fill
                tl.to(progress, { width: "100%", ease: "none" });
            } else {
                // Mobile: Vertical Fill
                tl.to(progress, { height: "100%", ease: "none" });
            }

            // 4. Step Activation Logic
            tl.eventCallback("onUpdate", () => {
                const prog = tl.progress();
                let activeIndex = Math.floor(prog / 0.2);
                if (activeIndex > 4) activeIndex = 4;
                if (activeIndex < 0) activeIndex = 0;

                dots.forEach((dot, index) => {
                    const card = cards[index];

                    if (index === activeIndex) {
                        // ACTIVE
                        if (!dot.classList.contains('active')) {
                            dot.classList.add('active');
                            gsap.to(dot, { scale: 1.3, backgroundColor: "#1B4B43", duration: 0.3, overwrite: true });
                            if (card) {
                                card.classList.add('active');
                                gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)", overwrite: true });
                            }
                        }
                    } else {
                        // INACTIVE
                        if (dot.classList.contains('active')) {
                            dot.classList.remove('active');
                            gsap.to(dot, { scale: 1, backgroundColor: "#ccc", duration: 0.3, overwrite: true });
                            if (card) {
                                card.classList.remove('active');
                                gsap.to(card, { opacity: 0.5, y: 30, duration: 0.5, overwrite: true });
                            }
                        }
                    }
                });
            });
        });
    }

    // Call Component inits
    initFitAnimations();
    initHowAnimations();

})();

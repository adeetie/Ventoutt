/**
 * pages.js - Common Component JavaScript
 * Handles functionality for components shared across multiple pages:
 * - Testimonials (marquee carousel)
 * - Caring & Expert Members (therapist cards)
 * - How It Works (scrollytelling)
 * - Blogs (horizontal scroll)
 * - FAQ (accordion)
 * - Specializations (horizontal scroll)
 * - Partners (logo carousel)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    console.log('[Pages.js] Loaded - Common Components');

    /* =========================================
       1. Testimonials Marquee (3D Infinite Carousel)
       ========================================= */
    /* =========================================
       1. Testimonials Marquee (3D Infinite Carousel)
       ========================================= */
    const initTestimonials = () => {
        const marquees = document.querySelectorAll('.marquee');
        marquees.forEach(marquee => {
            if (marquee.dataset.initialized === 'true') return;
            marquee.dataset.initialized = 'true';

            const marqueeInner = marquee.querySelector('.marquee-inner');
            if (!marqueeInner) return;

            // Clone original content for infinite loop (prevent double cloning if already cloned in HTML)
            const originals = Array.from(marqueeInner.querySelectorAll('.vo-testimonial-card:not(.clone)'));
            if (originals.length === 0) return;

            // Clear clones if any (to avoid compounding on hot reload or multiple calls)
            marqueeInner.querySelectorAll('.clone').forEach(c => c.remove());

            originals.forEach(item => {
                const clone = item.cloneNode(true);
                clone.classList.add('clone');
                clone.setAttribute('aria-hidden', 'true');
                marqueeInner.appendChild(clone);
            });

            // Animation state
            let currentTx = 0;
            const speed = 0.6;
            let isPaused = false;
            let animationId;

            const perspective = 1000;

            const updateCards3D = () => {
                const viewportCenter = marquee.offsetWidth / 2;
                const allCards = marqueeInner.children;

                Array.from(allCards).forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + rect.width / 2;
                    const dist = cardCenter - viewportCenter;
                    const norm = dist / viewportCenter;

                    const rotateY = norm * -30;
                    const z = (1 - Math.abs(norm)) * -60;

                    card.style.transform = `perspective(${perspective}px) rotateY(${rotateY}deg) translateZ(${z}px)`;
                    card.style.zIndex = Math.round(100 - Math.abs(norm) * 50); // Improved Z-index logic
                });
            };

            const calculateScrollWidth = () => {
                if (marqueeInner.scrollWidth === 0) return 0;
                // Width of the original items only
                const itemWidth = originals[0].offsetWidth + parseInt(window.getComputedStyle(marqueeInner).gap || 0);
                return itemWidth * originals.length;
            };

            let scrollLimit = calculateScrollWidth();

            window.addEventListener('resize', () => {
                scrollLimit = calculateScrollWidth();
            });

            const animate = () => {
                if (!isPaused) {
                    currentTx -= speed;
                    if (Math.abs(currentTx) >= scrollLimit) {
                        currentTx = 0;
                    }
                    marqueeInner.style.transform = `translate3d(${currentTx}px, 0, 0)`;
                    updateCards3D();
                }
                animationId = requestAnimationFrame(animate);
            };

            animationId = requestAnimationFrame(animate);

            marquee.addEventListener('mouseenter', () => isPaused = true);
            marquee.addEventListener('mouseleave', () => isPaused = false);

            // Manual resume/pause toggle
            marquee.addEventListener('click', (e) => {
                if (e.target.tagName !== 'IFRAME') {
                    isPaused = !isPaused;
                }
            });

            // Iframe/Video Support
            const iframes = marqueeInner.querySelectorAll('iframe');
            iframes.forEach((iframe, index) => {
                iframe.id = `vo-yt-frame-${Date.now()}-${index}`;
                let src = iframe.src;
                if (src.includes('/shorts/')) src = src.replace('/shorts/', '/embed/');
                const u = new URL(src);
                u.searchParams.set('enablejsapi', '1');
                if (iframe.src !== u.toString()) iframe.src = u.toString();
            });
        });
        console.log('[Pages.js] Testimonials marquees initialized');
    };

    /* =========================================
       2. Caring & Expert Members (Therapist Cards)
       ========================================= */
    const initExpertCards = () => {
        // Mobile swipe functionality is handled by vo-therapist-swipe.js
        // Desktop hover effects are CSS-based
        // This function can handle any generic expert card setup if needed
        const expertSections = document.querySelectorAll('.vo-experts-v2-section');
        expertSections.forEach(section => {
            if (section.dataset.initialized === 'true') return;
            section.dataset.initialized = 'true';
            console.log('[Pages.js] Expert cards section initialized');
        });
    };

    /* =========================================
       3. How It Works (Scrollytelling Animation)
       ========================================= */
    const initHowItWorks = () => {
        const wrappers = document.querySelectorAll('.how-scroll-wrapper');

        wrappers.forEach(howWrapper => {
            if (howWrapper.dataset.initialized === 'true') return;
            howWrapper.dataset.initialized = 'true';

            const howProgress = howWrapper.querySelector('.how-timeline-progress');
            const howDots = howWrapper.querySelectorAll('.how-dot');
            const howCards = howWrapper.querySelectorAll('.how-card');

            if (!howProgress) return;

            const handleScroll = () => {
                const rect = howWrapper.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Calculate progress
                const totalScrollableDistance = howWrapper.offsetHeight - windowHeight;
                let scrolled = -rect.top;

                // Normalize to 0-1
                let progress = scrolled / totalScrollableDistance;
                progress = Math.max(0, Math.min(1, progress));

                // Update progress bar
                const percent = progress * 100;

                if (window.innerWidth >= 900) {
                    howProgress.style.width = `${percent}%`;
                    howProgress.style.height = '100%';
                } else {
                    howProgress.style.height = `${percent}%`;
                    howProgress.style.width = '100%';
                }

                // Activate steps
                const totalSteps = howCards.length;
                const stepSize = 1 / totalSteps;

                howDots.forEach((dot, index) => {
                    const threshold = stepSize * index;
                    if (progress > threshold + 0.05 || (index === 0 && progress >= 0)) {
                        dot.classList.add('active');
                        if (howCards[index]) howCards[index].classList.add('active');
                    } else {
                        dot.classList.remove('active');
                        if (howCards[index]) howCards[index].classList.remove('active');
                    }
                });
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        });
        console.log('[Pages.js] How It Works scrollytelling initialized');
    };

    /* =========================================
       4. Blogs Horizontal Scroll
       ========================================= */
    window.scrollBlogs = (direction, btn) => {
        const section = btn ? btn.closest('.vo-blogs-section') : document.querySelector('.vo-blogs-section');
        if (!section) return;
        const grid = section.querySelector('.vo-blogs-grid');
        if (!grid) return;
        const scrollAmount = grid.offsetWidth * 0.9;
        grid.scrollBy({
            left: direction === 'next' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    };

    /* =========================================
       5. FAQ Accordion
       ========================================= */
    const initFAQ = () => {
        const faqSections = document.querySelectorAll('.vo-faq-section');

        faqSections.forEach(section => {
            if (section.dataset.initialized === 'true') return;
            section.dataset.initialized = 'true';

            const faqItems = section.querySelectorAll('.vo-faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.vo-faq-question') || item.querySelector('summary');
                if (!question) return;

                question.addEventListener('click', (e) => {
                    // If it's a details element, standard behavior applies unless we want one-at-a-time
                    const isDetails = item.tagName === 'DETAILS';
                    if (!isDetails) {
                        const isActive = item.classList.contains('active');
                        faqItems.forEach(faq => faq.classList.remove('active'));
                        if (!isActive) item.classList.add('active');
                    } else {
                        // For details, close others
                        if (!item.hasAttribute('open')) {
                            faqItems.forEach(faq => {
                                if (faq !== item) faq.removeAttribute('open');
                            });
                        }
                    }
                });
            });
        });
        console.log('[Pages.js] FAQ sections initialized');
    };

    /* =========================================
       6. Specializations Horizontal Scroll
       ========================================= */
    window.scrollSpecs = (direction, btn) => {
        const section = btn ? btn.closest('.vo-specs-section') : document.querySelector('.vo-specs-section');
        if (!section) return;
        const grid = section.querySelector('.vo-specs-grid');
        if (!grid) return;
        const scrollAmount = grid.offsetWidth * 0.9;
        grid.scrollBy({
            left: direction === 'next' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    };

    /* =========================================
       7. Partners Logo Carousel
       ========================================= */
    const initPartnersCarousel = () => {
        const tracks = document.querySelectorAll('.logo-track, #vtLogoTrack, #voPartnersTrackV3');

        tracks.forEach(track => {
            if (track.dataset.init === 'true') return;
            track.dataset.init = 'true';

            const originals = Array.from(track.children);
            if (originals.length === 0) return;

            const originalWidth = track.scrollWidth;
            const windowWidth = window.innerWidth;

            // Calculate sets needed to cover screen
            const setsNeeded = Math.ceil(windowWidth / (originalWidth || 1000)) + 2;

            const fragment = document.createDocumentFragment();
            for (let i = 0; i < setsNeeded * 2; i++) { // Duplicate enough times
                originals.forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.setAttribute('aria-hidden', 'true');
                    fragment.appendChild(clone);
                });
            }

            track.appendChild(fragment);

            // Calculate animation duration
            const totalWidth = track.scrollWidth;
            const isMobile = windowWidth < 768;
            const velocity = isMobile ? 120 : 80;
            const duration = (totalWidth / 3) / velocity; // Base duration on segment

            track.style.animationDuration = `${duration}s`;
        });
        console.log('[Pages.js] Partners carousels initialized');
    };

    /* =========================================
       8. Expanding Gallery (Mobile Interaction)
       ========================================= */
    const initExpandingGallery = () => {
        const gallerySections = document.querySelectorAll('.vo-help-section, .vo-expanding-gallery-section');

        gallerySections.forEach(section => {
            if (section.dataset.initialized === 'true') return;
            section.dataset.initialized = 'true';

            const galleryCards = section.querySelectorAll('.vo-gallery-card');
            if (galleryCards.length > 0 && window.innerWidth <= 900) {
                galleryCards.forEach(card => {
                    const handleExpand = (e) => {
                        if (e.target.classList.contains('vo-gallery-link')) return;

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
            }
        });
        console.log('[Pages.js] Expanding galleries initialized');
    };

    /* =========================================
       9. Stats Counter Animation (Infinite Odometer)
       ========================================= */
    const initStatsCounter = () => {
        const odometerElements = document.querySelectorAll('[data-odometer]');

        if (odometerElements.length > 0) {
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
            console.log('[Pages.js] Stats counter initialized');
        }
    };

    /* =========================================
       10. Venting Banner Slideshow
       ========================================= */
    const initVentingBanner = () => {
        const banners = document.querySelectorAll('.venting-banner-figma');

        banners.forEach(banner => {
            if (banner.dataset.initialized === 'true') return;
            banner.dataset.initialized = 'true';

            const figmaSlides = banner.querySelectorAll('.blob-slide');
            if (figmaSlides.length > 0) {
                let cur = 0;
                setInterval(() => {
                    figmaSlides[cur].classList.remove('active');
                    cur = (cur + 1) % figmaSlides.length;
                    figmaSlides[cur].classList.add('active');
                }, 4000);
            }
        });
        console.log('[Pages.js] Venting banners initialized');
    };

    /* =========================================
       11. Find Your Right Fit Interaction
       ========================================= */
    const initFitInteraction = () => {
        const sections = document.querySelectorAll('.vo-fit-section');

        sections.forEach(section => {
            if (section.dataset.initialized === 'true') return;
            section.dataset.initialized = 'true';

            const fitTrack = section.querySelector('.vo-fit-track');
            const fitFeatured = section.querySelector('.vo-fit-card.featured');
            const prevBtn = section.querySelector('.vo-fit-arrow.prev');
            const nextBtn = section.querySelector('.vo-fit-arrow.next');

            if (fitTrack && fitFeatured) {
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        fitFeatured.scrollIntoView({
                            behavior: 'auto',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }, 300);
                }

                if (prevBtn && nextBtn) {
                    prevBtn.addEventListener('click', () => {
                        fitTrack.scrollBy({ left: -300, behavior: 'smooth' });
                    });
                    nextBtn.addEventListener('click', () => {
                        fitTrack.scrollBy({ left: 300, behavior: 'smooth' });
                    });
                }

                if (window.innerWidth <= 1024) {
                    const fitCards = section.querySelectorAll('.vo-fit-card');
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
            }
        });
        console.log('[Pages.js] Fit interactions initialized');
    };

    // Initialize all common components
    initTestimonials();
    initExpertCards();
    initHowItWorks();
    initFAQ();
    initPartnersCarousel();
    initExpandingGallery();
    initStatsCounter();
    initVentingBanner();
    initFitInteraction();

    /* =========================================
       12. Navbar Dropdown Toggles (Migrated)
       ========================================= */
    const initDropdowns = () => {
        const navSplitToggles = document.querySelectorAll('.nav-split-toggle');
        navSplitToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = toggle.closest('.nav-dropdown');
                if (dropdown) dropdown.classList.toggle('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    };
    initDropdowns();
});


/* =========================================
   Shared Functions (Blogs, Specs, Challenges)
   ========================================= */

// Horizontal scroll functions for blogs and specializations
function scrollBlogs(direction) {
    const grid = document.querySelector('.vo-blogs-grid');
    if (!grid) return;
    const scrollAmount = grid.offsetWidth * 0.9;
    grid.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
    });
}

function scrollSpecs(direction) {
    const grid = document.querySelector('.vo-specs-grid');
    if (!grid) return;
    const scrollAmount = grid.offsetWidth * 0.9;
    grid.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
    });
}

// Common Challenges Toggle
function toggleVoChallengesList() {
    const expandedList = document.querySelector('.vo-challenges-expanded');
    const toggleBtnText = document.querySelector('#voToggleText');
    const toggleBtnIcon = document.querySelector('#voToggleChallenges .chevron-right');

    if (expandedList.style.display === 'none') {
        expandedList.style.display = 'block';
        toggleBtnText.textContent = 'See Less';
        if (toggleBtnIcon) toggleBtnIcon.style.transform = 'rotate(180deg)';
    } else {
        expandedList.style.display = 'none';
        toggleBtnText.textContent = 'See More';
        if (toggleBtnIcon) toggleBtnIcon.style.transform = 'rotate(0deg)';
    }
}


/* =========================================
   About Us Page Scripts
   ========================================= */

// Infinite Carousel Logic
function initInfiniteCarousel() {
    const tracks = document.querySelectorAll('.carousel-track, #carouselTrack');
    tracks.forEach(track => {
        if (track.dataset.initialized === 'true') return;
        track.dataset.initialized = 'true';
        // Clone content twice to ensure seamless scrolling
        const content = track.innerHTML;
        track.innerHTML = content + content + content;
    });
}

// Testimonial Auto-Slider
function initTestimonialSlider() {
    const sections = document.querySelectorAll('.testimonial-slider-section');

    sections.forEach(section => {
        if (section.dataset.initialized === 'true') return;
        section.dataset.initialized = 'true';

        const slides = section.querySelectorAll('.testimonial-slide');
        let currentSlide = 0;

        if (slides.length > 0) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 5000);
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initInfiniteCarousel();
    initTestimonialSlider();
    // Therapy-specific initializations
    initTherapyHeroSlideshow();
    initExpertPointersCarousel();
    initWhyLoveScrollytelling();
});

/* =========================================
   8. Services 'Why Choose Us' Carousel
   ========================================= */
window.scrollServices = (direction, btn) => {
    const section = btn ? btn.closest('.vo-services-hero, .services-grid-container') : document.querySelector('.services-grid-container');
    const grid = section && section.classList.contains('services-grid-container') ? section : (section ? section.querySelector('.services-grid-container') : document.querySelector('.services-grid-container'));
    if (!grid) return;
    const scrollAmount = 340; // Approx card width + gap
    grid.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
    });
};

/* =========================================
   9. Therapy Page Functions
   ========================================= */

// Slideshow for venting banner (blob slides)
function initTherapyHeroSlideshow() {
    const banners = document.querySelectorAll('.venting-banner-figma');

    banners.forEach(banner => {
        if (banner.dataset.initialized === 'true') return;
        banner.dataset.initialized = 'true';

        const figmaSlides = banner.querySelectorAll('.blob-slide');
        if (figmaSlides.length > 0) {
            let cur = 0;
            setInterval(() => {
                figmaSlides[cur].classList.remove('active');
                cur = (cur + 1) % figmaSlides.length;
                figmaSlides[cur].classList.add('active');
            }, 4000);
        }
    });
}

// Expert Pointers Carousel Animation
function initExpertPointersCarousel() {
    const tracks = document.querySelectorAll('.expert-pointers-track, #expertPointersTrack');

    tracks.forEach(track => {
        if (track.dataset.initialized === 'true') return;
        track.dataset.initialized = 'true';

        // Clone items for infinite loop
        const originals = Array.from(track.children);
        if (originals.length === 0) return;

        // Clone set 1, 2, 3 to ensure enough width for infinite scroll
        originals.forEach(item => track.appendChild(item.cloneNode(true)));
        originals.forEach(item => track.appendChild(item.cloneNode(true)));
        originals.forEach(item => track.appendChild(item.cloneNode(true)));

        // Calculate widths
        const gap = 20;
        const itemWidth = originals[0].getBoundingClientRect().width || 280;
        const totalItemWidth = itemWidth + gap;

        // The distance to scroll is the width of the ORIGINAL set
        const scrollDistance = totalItemWidth * originals.length;

        // Set CSS variable and Animation
        track.style.setProperty('--scroll-distance', `${scrollDistance}px`);

        // Duration: 40px per second speed
        const duration = scrollDistance / 40;

        track.style.animation = `pointer-scroll ${duration}s linear infinite`;

        // Pause on hover
        track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    });
}

// Why People Love Ventoutt - Scroll-Triggered Behavior
function initWhyLoveScrollytelling() {
    const sections = document.querySelectorAll('.why-love-section');

    sections.forEach(section => {
        if (section.dataset.scrollytellingInitialized === 'true') return;
        section.dataset.scrollytellingInitialized = 'true';

        let currentIndex = -1;

        const handleScroll = () => {
            const points = section.querySelectorAll('.why-love-point');
            const photos = section.querySelectorAll('.why-love-photo');

            if (points.length === 0) return;

            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate scroll progress within the section
            const scrollDistance = rect.height - viewportHeight;
            let scrolled = -rect.top;

            // Normalize to 0-1
            let progress = scrolled / (scrollDistance || 1);
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // Map to index
            const totalPoints = points.length;
            const index = Math.min(Math.floor(progress * totalPoints), totalPoints - 1);

            // Only update if index changed
            if (index !== currentIndex) {
                currentIndex = index;

                points.forEach((point, i) => {
                    point.classList.toggle('active', i === index);
                });

                photos.forEach((photo, i) => {
                    photo.classList.toggle('active', i === index);
                });
            }
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        handleScroll(); // Run once on load
    });
}

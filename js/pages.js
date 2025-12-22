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
    const initTestimonials = () => {
        const marquee = document.querySelector('.marquee');
        const marqueeInner = document.querySelector('.marquee-inner');

        if (!marquee || !marqueeInner) return;

        // Clone original content for infinite loop
        const originals = Array.from(marqueeInner.children);
        if (originals.length === 0) return;

        originals.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            marqueeInner.appendChild(clone);
        });

        // Animation state
        let currentTx = 0;
        const speed = 0.6; // Slower, smoother speed
        let isPaused = false;
        let animationId;

        // 3D perspective settings
        const perspective = 1000;

        const updateCards3D = () => {
            const viewportCenter = marquee.offsetWidth / 2;
            const allCards = marqueeInner.children;

            Array.from(allCards).forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const dist = cardCenter - viewportCenter;

                // Normalize distance
                const norm = dist / viewportCenter;

                // Concave effect
                const rotateY = norm * -30;
                const z = (1 - Math.abs(norm)) * -60;

                card.style.transform = `perspective(${perspective}px) rotateY(${rotateY}deg) translateZ(${z}px)`;
                card.style.zIndex = Math.round(Math.abs(norm) * 100) + 10;
            });
        };

        const calculateScrollWidth = () => {
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

                // Infinite loop reset
                if (Math.abs(currentTx) >= scrollLimit) {
                    currentTx = 0;
                }

                marqueeInner.style.transform = `translate3d(${currentTx}px, 0, 0)`;
                updateCards3D();
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        // Pause on hover
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
                let src = iframe.src;
                if (src.includes('/shorts/')) {
                    src = src.replace('/shorts/', '/embed/');
                }
                const u = new URL(src);
                u.searchParams.set('enablejsapi', '1');
                u.searchParams.set('rel', '0');
                u.searchParams.set('modestbranding', '1');

                if (iframe.src !== u.toString()) {
                    iframe.src = u.toString();
                }
            }
        });

        // Inject YT API listeners
        const iframes = marqueeInner.querySelectorAll('iframe');
        const injectYTEvents = () => {
            iframes.forEach(ifr => {
                try {
                    const u = new URL(ifr.src);
                    if (!u.searchParams.has('enablejsapi')) {
                        u.searchParams.set('enablejsapi', '1');
                        ifr.src = u.toString();
                    }
                    if (ifr.contentWindow) {
                        ifr.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: ifr.id }), '*');
                        ifr.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'], id: ifr.id }), '*');
                    }
                } catch (e) { }
            });
        };
        setTimeout(injectYTEvents, 2000);

        // Listen for YouTube API messages
        window.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.event === 'onStateChange') {
                    if (data.info === 1) { // Playing
                        isPaused = true;
                    }
                }
            } catch (e) { }
        });

        // Manual resume/pause toggle
        marquee.addEventListener('click', (e) => {
            if (e.target.tagName !== 'IFRAME') {
                isPaused = !isPaused;
            }
        });

        console.log('[Pages.js] Testimonials marquee initialized with video support');
    };

    /* =========================================
       2. Caring & Expert Members (Therapist Cards)
       ========================================= */
    const initExpertCards = () => {
        // Mobile swipe functionality is handled by vo-therapist-swipe.js
        // Desktop hover effects are CSS-based
        // This function can add any additional interactivity needed

        const expertsSection = document.querySelector('.vo-experts-v2-section');
        if (!expertsSection) return;

        console.log('[Pages.js] Expert cards section found');
        // Add any specific JavaScript needed for expert cards
    };

    /* =========================================
       3. How It Works (Scrollytelling Animation)
       ========================================= */
    const initHowItWorks = () => {
        const howWrapper = document.querySelector('.how-scroll-wrapper');
        const howProgress = document.querySelector('.how-timeline-progress');
        const howDots = document.querySelectorAll('.how-dot');
        const howCards = document.querySelectorAll('.how-card');

        if (!howWrapper || !howProgress) return;

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
            const stepSize = 1 / 5;

            howDots.forEach((dot, index) => {
                const threshold = stepSize * index;
                if (progress > threshold + 0.05 || (index === 0 && progress >= 0)) {
                    dot.classList.add('active');
                    howCards[index].classList.add('active');
                } else {
                    dot.classList.remove('active');
                    howCards[index].classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial state

        console.log('[Pages.js] How It Works scrollytelling initialized');
    };

    /* =========================================
       4. Blogs Horizontal Scroll
       ========================================= */
    window.scrollBlogs = (direction) => {
        const grid = document.querySelector('.vo-blogs-grid');
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
        const faqItems = document.querySelectorAll('.vo-faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.vo-faq-question');
            if (!question) return;

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

        console.log('[Pages.js] FAQ accordion initialized');
    };

    /* =========================================
       6. Specializations Horizontal Scroll
       ========================================= */
    window.scrollSpecs = (direction) => {
        const grid = document.querySelector('.vo-specs-grid');
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
        const track = document.getElementById('voPartnersTrackV3');
        if (!track) return;

        // Prevent double initialization
        if (track.dataset.init === 'true') return;
        track.dataset.init = 'true';

        const originals = Array.from(track.children);
        const originalWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;

        // Calculate sets needed to cover screen
        const setsNeeded = Math.ceil(windowWidth / originalWidth) + 2;

        const fragment = document.createDocumentFragment();

        // Build base strip
        for (let i = 0; i < setsNeeded; i++) {
            originals.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                fragment.appendChild(clone);
            });
        }

        track.innerHTML = '';
        track.appendChild(fragment);

        // Duplicate for CSS loop
        const baseChildren = Array.from(track.children);
        baseChildren.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        // Calculate animation duration
        const totalWidth = track.scrollWidth;
        const widthToTravel = totalWidth / 2;
        const isMobile = windowWidth < 768;
        const velocity = isMobile ? 150 : 100;
        const duration = widthToTravel / velocity;

        track.style.animationDuration = `${duration}s`;

        console.log(`[Pages.js] Partners carousel initialized (${duration.toFixed(2)}s duration)`);
    };

    /* =========================================
       8. Expanding Gallery (Mobile Interaction)
       ========================================= */
    const initExpandingGallery = () => {
        const galleryCards = document.querySelectorAll('.vo-gallery-card');
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
            console.log('[Pages.js] Expanding gallery initialized');
        }
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
        const figmaSlides = document.querySelectorAll('.venting-banner-figma .blob-slide');
        if (figmaSlides.length > 0) {
            let cur = 0;
            setInterval(() => {
                figmaSlides[cur].classList.remove('active');
                cur = (cur + 1) % figmaSlides.length;
                figmaSlides[cur].classList.add('active');
            }, 4000);
            console.log('[Pages.js] Venting banner slideshow initialized');
        }
    };

    /* =========================================
       11. Find Your Right Fit Interaction
       ========================================= */
    const initFitInteraction = () => {
        const fitTrack = document.getElementById('voFitTrack');
        const fitFeatured = document.getElementById('fitFeatured');
        const prevBtn = document.querySelector('.vo-fit-arrow.prev');
        const nextBtn = document.querySelector('.vo-fit-arrow.next');

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
            console.log('[Pages.js] Fit interaction initialized');
        }
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
    const track = document.getElementById('carouselTrack');
    if (track) {
        // Clone content twice to ensure seamless scrolling
        const content = track.innerHTML;
        track.innerHTML = content + content + content;
    }
}

// Testimonial Auto-Slider
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        setInterval(() => {
            // Remove active from current
            slides[currentSlide].classList.remove('active');
            // Next slide
            currentSlide = (currentSlide + 1) % slides.length;
            // Add active to next
            slides[currentSlide].classList.add('active');
        }, 5000); // 5 seconds
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initInfiniteCarousel();
    initTestimonialSlider();
});

/* ========== VentOutt Homepage Interactions ========== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('VentOutt Home JS Loaded');

    // --- Hero Slideshow ---
    const slides = document.querySelectorAll('.vo-hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 3000; // 3 seconds

        setInterval(() => {
            // Remove active from current
            slides[currentSlide].classList.remove('active');

            // Increment
            currentSlide = (currentSlide + 1) % slides.length;

            // Add active to new
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }

    // --- Dynamic Greeting (Language Switcher) ---
    // --- Dynamic Greeting (Typewriter Effect) ---
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

        let msgIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100; // Typing speed

        function type() {
            const currentText = hellos[msgIndex];

            if (isDeleting) {
                // Delete char
                greetingEl.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Faster deleting
            } else {
                // Add char
                greetingEl.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150; // Normal typing
            }

            if (!isDeleting && charIndex === currentText.length) {
                // Finished typing, pause before deleting
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting, move to next word
                isDeleting = false;
                msgIndex = (msgIndex + 1) % hellos.length;
                typeSpeed = 500; // Pause before typing next
            }

            setTimeout(type, typeSpeed);
        }

        // Start the typewriter loop
        // Ensure opacity is 1 and remove transition from previous fade logic
        greetingEl.style.opacity = 1;
        greetingEl.style.transition = 'none';
        type();
    }
    // --- Expanding Gallery (Mobile Interaction) ---
    const galleryCards = document.querySelectorAll('.vo-gallery-card');
    if (galleryCards.length > 0 && window.innerWidth <= 900) { // Changed to 900 to match CSS breakpoint
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
                            inline: 'center' // Align center in horizontal scroll/flex
                        });
                    }, 100);
                }
            };

            card.addEventListener('click', handleExpand);
            // Passive false for touchstart to allow e.preventDefault() if needed, 
            // but usually click is enough for this hybrid approach. 
            // Keeping it simple with click unless specific issues arise.
        });
    }
    /* =========================================
       4. Stats Counter Animation (Infinite Odometer)
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

                    // Parse initial value from HTML (e.g., "36,539")
                    let currentValue = parseFloat(element.textContent.replace(/[^0-9.]/g, '')) || 0;
                    const incrementRate = parseFloat(element.getAttribute('data-increment')) || 1;
                    const incrementPerFrame = incrementRate / 60; // Approx 60fps

                    const updateDisplay = () => {
                        currentValue += incrementPerFrame;
                        // Format with commas, keep original prefix/suffix if complex (simplified here for numbers)
                        element.textContent = Math.floor(currentValue).toLocaleString('en-US');

                        // Only animate if there's an increment
                        if (incrementRate > 0) {
                            requestAnimationFrame(updateDisplay);
                        }
                    };

                    // Only animate if there's an increment
                    if (incrementRate > 0) {
                        requestAnimationFrame(updateDisplay);
                    }
                }
            });
        }, { threshold: 0.5 });

        odometerElements.forEach(el => odometerObserver.observe(el));
    }


    /* =========================================
       15. Find Your Right Fit Interaction
       ========================================= */
    const fitTrack = document.getElementById('voFitTrack');
    const fitFeatured = document.getElementById('fitFeatured');
    const prevBtn = document.querySelector('.vo-fit-arrow.prev');
    const nextBtn = document.querySelector('.vo-fit-arrow.next');

    if (fitTrack && fitFeatured) {
        // Initial Center on Mobile
        if (window.innerWidth <= 768) {
            // Delay to ensure layout rendering/paint is complete
            setTimeout(() => {
                fitFeatured.scrollIntoView({
                    behavior: 'auto', // Instant snap
                    block: 'nearest',
                    inline: 'center'
                });
            }, 300);
        }

        // Arrow Navigation
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                fitTrack.scrollBy({
                    left: -300, // Approx card width
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

        // Dynamic Mobile Scaling (Center = Big)
        // Only run on mobile/tablet where horiz scroll exists
        if (window.innerWidth <= 1024) {
            const fitCards = document.querySelectorAll('.vo-fit-card');

            // Observer to track which card is in the center "sweet spot"
            const observerOptions = {
                root: fitTrack,
                // Shrink the detection area to the middle 40% of the container
                // This ensures only the most central card is "intersecting"
                rootMargin: '0px -30% 0px -30%',
                threshold: 0.1 // Trigger as soon as it touches the center strip
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Remove scale-active from all, add to current
                        // Note: We DO NOT touch 'featured' class so color stays permanent
                        fitCards.forEach(c => c.classList.remove('scale-active'));
                        entry.target.classList.add('scale-active');
                    }
                });
            }, observerOptions);

            fitCards.forEach(card => observer.observe(card));
        }
    }

    /* =========================================
       Partners Logo Marquee V3 (Smart Cloning)
       ========================================= */
    const initPartnersV3 = () => {
        const track = document.getElementById('voPartnersTrackV3');
        if (!track) return;

        // 0. Reset for idempotent runs ( e.g. resize )
        // We'll trust the first run for now, but resizing logic can be added if needed.
        if (track.dataset.init === 'true') return;
        track.dataset.init = 'true';

        const originals = Array.from(track.children);
        const originalWidth = track.scrollWidth; // Approx width of one set
        const windowWidth = window.innerWidth;

        // 1. Calculate how many sets we need to cover the screen width atleast twice
        // This ensures no gaps before the loop point.
        // We add +2 buffer sets just to be safe.
        const setsNeeded = Math.ceil(windowWidth / originalWidth) + 2;

        const fragment = document.createDocumentFragment();

        // 2. Build the "Base Strip" (enough to cover screen)
        for (let i = 0; i < setsNeeded; i++) {
            originals.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                fragment.appendChild(clone);
            });
        }

        // 3. Clear and append base strip
        track.innerHTML = '';
        track.appendChild(fragment);

        // 4. DUPLICATE Base Strip for CSS Loop
        // The CSS animates -50%, so we need exactly 2 identical halves.
        const baseChildren = Array.from(track.children);
        baseChildren.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        // 5. Calculate Animation Duration based on Constant Velocity
        // Target: ~150px per second on Mobile (Fast), ~100px on Desktop
        const totalWidth = track.scrollWidth;
        const widthToTravel = totalWidth / 2; // -50%

        const isMobile = windowWidth < 768;
        const velocity = isMobile ? 150 : 100; // pixels per second

        const duration = widthToTravel / velocity;

        track.style.animationDuration = `${duration}s`;

        console.log(`[VO-Partners-V3] Sets: ${setsNeeded}, Duplicated: Yes, Duration: ${duration.toFixed(2)}s`);
    };

    // Run Init
    initPartnersV3();

    /* =========================================
       How It Works - Scrollytelling Animation
       ========================================= */
    const howWrapper = document.querySelector('.how-scroll-wrapper');
    const howProgress = document.querySelector('.how-timeline-progress');
    const howDots = document.querySelectorAll('.how-dot');
    const howCards = document.querySelectorAll('.how-card');

    if (howWrapper && howProgress) {
        const handleScroll = () => {
            const rect = howWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate progress
            const totalScrollableDistance = howWrapper.offsetHeight - windowHeight;
            let scrolled = -rect.top;

            // Normalize to 0 - 1
            let progress = scrolled / totalScrollableDistance;

            // Clamp
            progress = Math.max(0, Math.min(1, progress));

            // Update Progress Bar
            const percent = progress * 100;

            if (window.innerWidth >= 900) {
                howProgress.style.width = `${percent}%`;
                howProgress.style.height = '100%';
            } else {
                howProgress.style.height = `${percent}%`;
                howProgress.style.width = '100%';
            }

            // Trigger Active States for 5 Steps
            const stepSize = 1 / 5; // 0.2

            howDots.forEach((dot, index) => {
                const threshold = stepSize * index;
                // Relaxed threshold for Step 1
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
        // Run once on load to set initial state
        handleScroll();
    }
});

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

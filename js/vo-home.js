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
       5. 3D Scroll Effect (Disabled as Hero is no longer sticky)
       ========================================= */
    /*
    const heroSection = document.querySelector('.vo-hero');
    const helpSection = document.querySelector('.vo-help-section');
    const statsSection = document.querySelector('.vo-stats-section-floating'); // Identify Stats

    if (heroSection && helpSection) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;

            // --- 1. Hero Recedes (as Services rises) ---
            if (scrollY < heroHeight) {
                const scale = 1 - (scrollY / heroHeight) * 0.1;
                const opacity = 1 - (scrollY / heroHeight) * 0.5;

                heroSection.style.transform = `scale(${Math.max(0.9, scale)})`;
                heroSection.style.opacity = Math.max(0, opacity);
            }

            // --- 2. Services Recedes (as Stats rises) ---
            // Animation triggers when Stats section is entering view
            if (statsSection) {
                const statsRect = statsSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // If Stats is coming up from the bottom (entering viewport)
                if (statsRect.top < windowHeight && statsRect.top > 0) {
                    // Calculate progress: 0 (just entering) -> 1 (fully covering)
                    // Using a shorter range for faster effect as it covers
                    const progress = 1 - (statsRect.top / windowHeight);

                    const scaleHelp = 1 - (progress * 0.1);
                    const opacityHelp = 1 - (progress * 0.5);

                    helpSection.style.transform = `scale(${Math.max(0.9, scaleHelp)})`;
                    helpSection.style.opacity = Math.max(0, opacityHelp);
                } else if (statsRect.top >= windowHeight) {
                    // Reset if scrolled back up
                    helpSection.style.transform = 'scale(1)';
                    helpSection.style.opacity = '1';
                }
            }
        }, { passive: true });
    }
    */
});

/**
 * VentOut Therapy Page JavaScript
 * Page-specific functionality for the therapy page
 */

// Slideshow for venting banner (blob slides)
document.addEventListener('DOMContentLoaded', () => {
    const figmaSlides = document.querySelectorAll('.venting-banner-figma .blob-slide');
    if (figmaSlides.length > 0) {
        let cur = 0;
        setInterval(() => {
            figmaSlides[cur].classList.remove('active');
            cur = (cur + 1) % figmaSlides.length;
            figmaSlides[cur].classList.add('active');
        }, 4000);
    }
});

// Expert Pointers Carousel Animation
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('expertPointersTrack');
    if (track) {
        // Clone items for infinite loop
        const originals = Array.from(track.children);

        // Clone set 1
        originals.forEach(item => track.appendChild(item.cloneNode(true)));
        // Clone set 2
        originals.forEach(item => track.appendChild(item.cloneNode(true)));
        // Clone set 3
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
    }
});

/**
 * Why People Love Ventoutt - Scroll-Triggered Behavior (Smooth)
 * Content changes smoothly as user scrolls through the section
 */
document.addEventListener('DOMContentLoaded', function () {
    const section = document.querySelector('.why-love-section');

    if (!section) return;

    let ticking = false;
    let currentIndex = 0;

    // Throttled scroll handler for performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Run once on load
    handleScroll();

    function handleScroll() {
        const points = section.querySelectorAll('.why-love-point');
        const photos = section.querySelectorAll('.why-love-photo');

        if (points.length === 0) return;

        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress
        const scrollDistance = rect.height - viewportHeight;
        let scrolled = -rect.top;

        // Normalize to 0-1
        let progress = scrolled / scrollDistance;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;

        // Map to index with smooth transition zones
        const totalPoints = points.length;
        const rawIndex = progress * totalPoints;
        const index = Math.min(Math.floor(rawIndex), totalPoints - 1);

        // Only update if index changed (reduces reflows)
        if (index !== currentIndex) {
            currentIndex = index;

            // Update active states with stagger
            points.forEach((point, i) => {
                if (i === index) {
                    setTimeout(() => point.classList.add('active'), 0);
                } else {
                    point.classList.remove('active');
                }
            });

            photos.forEach((photo, i) => {
                if (i === index) {
                    setTimeout(() => photo.classList.add('active'), 0);
                } else {
                    photo.classList.remove('active');
                }
            });
        }
    }
});

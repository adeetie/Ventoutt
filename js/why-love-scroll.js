/**
 * Why People Love Ventoutt - Native Sticky Implementation
 * Allows native scrolling while tracking progress to update content.
 */

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.why-love-scroll-section');

    // We bind a single scroll listener to window for performance
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });

    // Also run once on load to set initial state
    handleGlobalScroll();

    function handleGlobalScroll() {
        sections.forEach(activateSection);
    }

    function activateSection(section) {
        const container = section.querySelector('.why-love-scroll-container');
        const points = section.querySelectorAll('.why-love-point');
        const images = section.querySelectorAll('.why-love-slide-image');

        if (!container || points.length === 0) return;

        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress through the section
        // Start: When section top enters viewport (or hits top:0)
        // End: When section bottom leaves viewport

        // However, for sticky behavior:
        // Section is tall (e.g. 400vh). Container is 100vh sticky.
        // We want animation to progress as the Container is stuck.
        // Stuck start: rect.top <= 0
        // Stuck end: rect.bottom <= viewportHeight

        // Total scrollable distance where content changes
        const scrollDistance = rect.height - viewportHeight;

        // How far have we scrolled into the section?
        // If rect.top is 0, we are at start.
        // If rect.top is -scrollDistance, we are at end.
        let scrolled = -rect.top;

        // Normalize 0 to 1
        let progress = scrolled / scrollDistance;

        // Clamp
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;

        // Map progress to index (0 to N-1)
        const totalPoints = points.length;
        // Optional: Use a slightly smaller range so text doesn't swap instantly at the very end
        const index = Math.min(Math.floor(progress * totalPoints), totalPoints - 1);

        updateActive(index, points, images);
    }

    function updateActive(index, points, images) {
        points.forEach((point, i) => {
            if (i === index) {
                point.classList.add('active');
            } else {
                point.classList.remove('active');
            }
        });

        images.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
    }
});

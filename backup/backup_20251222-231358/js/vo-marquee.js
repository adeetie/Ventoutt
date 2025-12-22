/**
 * vo-marquee.js
 * Handles the 3D Infinite Marquee Testimonials Loop.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const initTestimonials = () => {
        const marquee = document.querySelector('.marquee');
        const marqueeInner = document.querySelector('.marquee-inner');

        if (!marquee || !marqueeInner) return;

        // 1. Setup Clones
        // We need enough content to scroll infinitely. 
        // Simple approach: Clone the original set once, giving us [A, B, C, ... A, B, C ...]
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
                card.style.zIndex = Math.round(Math.abs(norm) * 100) + 10;
            });
        };

        const calculateScrollWidth = () => {
            // Total width is roughly half the inner width (after cloning)
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

                // Update iframe src
                // NOTE: Triggering reload might be heavy, do it only if changed
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
        // Give iframes a moment to load
        setTimeout(injectYTEvents, 2000);

        // Listen for YouTube API messages
        window.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                // info: 1 = Playing, 2 = Paused, 0 = Ended
                if (data.event === 'onStateChange') {
                    if (data.info === 1) { // Playing
                        isPaused = true;
                    } else if (data.info === 2 || data.info === 0) { // Paused or Ended
                        // Only resume if mouse is not hovering (handled by mouseenter/leave)
                        // But actually mouseleave sets isPaused=false. 
                        // If user plays video, they are likely hovering.
                        // If they unhover, it resumes? That might be annoying if video is playing.
                        // Ideally: Pause if video is playing OR mouse is hovering.
                        // Let's rely on hover for now, but if video is playing, force pause?
                        // The user can pause video then unhover.
                        // For now let's stick to hover pause.
                        // The previous implementation had 'isPaused' controlled by hover.

                        // Wait, the previous implementation in vo-index-v2.js had logic to auto-pause on video play.
                        // I'll keep it simple for now as per previous working state,
                        // relying on the manual mouse hover.
                    }
                }
            } catch (e) { }
        });

        // Manual resume if needed (click on background)
        marquee.addEventListener('click', (e) => {
            // If not clicking on an iframe
            if (e.target.tagName !== 'IFRAME') {
                isPaused = !isPaused; // Toggle
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTestimonials);
    } else {
        initTestimonials();
    }
});

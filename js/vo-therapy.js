            document.addEventListener('DOMContentLoaded', () => {
                const track = document.getElementById('expertPointersTrack');
                if (track) {
                    // 1. Clone items for infinite loop logic (at least enough to fill screen + scroll)
                    // We have 3 items. Clone them 3 times = 12 items total, should be plenty.
                    const originals = Array.from(track.children);

                    // Clone set 1
                    originals.forEach(item => track.appendChild(item.cloneNode(true)));
                    // Clone set 2
                    originals.forEach(item => track.appendChild(item.cloneNode(true)));
                    // Clone set 3
                    originals.forEach(item => track.appendChild(item.cloneNode(true)));

                    // 2. Calculate widths
                    const gap = 20;
                    // Get one item width (assuming equal)
                    const itemWidth = originals[0].getBoundingClientRect().width || 280;
                    const totalItemWidth = itemWidth + gap;

                    // The distance to scroll is the width of the ORIGINAL set
                    const scrollDistance = totalItemWidth * originals.length;

                    // 3. Set CSS variable and Animation
                    track.style.setProperty('--scroll-distance', `${scrollDistance}px`);

                    // Duration: Let's say 40px per second speed
                    // 3 items * 300px(approx) = 900px. 900/40 = ~22s
                    const duration = scrollDistance / 40;

                    track.style.animation = `pointer-scroll ${duration}s linear infinite`;

                    // Pause on hover
                    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
                    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
                }
            });


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


            document.addEventListener('DOMContentLoaded', () => {
                const navSplitToggles = document.querySelectorAll('.nav-split-toggle');

                navSplitToggles.forEach(toggle => {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const dropdown = toggle.closest('.nav-dropdown');
                        dropdown.classList.toggle('active');
                    });
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.nav-dropdown')) {
                        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                            dropdown.classList.remove('active');
                        });
                    }
                });
            });



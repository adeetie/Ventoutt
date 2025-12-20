
        // Simple JS to duplicate items for seamless loop
        document.addEventListener('DOMContentLoaded', () => {
            const track = document.getElementById('carouselTrack');
            if (track) {
                // Clone content twice to ensure full coverage during scroll
                const content = track.innerHTML;
                track.innerHTML = content + content + content;
            }
        });
    


        // Simple Auto-Slider Logic
        document.addEventListener('DOMContentLoaded', () => {
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
    



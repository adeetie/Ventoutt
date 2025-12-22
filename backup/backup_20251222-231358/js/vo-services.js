
// ========== Venting Banner Slideshow ==========
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

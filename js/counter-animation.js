// Continuous Odometer Counter (For Stats)
(function () {
    'use strict';

    function createOdometer(element, startValue, incrementPerSecond) {
        let currentValue = startValue;
        const decimals = element.getAttribute('data-decimals') ? parseInt(element.getAttribute('data-decimals')) : 0;

        // Calculate increment per frame (60fps)
        const incrementPerFrame = incrementPerSecond / 60;

        function updateDisplay() {
            currentValue += incrementPerFrame;

            // Format and display
            if (decimals > 0) {
                element.textContent = currentValue.toFixed(decimals);
            } else {
                element.textContent = Math.floor(currentValue).toLocaleString('en-US');
            }

            // Continue indefinitely
            requestAnimationFrame(updateDisplay);
        }

        // Start the odometer
        requestAnimationFrame(updateDisplay);
    }

    function initOdometers() {
        const odometers = document.querySelectorAll('[data-odometer]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Only start once
                    if (element.dataset.started === 'true') {
                        return;
                    }

                    element.dataset.started = 'true';

                    // Get starting value from the element's current text
                    const startValue = parseFloat(element.textContent.replace(/,/g, ''));

                    // Get increment rate (default: 1 per second)
                    const incrementRate = parseFloat(element.getAttribute('data-increment')) || 1;

                    createOdometer(element, startValue, incrementRate);

                    // Unobserve after starting
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.3
        });

        odometers.forEach(odometer => {
            observer.observe(odometer);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOdometers);
    } else {
        initOdometers();
    }
})();

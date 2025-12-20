/**
 * VentOutt Header Component (Refactored)
 * Loads HTML and initializes behavior.
 */

(function () {
    'use strict';

    const COMPONENT_PATH = 'components/vo-header.html';

    function loadHeader() {
        fetch(COMPONENT_PATH)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${COMPONENT_PATH}`);
                return response.text();
            })
            .then(html => {
                // inject HTML
                const headerContainer = document.createElement('div');
                headerContainer.id = 'vo-header-component';
                headerContainer.innerHTML = html;

                const body = document.body;
                if (body.firstChild) {
                    body.insertBefore(headerContainer, body.firstChild);
                } else {
                    body.appendChild(headerContainer);
                }

                initializeHeader();
            })
            .catch(err => console.error('VO-Header Error:', err));
    }

    function initializeHeader() {
        initDesktopDropdown();
        initMobileMenu();
        initScrollBehavior();
        setHeaderTextColor();
    }

    function initDesktopDropdown() {
        const dropdown = document.querySelector('.vo-header__dropdown');
        const toggle = document.querySelector('.vo-header__dropdown-toggle');

        if (!dropdown || !toggle) return;

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Split button logic (optional, if we want the link to work separately)
        // Currently the HTML has the link separate from the toggle button
    }

    function initMobileMenu() {
        const hamburger = document.querySelector('.vo-mobile-header__hamburger');
        const overlay = document.querySelector('.vo-mobile-menu');
        const closeBtn = document.querySelector('.vo-mobile-menu__close');
        const backdrop = document.querySelector('.vo-mobile-menu__backdrop');
        const sections = document.querySelectorAll('.vo-mobile-menu__section');

        if (!hamburger || !overlay) {
            console.warn('VO-Header: Mobile menu elements missing');
            return;
        }

        const openMenu = () => {
            overlay.classList.add('active');
            backdrop?.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            overlay.classList.remove('active');
            backdrop?.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        };

        hamburger.addEventListener('click', openMenu);
        closeBtn?.addEventListener('click', closeMenu);
        backdrop?.addEventListener('click', closeMenu);

        // Sections (Accordions)
        sections.forEach(section => {
            const header = section.querySelector('.vo-mobile-menu__item-header');
            if (header) {
                header.addEventListener('click', () => {
                    section.classList.toggle('active');
                });
            }
        });

        // Close on link click
        const links = document.querySelectorAll('.vo-mobile-menu__link, .vo-mobile-menu__sublink');
        links.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 100);
            });
        });
    }

    function setHeaderTextColor() {
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Pages with light backgrounds that need black text
        const lightBackgroundPages = [
            'vo-about.html',
            'vo-services.html',
            'vo-therapy.html'
        ];

        // Check if current page has light background
        const isLightBackground = lightBackgroundPages.some(page => currentPage.includes(page));

        // Only apply black text on light background pages, keep white on index.html
        if (isLightBackground) {
            // Select all navigation links and elements that need color change
            const navLinks = document.querySelectorAll('nav a, .vo-header a, .vo-header__nav a, header a, .vo-header__dropdown-toggle');
            const navText = document.querySelectorAll('.vo-header span, .vo-header__logo, nav span');

            // Apply black color with high specificity
            navLinks.forEach(link => {
                link.style.color = '#000000';
                link.style.setProperty('color', '#000000', 'important');
            });

            navText.forEach(text => {
                text.style.color = '#000000';
                text.style.setProperty('color', '#000000', 'important');
            });

            // Also update on hover state via CSS variable if needed
            document.documentElement.style.setProperty('--header-text-color', '#000000');
        }
    }

    function initScrollBehavior() {
        const header = document.querySelector('.vo-header');
        if (!header) return;

        // If explicitly set to solid (e.g. by page), don't override transparency logic blindly
        // But here we assume default behavior: transparent at top, solid on scroll.

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'var(--vo-color-black)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.4)';
            }
        });
    }

    // Auto-load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();


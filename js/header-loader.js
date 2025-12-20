/**
 * Header Component Loader
 * Dynamically loads the header component into all pages
 * and handles navigation interactions
 */

(function () {
    'use strict';

    /**
     * Load header component HTML
     */
    function loadHeader() {
        fetch('components/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load header component');
                }
                return response.text();
            })
            .then(html => {
                // Insert header at the beginning of body
                const bodyElement = document.body;
                const headerContainer = document.createElement('div');
                headerContainer.id = 'header-component';
                headerContainer.innerHTML = html;

                // Insert as first child of body
                if (bodyElement.firstChild) {
                    bodyElement.insertBefore(headerContainer, bodyElement.firstChild);
                } else {
                    bodyElement.appendChild(headerContainer);
                }

                // Initialize header functionality after loading
                initializeHeader();
            })
            .catch(error => {
                console.error('Error loading header:', error);
            });
    }

    /**
     * Initialize header functionality
     */
    function initializeHeader() {
        initializeDesktopDropdown();
        initializeMobileMenu();
    }

    /**
     * Desktop Navigation Dropdown
     */
    function initializeDesktopDropdown() {
        const dropdown = document.querySelector('.nav-dropdown');
        const dropdownToggle = document.querySelector('.nav-split-toggle');

        if (!dropdown || !dropdownToggle) return;

        // Toggle dropdown on button click
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Prevent dropdown from closing when clicking inside
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    /**
     * Mobile Menu Functionality
     */
    function initializeMobileMenu() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
        const mobileMenuSections = document.querySelectorAll('.mobile-menu-section');

        if (!hamburgerBtn || !mobileMenuOverlay || !mobileMenuClose || !mobileMenuBackdrop) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Open mobile menu
        hamburgerBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            mobileMenuBackdrop.classList.add('active');
            hamburgerBtn.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });

        // Close mobile menu function
        function closeMobileMenu() {
            mobileMenuOverlay.classList.remove('active');
            mobileMenuBackdrop.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Close on close button
        mobileMenuClose.addEventListener('click', closeMobileMenu);

        // Close on backdrop click
        mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

        // Toggle mobile submenu sections
        mobileMenuSections.forEach(section => {
            const menuItem = section.querySelector('.mobile-menu-item');
            if (menuItem) {
                menuItem.addEventListener('click', () => {
                    section.classList.toggle('active');
                });
            }
        });

        // Close menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-submenu-item, .mobile-menu-item-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay to allow navigation
                setTimeout(closeMobileMenu, 100);
            });
        });
    }

    /**
     * Adjust header style based on scroll position (optional enhancement)
     */
    function initializeScrollBehavior() {
        const header = document.querySelector('.service-nav');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add solid background when scrolled
            if (currentScroll > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.9)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.4)';
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }

    // Optional: Initialize scroll behavior after header is loaded
    window.addEventListener('load', () => {
        setTimeout(initializeScrollBehavior, 100);
    });

})();

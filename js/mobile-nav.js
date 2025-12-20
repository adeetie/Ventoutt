// Mobile Navigation JavaScript
(function () {
    'use strict';

    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger-btn');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        const menuBackdrop = document.querySelector('.mobile-menu-backdrop');
        const closeBtn = document.querySelector('.mobile-menu-close');
        const menuItems = document.querySelectorAll('.mobile-menu-item');

        if (!hamburger || !menuOverlay) return;

        // Toggle menu
        function openMenu() {
            menuOverlay.classList.add('active');
            menuBackdrop.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuOverlay.classList.remove('active');
            menuBackdrop.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        menuBackdrop.addEventListener('click', closeMenu);

        // Accordion functionality
        menuItems.forEach(item => {
            item.addEventListener('click', function () {
                const submenu = this.nextElementSibling;

                if (submenu && submenu.classList.contains('mobile-submenu')) {
                    // Close all other submenus
                    document.querySelectorAll('.mobile-submenu.expanded').forEach(sub => {
                        if (sub !== submenu) {
                            sub.classList.remove('expanded');
                            sub.previousElementSibling.classList.remove('expanded');
                        }
                    });

                    // Toggle current submenu
                    submenu.classList.toggle('expanded');
                    this.classList.toggle('expanded');
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();

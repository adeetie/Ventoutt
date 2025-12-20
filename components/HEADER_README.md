# Header Component Documentation

## Overview
This header component system provides a consistent, reusable navigation header across all pages of the Ventoutt website. It includes both desktop and mobile navigation with responsive design.

## Files Created
1. `components/header.html` - Header HTML markup
2. `css/components/header.css` - Header styling
3. `js/header-loader.js` - JavaScript to load and initialize header

## Installation

### Step 1: Include CSS in your page
Add the header CSS in the `<head>` section of your HTML pages:

```html
<link rel="stylesheet" href="css/components/header.css">
```

### Step 2: Include JavaScript before closing `</body>` tag
Add the header loader script at the end of your HTML pages:

```html
<script src="js/header-loader.js"></script>
```

### Example HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    
    <!-- Design System CSS -->
    <link rel="stylesheet" href="css/design-system.css">
    <!-- Header Component CSS -->
    <link rel="stylesheet" href="css/components/header.css">
    <!-- Other CSS files -->
</head>
<body>
    <!-- Header will be automatically loaded here by header-loader.js -->
    
    <!-- Your page content -->
    <main>
        <!-- ... -->
    </main>

    <!-- Footer -->
    
    <!-- Scripts -->
    <script src="js/header-loader.js"></script>
    <!-- Other scripts -->
</body>
</html>
```

## Features

### Desktop Navigation
- Logo with link to home page
- Navigation links: Home, Services (dropdown), Join Us, Internships, About Us, Help, Blog
- Services dropdown with: Therapy, Venting, Coaching
- Tagline: "for young adults, by young adults"
- Transparent background that becomes solid on scroll
- Hover effects on all links

### Mobile Navigation
- Fixed top header with logo and hamburger menu
- Slide-in menu from right side
- Expandable Services section
- Direct links to all main pages
- Tagline and CTA button
- Backdrop overlay when menu is open
- Prevents body scrolling when menu is open

### Responsive Behavior
- Desktop navigation displays on screens wider than 1024px
- Mobile navigation displays on screens 1024px and below
- Smooth transitions and animations

## Customization

### Changing Logo
Update the logo URL in `components/header.html`:
```html
<img src="YOUR_LOGO_URL" alt="Ventoutt Logo" class="logo-img">
```

### Modifying Navigation Links
Edit the navigation links in `components/header.html`:
```html
<div class="service-nav-links">
    <a href="your-page.html">Your Link</a>
    <!-- ... -->
</div>
```

### Styling Adjustments
Modify CSS variables in `css/components/header.css`:
- Header height: `.service-nav { height: 100px; }`
- Background color: `.service-nav { background: rgba(0, 0, 0, 0.4); }`
- Link spacing: `.service-nav-links { gap: 10px; }`

### Header Variants

#### Solid Background (no transparency)
Add the `nav-solid` class to the header element:
```html
<header class="service-nav nav-solid">
```

#### Light Theme
The current configuration uses `nav-light` class:
```html
<header class="service-nav nav-light">
```

## JavaScript API

The header loader automatically:
1. Fetches the header HTML component
2. Injects it into the page
3. Initializes dropdown functionality
4. Sets up mobile menu interactions

### Events Handled
- Desktop dropdown toggle
- Mobile menu open/close
- Mobile submenu expansion
- Backdrop click to close menu
- Scroll-based background opacity (optional)

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- IE11 not supported (uses modern JavaScript features)

## Troubleshooting

### Header not loading
- Check that `header-loader.js` is included before the closing `</body>` tag
- Verify the path to `components/header.html` is correct
- Check browser console for errors

### Dropdown not working
- Ensure JavaScript is enabled
- Check that CSS classes match between HTML and CSS
- Verify no conflicting JavaScript on the page

### Mobile menu not sliding in
- Check for CSS conflicts with other styles
- Verify viewport meta tag is present
- Ensure JavaScript is loaded correctly

## Dependencies
- Requires CSS variables defined in `design-system.css` or `main.css`:
  - `--font-heading`
  - `--font-body`
  - `--primary-orange`
  - `--primary-orange-dark`

## Notes
- The header uses `position: absolute` for desktop to overlay hero sections
- Mobile header uses `position: fixed` to stay at top while scrolling
- Body padding is automatically added on mobile to account for fixed header
- All transitions are smooth (0.3s ease)
- The header is fully accessible with proper ARIA labels

## Future Enhancements
- [ ] Add active state for current page
- [ ] Implement sticky header on scroll
- [ ] Add search functionality
- [ ] Support for user login/profile
- [ ] Multi-language support
- [ ] Dark mode toggle

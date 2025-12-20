# Footer Component Documentation

## Overview
This footer component system provides a consistent, reusable footer across all pages of the Ventoutt website. It includes:
1. **Healing Journey CTA Section**: The large call-to-action section that appears above the footer.
2. **Global Footer**: The standard footer with logo, links, contact info, and copyright.

## Files Created
1. `components/footer.html` - HTML markup for both CTA and Footer
2. `css/components/footer.css` - Styling for both sections
3. `js/footer-loader.js` - JavaScript to load the footer

## Installation

### Step 1: Include CSS in your page
Add the footer CSS in the `<head>` section of your HTML pages:

```html
<link rel="stylesheet" href="css/components/footer.css">
```

### Step 2: Include JavaScript before closing `</body>` tag
Add the footer loader script at the end of your HTML pages:

```html
<script src="js/footer-loader.js"></script>
```

### Example HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Other stylesheets -->
    <link rel="stylesheet" href="css/components/footer.css">
</head>
<body>
    
    <!-- Your page content -->
    
    <!-- Scripts -->
    <script src="js/footer-loader.js"></script>
</body>
</html>
```

## Features

### CTA Section
- "Start Your Healing Journey Today" heading
- Description text
- "Book Free Consultation" button with icon
- Background image with gradient overlay

### Footer Section
- **Brand Column**: Logo and social media icons (Facebook, Instagram, Twitter, LinkedIn)
- **Quick Links**: Navigation to key pages
- **Therapies**: List of service offerings
- **Contact Info**: Address, Phone, Email
- **Download Buttons**: App store buttons
- **Disclaimer**: Important medical disclaimer and suicide prevention link
- **Copyright**: 2025 Copyright notice

## Customization

### Editing Content
To change any text, links, or images, edit `components/footer.html`.

### Styling Adjustments
To change colors, fonts, or layout, edit `css/components/footer.css`.
- The CTA background image is set in the `.healing-journey-cta` class.
- Colors are hardcoded to match the design but can be switched to CSS variables if needed.

## JavaScript API

The footer loader (`js/footer-loader.js`) simply fetches the HTML content and appends it to the bottom of the `<body>` tag. It does not currently require any initialization logic.

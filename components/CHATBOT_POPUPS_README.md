# Chatbot & Popups Components Documentation

## Overview
This documentation covers the Chatbot and Popup components, which are designed to engage users and provide support options.

## Files Created
1. `components/chatbot.html` - Chatbot structure
2. `css/components/chatbot.css` - Chatbot styling
3. `js/chatbot-loader.js` - Loader for chatbot (requires `js/chatbot.js` for logic)
4. `components/popups.html` - HTML for Entry Modal and Scroll Popup
5. `css/components/popups.css` - Styling for popups
6. `js/popups-loader.js` - Loader and logic for popups

## Chatbot Installation

### Step 1: Include CSS
```html
<link rel="stylesheet" href="css/components/chatbot.css">
```

### Step 2: Include Loader Script
Add this before the closing `</body>` tag.
**Note**: The loader expects `js/chatbot.js` to exist in your project structure as it loads it dynamically.

```html
<script src="js/chatbot-loader.js"></script>
```

### Features
- Floating "How can we help you?" bubble
- Expandable chat interface
- Dynamic loading to improve initial page performance

## Popups Installation

### Step 1: Include CSS
```html
<link rel="stylesheet" href="css/components/popups.css">
```

### Step 2: Include Loader Script
Add this before the closing `</body>` tag.

```html
<script src="js/popups-loader.js"></script>
```

### Features
1. **Entry Modal**: automatically appears on the Homepage (triggered by logic in `popups-loader.js`) after 1 second.
2. **Scroll Popup**: appears on any page when the user scrolls past 80% of the content.

### Logic Customization
To change triggers (e.g., disable entry modal on specific pages), edit `js/popups-loader.js`.

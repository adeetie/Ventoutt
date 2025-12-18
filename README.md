# MentalBot Chatbot Demo

## Overview
A lightweight, sticky, bottom‑right psycho‑educational chatbot built with vanilla HTML, CSS, and JavaScript. It runs entirely in the browser – no backend required for the demo.

## Project Structure
```
chatbot/
├─ index.html               # Demo landing page (loads the chatbot)
├─ demo-venting.html        # Demo page for the venting flow
├─ demo-coaching.html       # Demo page for the coaching flow
├─ demo-therapy.html        # Demo page for the therapy flow
├─ css/
│   └─ mentalbot.css        # Styles for the chatbot UI
├─ js/
│   ├─ utils.js            # Helper utilities (DOM, fetch, debounce)
│   └─ mentalbot.js        # Core chatbot implementation
├─ assets/
│   └─ icons/*.svg         # SVG icons (optional)
└─ README.md                # This file
```

## Local Demo
1. Open the **chatbot** folder in your editor.
2. Open any of the HTML files (e.g. `index.html`, `demo-venting.html`) in a browser. You can use VS Code Live Server or simply double‑click the file.
3. The chatbot pill appears in the bottom‑right corner. Click it to expand and interact.
4. Test the three flows:
   - **Vent** – click the *Vent* button.
   - **Coaching** – click the *Coaching* button (US users will see a regional notice).
   - **Therapy** – click the *Therapy* button.
5. Type a crisis keyword such as `I want to kill myself` – the bot will display a crisis message and emit a `crisisRedirect` event.

## WordPress / Elementor Integration (later)
1. Copy `css/mentalbot.css` and `js/mentalbot.js` (and `js/utils.js`) into your theme’s assets folder.
2. Enqueue the files in `functions.php`:
   ```php
   wp_enqueue_style('mentalbot', get_stylesheet_directory_uri() . '/chatbot/css/mentalbot.css');
   wp_enqueue_script('mentalbot', get_stylesheet_directory_uri() . '/chatbot/js/mentalbot.js', array(), null, true);
   ```
3. Insert the HTML snippet (the container with `id="mentalbot-shell"`) into your footer.php or an Elementor Global Footer block.
4. Override URLs for helplines, coaching, and therapy links by editing `mentalbot.js` or by providing a custom `MB.on('crisisRedirect', ...)` handler.

## Customisation
- **Styling** – edit `css/mentalbot.css` (colors, fonts, gradients).
- **Content** – modify the welcome message and button labels in `mentalbot.js`.
- **Crisis List** – update `CRISIS_KEYWORDS` in `mentalbot.js`.
- **Analytics** – hook into `MB.on(event, handler)` or rely on the built‑in `dataLayer` pushes.

## Accessibility
- Uses `aria-live="polite"` for dynamic messages.
- All interactive elements are native `<button>` elements and keyboard‑focusable.
- Contrast ratios meet WCAG AA.

## License
Free to use for demos and non‑commercial projects. For commercial use, consider adding attribution and reviewing the code for your own compliance.

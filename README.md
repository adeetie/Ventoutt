# VentOutt Website

A mental health and therapy platform featuring modular, reusable sections across multiple pages.

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| Services | `vo-services.html` |
| About | `vo-about.html` |
| Therapy | `vo-therapy.html` |
| Venting | `vo-venting.html` |
| Coaching | `vo-coaching.html` |

---

## Shared Sections

The following sections are reused across multiple pages. Some have page-specific variations.

| Section | Home | Services | About | Therapy | Venting | Coaching |
|---------|:----:|:--------:|:-----:|:-------:|:-------:|:--------:|
| Testimonials | ✓ | ✓ | | ✓ | ✓ | ✓ |
| Find Your Right Fit | ✓ | ✓ | | ✓ | ✓ | ✓ |
| How It Works | ✓ | ✓ | | ✓ | ✓ | ✓ |
| Related Blogs | ✓ | ✓ | | ✓ | ✓ | ✓ |
| Specializations & Challenges | ✓ | ✓ | | ✓* | ✓ | ✓ |
| Why People Love Ventoutt | | | | ✓ | ✓ | ✓ |
| Venting Banner | | | | ✓ | ✓ | ✓ |
| Partners & Therapists Carousel | ✓ | ✓ | | | | |
| FAQ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Meet Our Experts | ✓ | ✓ | | ✓* | ✓ | ✓ |
| Service Hero | | | | ✓ | ✓ | ✓ |

> **`*`** = Has page-specific variation

---

## Section Variations

### Experts Section

**Standard** (Home, Services, Venting, Coaching):
- Label: `MEET OUR EXPERTS`
- Title: `Caring & Expert Members`

**Therapy Page Variation**:
- Label: `VERIFIED CLINICAL PARTNERS`
- Title: `Caring & Expert Members`
- Subtitle: `Expert Care, Independently Verified`
- Includes **Expert Pointers Carousel**:
  - Clinical Diagnosis
  - Medication Management
  - Long-term Recovery

### How It Works Section

**Main Version** (5 steps):
- Eyebrow: `SIMPLE PROCESS`
- Title: `How It Works`
- Steps: Select service → Choose provider → Pick time → Pay → Session

**Vetting Process Version** (Therapy page, 3 steps):
- Eyebrow: `OUR VETTING PROCESS`
- Title: `How We Choose Our Partners`
- Steps: License Verification → Safety Check → Quality Assurance

---

## Technical Architecture

The website uses a hybrid approach: static HTML for layouts and dynamic JavaScript for shared components and interactive features.

### CSS Structure
- **`css/global.css`**: Design tokens, resets, and utility classes used sitewide.
- **`css/style.css` & `css/pages.css`**: Large consolidated stylesheets containing styles for various sections and pages (legacy/consolidated).
- **`css/index.css`**: Specific overrides and unique styles for the Homepage.
- **`css/components/`**: Modular styles for encapsulated components (Header, Footer, Chatbot, Popups).

### JavaScript Architecture
- **Dynamic Loading**: `vo-header.js` and `vo-footer.js` use the `fetch()` API to inject HTML from the `components/` directory into the DOM on page load.
- **`js/main.js`**: Initializer for unique primary page features (Hero, Dynamic Greetings, Homepage-specific carousels).
- **`js/pages.js`**: The core logic engine for shared components (Testimonials, FAQ, Partners, Scrollytelling transitions).
- **`js/vo-therapist-swipe.js`**: Dedicated logic for mobile swipe interactions in expert/therapist sections.

---

## Logic Distribution Mapping

| Feature | Primary Logic File | Mechanism |
|---------|--------------------|-----------|
| **Header/Navigation** | `js/vo-header.js` | Fetch & Auto-Init |
| **Footer** | `js/vo-footer.js` | Fetch & Auto-Init |
| **Testimonials** | `js/pages.js` | 3D CSS Transform Carousel |
| **How It Works** | `js/pages.js` | Scroll-based Progress Tracking |
| **Therapist Swipe** | `js/vo-therapist-swipe.js` | Touch Events / Gestures |
| **Hero Greeting** | `js/main.js` | Typewriter Effect Interval |
| **Chatbot** | `js/vo-chatbot.js` | DOM Manipulation & State |

---

## Project Structure

```
ventoutt-demo/
├── index.html
├── vo-about.html
├── vo-coaching.html
├── vo-services.html
├── vo-therapy.html
├── vo-venting.html
├── full-site-preview.html
├── css/
│   ├── style.css
│   ├── pages.css
│   └── ...
├── js/
│   ├── main.js
│   ├── pages.js
│   └── ...
└── images/
    └── ...
```

---

## Proprietary Notice

Proprietary software of VentOutt. All rights reserved.

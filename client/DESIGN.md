# TinyAdds – Design Specification & Style Guide

A comprehensive design system and component specification for the **TinyAdds** classified listing & marketplace web application, matching the official peach-cream warm visual identity and homepage implementation.

---

## 1. Brand & Visual Identity Overview

TinyAdds features a warm, friendly, modern classifieds and directory identity characterized by:
- **Theme Palette:** Terracotta/warm pumpkin primary accent (`#d4572b`), warm dark chocolate ink (`#3b2418`), warm peach background surfaces (`#fff1e8`), and soft divider lines (`#f5e0d3`).
- **Typography:** *Plus Jakarta Sans* across headings, body copy, badges, and controls for crisp geometric clarity.
- **Shape Language:** Rounded pill-shaped buttons (`border-radius: 999px`), rounded card containers (`1rem` to `1.5rem`), soft multi-avatar user overlays, and floating statistical counters.
- **Layout Rhythm:** Alternating clean white (`#ffffff`) and soft peach (`#fff1e8`) section backgrounds with structured grids (4-column cards, 5-column city thumbnails, brand tiles).

---

## 2. Design Tokens

### 2.1 Color Palette
```css
:root {
  /* Brand / Primary */
  --lb-primary: #d4572b;        /* Warm Terracotta / Orange */
  --lb-primary-dark: #b8441c;   /* Darker hover state */
  --lb-primary-rgb: 212, 87, 43;

  /* Typography / Neutrals */
  --lb-ink: #3b2418;           /* Deep espresso / headline color */
  --lb-text: #7a6459;          /* Neutral body muted brown/gray */
  
  /* Backgrounds & Borders */
  --lb-soft: #fff1e8;          /* Light peach section fill */
  --lb-line: #f5e0d3;          /* Warm peach border & divider line */
  --lb-white: #ffffff;         /* Pure white container surface */
  
  /* Status & Accents */
  --lb-verified: #16a34a;      /* Verified badge green */
  
  /* Framework / Bootstrap Overrides */
  --bs-body-font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --bs-body-color: var(--lb-text);
  --bs-link-color: var(--lb-primary);
  --bs-primary: var(--lb-primary);
}
```

### 2.2 Typography
- **Font Family:** `'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif`
- **Headings (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`):**
  - Font weight: `700` / `800`
  - Color: `var(--lb-ink)` (`#3b2418`)
  - Hero Title: `clamp(2.25rem, 5.2vw, 4rem)`, line-height `1.1`, weight `800`
  - Section Headings (`h2`): `clamp(1.75rem, 3.5vw, 2.5rem)`, weight `700`
  - Card Titles (`h3`): `1.05rem` to `1.15rem`, weight `700`
- **Body & Meta:**
  - Body text: `1rem` (`16px`), color `var(--lb-text)` (`#7a6459`)
  - Metadata / Tags: `0.8rem` to `0.85rem`
  - Badges: `0.875rem`, font weight `600`, text-transform `lowercase` or `uppercase` tracking

### 2.3 Radii & Elevation
- **Border Radii:**
  - Pills / Action Buttons / Badges / Search Inputs: `999px`
  - Content Cards / Image Thumbnails: `1rem` (`16px`) to `1.25rem` (`20px`)
  - Testimonial Quote Boxes: `1.5rem` (`24px`)
  - Search Bar Container: `1.25rem` (`20px`)
- **Shadows:**
  - Search Bar / Counter Floating Cards: `0 1rem 2.5rem rgba(59, 36, 24, 0.1)`
  - Card Hover Elevation: `0 1rem 2rem rgba(59, 36, 24, 0.1)` (with `-3px` translateY)
  - Pill Hover: `0 0.5rem 1.25rem rgba(212, 87, 43, 0.15)`

---

## 3. Global & Shared UI Components

### 3.1 Header & Navigation (`Header.tsx`)
- **Top Navigation Bar:**
  - Sticky/clean white background with a thin bottom border `1px solid var(--lb-line)`.
  - Left: Logo wordmark `TinyAdds` with orange `Adds` highlight.
  - Center: Nav links (`Home`, `Listings` [dropdown], `Pages` [dropdown], `Blog`, `Contact`). Hover color changes to `var(--lb-primary)`.
  - Right:
    - User account icon & Sign In button (`.lb-signin`).
    - CTA button: `+ Post Your Ad` rounded pill button (`.btn.lb-btn-primary`).
- **Responsive Drawer:** Offcanvas navigation menu for mobile screens (`< 992px`).

### 3.2 Category Marquee Bar (`CategoryMarquee.tsx`)
- An infinite horizontal marquee banner above the hero displaying top category pills.
- Pill Items: White pill with subtle border `1px solid var(--lb-line)`, circular category icon in a soft peach bubble, category name, and item counter.
- Animation: Smooth continuous linear scroll with hover-to-pause and gradient mask fade at edges.

### 3.3 Section Header & Badges
- **Badge (`.lb-badge`):** Rounded pill with translucent peach tint (`rgba(212, 87, 43, 0.1)`), bold orange text, indicating category or context (e.g., `TinyAdds`, `Search by location`, `hand-picked listing`, `testimonials`, `insights`).
- **Section Heading:** Bold dark ink title centered or left-aligned with contextual subtitle.

### 3.4 Buttons & Controls
- **Primary Button (`.btn.lb-btn-primary`):** Full pill (`border-radius: 999px`), `background-color: var(--lb-primary)`, color `#fff`, `padding: 0.7rem 1.4rem`. Darkens to `var(--lb-primary-dark)` on hover/active.
- **Soft Button / Chip (`.lb-btn-soft`, `.lb-chip`):** Soft peach background (`var(--lb-soft)`), orange text (`var(--lb-primary)`), pills for tags like `car & parts`, `clothing`, `electronics`, `Details`.
- **Outline / Dark Pill:** Active state pill in tabs (`Asia`, `USA`, `Europe`) with dark ink fill (`var(--lb-ink)`) or primary orange.

---

## 4. Homepage Section Specifications (Screen Anatomy)

Based on the official homepage layout:

### 4.1 Hero Section (`Hero.tsx`)
1. **Background:** Vertical linear gradient transitioning from warm light peach (`#ffe3d1`) down to pure white (`#fff`), with decorative subtle geometric background shapes.
2. **Top Category Marquee:** Seamless scrolling category pill bar.
3. **Left Column (Search & Intent):**
   - Brand tag: `TinyAdds` badge.
   - Title: `Get daily thing in same platform`.
   - Transaction Type Tabs: Pills for `Buy`, `Sell`, and `Rent` with active orange highlight.
   - Subtitle: `50k+ thing is waiting for you`.
   - **Unified Search Bar:** Floating white pill card containing:
     - *Find field:* "What are you looking for?"
     - *Where field:* "City or area"
     - *CTA:* `Search Now` pill button with search icon.
4. **Right Column (Hero Visual Collage):**
   - Asymmetric multi-image grid showing satisfied consumers, gadgets, and vehicles with rounded corners (`1.5rem`).
   - Floating badge: `1,500+ Daily Ads Listing` counter card with elevation.

---

### 4.2 Search by Location (`SearchByLocation.tsx`)
1. **Header:** Section title `Search by location` with right-aligned regional filter pills (`asia`, `usa`, `europe`).
2. **Location Grid:** 5-column aspect ratio (`3:4`) photo cards with rounded corners (`1.25rem`).
   - Cities featured: Tokyo, Bangkok, Dhaka, Mumbai, Hanoi.
   - Bottom gradient scrim (`linear-gradient(180deg, transparent 45%, rgba(59, 36, 24, 0.8))`).
   - Floating label: Listing counter (`230+ ads`) + City name in bold white.
   - Hover effect: `scale(1.05)` subtle image zoom.

---

### 4.3 Top-Notch Items / Hand-Picked Listings (`Listings.tsx`)
1. **Background:** Warm peach section (`.lb-soft`).
2. **Header:** Centered badge `hand-picked listing` + `Top-notch items`.
3. **Listing Cards Grid:** 4-column responsive grid (4 on desktop, 3 on tablet, 2 on mobile):
   - **Card Anatomy:**
     - Top Image: Aspect ratio `4:3`, rounded top corners.
     - Header Row: Overlapping avatar bubble(s) of seller + post timestamp (`<i class="bi bi-clock"></i> 30 min ago`).
     - Title: Clickable item name (e.g. *Apple ipod duel inspiron 15...*, *Kelooni leather sofa*, *Troma classic Bicycle*).
     - Meta Row: Verified badge with checkmark (`#16a34a`) + location (`New York`).
     - Footer: Category chip (`car & parts`, `clothing`, `electronics`) + Price/CTA (`$580`, `$470`, or `Details` button).
4. **Bottom CTA:** Centered `More Items` primary rounded pill button.

---

### 4.4 Popular Categories Showcase (`PopularCategories.tsx` & `CategoryCarousel.tsx`)
1. **Visual Backdrop:** Large decorative outline watermark text `"Category"` in background.
2. **Header:** Left-aligned text (`Popular categories` + subtitle) with carousel arrow navigation buttons.
3. **Category Cards:** Vertical cards with warm gradient backgrounds, high-resolution lifestyle photography, and category label pills:
   - *Home Appliance*
   - *Sport & Equipments*
   - *Mobile & Accessories*
   - *Pets & Animal*

---

### 4.5 Search Through Brands (`Brands.tsx`)
1. **Background:** Soft peach background (`.lb-soft`).
2. **Left Column:**
   - Badge: `brand base ads`
   - Heading: `Search through brands`
   - Review Pill Card: White floating card with 5-star customer rating graphic and text: `Digital presence — 5000+ happy reviews`.
3. **Right Column:**
   - 3x3 grid of clean white brand cards with subtle border on hover.
   - Partner brands: Acer, Casio, Canon, GoPro, Sony, Verizon, Nestlé, etc., with active item counts (e.g., `300+ ads`).

---

### 4.6 Users Feedback / Testimonials (`Feedback.tsx`)
1. **Header:** Centered badge `testimonials` + `Users feedback`.
2. **Cards (2-Column Grid):**
   - Clean white quote box (`border: 1px solid var(--lb-line)`, `border-radius: 1.5rem`).
   - Watermark step number in top-right: `01`, `02` in large outlined typography.
   - Circular author avatar (64x64px).
   - Testimonial quotation text in dark espresso font.
   - Author caption name (`Alonso D. Dowson`, `Miranda h. Halim`).

---

### 4.7 Company Blogs (`Blogs.tsx`)
1. **Background:** Soft peach background (`.lb-soft`).
2. **Header:** Centered badge `insights` + `Company blogs`.
3. **Blog Cards (3-Column Grid):**
   - Thumbnail with category pill overlay in top-left (`Travel`, `Accessories`, `Property`).
   - Author & publish date metadata (`By Alson D. • Nov 21, 2023`).
   - Blog title with link hover transition.
   - Bottom row: `Read More →` link alongside engagement metrics (comments count & view count).

---

### 4.8 Global Footer (`Footer.tsx`)
1. **Color Scheme:** Deep dark ink espresso background (`--lb-ink: #3b2418`) with crisp white/translucent typography.
2. **Top Grid:**
   - **Column 1 (Support & Inquiries):** Brand badge, email address `info@tinyadds.com`, compact contact form (Name, Email, Message, Submit).
   - **Column 2 (Essential Links):** 2-column link directory (About, Blog, Sitemap, Terms, Privacy Policy, Live Chat, FAQ, Safety guidelines).
   - **Column 3 (About TinyAdds):** Short marketplace bio and `Get It Now` white pill CTA button.
3. **Bottom Bar:**
   - Left: White logo wordmark.
   - Center: Copyright attribution (`Copyright & Design by @ThemePure - 2024`).
   - Right: Circular social media icon buttons (Facebook, X/Twitter, Instagram, LinkedIn) + Language selector dropdown (`English`, `Arabic`, `Spanish`, `Mandarin`).

---

## 5. Responsive Breakpoint Rules

| Breakpoint | Width | Grid Adjustments |
|---|---|---|
| **Desktop (XL)** | `≥ 1200px` | 4-col listings, 5-col locations, 3-col brands, full horizontal search bar |
| **Tablet (LG/MD)** | `768px – 1199px` | 3-col / 2-col listings, 3-col locations, 2-col blog cards, category strip horizontally scrollable |
| **Mobile (SM/XS)** | `< 768px` | 1 or 2-col listings, 2-col locations, stacked search fields, offcanvas mobile navigation |

---

## 6. Implementation Guidelines

1. **Tokens Over Hardcoded Values:** Always reference CSS variables (`var(--lb-primary)`, `var(--lb-ink)`, `var(--lb-soft)`, `var(--lb-line)`).
2. **Semantic Elements:** Use `<article>` for listings and blogs, `<figure>` for testimonials, `<section>` for structured content.
3. **Micro-interactions:** Keep hover transformations consistent:
   - Cards: `translateY(-3px)` + warm tinted drop shadow.
   - Photo elements: `transform: scale(1.04 - 1.05)` with `overflow: hidden`.
   - Links: transition smoothly to `var(--lb-primary)`.
4. **Accessibility:** Ensure high contrast between text and background surfaces; all form fields have associated labels (or `visually-hidden` accessible labels), and icon-only buttons include `aria-label`.

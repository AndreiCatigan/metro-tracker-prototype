# Kinetic Transit Design System & shadcn/ui Bridge

**Project:** `track-me-tro`  
**Brand Identity:** Kinetic Transit  
**UI Primitives Framework:** shadcn/ui (Tailwind CSS v4 + Radix UI Primitives)  

---

## 1. Executive Summary & Brand Principles

The **Kinetic Transit** visual identity is engineered for high legibility, energetic visual hierarchy, and instant operational recognition across mobile and tablet form factors.

The design system bridges the client's bespoke palette and geometry directly into **shadcn/ui** primitives without sacrificing any of the established brand essence:

1. **High-Contrast Wayfinding & Action Orange:** Primary actions and key alerts use high-visibility electric transit orange (`#F95700`) and deep transit rust (`#A53700`).
2. **Tactile Geometry:** Cards use generous `rounded-3xl` (1.75rem / 28px) corner curvature, while buttons and chips use pill curvature (`rounded-full` / 9999px).
3. **Layered Neutral Architecture:** Clean white card containers (`#FFFFFF`) rest upon an off-white canvas (`#F7F9FB`), bounded by subtle `#E2E8F0` slate borders and ambient elevation shadows.
4. **Legible Kinetic Typography:** Google Font `Plus Jakarta Sans` across all display headings, data labels, and micro-copy.

---

## 2. Brand Color Palette & Semantic Mapping

| Token Name | Hex Code | Kinetic Role | shadcn / CSS Variable Mapping |
| :--- | :--- | :--- | :--- |
| **Electric Transit Orange** | `#F95700` | Primary action button, active route line, key highlights | `--primary`, `--primary-electric`, `--ring` |
| **Deep Transit Rust** | `#A53700` | Primary container, active pressed states, brand headers | `--primary-container`, `--primary-hover` |
| **Deep Charcoal Slate** | `#181C24` | High-contrast bottom docks, inverted cards, dark pills | `--secondary`, `--transit-charcoal` |
| **Warm Peach-Cream** | `#FFE8D6` | Concession discount badges, alert tints, pending tags | `--accent`, `--tertiary-peach` |
| **Neutral App Canvas** | `#F7F9FB` | Global background canvas for both passenger & crew screens | `--background`, `--surface` |
| **Card / Surface Lowest** | `#FFFFFF` | Primary card background, dialog surfaces, sheet drawers | `--card`, `--popover`, `--surface-container-lowest` |
| **High-Contrast Typography** | `#191C1E` | Primary body text and heavy titles | `--foreground`, `--card-foreground`, `--on-surface` |
| **Muted Slate Body** | `#64748B` | Timestamps, secondary route notes, helper text | `--muted-foreground`, `--transit-muted` |
| **Soft Border Slate** | `#E2E8F0` | Structural card dividing lines, table boundaries | `--border`, `--input`, `--transit-border` |
| **Active Live Green** | `#10B981` | Available seats, acknowledged hails, live GPS pins | `--transit-success` |
| **Error / Alert Red** | `#BA1A1A` | Cancellation, no-show warnings, emergency stop | `--destructive` |

---

## 3. shadcn/ui CSS Variable Bridge

In `app/globals.css`, shadcn variables are mapped to preserve Kinetic Transit identity out of the box:

```css
:root {
  /* Canvas & Base Text */
  --background: #f7f9fb;
  --foreground: #191c1e;

  /* Card Containers */
  --card: #ffffff;
  --card-foreground: #191c1e;

  /* Popovers & Modals */
  --popover: #ffffff;
  --popover-foreground: #191c1e;

  /* Primary CTA: Electric Transit Orange */
  --primary: #f95700;
  --primary-foreground: #ffffff;

  /* Secondary: Deep Charcoal Slate */
  --secondary: #181c24;
  --secondary-foreground: #ffffff;

  /* Muted Surfaces & Micro-copy */
  --muted: #f2f4f6;
  --muted-foreground: #64748b;

  /* Accent: Warm Peach-Cream */
  --accent: #ffe8d6;
  --accent-foreground: #a53700;

  /* Destructive Actions */
  --destructive: #ba1a1a;
  --destructive-foreground: #ffffff;

  /* Borders & Inputs */
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #f95700;

  /* Radius base */
  --radius: 1rem;
}
```

---

## 4. Typography Scale (`Plus Jakarta Sans`)

All shadcn and custom components inherit `font-sans` (`Plus Jakarta Sans`, system-ui, sans-serif):

- **Display Headline XL:** `32px / 40px`, Weight 800 (Screen titles, route banners)
- **Headline LG:** `24px / 32px`, Weight 800 (Section headings, modal headers)
- **Headline MD:** `20px / 28px`, Weight 700 (Card titles, bus number headers)
- **Headline SM:** `18px / 24px`, Weight 700 (Subsections, CTA button text)
- **Body LG:** `16px / 24px`, Weight 600 (Key data values, fare breakdown totals)
- **Body MD:** `14px / 20px`, Weight 500 (Standard UI body text)
- **Body SM:** `12px / 16px`, Weight 400 (Secondary information, descriptions)
- **Label LG / MD / SM:** `13px / 11px / 10px`, Weight 700, Uppercase, Tracking `0.04em`–`0.08em` (Badges, tags, bus status chips)

---

## 5. Shape Geometry & Elevation Hierarchy

- **Cards:** `rounded-3xl` (`1.75rem` / `28px`). Generously rounded to feel friendly, modern, and mobile-native.
- **Action Buttons & Chips:** `rounded-full` (`9999px`). Tactile pill buttons that prevent accidental mis-taps on mobile.
- **Input Fields & Selectors:** `rounded-2xl` (`1rem`).
- **Elevation Shadows:**
  - `shadow-elevation1`: `0 4px 20px -2px rgba(24, 28, 36, 0.05)` (Subtle resting card elevation)
  - `shadow-elevation2`: `0 10px 25px -4px rgba(24, 28, 36, 0.10)` (Floating menus, quick-book card, active tab docks)
  - `shadow-elevation3`: `0 8px 30px rgba(0, 0, 0, 0.25)` (Bottom sheets, modals, inspection drawers)

---

## 6. shadcn Component Customization Guidelines

When instantiating or customizing shadcn primitives:

1. **Button (`components/ui/button.tsx`):**
   - Default variant: `bg-primary text-primary-foreground hover:bg-[#A53700] rounded-full font-bold shadow-sm transition active:scale-[0.98]`.
   - Secondary variant: `bg-[#181C24] text-white hover:bg-slate-800 rounded-full font-semibold`.
   - Outline variant: `border border-[#E2E8F0] bg-white text-[#191C1E] hover:bg-slate-50 rounded-full font-semibold`.
   - Ghost variant: `text-[#64748B] hover:text-[#191C1E] hover:bg-slate-100 rounded-full`.
2. **Card (`components/ui/card.tsx`):**
   - Standard: `rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-elevation1`.
3. **Badge (`components/ui/badge.tsx`):**
   - Standard: `rounded-full px-3 py-1 font-bold text-[11px] uppercase tracking-wider`.
   - Kinetic Variants:
     - `variant="default"` (Electric Orange): `bg-[#F95700] text-white`
     - `variant="secondary"` (Charcoal): `bg-[#181C24] text-white`
     - `variant="peach"` (Peach Concession): `bg-[#FFE8D6] text-[#A53700]`
     - `variant="success"` (Live / Confirmed): `bg-emerald-100 text-emerald-800`
4. **Dialog / Sheet (`components/ui/dialog.tsx`, `components/ui/sheet.tsx`):**
   - Overlays use `bg-black/60 backdrop-blur-xs`.
   - Mobile drawers slide up from the bottom with top handles (`w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3`).
   - On tablets (`md:`), drawers transition into centered modal cards with `rounded-3xl`.

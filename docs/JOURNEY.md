# Engineering Journey & Milestones Log

**Project:** `track-me-tro`  
**Current Branch:** `develop`  
**Latest Update:** November 22, 2026  

---

## Milestone Overview

| Milestone | Status | Description |
| :--- | :--- | :--- |
| **Phase 0: Dual-App Prototype & Vercel Deployment** | Completed | Initial functional prototype for passenger booking, live GPS Leaflet map, conductor matrix, and Vercel build fixes on `main`. |
| **Phase 1: Codebase Audit & Technical Debt Identification** | Completed | Full inspection of all 17 routes, 15 components, and data layer; identified monolithic components, orphaned files, and responsive gaps. |
| **Phase 2: Modernization & Responsive Foundation** | **In Progress** | Setup `develop` branch, consolidate Tailwind v4 tokens, integrate Kinetic Transit shadcn/ui primitives, and establish Phone + Tablet responsive scaffolding. |
| **Phase 3: Passenger Flow Modernization** | Upcoming | Refactor passenger routes (`/home`, `/booking`, `/seats`, `/checkout`, `/ticket`) with shared responsive primitives. |
| **Phase 4: Conductor & Operations Modernization** | Upcoming | Decompose monolithic conductor dashboard and seat matrix into high-efficiency tablet/mobile command modules. |
| **Phase 5: Real-time Backend & PWA Hardening** | Upcoming | Transition from local multi-tab sync to real-time database backend and enable full PWA offline caching. |

---

## Detailed Milestone Logs

### Phase 0: Initial Dual-App Prototype & Deployment
- Built passenger route experience along the Leyte corridor (Sogod ⇄ Ormoc via Route 70).
- Created interactive Leaflet map components with live bus waypoints (`leyteHighwayCoords.json`).
- Implemented dual roles: Passenger booking flow and Conductor dispatch/matrix controls.
- Resolved Vercel deployment issue (`[BUILD_UTILS_SPAWN_1]`) by cleaning conflicting root configurations and targeting the `track-me-tro/` directory.
- Replaced cartoon crown (`👑`) and lock (`🔒`) emojis with custom vector `CrownIcon.tsx` and Material Symbols.

### Phase 1: Codebase Audit & Technical Debt Identification
- Conducted full audit across `app/`, `components/`, `lib/`, and `public/`.
- Flagged five orphaned components (`BottomSheet`, `BrandHeader`, `InputField`, `PrimaryButton`, `SeatMap`).
- Identified monolithic files exceeding standard maintainability thresholds:
  - `app/conductor/page.tsx` (1,088 lines)
  - `app/conductor/matrix/page.tsx` (761 lines)
  - `app/profile/page.tsx` (670 lines)
  - `lib/AppContext.tsx` (909 lines)
- Identified Tailwind v3/v4 configuration redundancy between `tailwind.config.ts` and `@theme` in `globals.css`.
- Highlighted the need for a Phone + Tablet responsive strategy to prevent awkward wide-screen stretching.

### Phase 2: Modernization & Responsive Foundation (Completed)
- **Branch Setup:** Created and switched to `develop` branch branched from `main`.
- **Documentation (`docs/`):**
  - `docs/AUDIT.md`: Complete codebase architecture audit.
  - `docs/DESIGN_SYSTEM.md`: Kinetic Transit brand guidelines & shadcn/ui bridge.
  - `docs/ARCHITECTURE.md`: Phone & Tablet responsive strategy and domain structure.
  - `docs/JOURNEY.md`: Milestone logs and detailed file changelogs.
- **Tailwind v4 Consolidation & shadcn/ui Setup:**
  - Migrated and consolidated all theme variables into `track-me-tro/app/globals.css` (`@theme`).
  - Added shadcn Kinetic Transit CSS variables in `:root` (primary orange `#F95700`, deep charcoal slate `#181C24`, warm peach-cream `#FFE8D6`, canvas `#F7F9FB`, white cards with `rounded-3xl` and `elevation1`-`elevation3` shadows).
  - Removed redundant `track-me-tro/tailwind.config.ts`.
  - Created `track-me-tro/lib/utils.ts` with standard `cn` helper (`clsx` + `tailwind-merge`).
- **Core UI Primitives (`components/ui/`):**
  - `components/ui/button.tsx`: Pill buttons with Kinetic Transit variants (`default`, `secondary`, `peach`, `outline`, `ghost`, `destructive`).
  - `components/ui/card.tsx`: White cards with `rounded-3xl`, soft `#E2E8F0` border, and `shadow-elevation1`.
  - `components/ui/badge.tsx`: Rounded-full uppercase chips (`default`, `secondary`, `peach`, `success`, `outline`).
  - `components/ui/input.tsx`: `rounded-2xl` input fields with orange focus ring.
  - `components/ui/dialog.tsx`: Modals with `bg-black/60 backdrop-blur-xs` overlay and `rounded-3xl` dialog cards.
  - `components/ui/sheet.tsx`: Touch bottom sheets with top drag handle and responsive slide animations.
  - `components/ui/tabs.tsx`: Charcoal-active tab triggers in `#ECEEF0` dock.
  - `components/ui/separator.tsx`: Structural `#E2E8F0` divider line.
- **Shared Responsive Scaffolding (`components/shared/`):**
  - `components/shared/AppShell.tsx`: Responsive Phone (<768px single-column with `pb-safe`) + Tablet (`md:max-w-3xl` for passenger, `md:max-w-6xl` for conductor).
  - `components/shared/PageHeader.tsx`: Unified header with back navigation, title, and action slots.
- **Removed Orphaned Components:**
  - Removed `components/BrandHeader.tsx`, `components/PrimaryButton.tsx`, `components/InputField.tsx`, and `components/BottomSheet.tsx`. Kept `components/SeatMap.tsx`.
- **Stability & Platform Fixes:**
  - Created `app/manifest.ts` returning valid Next.js `MetadataRoute.Manifest` for standalone PWA support.
  - Fixed React 19 `setState` cascading render warning in `app/conductor/map/page.tsx` by deriving `selectedHailId` during render.
  - Verified `npm run build` compiles with zero errors across all 21 routes.

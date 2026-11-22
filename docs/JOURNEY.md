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
- **GPS Telemetry & Freshness Indicators (`/map`):**
  - Extended `ActiveBus` model in `lib/data/corridorData.ts` and `lib/data/fleetData.ts` with `lastUpdatedMinsAgo`, `lastUpdatedAt`, and `signalStatus` (`"live"` | `"delayed"`).
  - Added pure formatting utilities `formatLastUpdated` and `computeBusSignalStatus` in `lib/data/fleetData.ts`.
  - Added `busLastUpdatedAt` timestamp tracking in `lib/AppContext.tsx` with multi-tab `localStorage` synchronization (`trackmetro_bus_last_updated_at`) automatically reset whenever conductors update dispatch status, shift, or stop progression.
  - Upgraded the selected bus inspection card in `app/map/page.tsx` using `Badge` (`LIVE` with green pulsing dot or `LAST SEEN` with warm amber dot), radio signal icon, and relative timestamp.
  - Added a 30-second client interval in `app/map/page.tsx` compliant with React 19 component purity rules.
  - Added subtle visual ring differentiation in `components/LiveMapLeaflet.tsx` (toning down outer pulse on delayed pins).
  - Enhanced responsive layout: anchored bottom card on phones, floating side card on tablets (`md:left-6 md:bottom-24 md:w-[380px]`).
- **Telemetry Refinement — Mutually Exclusive Status Badges & Guaranteed 2 Not-Live Buses:**
  - Simplified bus inspection drawer header into a single mutually exclusive `Badge`:
    - **Live (`signalStatus === "live"`):** Emerald green badge (`variant="success"`) with pulsing green dot (`animate-ping` + solid `#10B981`) and `LIVE` label only (removed duplicate radio icon and timestamp text).
    - **Not-Live / Delayed (`signalStatus !== "live"`):** Neutral muted-gray pill (`bg-slate-100 text-slate-600 border border-slate-200`) with a static solid gray dot (`bg-slate-400`) and formatted relative timestamp (`Last updated X mins ago`, guaranteed integer minute count).
  - Fleet Telemetry Distribution (`lib/data/fleetData.ts` & `lib/data/corridorData.ts`):
    - Guaranteed **exactly 2 delayed buses** per direction across all clock times: `sogod-to-ormoc` has units at `4` mins and `7` mins ago; `ormoc-to-sogod` has units at `5` mins and `8` mins ago. All remaining active fleet units in each direction are `"live"`.
    - Added presentation safeguard ensuring conductor multi-tab updates do not overwrite designated delayed demo buses (`!b.isDesignatedDelayed`).
  - Map Marker Cohesion (`components/LiveMapLeaflet.tsx`):
    - Aligned delayed bus pins to render a slate dashed ring (`border: 1.5px dashed #94A3B8; background: rgba(241, 245, 249, 0.7);`), slate bus icon (`#64748B`), and a slate dot (`#94A3B8`) in the bottom ETA tag, visually distinguishing live units from delayed units across both route directions.

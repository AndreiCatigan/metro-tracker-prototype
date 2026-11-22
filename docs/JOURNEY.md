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
- **Seat Reservation Pricing, Concession Discount & Universal ₱20 Convenience Fee:**
  - **Single Source of Truth (`lib/data/corridorData.ts`):**
    - Exported `CONVENIENCE_FEE = 20` and eliminated all hardcoded `15` / `₱15` references across the entire codebase.
    - Defined official Route 70 km markers for all 9 stations (`ROUTE_70_STOPS_KM`).
    - Implemented bidirectional full-route fare tables:
      - `Sogod ➔ Ormoc`: Bato `₱65`, Hilongos `₱90`, Hindang `₱110`, Inopacan `₱140`, Baybay City `₱180`, VSU Main Campus `₱215`, Albuera `₱245`, Ormoc City `₱275`.
      - `Ormoc ➔ Sogod`: Albuera (`₱35`), VSU Main Campus (`₱90`), Baybay City (`₱105`), Inopacan (`₱140`), Hindang (`₱160`), Hilongos (`₱185`), Bato (`₱205`), Sogod Terminal (`₱275`).
    - Implemented intermediate stop distance fare calculation (`Math.abs(destKm - originKm) * (275 / 155)`, rounded to nearest ₱5 with ₱25 minimum).
    - Concession discounts: 20% off base fare for Student, Senior, and PWD (`Math.round(baseFare * 0.20)`). Total: `discountedBaseFare + convenienceFee (20)`.
  - **Discount Verification Integration (`lib/AppContext.tsx` & `app/profile/page.tsx`):**
    - Added lazy client hydration for `verifiedDiscount`, `discountIdNumber`, and `discountSchoolOrAgency` to prevent flash of `"regular"`.
    - Wired `calculateSegmentFare` into `confirmBooking`, `createBooking`, and `requestSeatReservation` so booked tickets preserve exact stop-to-stop segment fares and verified concession discounts.
  - **Seat Reservation Redesign (`app/seats/page.tsx`):**
    - Added an interactive Kinetic Transit **Trip Segment Card** using `Card` and `Badge`.
    - Integrated a direction toggle between `Sogod ➔ Ormoc` and `Ormoc ➔ Sogod`.
    - Dynamic destination stop filtering (only stops ahead of the selected boarding stop are available).
    - Real-time fare display showing base fare, 20% concession badge (`Badge variant="peach"`), discount savings, and total fare including ₱20 convenience fee.
  - **Checkout & Ticket Breakdown (`app/checkout/page.tsx` & `app/ticket/page.tsx`):**
    - `app/checkout/page.tsx`: Displays corridor segment route, 20% concession discount badge, itemized breakdown (Base Fare, Verified Discount, Discounted Base Fare, ₱20 Convenience Fee, Total Amount), and dynamic checkout button.
    - `app/ticket/page.tsx`: Displays corridor segment, 20% concession badge, crossed-out original base fare, and exact total amount.
  - **Conductor POS Dynamic Route Alignment (`lib/data/conductorData.ts` & `app/conductor/pos/page.tsx`):**
    - Added `getPosRouteStops(direction)` returning directional stops and base fares for conductor on-bus ticketing.
- **Conductor-Assigned Seating Workflow & Post-Payment Two-Stage Experience:**
  - **Passenger Self-Seat Selection Retired:**
    - Replaced `app/seats/page.tsx` with a clean client redirect to `/booking` (`useRouter().replace("/booking")`).
    - Updated entry points across `/home`, `/map`, and `/schedule` so passengers follow the streamlined flow: Trip/Destination Selection (`/booking`) ➔ Payment (`/checkout`).
  - **Trip Segment Selection in `/booking` (`app/booking/page.tsx`):**
    - Integrated interactive Kinetic Transit Trip Segment Card on `/booking` featuring direction toggle (`Sogod ➔ Ormoc` / `Ormoc ➔ Sogod`), boarding stop selector, dynamically filtered destination stop selector, active bus unit preview, and clear notice: *"Seats are assigned by the bus conductor upon payment confirmation."*
    - Live segment fare engine with 20% concession badge, crossed-out base fare, and ₱20 convenience fee breakdown.
  - **Pre-Payment Checkout Neutrality (`app/checkout/page.tsx`):**
    - Removed pre-selected seat number; shows `"Seat: To be assigned by conductor"` with a warm peach badge.
    - Itemizes Base Fare, Concession Discount (-₱36 for student), ₱20 Convenience Fee, and Total Amount.
    - On payment confirmation, calls `createBooking` with `status: "pending_seat"` and `paymentStatus: "paid"`, and navigates to `/booking/pending`.
  - **Two-Stage Post-Payment Experience (`app/booking/pending/page.tsx`):**
    - **Stage A (Payment Successful & Pending Seat Assignment):**
      - Hero checkmark with payment confirmation (amount, GCash/Maya, route segment, PNR).
      - Warm peach badge `<Badge variant="peach">PENDING SEAT ASSIGNMENT</Badge>` with animated waiting indicator and copy: *"Your payment is confirmed. Please wait while the conductor on Bus [Bus No.] selects your seat."*
      - Live multi-tab synchronization via `localStorage` events; automatically transitions to Stage B the moment the conductor assigns a seat.
      - Single-device demo trigger: *"Demo: Simulate Conductor Assigning Seat"* for presentation pitches.
    - **Stage B (Seat Assigned & Bus Arrival Wait Screen):**
      - Celebratory `<Badge variant="success">SEAT CONFIRMED</Badge>`.
      - Bold headline: **"Your seat is number [##]"** with the seat number highlighted in electric transit orange (`#F95700`).
      - Bus Arrival & ETA Card: **"Please wait for Bus No. [DMS-XXX] to arrive"** at **[Origin Stop]**, live arrival estimate (**"Arriving in ~12 mins"** + clock time and React 19-compliant 1-minute countdown ticker).
      - Action CTAs: Primary "View Boarding Pass (QR)" (➔ `/ticket`) and Secondary "Track Bus Live on Map" (➔ `/map`).
  - **Conductor Operations Queue (`app/conductor/matrix/page.tsx` & `app/conductor/page.tsx`):**
    - Added **"Paid Passengers Awaiting Seat Assignment"** queue card to `app/conductor/matrix/page.tsx`, allowing the conductor to select a pending passenger and tap any vacant seat on the bus matrix to assign it.
    - Added high-visibility pending assignment banner on `app/conductor/page.tsx` alerting the crew when passengers are waiting for seats.
  - **Digital Boarding Pass Sync (`app/ticket/page.tsx`):**
    - Displays a `"Pending Conductor Seat Assignment"` banner with a direct link back to `/booking/pending` if visited prior to seat assignment.
    - Displays conductor-assigned seat number, Bus No., route segment, and verified discount badge once confirmed.
- **Discount Display Simplification, Pending Screen CTA Renaming & Phone/Tablet Responsive Audit:**
  - **Simplified Discount Display (`/booking`, `/checkout`, `/ticket`):**
    - Removed the loud/prominent `"DISCOUNT"` sign, banner, and oversized concession callout box (`bg-[#FFE8D6]/60`) from `/booking`.
    - Formatted the 20% concession discount as a plain, simple itemized row matching the exact font size (`text-[13px]`), weight (`font-semibold text-slate-600`), and alignment of `"Base Segment Fare"` and `"Discounted Base Fare"`:
      - `Base Segment Fare` .................... `₱180.00`
      - `Student Discount (20%)` ............ `-₱36.00`
      - `Discounted Base Fare` ............... `₱144.00`
      - `Convenience Fee` ........................ `₱20.00`
      - *(Separator)*
      - `Total Fare` .................................. `₱164.00`
    - In `/checkout` and `/ticket`, replaced oversized badges with minimal, clean inline labels and matching plain itemized breakdown rows.
  - **Renamed Pending Screen Button (`/booking/pending`):**
    - On Stage A (**Payment Successful / Booking Status**), replaced `"Demo: Simulate Conductor Assigning Seat"` with a sleek charcoal pill button labeled **`Next →`** (`#181C24` pill with `ArrowRight` icon).
    - Preserved the identical underlying handler (`assignSeatToBooking`) that transitions smoothly into Stage B (**Seat Confirmed**).
  - **Phone & Tablet Responsiveness Audit & Standardization:**
    - Standardized root containers across all passenger and auth routes with `w-full max-w-[440px] md:max-w-2xl mx-auto px-4 md:px-6 min-h-dvh overflow-x-hidden`.
    - Standardized conductor routes with `w-full max-w-[440px] md:max-w-4xl lg:max-w-5xl mx-auto px-3.5 sm:px-4 md:px-6 min-h-dvh overflow-x-hidden`.
    - Fixed bottom bars and modal drawers constrained with matching max-widths and `pb-safe`.
    - Stage B dual action buttons stack full-width on mobile phones (`grid-cols-1`) and sit side-by-side on tablets (`md:grid-cols-2`).
    - Added global viewport guardrail in `app/globals.css`: `html, body { overflow-x: clip; max-width: 100vw; min-height: 100dvh; }`.
- **React 19 / Next.js 16 Hydration Mismatch Resolution & `useLocalStorageState` Store:**
  - **Root Cause Eliminated:**
    - Eradicated lazy `useState(() => typeof window !== "undefined" ? localStorage.getItem(...) : defaultValue)` anti-patterns across `lib/AppContext.tsx` which caused initial hydration divergence between server HTML pre-rendering (`"regular"` -> `<button>`) and client hydration (`"student"` -> `<span>`) at `app/booking/page.tsx:293`.
    - Eliminated dynamic SSR clock/timestamp divergences across `app/booking/pending/page.tsx` and `app/map/page.tsx`.
  - **Reactive State Store (`lib/hooks/useLocalStorageState.ts`):**
    - Built a robust `useLocalStorageState<T>(key, defaultValue)` hook using React 19's `useSyncExternalStore`.
    - `getServerSnapshot`: Deterministically returns `defaultValue` for SSR and initial hydration passes.
    - `getSnapshot`: Retrieves cached parsed JSON keyed by raw `localStorage` string (`snapshotCache.get(key)`), guaranteeing referential stability and preventing infinite render loops.
    - `subscribe`: Listens to both native `window.addEventListener("storage", ...)` (cross-tab sync) and `window.addEventListener("trackmetro-storage", ...)` (instant intra-tab synchronization).
    - `setValue`: Serializes values, populates the snapshot cache, and dispatches custom storage events across tabs and windows.
    - Exported `useIsHydrated()` and `useCurrentTimestamp()` hooks for clean client-only gating without synchronous `setState` in effect cascades (`react-hooks/set-state-in-effect`).
  - **AppContext Refactoring (`lib/AppContext.tsx`):**
    - Migrated all persisted state variables to `useLocalStorageState`: `verifiedDiscount`, `discountIdNumber`, `discountSchoolOrAgency`, `passengerName`, `userLocation`, `simulatedTime`, `boardingAlertMinutes`, `isAlertActive`, `isPremium`, `selectedDirection`, `origin`, `destination`, `activeTicket`, `bookings`, `passengerHails`, `walkInSales`, `currentBusStop`, `passengersOnBoard`, `conductorName`, `busDetailsState`, `busStatus`, and `busLastUpdatedAt`.
    - Removed manual hydration `useEffect` (lines 339-411), manual `storage` event listener `useEffect` (lines 413-462), and 9 redundant write-sync `useEffect` watchers (lines 463-517).
    - Fixed static timestamp in `DEFAULT_INITIAL_BOOKINGS` (`"2026-11-24T08:00:00.000Z"`).
    - Resolved 23 `useCallback` dependency array warnings across dispatchers and actions.
  - **Secondary Hydration Trap Hardening:**
    - `app/booking/pending/page.tsx`: Gated `estimatedClockTime` with `useIsHydrated()` and added `suppressHydrationWarning`.
    - `app/map/page.tsx`: Replaced dynamic `Date.now()` `useState` with `useCurrentTimestamp()` external store ticking every 30 seconds.
  - **Verification:**
    - Zero Next.js hydration errors or warnings across hard reloads on `/booking`, `/checkout`, `/booking/pending`, `/ticket`, `/map`, and `/home`.
    - Production build (`npm run build`) statically prerenders 21/21 routes with 0 errors.
    - Full ESLint check (`npm run lint`) clean with 0 errors.
- **Bottom Navigation & Fixed CTA Bar Clearance Audit & `.pb-safe` Conflict Resolution:**
  - **Root Cause Eliminated:**
    - `.pb-safe` defined in `app/globals.css` applied `padding-bottom: env(safe-area-inset-bottom, 0px)`. Because `.pb-safe` was declared after Tailwind utilities, it clobbered and overrode Tailwind scroll clearance utilities (`pb-24`, `pb-32`, `md:pb-24`) down to `0px` on desktop, laptop, and non-notched screens.
    - On `/booking` and `/checkout`, the fixed bottom summary/CTA bar overlapped and sliced the Fare Breakdown card.
    - On `/ticket`, the floating charcoal `BottomNavigation` pill sat directly on top of the "Save to Wallet" and "Track Bus" action buttons.
    - Fixed infinite loop in `useCurrentTimestamp` store by using a stable in-memory variable updated exclusively by listener notifications, preventing cascading re-renders.
  - **Dedicated Safe-Clearance Utilities (`app/globals.css`):**
    - `.pb-nav-safe`: `padding-bottom: calc(7.5rem + env(safe-area-inset-bottom, 0px));` — provides at least 29px to 48px of clear breathing space for all pages rendering the floating `BottomNavigation` dock.
    - `.pb-cta-safe`: `padding-bottom: calc(8.5rem + env(safe-area-inset-bottom, 0px));` — provides 72px to 118px of clear breathing space for all pages with fixed bottom action/CTA bars.
    - `.pb-safe`: `padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));` — reserved strictly for fixed bars and bottom sheets themselves. Removed from `<body>` in `app/layout.tsx`.
  - **Route Updates Across the App:**
    - `/booking` & `/checkout`: Migrated container padding to `pb-cta-safe`. Fare Breakdown card and checkout action summaries sit completely above fixed CTA bars at max scroll.
    - `/ticket`, `/home`, `/schedule`, `/profile`, and `AppShell`: Migrated container padding to `pb-nav-safe`. Bottom-most action buttons, timetable cards, and settings scroll cleanly above the `BottomNavigation` pill.
    - `/conductor/matrix`: Migrated to `pb-cta-safe` and added `pb-safe` to the bottom seat inspection card. Row 10 (5-seat rear bench) sits strictly 74px to 120px above the fixed action card.
    - `/map`: Set mobile bus drawer offset to `bottom-22` (88px), floating cleanly 16px+ above `BottomNavigation` (72px).
    - `/booking/pending`, `/conductor`, `/conductor/pos`, `/conductor/scan`, `/`, `/signup`: Applied non-colliding `pb-12` to `pb-24` padding.
  - **Automated Viewport & Bounding-Box Verification:**
    - Tested all 14 active routes across Mobile Phone (`375x812`), Tablet (`768x1024`), and Short Viewport (`1280x680`).
    - Verified via `getBoundingClientRect()` at max scroll (`window.scrollTo(0, document.body.scrollHeight)`) that `contentBottom <= fixedBarTop - 16px` passed across 100% of routes.
    - `npm run lint` (0 errors) and `npm run build` (21/21 routes static prerendered) verified.

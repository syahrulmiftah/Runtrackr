# Runtrackr — Changelog & Engineering Record

All notable changes, commits, architectural decisions, and bug fixes made to the Runtrackr application are documented below in reverse-chronological order.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.3] - 2026-11-12

### Dev Server Restart & Git Repository Re-initialization

#### Fixed
- **Dev Server Process (`Vite on port 3000`)**:
  - Restarted the dev server process via `restart_dev_server`, clearing stale socket connections.
  - Verified local HTTP endpoint returning `200 OK` on `http://localhost:3000`.
  - Re-verified TypeScript compilation (`tsc --noEmit`) and Vite bundling with zero errors.
- **Git Branch Synchronization**:
  - Re-initialized local repository with user identity (`Syahrul Miftah <syahrulmiftahfarid@gmail.com>`) on branch `main` with all latest changes committed and ready for GitHub export.

---

## [0.9.2] - 2026-11-09

### Distance Filter Knob Refinement & Under-2km Activity Purge

#### Changed
- **Slider Knob Refinement (`src/components/ui/DualRangeSlider.tsx`)**:
  - Reduced the outside white stroke from 5px to **2px** (`ring-[2px] ring-white`).
  - Slightly reduced knob core size to **`w-3 h-3`** (12px core with 2px stroke, total 16px diameter) for a cleaner, more proportional visual footprint.
- **Dynamic Reset Button Visibility (`src/views/DashboardView.tsx`)**:
  - The Reset button is now completely hidden when the distance filter is in its default/reset state (`minDist === 0 && maxDist === maxDistance`).
  - Smoothly reveals when either knob is moved from default.
- **Sample Dataset Cleanup (`src/db/realSeedData.ts`, `src/db/storage.ts`)**:
  - Deleted all 44 activities under 2km from the sample dataset, retaining only the 133 high-quality runs of 2.00 km or greater.
  - Updated storage bootstrap cache key to `runtrackr_real_data_v3` to ensure IndexedDB and local storage automatically purge legacy sub-2km entries.

---

## [0.9.1] - 2026-11-09

### Dual-Knob Distance Filter Revision

#### Added
- **Reusable DualRangeSlider (`src/components/ui/DualRangeSlider.tsx`)**:
  - Implemented dual-knob range slider supporting independent lower and upper distance limit selection.
  - Features a thin 2px background track (`#27272F`), an active primary blue connecting line (`#4963F4`), and dual tactile knobs equipped with 5px outside white strokes (`ring-[5px] ring-white`) for prominent visual presence.
  - Includes 40×40px touch targets with pointer capture for fluid mobile dragging.

#### Changed
- **Revised Distance Filter UI (`src/views/DashboardView.tsx`)**:
  - Removed icon next to the header title.
  - Renamed header label to `"Distance (km)"`.
  - Replaced single slider with `DualRangeSlider` allowing both lower limit (`minDist`) and upper limit (`maxDist`) filtering.
  - Removed `(>= X.X)` display so only the Reset button remains on the top right.
  - Transformed Reset into a small secondary pill button (`h-7 px-3 rounded-full text-xs bg-[#27272F]`).
  - Updated bottom indicators to solid white (`text-white`) with larger font size (`text-sm font-medium`), removing the redundant `km` metric label.
  - Shortened the center run count to clean `"177 of 177"` format (removing `"runs in chart"`).

---

## [0.9.0] - 2026-11-09

### Visual Refinements, Active Metric Highlighting & Distance Filter Slider

#### Added
- **Global Decorative Background Element (`src/components/ui/DecorativeBackground.tsx`, `src/App.tsx`)**:
  - Implemented reusable component displaying a white `#FFFFFF` ellipse (300px × 32px) positioned at `-top-[24px]` and centered horizontally (`left-1/2 -translate-x-1/2`).
  - Reproduced Figma's 200px Layer Blur effect using an atmospheric radial gradient with soft 35px blur diffusion and 0.50–0.22 opacity, creating a subtle ambient light halo.
  - Mounted globally in `App.tsx` (`-z-10`, `pointer-events-none`) across all application pages (Home, Manage Account, Edit Profile, Privacy Policy, Terms & Conditions, Documentation, All Activity, Activity Detail, and Add Run).
- **Distance Filter Slider (`src/views/DashboardView.tsx`)**:
  - Added interactive distance slider positioned below the time group tabs and above the chart card.
  - Features real-time run filtering by minimum distance with live count display, custom `#4963F4` accent slider, and one-tap Reset button.
  - Only recalculates chart periods; recent activity list below remains untouched as specified.

#### Changed
- **Removed Unwanted Component Borders**:
  - **Chart Container (`src/components/chart/PerformanceChart.tsx`)**: Removed `border border-[#303037]` so the chart blends naturally into the page background.
  - **Recent Activity Rows (`src/components/ui/ActivityTable.tsx`)**: Removed `border border-[#27272F]` and hover border from `ActivityRow`.
  - **All Activity Rows (`src/views/AllActivityView.tsx`)**: Automatically borderless via shared `ActivityRow` component.
  - **Secondary Button (`src/components/ui/Button.tsx`)**: Removed `border border-[#303037]` from the Secondary variant to guarantee borderless pill styling.
- **Reusable Secondary Button for "View All Activity" (`src/components/ui/ActivityTable.tsx`)**:
  - Replaced ad-hoc button with standard `Button` component (`variant="Secondary"`, `rounded-full` 100px pill, `border-none`, white `ChevronRight` icon).
- **Active Metric Highlighting in Performance Chart (`src/components/chart/PerformanceChart.tsx`)**:
  - Dynamically highlights the active metric in primary blue (`#4963F4`) when selected via chart metric tabs (e.g. Score numeral and label turn blue in Score mode, Pace turns blue in Pace mode). Inactive metrics maintain neutral text (`#E3E4E9` and `#87878F`).

---

## [0.8.0] - 2026-11-06

### Separated Chart Navigation & Dedicated Needle Control

#### Added
- **Dedicated Data Point Selection Needle Control (`src/components/chart/PerformanceChart.tsx`)**:
  - Implemented an upward-pointing chevron triangle indicator (14px width × 10px height, 1px corner radius, solid white `#FFFFFF` fill) positioned directly below the chart needle at the baseline.
  - Centered the visible chevron inside an invisible touch target of at least 50 × 50px with `touch-none` and `cursor-pointer` for effortless mobile interaction.
  - Added dedicated pointer handlers (`handleNeedlePointerDown`, `handleNeedlePointerMove`, `handleNeedlePointerUp`) with `e.stopPropagation()` that independently move the needle and update the selected data point without triggering chart navigation.
  - Added full horizontal needle control track across the plot width for immediate tap-to-select and drag scrubbing between data points.

#### Changed
- **Separated Chart Navigation Swipe Area (`src/components/chart/PerformanceChart.tsx`)**:
  - Dedicated the main chart area exclusively to navigating between chart positions (sliding the 12-point window).
  - Fixed inverted swipe direction:
    - **Swipe left on chart** (`deltaX < -20`): Navigates forward to the next chart position (`windowOffset + 1`).
    - **Swipe right on chart** (`deltaX > 20`): Navigates backward to the previous chart position (`windowOffset - 1`).
  - Swiping or tapping within the main chart area no longer moves the needle or directly alters the active data point.
  - Maintained 60ms debounce for rapid consecutive swipes.
- **Chart X-Axis Spacing Increase (`src/components/chart/PerformanceChart.tsx`)**:
  - Increased vertical spacing between the chart/chevron and the X-axis date labels from 4px (`pt-1`) to 12px (`pt-3`).
  - Maintained precise alignment between the needle, chevron, and corresponding X-axis date labels.

---

## [0.7.0] - 2026-11-06

### Visual Refinements, Component Reuse & Navigation Precision

#### Added
- **Cross-Browser Scrollbar Hiding (`src/index.css`)**:
  - Implemented `.no-scrollbar` and `.scrollbar-none` CSS rules (`display: none !important`, `width: 0 !important`, `scrollbar-width: none !important`, `-ms-overflow-style: none !important`).
  - Applied to `LineTabs` and metric pill tabs to hide scrollbars while fully preserving swipe and touch scrolling on mobile devices.
- **Contextual Back Navigation Tracking (`src/App.tsx`)**:
  - Added `runDetailSourceView` state (`'dashboard' | 'all-activity'`) to track user navigation origin.
  - Clicking Back on the Activity Detail page now correctly returns the user to the All Activity page if they came from All Activity, and to the Home Screen if they came from the Home Screen.
  - Delete and edit flows also preserve this navigation origin.

#### Changed
- **Reused Activity Card Component on All Activity (`src/views/AllActivityView.tsx`)**:
  - Replaced duplicate card implementation with the shared `ActivityRow` component from `src/components/ui/ActivityTable.tsx`.
  - Configured the distance metric to use the **Roboto** font (`font-roboto font-bold text-lg`) instead of Anton for complete typography consistency.
- **Square-Shaped Activity Score Badges (`src/components/ui/ScoreBadge.tsx`)**:
  - Updated badge shape to an exact square (`aspect-square w-11 h-11 rounded-xl` for medium badges) across all activity lists on both the Home Screen and All Activity page.
  - Maintained the dynamic 5-color scale calculation, 24% background tint opacity, and Anton numeral styling.
- **Home Screen Metrics Grid Alignment (`src/components/chart/PerformanceChart.tsx`)**:
  - Refactored the 6-metric overview into a strict 3-column × 2-row CSS grid with uniform width and height (`h-[48px]`, `h-[26px]` value container) across all six containers.
  - Ensured consistent vertical baseline alignment for values and unit suffixes (`km`, `bpm`) and labels across all mobile screen widths.
- **Upload Activity Popup Spacing Improvements (`src/views/CsvImportModal.tsx`)**:
  - Added `pt-10` top padding to prevent the top-right close (`X`) button from crowding the dashed drag-and-drop container.
  - Increased internal padding (`py-8 px-5`) and vertical margins (`my-3`) around the drag-and-drop box to give the content comfortable breathing room.

---

## [0.6.0] - 2026-11-06

### Other Screens & Collapsible Monthly All Activity Suite

#### Added
- **Dedicated All Activity Screen (`src/views/AllActivityView.tsx`)**:
  - Implemented monthly activity grouping matching `All_activity_page_collapsed_a0187a99.png` and `All_activity_page_expanded_947cf9bf.png`.
  - Automatically groups all historical runs chronologically by month and year (`Nov, 2026`, `Oct, 2026`, `Sep, 2026`, ...).
  - **Monthly Summary**: Displays Total Distance (`10.20 km`), Total Duration in hours (`2.0h`), and Number of Runs (`3 runs`), with chevron expand/collapse indicators.
  - **Independently Collapsible Sections**: Each month can be toggled without affecting other months; summary row stays visible when collapsed.
  - Preserves exact activity card design from the Home Screen with dynamic 5-color scale score badge.
- **Dedicated Add/Edit Run Screen (`src/views/AddEditRunView.tsx`)**:
  - Replaced modal dialog with dedicated screen matching `Add_New_Run_1aabb582.png`.
  - Form layout with circular back button, blue asterisks (`*`) on required fields, date/time pickers, synchronized distance/duration/pace inputs, and 3-column metric row (Avg. Heart Rate, Elevation Gain, Cadence).
  - Full-width blue pill action button (`Add Run` / `Save Changes`).
- **Consistent Decorative Background Element**:
  - Positioned an ambient ellipse behind all content on every page:
    - Width: 300px, Height: 32px.
    - Effect: Layer Blur 200px (`filter: blur(200px)`).
    - Position: Horizontally centered (`left-1/2 -translate-x-1/2`).
    - Vertical offset: -20px (`-top-[20px]`).
    - Positioning: Absolute, lowest possible layer (`-z-10`, `pointer-events-none`).

#### Changed
- **Redesigned Run Detail Page (`src/views/RunDetailView.tsx`)**:
  - Updated layout matching `Run_Detail_a482025e.png`.
  - Top header with circular back button, `Run at` label, and date/time timestamp.
  - Activity title, description, and right-aligned location tag.
  - Giant 7xl blue Anton performance score hero (`128 Run Score`).
  - Clean 2-column metrics grid (Distance, Duration, Avg. Pace, Avg. Heart Rate, Elevation Gain, Cadence).
  - Circular floating action buttons at bottom for Delete (red trash icon) and Edit (pencil icon).
- **Redesigned Upload Activity Popup (`src/views/CsvImportModal.tsx`)**:
  - Matches `Popup_-_Upload_Activity_059557ef.png`.
  - Dashed outline container with upload icon, "Upload Your Strava Activity" header, "Supports: CSV" badge, and full-width "Select File" pill button.
  - Added "Learn more" interactive link connecting directly to the Strava import documentation guide.

#### Removed
- **Period Summary & Compare Features**:
  - Removed all UI elements, selection handlers, and routes associated with Period Summary and Compare.
  - Deleted obsolete files `src/views/PeriodSummaryView.tsx`, `src/views/CompareView.tsx`, and `src/views/AddEditRunModal.tsx` to maintain clean codebase architecture.

---

## [0.5.0] - 2026-11-06

### Manage Account & Settings Suite (Reference Designs 375px)

#### Added
- **Dedicated Manage Account View (`src/views/ManageAccountView.tsx`)**:
  - Replaced the previous modal popup with a dedicated route and view conforming to the 375px mobile viewport reference (`Manage_account_37f92dbf.png`).
  - Circular back button navigating back to the Home Dashboard.
  - Centered profile header featuring user avatar, full name (`Syahrul Miftah`), Google email (`syahrulmiftahfarid@gmail.com`), and pill-styled `Edit profile` button with pencil icon.
  - Settings list section with unified items for Privacy policy, Terms and conditions, Documentation, and Logout.
  - Full-width destructive `Delete account` pill button at the bottom of the screen.
- **Reusable Settings Component (`src/components/ui/SettingsButton.tsx`)**:
  - Derived from base `ButtonProps` interface to ensure design token consistency across the application.
  - Standardized rectangular card layout (`bg-[#27272F] border border-[#303037] rounded-xl px-4 py-3.5`).
  - Supports left leading icons, custom typography, chevron-right indicator, and `default` vs `danger` variants.
- **Edit Profile Screen (`src/views/EditProfileView.tsx`)**:
  - Top header with circular back button and "Edit profile" title matching `Edit_profile_4cbff883.png`.
  - Profile avatar with "Upload photo" pill button supporting image uploads and instant preview.
  - Read-only `Username` field (`Syahrul Miftah`) and read-only `Google email` field (`syahrulmiftahfarid@gmail.com`) with disabled cursor styling.
  - Informational notice callout box: `You cant change google email for now` with blue info icon and high-contrast dark indigo styling (`#161B30`, `#232F6E`, `#4963F4`).
- **Dedicated Privacy Policy Page (`src/views/PrivacyPolicyView.tsx`)**:
  - Complete 13-section legal disclosure matching `Privacy_Policy_6a4d6491.png`.
  - Details operator identity, Google account permissions, running data retention, service providers (Google, Supabase, Vercel), security measures, and user data rights.
- **Dedicated Terms & Conditions Page (`src/views/TermsConditionsView.tsx`)**:
  - Complete 11-section terms and conditions matching `Terms_and_Conditions_d528701a.png`.
  - Covers purpose and health disclaimer, data usage, Strava imports disclaimer, mathematical score estimates disclaimer, acceptable use, and governing laws of Indonesia.
  - Interactive inline link navigating seamlessly to the Privacy Policy.
- **Hierarchical Documentation Suite (`src/views/DocumentationView.tsx`, `src/views/DocumentationDetailView.tsx`)**:
  - Implemented multi-tier navigation flow: `Manage Account → Documentation → Documentation Detail`.
  - Reusable documentation topic registry (`DOC_TOPICS`) allowing easy addition of future topics.
  - **Import runs from Strava Detail Page** (`Import_runs_from_Strava_3b40ddca.png`): Step-by-step export, file identification, upload instructions, and bulleted "Good to know" guidance.
  - **How your score works Detail Page** (`How_your_score_works_f6831269.png`): Mathematical formula representation, interpretation guidance, pace/elevation caveats, and aggregation rules.

#### Changed
- **Redesigned Confirmation Popups (`src/components/ui/PopupDialog.tsx`)**:
  - Replaced double-button generic modals with the dedicated single-action pill popup designs:
    - **Logout Popup** (`Popup_39199985.png`): Top-right close button, centered `LogOut` icon, bold title "Log out from runtrackr", subtitle "You will be logged out, you can log in again anytime", and primary blue "Log out" pill button.
    - **Delete Account Popup** (`Popup-1_c5567ac1.png`): Top-right close button, centered warning triangle, bold title "Delete Account", subtitle "Your account will be deleted, this action cannot be undone", and red "Delete" pill button.
- **Header Avatar Navigation**:
  - Dashboard avatar button now transitions directly to the new dedicated `Manage Account` page.

---

## [0.4.0] - 2026-11-06

### Home Screen — UI & UX Redesign (Reference Image `img1`)

#### Added
- **Reusable Line-Style Tabs (`src/components/ui/LineTabs.tsx`)**:
  - Implemented `LineTabs` component with `active` (`16px bold`, White, 2px solid `#4963F4` bottom line) and `inactive` (`16px regular`, Grey `#87878F`, subtle border) variants.
  - Supports `Daily`, `Weekly`, `Monthly`, `Quarterly`, and `Yearly` time aggregations.
- **Dynamic 5-Color Scale Score Badge (`src/components/ui/ScoreBadge.tsx`)**:
  - Implemented Excel-like conditional formatting color scale across dataset min/max values:
    - **Green** (`#22C55E` / `#4AC189`) for highest score.
    - **Lime** (`#84CC16`).
    - **Yellow** (`#EAB308`).
    - **Orange** (`#F97316`).
    - **Red** (`#EF4444` / `#BA4949`) for lowest score.
  - Badge displays solid score numeral with matching background tint at **24% opacity** (`rgba(..., 0.24)`).
  - Automatically recalculates dynamic thresholds whenever runs are added, edited, or imported.
- **Dedicated All Activities Screen (`src/views/AllActivityView.tsx`)**:
  - Full activity browsing with real-time text search (by title, date, or location).
  - Reuses new vertical `ActivityRow` design and dynamic color scale badges.
  - Header with `Back to dashboard`, quick upload, and add run actions.

#### Changed
- **Vertical Header Layout (`src/views/DashboardView.tsx`)**:
  - Replaced horizontal header with vertical column: circular user avatar at top-left, followed by `Welcome back!` (`text/lg/regular`, 18px grey) and user name (`title/lg/regular`, 24px white).
  - Replaced letter initials with user avatar profile image with silhouette fallback.
  - Positioned Upload CSV and Add Run action buttons in top-right corner.
- **Consolidated 6-Metric Overview Grid (`src/components/chart/PerformanceChart.tsx`)**:
  - Merged separate score and volume metrics into a unified 3-column × 2-row overview grid matching `img1`:
    1. **Avg. Score**
    2. **Avg. Pace**
    3. **Avg. Heart Rate**
    4. **Runs** (unit label `runs` removed, renamed from Activities)
    5. **Distance**
    6. **Duration**
- **Expanded Chart Metric Tabs**:
  - Positioned pill tabs directly above the chart with exact order: `Score`, `Distance`, `Pace`, `Duration`, `Heart Rate`, `Runs`.
  - Chart dynamically shifts to plot the selected metric.
- **Single-Point Swipe Navigation & Touch Targets**:
  - Replaced pagination UI with single-point swipe navigation (swiping left or right advances or rewinds the needle by exactly one data point with support for quick consecutive flicks).
  - Expanded interactive touch area to the entire width and height of the chart; tapping anywhere immediately snaps the needle to the nearest data point.
  - Added `touch-action: pan-y` to prevent interference with vertical mobile scrolling.
- **Chart Styling**:
  - Removed horizontal separator directly above the chart.
  - Reduced vertical gap between the bottom of the chart and its X-axis date labels.
  - Changed the selection indicator line (needle) to solid white (`#FFFFFF`, 1.5px stroke).
- **Redesigned Activity Rows (`src/components/ui/ActivityTable.tsx`)**:
  - Row 1: Date and time (`31 Oct · 16:24`, White).
  - *8px gap*
  - Row 2: Distance (`10.20 km`, 18px bold white).
  - *4px gap*
  - Row 3: Duration, Pace, and Heart Rate (Grey; turns red when heart rate is missing).
  - Right: Vertically aligned dynamic score badge.
- **Section Heading & Limit**:
  - Renamed section heading to `Recent activity` (`text/lg/regular`, White).
  - Limited Home Screen display to the **latest 5 runs**.
  - Added `View all activity >` button beneath the list navigating to `AllActivityView`.

#### Removed
- Removed the three quick recap mini cards from the Home Screen.
- Removed checkboxes, bulk selection, table sorting toggles, and table header labels (`Score`, `All Runs`).

---

## [0.3.0] - 2026-11-05

### Chart Area Gradient & Precision Polyline

#### Added
- **SVG Area Gradient Fill (`Line_Chart_485b5cc5.png`)**:
  - Implemented `<linearGradient id="chartAreaGradient">` in SVG `<defs>` with Primary color (`#4963F4`) at **40% opacity (`stopOpacity="0.40"`)** at the peak fading to **0% opacity (`stopOpacity="0.00"`)** at the baseline.
  - Added `generateAreaPath(points, bottomY)` in `src/components/chart/chartMath.ts` to construct the closed polygon path beneath the curve.
- **Figma Dot Point Tokens**:
  - Styled unselected dots with dark fill (`#19191F`) and primary stroke (`#4963F4`).
  - Styled active selected dot with a 40% primary halo circle (`r=9`, `fillOpacity=0.35`) and solid core.

#### Changed
- Refined trend curve polyline to clean, sharp straight segments (`L ${x} ${y}`) connecting vertices matching Figma reference.
- Updated vertical scrubber line to a solid light line (`#E3E4E9`, 1.5px stroke, 0.8 opacity).

---

## [0.2.0] - 2026-11-05

### Excel Formula Synchronization & Table Reverse Chronological Sorting

#### Fixed
- **Physiological Scoring Formula**:
  - Synchronized scoring calculation with user's Excel spreadsheet: `=(J37/K37)*(100/M37)`.
  - Mapped Excel's day-fraction time storage ($\text{Duration in seconds} / 86,400$) and heart rate in column M, yielding:
    $$\text{Score} = \left(\frac{\text{Distance (km)}}{\frac{\text{Duration (seconds)}}{86,400}}\right) \times \left(\frac{100}{\text{Heart Rate (bpm)}}\right) = \frac{\text{Distance (km)} \times 8,640,000}{\text{Duration (seconds)} \times \text{Heart Rate (bpm)}}$$
  - Verified exact integer match across all 6 benchmark rows (17-Oct Brobahan: `117`, `99`; 26-Oct Tarkam: `106`; 27-Oct Brobahan: `102`; 29-Oct Brobahan: `98`; 3-Nov Brobahan: `106`).
  - Upgraded database migration key to `runtrackr_real_data_v2`, automatically recomputing all 177 activity scores.
- **Table Sorting Order**:
  - Configured activity tables to sort in reverse-chronological order (`timeB - timeA`) by default, previewing from 3 Nov 2026 down to 11 Jun 2025.
  - Added explicit year formatting (`3 Nov 2026` vs `11 Jun 2025`) across all rows to prevent multi-year ambiguity.
  - Preserved left-to-right chronological progression on the trend chart so time-series curves render correctly from past to present.

---

## [0.1.0] - 2026-11-05

### Initial Architecture & 177 Real Strava Activities

#### Added
- **Real Strava Dataset**:
  - Filtered and ingested 177 genuine running activities (`Activity Type === 'Run'`) from raw `activities.csv`.
  - Structured into typed TypeScript seed module `src/db/realSeedData.ts` and loaded through client-side IndexedDB repository in `src/db/storage.ts`.
  - Accounted for 116 runs with heart rate (scored) and 61 runs without heart rate (graceful non-scoring state with manual estimation).
- **Core Design System**:
  - Dark visual tokens: `#0D0C11` (canvas), `#19191F` (layer 1), `#27272F` (layer 2), `#3C3C45` (layer 3), `#303037` (border), `#4963F4` (primary accent), `#E3E4E9` (white text), `#87878F` (grey text).
  - Typography: **Anton** for metric numerals and score badges; **Roboto** for UI copy, tables, and inputs.
- **Core View Suite**:
  - `DashboardView.tsx`: Main hub with time grouping, performance chart, and activities.
  - `RunDetailView.tsx`: Comprehensive breakdown of distance, moving time, elapsed time, average pace, heart rate, cadence, elevation, and heart rate estimation dialog.
  - `PeriodSummaryView.tsx`: Detailed analytics for selected week/month/quarter/year.
  - `CompareView.tsx`: Side-by-side progression chart and comparative metrics table.
  - `AddEditRunModal.tsx`: Tri-directional synchronized input form with overlap validation.
  - `CsvImportModal.tsx`: Drag-and-drop Strava CSV parser with atomic persistence.
  - `SettingsModal.tsx`: User profile editing, JSON backup export/import, and empty/seed reset.
  - `Toast.tsx`, `PopupDialog.tsx`, `InlineMessage.tsx`: Contextual alerts and confirmations.

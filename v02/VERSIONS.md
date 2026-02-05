# Version Control Log

This file tracks all changes made to the AIJI website with version numbers for easy rollback.

## Version Numbering System

- **Major** (v3.0.0): Breaking changes, major redesigns
- **Minor** (v2.1.0): New features, significant additions  
- **Patch** (v2.0.1): Bug fixes, small adjustments, styling tweaks

---

## Version History

### v438 - 2026-02-05
**Status: ✅ Current**

**Footer Redesign: Animated Gradients, Responsive Layout & Interactive Enhancements:**

Completely redesigned the footer with animated gradient backgrounds, optimized column layouts, and improved responsive behavior across all breakpoints.

**Changes Made:**

1. **Animated Gradient Background**
   - Added three-color animated gradient background using `radial-gradient` with `background-position` animation
   - Colors: Warm Pink (#FFB8B6, 0.7 opacity), Light Green (#BAEAB0, 0.7 opacity), Light Blue (#AEE0E5, 0.9 opacity)
   - Animation: 12-second ease-in-out infinite loop with smooth color movement
   - Background size: 400% × 400% for enhanced animation visibility
   - Base background: Warm Cream (#FFF3E9)

2. **Desktop Layout Optimization**
   - Changed grid from equal `1fr` columns to mixed: `1fr repeat(4, 180px)`
   - Logo column: Flexible width (1fr) to fill remaining space
   - Content columns (Our Work, Urgency+Pursuit, Leadership & Partners, Pursuit.org): Fixed 180px width each
   - Column gap: Reduced from 40px to 20px for tighter, more compact layout
   - Prevents columns from spreading across full viewport width

3. **Tablet Responsive Layout (≤1024px)**
   - 3-column grid: `1fr 180px 180px`
   - Column 1: Logo (flexible, spans 2 rows vertically)
   - Column 2: Our Work (row 1) + Urgency+Pursuit (row 2)
   - Column 3: Leadership & Partners (row 1) + Pursuit.org (row 2)
   - Gap: 30px between columns
   - Signup section stacks below headline with 30px spacing
   - Form left-aligned to headline

4. **Mobile Responsive Layout (≤768px)**
   - Single column layout (all elements stacked vertically)
   - Order: Logo → Our Work → Urgency+Pursuit → Leadership & Partners → Pursuit.org
   - Gap: 20px between sections
   - Signup section below headline with 30px spacing

5. **Interactive Hover Effects**
   - Added animated black circle (8px diameter) to left of section/page links on hover
   - Circle grows from center with smooth opacity transition (0 → 1)
   - Gap between circle and text: 14px (via padding-left)
   - Removed link opacity reduction on hover to keep circles fully visible

6. **Spacing & Typography Refinements**
   - Removed top border line from footer
   - Email input placeholder: Changed from gray (#888888) to black (#000000)
   - Navigation grid bottom margin: 70px (increased from 60px)
   - Copyright section: 15px from bottom of viewport (reduced from 25px)
   - Section title gap (Urgency → Pursuit): 24px margin-top

7. **Animation Performance**
   - Removed unused `@property` declarations for custom CSS properties
   - Cleaned up CSS variables from `:root`
   - Fixed animation conflict where `delayedShow` animation was overriding gradient animation
   - Changed footer visibility transition from animation to simple opacity/visibility transition

**Files Modified:**
- `public/styles.css` - Footer gradient animation, responsive grid layouts, hover effects, spacing adjustments
- `public/index.html` - No changes (structure remained the same)

---

### v437 - 2026-02-04
**Status: ✅ Superseded**

**Visibility Fixes, Navigation Updates & Typography Refinements:**

Fixed persistent visibility issues across Steps 5-9 (Decade of Work, NYT Quote, Demography, Economic Impact, Transformation Stories), updated navigation section labels, and refined typography throughout the site.

**Changes Made:**

1. **Fixed Parent Container Opacity Issue (Steps 5-9)**
   - Root cause: `#our-work` section was getting `section-hidden` class with `opacity: 0.3`, cascading to all children
   - Fix: Added CSS override `#our-work.section-hidden { opacity: 1 !important; }` in `script.js` injected styles
   - Result: All content in Steps 5-9 now displays at full opacity

2. **Added Missing Stagger Animation Classes**
   - **Step 7 (Demography)**: Added `stagger-item stagger-demo-headline`, `stagger-item stagger-demo-body`, `stagger-item stagger-demo-grid` classes
   - **Step 8 (Economic Impact)**: Added `stagger-item stagger-econ-headline`, `stagger-item stagger-econ-body`, `stagger-item stagger-econ-grid` classes
   - **Step 9 (Transformation Stories)**: Added `stagger-item stagger-trans-headline`, `stagger-item stagger-trans-desc`, `stagger-item stagger-trans-gallery` classes
   - JavaScript trigger functions can now find and animate these elements properly

3. **Fixed NYT Background Image Visibility (Step 6)**
   - Issue: CSS selectors required `.wwd` parent class that didn't exist in HTML structure
   - Fix: Added alternative selectors without `.wwd` parent requirement for all Step 6 rules
   - Updated `.wwd-step-6` comment from "Partners" to "NYT Quote" for clarity
   - Set `min-height: 150vh` and `overflow-y: visible` for proper scroll effect
   - Added explicit `opacity: 1 !important` for `.press-quote-bg` and `.nyt-bg-image`

4. **Fixed Builder Photos Visibility (Step 5)**
   - Added CSS override for `#impact-decade-bg` container: `opacity: 1 !important`
   - Added JavaScript fallback in `updateBuilderPhotosExit()` to force photo visibility when in viewport
   - Ensures photos become visible even if IntersectionObserver doesn't trigger

5. **Fixed CSS Selector Specificity Issues**
   - Added alternative selectors without `.wwd` parent for Steps 5-9 throughout `styles.css`
   - Ensures all styling rules apply correctly regardless of parent class structure

6. **Fixed Navigation Underline on "Get Involved"**
   - Issue: Generic `.nav-links a::after` rule created underline for all links including pill button
   - Fix: Updated base `::after` rules to exclude `.nav-cta-pill`: `.nav-links a:not(.nav-cta-pill)::after`
   - "Get Involved" pill button no longer shows underline when active

7. **Updated Navigation Section Labels**
   - "Our Vision" → "Our Work" (first section, still links to `#our-vision`)
   - "Our Work" → "Pursuit" (second section, still links to `#our-work`)
   - "The Urgency" and "Leadership & Partners" unchanged
   - Section IDs preserved for backward compatibility with existing links

8. **Fixed Urgency Page Percentage Font Weight**
   - Issue: 64% and 4% displayed at font-weight 900 instead of intended 600 (semibold)
   - Root cause: `.urgency-gap-percent` selector required `.wwd` or `.urgency` parent that didn't exist
   - Fix: Added `.wwd-step-urgency .urgency-gap-percent` selector to match actual HTML structure
   - Percentages now correctly display at semibold (600) weight

9. **Typography Updates**
   - **Body Medium line-height**: Changed from `1.2` to `1.4` for `.body-medium-regular` and `.body-medium-semibold`
   - **Navigation Typography**: 
     - Created `nav-regular` class (15px, weight 400, based on `footer-small-regular`)
     - Created `nav-semibold` class (15px, weight 600)
     - Applied `nav-semibold` to section names (Our Work, The Urgency, Pursuit, Leadership & Partners)
     - Applied `nav-regular` to "Get Involved" button
   - **Navigation Spacing**: Reduced gap between nav items from `2rem` (32px) to `1rem` (16px) - 50% reduction

**Files Modified:**
- `public/script.js` - Parent container opacity fix, builder photos fallback, comment updates
- `public/index.html` - Added stagger classes to Steps 7-9, updated nav labels, applied nav typography classes
- `public/styles.css` - Fixed NYT background rules, added CSS overrides for Steps 5-9, fixed nav underline, updated urgency percent selector, created nav typography classes, adjusted body-medium line-height, reduced nav gap

---

### v436 - 2026-02-03
**Status: ✅ Superseded**

**Console Cleanup & Demography/Economic Impact Exit Animation Fix:**

Removed excessive debug logging from console and fixed the abrupt disappearing of Demography (step 7) and Economic Impact (step 8) pages, especially in Cursor's native browser.

**Changes Made:**

1. **Console Debug Logging Cleanup**
   - Removed `[Demo Exit]` and `[Econ Exit]` messages that fired on every scroll frame
   - Removed `📜 WWD scroll` logging (fired every 500px of scroll)
   - Removed `🎥 videoHeader wheel` logging (fired on every wheel event)
   - Removed `🚫 BLOCKING` warnings during animation
   - Removed `🔴 SCROLL STUCK!` detector and its verbose logging
   - Removed all initialization logs (pillar state, mission backgrounds, rotating words, page transitions, stagger animations, section switching)
   - Removed all page sequence trigger logs (How, Hub, Council, Partners, Urgency, Demography, Economic Impact, Transformation Stories)
   - Kept only essential error handling logs (video play errors, Vimeo init warnings, DEBUG_DECADE developer flag)

2. **Demography & Economic Impact Exit Animation Fix**
   - Bug: Pages disappeared abruptly in Cursor's browser but worked in Chrome
   - Root cause: `updatePageTransitions()` treated ~100vh pages as "short steps" and hid them instantly when `stepRect.bottom <= 0`
   - Fix: Added custom exit logic for steps 7 and 8 that excludes them from the standard short-step instant-hide behavior
   - Exit now based on **content bottom position** (`.demographics-grid`) rather than page bottom
   - Fade starts when content bottom hits viewport center (50%)
   - Fade completes when content bottom hits 25% from viewport top (faster fade over 25vh)
   - Consistent behavior across all browsers

3. **Removed Unused Variables**
   - Cleaned up `_lastDemoLogTime` and `_lastEconLogTime` variables that were no longer needed after removing debug logging

**Files Modified:**
- `public/script.js` - Console cleanup, demography/economic exit animation fix

---

### v435 - 2026-02-02
**Status: Previous**

**What We Do Content Fix & NYT Image Sizing:**

Fixed mission content not loading after returning from Our Impact via logo click, and adjusted NYT background image sizing.

**Changes Made:**

1. **What We Do Content After Logo Click**
   - Bug: After Our Impact → logo click → header video → swipe down, What We Do showed nav and progress bar but mission content was missing
   - Cause: The `.wwd` section kept inline `opacity: 0` from the previous nav transition (fade out when leaving WWD)
   - Fix: In logo click handler, clear inline `opacity` and `transition` on all section pages when resetting, and explicitly set WWD to `opacity: 1` when re-activating

2. **Debug Cleanup**
   - Removed visual debug panel and "FIX IT" button used during troubleshooting
   - Removed all debug `console.log` statements from WWD init block, `handleScroll`, and `updateMissionEntrance`

3. **NYT Background Image**
   - Image is horizontally oriented; removed `transform: rotate(-90deg)`
   - Set `width: 80vw` and `height: auto` so image is 80% of viewport width with aspect ratio preserved
   - Removed `max-width: none` (no longer needed without rotation)

**Files Modified:**
- `public/script.js` - Logo click: clear section opacity on reset, set WWD opacity 1; removed debug panel and logs
- `public/styles.css` - `.nyt-bg-image`: no rotation, width 80vw, height auto

---

### v434 - 2026-02-01
**Status: Previous**

**Advisory Council Layout & Images:**

Redesigned the Advisory Council page with new layout, tighter row spacing, and real member photos.

**Changes Made:**

1. **Layout**
   - 2-column grid with column flow (left: Miguel, Jon, Ryan; right: MC Lader, Julie)
   - Row gap reduced to 40px (from 125px) for tighter vertical spacing within each column
   - Column gap 125px; stagger 150px (right column lower)
   - Ryan moved to left column below Jon (no longer centered spanning both columns)

2. **Typography**
   - Names: body-large-regular; titles: body-small-regular
   - Thumbnails 300×300px; name/title max-width 300px

3. **Images**
   - Replaced all 5 placeholder divs with actual photos: AIJI_Advisory_MiguelCardona.jpg, AIJI_Advisory_MCLader.jpeg, AIJI_Advisory_JonSchnur.jpeg, AIJI_Advisory_JulieSamuels.jpg, AIJI_Advisory_RyanCraig .jpeg

4. **Mobile**
   - grid-auto-flow: row on small screens; stagger removed

**Files Modified:**
- `public/index.html` - Council card images
- `public/styles.css` - Council grid layout, gaps, typography

---

### v433 - 2026-02-01
**Status: Previous**

**Footer Page Structure & Scroll Behavior:**

Restructured the footer as a separate page (step 7), fixed scroll snap-back when scrolling up from footer, reduced gap between partners and footer, and ensured footer bottom aligns with viewport bottom when scrolled.

**Changes Made:**

1. **Footer as Separate Page (Step 7)**
   - Extracted footer from inside Our Partners step into its own page (step 7)
   - Footer now follows Section / Page / Elements structure correctly
   - Page title "Our Partners" fades away when transitioning to footer page

2. **Footer Scroll Behavior**
   - Removed scroll-snap to fix aggressive snap-back when scrolling up from footer (no longer snaps back to bottom)
   - Footer page never fades (always full opacity)
   - Footer bottom aligns with viewport bottom when scrolled (via padding-bottom on step 7)
   - Copyright sits 30px above viewport bottom
   - overscroll-behavior-y: none to prevent rubber band past content bottom

3. **Reduced Gap Between Partners and Footer**
   - Reduced .wwd-partners-wrapper padding-bottom from var(--space-4xl) to var(--space-xl)
   - Footer at top of step (justify-content: flex-start) - no empty space above footer
   - padding-bottom on .wwd-step-7 ensures footer bottom = viewport bottom when scrolled

**Files Modified:**
- `public/index.html` - Footer moved to separate wwd-step-7
- `public/styles.css` - Footer step styles, partners padding, overscroll behavior, scroll-snap removed
- `public/script.js` - Footer step excluded from fade transitions, never fades in/out

---

### v432 - 2026-02-01
**Status: Previous**

**Transition Timing & Scroll Behavior Fixes:**

Fixed the gap between Vision and How pages, locked How page content during pillar cycling, and fixed Hub page so all elements scroll together as a unit.

**Changes Made:**

1. **Vision → How Transition**
   - Reduced Vision page min-height from 180vh to 150vh
   - How content now triggers earlier (when page enters bottom 30% of viewport)
   - Eliminates the long scroll gap between Vision exit and How content load

2. **How Page Content Locked**
   - Removed parallax scrolling from How page content
   - Content stays LOCKED in position while cycling through 4 pillar categories
   - All pillar descriptions (1-4) now visible during their active states
   - Exit animation starts at 85% scroll progress (was 70%)

3. **Hub Page - All Elements Scroll Together**
   - Headline, body copy, and images now move UP as a UNIT
   - After stagger loading completes, all elements scroll together
   - Fixed issue where images were going behind headline/body
   - Proper z-ordering maintained during scroll

4. **Content Padding**
   - Changed from 300px to 200px for both top and bottom

**Files Modified:**
- `public/styles.css` - Reduced Vision page height, updated padding
- `public/script.js` - Fixed entrance timing, locked How content, unified Hub scrolling

---

### v431 - 2026-02-01
**Status: Previous**

**Loading Sequence Refinements and Page Title Updates:**

Fixed loading sequences for How, Hub, Advisory Council, and Partners pages. Updated page titles and content padding.

**Changes Made:**

1. **Page Title Text Updates**
   - "Leadership" → "Advisory Council"
   - "Ecosystem" → "Our Partners"

2. **Content Padding Update**
   - Changed `--content-padding-top` and `--content-padding-bottom` from 100px to 300px

3. **How Page Loading Sequence**
   - Sequence: Headline → 4 pillar categories → First pillar description → Pathway (arrows)
   - All elements load automatically when page enters viewport center
   - Fixed issue where Vision page title showed while How content was loading
   - Content now scrolls with page after initial load

4. **Hub Page Loading Sequence**
   - Sequence: Headline → Body copy → Images (left-right, top-bottom)
   - Headline and body copy now move with background after initial load
   - All elements scroll together as a unit

5. **Advisory Council & Partners Loading Sequence**
   - Sequence: Headline → Body copy (description) → Cards/items
   - Added stagger classes for headlines and descriptions

6. **Page Title Sync Fix**
   - Page titles now check if corresponding content is visible
   - Prevents mismatched title/content during transitions
   - Added visibility checks for fixed content containers

**Files Modified:**
- `public/index.html` - Updated page title text
- `public/styles.css` - Updated padding, added stagger styles for headlines/body
- `public/script.js` - Rewrote stagger sequences, fixed page title logic, updated entrance animations

---

### v430 - 2026-02-01
**Status: Previous**

**Animation/Loading Sequence Consistency Overhaul:**

Standardized page entry animations with consistent headline positioning, auto-loading staggered effects for multi-element sections, unified content padding, and footer adjustments.

**Changes Made:**

1. **Added Missing Page Titles (Steps 5 & 6)**
   - Added `Leadership` title for Advisory Council page
   - Added `Ecosystem` title for Partners page
   - Titles now appear in the left-side fixed container like other pages

2. **Headline Positioning for Multi-Element Pages**
   - Headlines on How, Hub, Advisory Council, and Partners pages now appear 100px below the nav (172px from top)
   - Changed `.wwd-how-content-fixed` and `.wwd-hub-content-fixed` from centered to top-based positioning
   - Added entrance animations for Council and Partners wrappers

3. **Auto-Loading Stagger Animations**
   - Four Pillars (Step 3): Items load top-to-bottom with 100ms delay
   - Hub Gallery (Step 4): Images load in grid order with 120ms delay
   - Council Cards (Step 5): Cards load left-to-right with 100ms delay
   - Partner Cards (Step 6): Cards load per category with 60ms delay
   - Added CSS classes `.stagger-item` and `.stagger-revealed`
   - Animations reset when scrolling back, replay on re-entry

4. **Consistent Vertical Padding**
   - Added CSS custom properties: `--content-padding-top`, `--content-padding-bottom`, `--nav-height`
   - Reduced step heights for tighter transitions:
     - Step 1 (Mission): 280vh → 250vh
     - Step 2 (Vision): 200vh → 180vh
     - Steps 3-4 (How, Hub): 200vh → 160vh
     - Steps 5-6: Content-based height (min-height: auto)
   - Applied consistent 100px padding top/bottom across all steps

5. **Footer Height Adjustment**
   - Changed footer from fixed 600px to content-based height
   - Set `padding-bottom: 30px` for exactly 30px below copyright
   - Enhanced bounce animation with multi-step easing
   - Added scroll position correction after bounce

**Files Modified:**
- `public/index.html` - Added page titles for steps 5 and 6
- `public/styles.css` - Updated positioning, padding, stagger animations, footer
- `public/script.js` - Added stagger animation system, entrance handlers, bounce fix

---

### v429 - 2026-01-31
**Status: Previous**

**Fixed Scroll Blocking Issues:**

**Problem:** Scrolling gets stuck right after Mission loads and at bottom of page when using trackpad.

**Root Causes Found:**
1. `scrollBehavior: 'smooth'` on WWD section conflicts with trackpad momentum scrolling
2. Video header wheel handler checked `isAnimating` BEFORE checking `video-complete`, potentially blocking scroll

**Fixes Applied:**

1. **Removed `scrollBehavior: 'smooth'` from WWD section (line 1739)**
   - This CSS property conflicts with native trackpad momentum
   - Trackpad already has smooth momentum built in
   - Removed to allow natural scrolling

2. **Fixed video header wheel handler (lines 504-528)**
   - Moved `video-complete` check to be the FIRST thing checked
   - If `video-complete` is true, immediately `return` without calling `preventDefault()`
   - This ensures the handler NEVER blocks scroll after entering the site

**Before:**
```javascript
if (isAnimating) {
  e.preventDefault(); // This could run even after video-complete!
  return;
}
if (!document.body.classList.contains('video-complete') && ...) {
```

**After:**
```javascript
if (document.body.classList.contains('video-complete')) {
  return; // FIRST check - never block after transition
}
if (isAnimating) {
  e.preventDefault();
  return;
}
```

**Files Modified:**
- `public/script.js` - Fixed wheel handler order, removed smooth scroll

---

### v428 - 2026-01-31
**Status: Previous**

**Removed All Residual Swipe/Gesture Navigation Code:**

**Problem Identified:**
The codebase had TWO competing navigation systems:
1. **OLD: Swipe/Gesture-based** (`initWwdSwipePages`) - used wheel events with `preventDefault()` to control page transitions
2. **NEW: Scroll-based** (`initWwdContinuousScroll` + `initAdvancedPageTransitions`) - uses scroll position to fade elements

Although `initWwdSwipePages()` was commented out, the code was still present and causing confusion. Additionally, the video header wheel handler could intercept wheel events even after the video transition was complete.

**Fixes Applied:**

1. **Fixed Video Header Wheel Handler (lines 514-516):**
   - Added `!document.body.classList.contains('video-complete')` check
   - Now only intercepts wheel events BEFORE video transition completes
   - After entering site, all wheel events pass through naturally

2. **Deleted Entire `initWwdSwipePages` Function:**
   - Removed ~776 lines of dead code (lines 585-1360)
   - This function was already disabled but still in codebase
   - Contained wheel event handlers with `preventDefault()` calls
   - Contained gesture detection, subsection transitions, pillar state management

3. **Updated Comments:**
   - Removed references to old swipe navigation
   - Updated `initLazyScrollReveal` comment
   - Updated `initWwdContinuousScroll` comment

**Architecture Now (Pure Scroll-Based):**
- Video header wheel handler: Only active BEFORE video-complete
- WWD section: NO wheel handlers - pure natural scrolling
- Animations: Driven by scroll position via `initAdvancedPageTransitions()`
- All pages visible: Via `initWwdContinuousScroll()`

**Files Modified:**
- `public/script.js` - Removed 776 lines of dead code, fixed video header handler

**Code Reduction:**
- Before: ~3200 lines
- After: ~2425 lines
- Removed: ~776 lines of swipe/gesture handling code

---

### v427 - 2026-01-31
**Status: Previous**

**Fixed Mission Page Image Cutoff & Height:**

**Root Cause Found:**
- Images positioned at: 20vh, 90vh, 160vh, 230vh
- But Mission page was only `min-height: 200vh`
- Last image at 230vh was beyond page bounds = CUT OFF

**Fixes Applied:**
1. Increased `.wwd-step-1` min-height from 200vh to 280vh
2. Added `min-height: 280vh` to `.wwd-mission-bg-scroll` container
3. Added `overflow: visible` to background container to prevent clipping

**Note on Scroll Architecture:**
- Body has `overflow: clip` and `height: 100vh` - NO page-level scrolling
- `.section-page` has `height: 100vh` with `overflow-y: scroll` - scrolling happens INSIDE section
- WWD content scrolls within the section container
- `initWwdSwipePages()` is DISABLED - no wheel event blocking on WWD section
- Only active wheel handler is on video header (for logo animation)

**CSS Changes:**
- `.wwd-step-1`: `min-height: 200vh` → `min-height: 280vh`
- `.wwd-mission-bg-scroll`: Added `min-height: 280vh` and `overflow: visible`

**Files Modified:**
- `public/styles.css` - Fixed Mission page height and container overflow

**Current Page Heights:**
- **Mission (Step 1):** 280vh (for 4 images ending at 230vh)
- **Vision (Step 2):** 200vh  
- **Four Pillars (Step 3):** 200vh
- **The Hub (Step 4):** 200vh

---

### v426 - 2026-01-31
**Status: Previous**

**Removed All Scroll Cooldowns - Scrolling Should Never Get Stuck:**

**REMOVED:**
1. ❌ Section entry cooldown (was 200ms) - REMOVED
2. ❌ Scroll boundary cooldown (was 200ms) - REMOVED  
3. ❌ Post-action cooldown (was 300ms) - REMOVED
4. ❌ Blanket `preventDefault()` on scroll down - REMOVED

**KEPT (only when necessary):**
- `preventDefault()` only during active animations
- `preventDefault()` only when triggering a specific page transition action
- Natural scrolling allowed everywhere else

**Changes:**
- Removed section entry cooldown check entirely
- Removed scroll boundary cooldown check entirely
- Removed post-action cooldown (minCooldown) check entirely
- Changed `wwdGestureActionTaken` block to NOT call preventDefault
- Moved `preventDefault()` to only specific transition actions, not blanket all scroll down
- Bounce animation at bottom no longer blocks scroll

**JavaScript Changes:**
- Lines 893-901: Removed section entry cooldown
- Lines 931-937: Removed scroll boundary cooldown
- Lines 945-955: Removed post-action cooldown
- Line 949: Removed blanket `e.preventDefault()` for scrolling down
- Only call `preventDefault()` when actually triggering pillar/page transition

**Files Modified:**
- `public/script.js` - Removed all scroll-blocking cooldowns

**Expected Result:**
- Scrolling should NEVER get stuck going down the page
- Natural smooth scrolling throughout
- Only blocks during active transition animations

---

### v425 - 2026-01-31
**Status: Previous**

**Hub Page Animation Fixes:**
- FIXED: Hub headline and body copy now stay vertically centered in browser throughout animation
- FIXED: Gallery and text now move in unison (both stay in place, no independent upward movement)
- FIXED: Gallery exits much later (85% instead of 70%) - stays visible longer

**Changes:**
1. **Text Centering:** Hub text (`wwd-hub-content-fixed`) now stays at `translate(-50%, -50%)` throughout all phases
   - Entrance: Fades in at center (no upward movement)
   - Visible: Stays centered (removed lock phase upward movement)
   - Exit: Fades out at center (no upward movement)

2. **Gallery Movement:** Gallery (`wwd-hub-gallery`) simplified to stay in place
   - Entrance: Moves up from bottom (15-40% scroll)
   - Visible: Stays in place at `translateY(0)` (40-85% scroll)
   - Exit: Fades out in place (85-95% scroll)

3. **Exit Timing:** Extended visibility window
   - Exit start: 70% → 85% (15% more scroll before fading)
   - Gallery now visible for 45% of page (was 30%)

**JavaScript Changes:**
- Removed text upward movement in lock phase (lines 2930-2940)
- Removed gallery upward movement during visible phase
- Changed `exitStartProgress` from 0.7 to 0.85
- Text and gallery now exit together with same timing

**Files Modified:**
- `public/script.js` - Updated `updateHubEntrance()` function

**Page Heights (All Pages):**
- **Mission (Step 1):** `min-height: 200vh; height: auto` (grows with images)
- **Vision (Step 2):** `min-height: 200vh; height: auto` (less content = shorter)
- **Four Pillars (Step 3):** `min-height: 200vh; height: auto`
- **The Hub (Step 4):** `min-height: 200vh; height: auto`

All pages have same baseline (200vh) but grow based on content amount.

---

### v424 - 2026-01-31
**Status: Previous**

**Scroll Blocking & Transition Timing Fixes:**
- FIXED: Scrolling getting stuck after page transitions
- FIXED: Long delay before Four Pillars appears after Vision page

**Changes:**
- Reduced post-action cooldown from 700ms to 300ms (was causing stuck feeling after transitions)
- Unified cooldown for all transitions (subsections and pillars) to 300ms
- Improved Four Pillars entrance timing - now starts fading in when page enters viewport bottom (instead of waiting for center)
- Increased Four Pillars entrance zone from 0.25vh to 0.5vh for faster appearance

**JavaScript Changes:**
- `minCooldown`: 700ms → 300ms for subsection transitions
- `howPageEntering`: Now triggers when `rect.top < viewportHeight` (was `rect.top < viewportCenter`)
- `entranceZone`: 0.25vh → 0.5vh for faster fade-in
- Changed entrance calculation from `distancePastCenter` to `distanceIntoViewport`

**Files Modified:**
- `public/script.js` - Reduced cooldowns, improved How page entrance timing

**Expected Improvements:**
- No more stuck scrolling after page transitions
- Four Pillars appears immediately after Vision text fades (no blank screen)
- Smoother overall scrolling experience

---

### v423 - 2026-01-31
**Status: Previous**

**Dynamic Page Heights & Scroll Improvements:**
- Set all WWD pages to `min-height: 200vh` baseline (allows content to enter from bottom, stay visible, exit from top)
- Changed all WWD steps to `height: auto` so pages grow naturally based on content
- Mission page (more images) will now be taller than Vision page (less content)
- Pages no longer forced to same artificial heights

**Scroll Blocking Fixes:**
- REDUCED section entry cooldown from 800ms to 200ms (was blocking scrolling too long)
- REDUCED scroll boundary cooldown from 800ms to 200ms (was causing stuck feeling)
- REMOVED `hubMomentumBlocking` flag that was preventing scrolling
- REMOVED bottom-of-section wheel event blocking
- REDUCED excessive `preventDefault()` calls - only prevent during actual animations
- Enabled natural scroll back to video header from mission page

**CSS Changes:**
- `.wwd-step`: Changed from `min-height: 100vh` to `min-height: 200vh; height: auto`
- `.wwd-step-1`: Changed from `min-height: 300vh` to `min-height: 200vh; height: auto`
- `.wwd-step-2`: Changed from `min-height: 250vh` to `min-height: 200vh; height: auto`
- `.wwd-step-3`: Changed from `min-height: 250vh` to `min-height: 200vh; height: auto`
- `.wwd-step-4`: Changed from `min-height: 250vh` to `min-height: 200vh; height: auto`
- `.wwd-step-6`: Changed from `height: 100vh !important` to `height: auto !important; min-height: 200vh`

**JavaScript Changes:**
- Section entry cooldown: 800ms → 200ms
- Scroll boundary cooldown: 800ms → 200ms
- Removed `hubMomentumBlocking` flag
- Removed bottom-of-section wheel blocking
- Improved scroll-up logic to allow natural back-navigation to video header
- Reduced `preventDefault()` calls to only essential cases

**Preserved:**
- ✅ All fade in/out logic
- ✅ Text centering and sticky/fixed containers
- ✅ Parallax effects (Mission, Vision, Hub)
- ✅ Rotating words animation
- ✅ Logo animation
- ✅ All existing animations

**Files Modified:**
- `public/styles.css` - Updated all .wwd-step min-height values
- `public/script.js` - Removed scroll blocking, reduced cooldowns, enabled back-navigation

**Expected Improvements:**
- Smoother scrolling throughout site
- No more "stuck" feeling when scrolling
- Vision page transitions faster (less empty scroll space)
- Can scroll back to video header from mission page
- Each page height now matches its content

---

### v397 - 2026-01-30
**Status: Previous**

**Fixes for Section Structure:**
- Fixed WWD footer HTML structure - now properly nested inside wwd-step-5
- Fixed HTML indentation and closing tags for WWD footer
- Added !important to section-page styles to ensure they override section-specific styles
- Increased section-page z-index to 100 to ensure they're above other elements
- Added CSS for .wwd-footer-inner styling
- Made wwd-step-5 height: auto with min-height: 100vh to allow scrolling to footer

**Files Modified:**
- `public/index.html` - Fixed WWD footer HTML structure inside step 5
- `public/styles.css` - Added !important to section-page, increased z-index, added wwd-footer-inner and wwd-step-5 overrides

---

### v396 - 2026-01-30
**Status: Previous**

**THREE INDEPENDENT SECTIONS - Complete Redesign:**
- Created truly independent sections that cannot scroll into each other
- Each section (What We Do, Our Impact, The Urgency) is now a fixed, full-screen container
- Only ONE section is visible at a time - navigation switches between them
- Each section has internal scrolling with footer at the bottom

**Architecture Changes:**
- Body: `overflow: hidden; height: 100vh` - prevents page-level scrolling
- New `.section-page` CSS class: `position: fixed; display: none` by default
- `.section-page.active` shows the active section
- Navigation clicks switch which section has `.active` class

**Files Modified:**
- `public/index.html` - Added `section-page` class to WWD, Our Impact, Urgency sections; WWD has `active` by default
- `public/styles.css` - Added `.section-page` class system; updated body to `overflow: hidden`; simplified section-specific styles
- `public/script.js` - Added `initSectionSwitching()` function to handle navigation clicks and section switching

**Section Structure:**
1. What We Do: Mission → Vision → 4 Pillars → Council → Partners → Footer → END
2. Our Impact: Stories → Salary Journey → Demographics → Press → Footer → END
3. The Urgency: Stats → Quote → Footer → END

---

### v395 - 2026-01-30
**Status: Previous (Broken - sections still scrolled into each other)**

**CRITICAL FIX - Proper Section Isolation:**
- Fixed fundamental architecture issue where sections weren't truly isolated
- Moved all footers INSIDE their respective section containers (were previously outside)
- Converted all sections to 100vh containers with internal scrolling (overflow-y: auto)
- Each section now scrolls independently within its own viewport
- Footers now visible at bottom of each section's scrollable content
- Improved bounce animation - triggers on scroll event and prevents wheel events at bottom
- Sections can no longer scroll into each other - completely isolated
- Users must use navigation menu to switch between sections

**Files Modified:**
- `public/index.html` - Moved footers inside wwd-content, builder-stories container, and urgency container
- `public/styles.css` - Changed sections to height: 100vh with overflow-y: auto
- `public/script.js` - Updated initSectionScrollBoundaries to include WWD, improved bounce detection

**What Changed:**
- WWD: Footer now inside wwd-content div, section has overflow-y: auto
- Our Impact: Footer now inside builder-stories container, section is 100vh with overflow-y: auto  
- Urgency: Footer now inside urgency container, section is 100vh with overflow-y: auto

---

### v394 - 2026-01-30
**Status: Previous (Broken - footers were outside sections)**

**Footer Duplication & Section Isolation:**
- Removed simple section footers added in v393 (wwd-footer, section-footer)
- Duplicated full main footer to end of each major section (What We Do, Our Impact, The Urgency)
- Each section now has complete footer with logo, tagline, email signup, social links, and navigation
- Disabled automatic scrolling between sections - sections are now completely isolated
- Removed exitWwdSection() function - WWD no longer auto-scrolls to Our Impact
- Removed scroll-up handler from Our Impact section
- Added bounce animation when reaching bottom of any section
- Users must use navigation menu or footer links to move between sections

**Files Modified:**
- `public/index.html` - Removed v393 footers, added full footer after WWD, Our Impact, and Urgency sections
- `public/styles.css` - Removed v393 footer styles, added bounce animation keyframes
- `public/script.js` - Removed updateWwdFooter() function, removed exitWwdSection(), added scroll boundary detection with bounce for all sections

---

### v393 - 2026-01-30
**Status: Previous**

**Added Footer Elements to All Sections:**
- Added footer navigation to What We Do section (fixed at bottom, visible on Step 5 - Partners)
- Added footer navigation to Our Impact section
- Added footer navigation to The Urgency section
- Footer includes Privacy Policy, Terms of Use, Contact links and copyright
- WWD footer shows/hides dynamically based on current subsection (visible only on Partners)
- Section footers are always visible at bottom of their respective sections

**Files Modified:**
- `public/index.html` - Added wwd-footer, section-footer elements to WWD, Our Impact, and Urgency sections
- `public/styles.css` - Added .wwd-footer, .section-footer styling with responsive mobile adjustments
- `public/script.js` - Added updateWwdFooter() function and calls throughout subsection transitions

---

### v392 - 2026-01-30
**Status: Previous**

**Major Site Restructure - Advisory Council & Partners moved to What We Do:**
- Removed The Hub as standalone section
- Moved Advisory Council to WWD Step 4 (after Four Pillars)
- Moved Our Partners to WWD Step 5 (after Council)
- Updated navigation: removed "The Hub" link
- Navigation now shows: What We Do, Our Impact, The Urgency, Get Updates
- Updated WWD to have 5 subsections: Mission, Vision, How, Leadership, Ecosystem
- Exit from WWD now scrolls to Our Impact (formerly Builders)
- Scroll back from Our Impact returns to Partners (Step 5)

**Files Modified:**
- `public/index.html` - Restructured sections, moved Council/Partners into WWD, removed hub-section
- `public/script.js` - Updated maxSubsection to 5, added step4/step5 transitions, updated scroll behavior
- `public/styles.css` - Added wwd-council-wrapper and wwd-partners-wrapper styling, removed hub-section styles

---

### v391 - 2026-01-29
**Status: Previous**

**Navigation bar blur effect:**
- Added 60% opacity background with frosted glass effect
- Implemented backdrop-filter with 20px blur and 180% saturation
- Fixed content positioning to allow text/images to show through nav with blur
- Changed .wwd overflow from hidden to visible
- Content now extends behind nav for proper blur effect

**Files Modified:**
- `public/styles.css` - Updated .nav, .nav.scrolled, .nav.hidden-on-video, body.logo-at-top .nav.hidden-on-video, .wwd, .wwd-step
- `public/script.js` - Updated nav background animation to use rgba with backdrop-filter

---

### v390 - 2026-01-29
**Status: Previous**

**Footer button swipe direction:**
- Changed from left-to-right to bottom-to-top

**Files Modified:**
- `public/styles.css`

---

### v389 - 2026-01-29
**Status: Previous**

**Footer button hover animation:**
- Hover state: black background with white text
- Swipe animation: background slides in from left
- Uses background-position transition on gradient

**Files Modified:**
- `public/styles.css`

---

### v388 - 2026-01-29
**Status: Previous**

**Footer form gap:**
- Gap between input and button: 24px → 19px (reduced by 5px)

**Files Modified:**
- `public/styles.css`

---

### v387 - 2026-01-29
**Status: Previous**

**Footer input/button alignment:**
- Changed align-items: center → flex-end
- Input underline now aligns with button bottom

**Files Modified:**
- `public/styles.css`

---

### v386 - 2026-01-29
**Status: Previous**

**Footer button styling:**
- Changed from solid black to outline (1px black border)
- Background: transparent
- Text: black

**Files Modified:**
- `public/styles.css`

---

### v385 - 2026-01-29
**Status: Previous**

**Footer spacing:**
- Added 5px gap between phrase and input field (margin-top: -40px → -35px)

**Files Modified:**
- `public/styles.css`

---

### v384 - 2026-01-29
**Status: Previous**

**Footer input field:**
- Added 3px more padding between text and line (now 8px total)
- Removed gradient animation
- Focus state: 3px solid black line

**Files Modified:**
- `public/styles.css`

---

### v383 - 2026-01-29
**Status: Previous**

**Footer input field styling:**
- Padding reduced: 16px → 5px (space between text and underline)
- Focus state: line thickens to 3px
- Animated gradient on focus: cycles through pink → green → blue

**Files Modified:**
- `public/styles.css` - input padding, focus animation

---

### v382 - 2026-01-29
**Status: Previous**

**Footer spacing adjustments:**
- Input field: moved up 30px (margin-top: -40px)
- Gap to pursuit.org: reduced by 50px (now 30px)
- Social icons: added 30px margin-bottom to separate from copyright

**Files Modified:**
- `public/styles.css`

---

### v381 - 2026-01-29
**Status: Previous**

**New typography class + spacing:**
- Created `footer-medium-semibold` (20px, 600 weight)
- Moved tagline and input field down 20px (margin-top: -30px → -10px)

**Files Modified:**
- `public/styles.css`

---

### v380 - 2026-01-29
**Status: Previous**

**New typography class:**
- Created `footer-small-regular` (15px, 400 weight)
- Applied to copyright text

**Updated class system:**
| Class | Size | Weight |
|-------|------|--------|
| footer-large-semibold | 30px | 600 |
| footer-large-regular | 30px | 400 |
| footer-medium-regular | 20px | 400 |
| footer-small-semibold | 15px | 600 |
| footer-small-regular | 15px | 400 |

**Files Modified:**
- `public/styles.css` - new class
- `public/index.html` - applied to copyright

---

### v379 - 2026-01-29
**Status: Previous**

**Fixed font conflict:**
- Removed `form-input` and `form-button` classes from footer elements
- These generic classes were setting `font-family: 'Inter'` which overrode Fractul
- Footer input/button now only use `footer-input` and `footer-button` classes

**Files Modified:**
- `public/index.html` - removed conflicting classes

---

### v378 - 2026-01-29
**Status: Previous**

**Fixed font on input/button with explicit values:**
- `inherit` doesn't work well with classes on the same element
- Now using explicit values with !important:
  - font-family: "fractul-variable", sans-serif
  - font-size: 20px
  - font-weight: 400
- Applied to .footer-input, .footer-button, and ::placeholder

**Files Modified:**
- `public/styles.css`

---

### v377 - 2026-01-29
**Status: Previous**

**Ensure input inherits Fractul font:**
- Added font-family: inherit, font-size: inherit, font-weight: inherit to .footer-input
- Both input and button now explicitly inherit from .footer-medium-regular (Fractul)

**Files Modified:**
- `public/styles.css`

---

### v376 - 2026-01-29
**Status: Previous**

**Fixed button font size:**
- Added font-family: inherit, font-size: inherit, font-weight: inherit to .footer-button
- Buttons have browser defaults that override class styling - now forced to inherit

**Files Modified:**
- `public/styles.css`

---

### v375 - 2026-01-29
**Status: Previous**

**All footer classes letter-spacing set to 0:**
- footer-large-semibold: 0.05em → 0
- footer-large-regular: already 0
- footer-medium-regular: 0.05em → 0
- footer-small-semibold: 0.05em → 0

**Files Modified:**
- `public/styles.css`

---

### v374 - 2026-01-29
**Status: Previous**

**Fixed input/button font size:**
- Removed hardcoded font-size: 16px from .footer-input
- Now properly inherits 20px from .footer-medium-regular class

**Files Modified:**
- `public/styles.css`

---

### v373 - 2026-01-29
**Status: Previous**

**Footer input placeholder styling:**
- Placeholder text now inherits font styling from parent (footer-medium-regular)

**Files Modified:**
- `public/styles.css` - placeholder inherits font properties

---

### v372 - 2026-01-29
**Status: Previous**

**Footer input field:**
- Brought down 20px (margin-top: -30px)

**Files Modified:**
- `public/styles.css`

---

### v371 - 2026-01-29
**Status: Previous**

**Footer spacing:**
- Input field moved up 50px
- Gap between form and pursuit.org: 80px

**Files Modified:**
- `public/styles.css` - footer-form margins

---

### v370 - 2026-01-29
**Status: Previous**

**Footer layout simplified:**
- Removed "Let's build–together." heading
- Input field + button moved directly under tagline
- Button now shows "Get Involved" text (replaced arrow)
- Input field uses footer-medium-regular
- 2-column layout: brand (with form) | nav links

**Files Modified:**
- `public/index.html` - restructured footer
- `public/styles.css` - 2-column grid, button text styling

---

### v369 - 2026-01-29
**Status: Previous**

**Footer layout restructure:**
- 3 columns: brand | signup | nav links
- Input field directly under "Let's build–together."
- Added "Get Involved" below signup form
- Button: pill shape, black background, white arrow
- Nav links (Privacy Policy, Terms, Contact): stacked, right-aligned, top-aligned with logo
- Removed border line above copyright
- Copyright moved up

**Files Modified:**
- `public/index.html` - restructured footer
- `public/styles.css` - new 3-column layout, button styling, nav links

---

### v368 - 2026-01-29
**Status: Previous**

**Footer logo adjustments:**
- Moved back to original position (removed negative margins)
- Scaled down 50% (120px → 60px)

**Files Modified:**
- `public/styles.css`

---

### v367 - 2026-01-29
**Status: Previous**

**Footer logo changed:**
- From: AIJI_Logo_Acronym_Black.svg
- To: AIJI_Logo_Acronym_Background.svg

**Files Modified:**
- `public/index.html`

---

### v366 - 2026-01-29
**Status: Previous**

**footer-large-regular letter-spacing:**
- Changed from 0.05em to 0

**Files Modified:**
- `public/styles.css`

---

### v365 - 2026-01-29
**Status: Previous**

**Applied footer-large-regular to tagline:**
- "Let's build an AI-first future. For all of us." now uses 30px, 400 weight

**Files Modified:**
- `public/index.html` - tagline class

---

### v364 - 2026-01-29
**Status: Previous**

**New typography class:**
- `footer-large-regular` - 30px, 400 weight

**Updated class system:**
| Class | Size | Weight |
|-------|------|--------|
| `footer-large-semibold` | 30px | 600 |
| `footer-large-regular` | 30px | 400 |
| `footer-medium-regular` | 20px | 400 |
| `footer-small-semibold` | 15px | 600 |

**Files Modified:**
- `public/styles.css` - new class

---

### v363 - 2026-01-29
**Status: Previous**

**Footer tagline to sentence case:**
- "Let's build an AI-first future. For all of us."

**Files Modified:**
- `public/index.html` - tagline text

---

### v362 - 2026-01-29
**Status: Previous**

**Footer fine-tuning:**
- Social icons: brought down 10px (margin-top: -10px)
- Social icons gap: 10px between logos
- Tagline: moved down 20px (margin-top: -30px)

**Files Modified:**
- `public/styles.css` - social icons, tagline margin

---

### v361 - 2026-01-29
**Status: Previous**

**Footer spacing adjustments:**
- Social icons gap: reduced by 20px (now 0px)
- Social icons: moved up 20px
- Tagline "LET'S BUILD AN...": moved up 50px

**Files Modified:**
- `public/styles.css` - social icons gap/margin, tagline margin

---

### v360 - 2026-01-29
**Status: Previous**

**Footer simplification:**
- Removed "Follow us" label
- Social icons now 15px below pursuit.org

**Files Modified:**
- `public/index.html` - removed Follow us span
- `public/styles.css` - footer-links-section gap 15px

---

### v359 - 2026-01-29
**Status: Previous**

**Footer spacing adjustments:**
- Logo: pushed left another 10px (now -20px total)
- Logo to tagline gap: halved again (now 1/4 of original)
- Social icons gap: 20px

**Files Modified:**
- `public/styles.css` - logo margin, social icons gap

---

### v358 - 2026-01-29
**Status: Previous**

**Footer refinements:**
- Logo: 120px (50% bigger), moved left 10px, up 10px
- Logo to tagline gap: reduced by half
- Tagline line-height: 1.1 (reduced by ~50%)
- "Follow us" and "Let's build–together." changed to sentence case

**Files Modified:**
- `public/styles.css` - logo size/position, tagline line-height
- `public/index.html` - sentence case text

---

### v357 - 2026-01-29
**Status: Previous**

**Footer styling updates:**

**Logo:**
- Size: 80px (200% of original 40px)
- Aligned left with tagline

**Typography classes updated:**
- Removed `text-transform` from all footer classes (case controlled by input)
- `footer-large-semibold`: 30px, 600 weight (50% increase)
- `footer-medium-regular`: NEW - 20px, 400 weight
- `footer-small-semibold`: 15px, 600 weight

**Class applications:**
- Main tagline: `footer-large-semibold` (uppercase in HTML)
- PURSUIT.ORG, FOLLOW US, LET'S BUILD–TOGETHER: `footer-medium-regular`
- Copyright, links: `footer-small-semibold`

**Layout:**
- "Let's build..." line break after "FUTURE."
- Social icons now below "FOLLOW US" with 6px gap

**Files Modified:**
- `public/styles.css` - updated classes, logo size, social layout
- `public/index.html` - uppercase text, new class applications

---

### v356 - 2026-01-29
**Status: Previous**

**Typography class refactoring:**

**Renamed:**
- `body-copy-regular` → `body-large-regular`

**New classes created:**
- `footer-large-semibold` - 20px, 600 weight, title case, letter-spacing 0.05em
- `footer-small-semibold` - 15px (75%), 600 weight, title case, letter-spacing 0.05em

**Applied to footer:**
- Main footer elements (tagline, pursuit.org, Follow us, signup title): `footer-large-semibold`
- Bottom bar (copyright, links): `footer-small-semibold`

**Files Modified:**
- `public/styles.css` - new typography classes, simplified footer styles
- `public/index.html` - renamed body-copy-regular → body-large-regular, added footer typography classes

---

### v355 - 2026-01-29
**Status: Previous**

**Footer redesign:**

**Left side:**
- Replaced text logo with `AIJI_Logo_Acronym_Black.svg`
- Changed tagline to "Let's build an AI-First Future. For all of us." (page title style)
- "pursuit.org" link (page title style)
- "Follow us" label + X logo + Instagram logo (black icons)

**Right side:**
- Title changed to "Let's Build–together." (page title style)
- Input field: transparent background, thin black underline
- Submit button: pink circle with arrow

**Bottom bar:**
- Copyright and links: page title style (uppercase, 20px, 600 weight)

**Files Modified:**
- `public/index.html` - new footer HTML structure
- `public/styles.css` - complete footer restyling

---

### v354 - 2026-01-29
**Status: Previous**

**Major refactor: Renamed "hero" → "wwd" (What We Do):**
- Renamed all CSS classes: `.hero` → `.wwd`, `.hero-*` → `.wwd-*`
- Renamed all CSS variables: `--hero-*` → `--wwd-*`
- Renamed JS variables: `heroSection` → `wwdSection`, `isInHeroSection` → `isInWwdSection`, etc.
- Renamed JS functions: `initHeroSwipeSubsections` → `initWwdSwipePages`, `exitHeroSection` → `exitWwdSection`
- Updated all comments to reflect new naming

**Naming convention established:**
- **Section** = "wwd" (What We Do)
- **Page** = Mission, Vision, How, Hub (still using "step" in code, can rename later)
- **State** = Pillar states 01-04

This sets up a pattern for future sections: `.impact`, `.collab`, etc.

**Files Modified:**
- `public/index.html` - all class names
- `public/styles.css` - all selectors and variables
- `public/script.js` - all variables, functions, and selectors

---

### v353 - 2026-01-29
**Status: Previous**

**Four Pillars color inheritance fix:**
- Added `color: inherit` to `.hero-initiative-num` and `.hero-initiative-name`
- This overrides the `.body-copy-regular` color (#333) so both number and name
  properly inherit the parent's color (#AAAAAA inactive, #000 active)

**Files Modified:**
- `public/styles.css` - color inherit on num and name

---

### v352 - 2026-01-29
**Status: Previous**

**Four Pillars interaction improvements:**
- Changed inactive category color from #ccc to #AAAAAA
- Changed cursor to pointer on categories to indicate clickability
- Added click handlers to all categories (01-04) in "The How" subsection
  - Clicking a category jumps directly to that state
  - Only works when in the Pillars subsection
  - Blocks during animations

**Files Modified:**
- `public/styles.css` - color #AAAAAA, cursor pointer
- `public/script.js` - click event listeners on initiative items

---

### v351 - 2026-01-28
**Status: Previous**

**Hub scroll momentum fix v2:**
- Added `hubMomentumBlocking` flag to completely block wheel event processing
- The issue: after `isAnimating = false`, wheel events were processed but stored up
- The fix:
  - Set `hubMomentumBlocking = true` at start of transition
  - Keep it true until 500ms AFTER the 600ms transition (1100ms total)
  - Wheel handler blocks and prevents default when this flag is true
  - Increased delay to 500ms for momentum to fully dissipate
  - This ensures no scroll events are processed during the entire transition window

**Files Modified:**
- `public/script.js` - added hubMomentumBlocking flag and extended blocking

---

### v350 - 2026-01-28
**Status: Previous**

**Hub scroll momentum fix:**
- Body copy to images: 60px → 80px
- Fixed Hub landing position affected by swipe aggressiveness:
  - Set `overflow: hidden` on Hub BEFORE transition starts
  - This prevents wheel events from affecting scrollTop during transition
  - Re-enable overflow 200ms after transition completes to let momentum die
  - This ensures Hub always starts at top regardless of swipe intensity

**Files Modified:**
- `public/styles.css` - margin-bottom to 80px
- `public/script.js` - overflow hidden during 3→4 transition

---

### v349 - 2026-01-28
**Status: Previous**

**Hub spacing and scroll fix:**
- Body copy to images: 60px → 80px
- Added more aggressive scroll reset for Hub transition:
  - Reset before transition
  - Reset right before showing step
  - Reset after activation
  - Reset with requestAnimationFrame to ensure DOM update

**Files Modified:**
- `public/styles.css` - margin-bottom to 80px
- `public/script.js` - multiple scroll resets in 3→4 transition

---

### v348 - 2026-01-28
**Status: Previous**

**Hub spacing adjusted:**
- Headline to body copy: 30px → 40px
- Body copy to images: 50px → 60px

**Files Modified:**
- `public/styles.css`

---

### v347 - 2026-01-28
**Status: Previous**

**Fixed scroll position on Hub transition:**
- Reset `step4.scrollTop = 0` BEFORE the transition starts
- This prevents momentum from aggressive swipes carrying over
- Still reset again after animation completes for safety

**Files Modified:**
- `public/script.js` - Added early scroll reset in 3→4 transition

---

### v346 - 2026-01-28
**Status: Previous**

**Hub body copy max-width:**
- Changed from 1000px to 975px

**Files Modified:**
- `public/styles.css`

---

### v345 - 2026-01-28
**Status: Previous**

**Hub body copy max-width:**
- Changed from 950px to 1000px

**Files Modified:**
- `public/styles.css`

---

### v344 - 2026-01-28
**Status: Previous**

**Hub body copy max-width adjusted:**
- Changed from 900px to 950px

**Files Modified:**
- `public/styles.css`

---

### v343 - 2026-01-28
**Status: Previous**

**Reverted Hub text padding changes:**
- Removed responsive padding from .hero-hub-text (was causing layout issues)
- Restored 130px top padding on .hero-step-4
- Body copy constrained by max-width: 900px instead

**Files Modified:**
- `public/styles.css` - Removed .hero-hub-text media query padding

---

### v342 - 2026-01-28
**Status: Previous**

**Hub top padding restored:**
- Increased desktop top padding back to 150px (was reduced to 130px earlier)

**Files Modified:**
- `public/styles.css` - Hub step-4 top padding

---

### v341 - 2026-01-28
**Status: Previous**

**Hub body copy width constrained:**
- Set max-width: 900px on body copy for better readability
- Body copy now appears narrower, closer to headline visual width

**Files Modified:**
- `public/styles.css` - Hub body copy max-width

---

### v340 - 2026-01-28
**Status: Previous**

**Hub text padding matches Four Pillars:**
- Added responsive padding to `.hero-hub-text` wrapper
- 601-1024px: 25px padding
- 1025-1400px: 80px padding (matches Four Pillars)
- Body copy now has same width constraints as headline

**Files Modified:**
- `public/styles.css` - Added responsive padding to Hub text wrapper

---

### v339 - 2026-01-28
**Status: Previous**

**Pillar category names use body-copy-regular:**
- Applied `.body-copy-regular` class to `.hero-initiative-name` elements
- Category names now match body copy size (27px - 43px)

**Files Modified:**
- `public/index.html` - Added body-copy-regular to initiative names
- `public/styles.css` - Simplified .hero-initiative-name

---

### v338 - 2026-01-28
**Status: Previous**

**Body copy size reduced to 90%:**
- Before: clamp(1.875rem, 3vw, 3rem) = 30px - 48px
- After: clamp(1.6875rem, 2.7vw, 2.7rem) = 27px - 43px

**Files Modified:**
- `public/styles.css` - Updated .body-copy-regular font-size

---

### v337 - 2026-01-28
**Status: Previous**

**Created reusable headline class:**
- Added `.headline-regular` class with shared typography styles
- Font: fractul-variable, clamp(2.5rem, 4vw, 4rem), weight 400, line-height 1.1, color #000
- Applied to all headlines in "What We Do" section:
  - `.hero-text-pursuit` (The Mission)
  - `.hero-text-collective-top` (The Vision)
  - `.hero-initiatives-headline` (Four Pillars)
  - `.hero-hub-headline` (The Hub)
- Simplified existing CSS classes by removing duplicate typography

**Files Modified:**
- `public/styles.css` - Added .headline-regular class, simplified existing classes
- `public/index.html` - Added headline-regular class to all headlines

---

### v336 - 2026-01-28
**Status: Previous**

**Created reusable typography class:**
- Added `.body-copy-regular` class with shared typography styles
- Font: fractul-variable, clamp(1.875rem, 3vw, 3rem), weight 400, line-height 1.3, color #333
- Applied to `.hero-hub-body` and `.hero-initiative-desc` elements
- Simplified existing CSS classes by removing duplicate typography

**Files Modified:**
- `public/styles.css` - Added .body-copy-regular class, simplified existing classes
- `public/index.html` - Added body-copy-regular class to Hub body and Four Pillars descriptions

---

### v335 - 2026-01-28
**Status: Previous**

**Hub desktop top padding adjusted:**
- Changed from 120px to 130px

**Files Modified:**
- `public/styles.css`

---

### v334 - 2026-01-28
**Status: Previous**

**Hub desktop top padding adjusted:**
- Changed from 100px to 120px

**Files Modified:**
- `public/styles.css` - Hub desktop top padding to 120px

---

### v333 - 2026-01-28
**Status: Previous**

**Hub desktop top padding reduced:**
- Changed desktop top padding from 150px to 100px
- Matches the visual position of the Four Pillars headline

**Files Modified:**
- `public/styles.css` - Hub desktop top padding reduced

---

### v332 - 2026-01-28
**Status: Previous**

**Hub mobile spacing to match Four Pillars:**
- Changed Hub mobile top padding from 150px to 30px
- With 40px title padding, total = 70px from step top to title (matches Four Pillars)
- Desktop remains at 150px (content scrolls, not centered)

**Files Modified:**
- `public/styles.css` - Hub mobile top padding matches Four Pillars

---

### v331 - 2026-01-28
**Status: Previous**

**Scroll boundary pause increased:**
- Increased SCROLL_BOUNDARY_COOLDOWN from 400ms to 800ms
- This creates a more noticeable pause when hitting the bottom of a scrollable subsection before transitioning

**Files Modified:**
- `public/script.js` - Increased scroll boundary cooldown

---

### v330 - 2026-01-28
**Status: Previous**

**Hub section bottom padding:**
- Increased bottom padding from 40px to 100px
- Applied to both desktop and mobile

**Files Modified:**
- `public/styles.css` - Increased Hub section bottom padding

---

### v329 - 2026-01-28
**Status: Previous**

**Fixed Hub title positioning:**
- Root cause: Parent `transform` on `.hero-step` breaks `position: fixed` (CSS spec)
- Solution: Added separate fixed title element outside the scrolling step
- Desktop: Fixed title shows when step-4 is active (CSS sibling selector)
- Mobile: Inline title inside step for flow layout

**Files Modified:**
- `public/index.html` - Added `.hero-hub-title-fixed` outside step, `.hero-hub-title-mobile` inside
- `public/styles.css` - Styles for fixed/mobile Hub titles

---

### v328 - 2026-01-28
**Status: Previous**

**Hub gallery width matches Four Pillars table:**
- Applied same max-width (1400px) and responsive padding as Four Pillars
- Mobile: 25px padding
- Tablet (601-1024px): 25px padding
- Desktop (1025-1400px): 80px padding
- 2 images now span the same width as the Four Pillars table

**Files Modified:**
- `public/styles.css` - Hub gallery width/padding to match Four Pillars

---

### v327 - 2026-01-28
**Status: Previous**

**Hub title fixed positioning:**
- "The Hub" title now uses `position: fixed` on desktop so it stays at vertical center while content scrolls
- On mobile (≤900px), title remains in flow and scrolls with content

**Files Modified:**
- `public/styles.css` - Fixed Hub subsection title positioning

---

### v326 - 2026-01-28
**Status: Previous**

**Hub section - adjust top padding:**
- Increased top padding from 100px to 150px (+50px as requested)
- Applied to both desktop and mobile

**Files Modified:**
- `public/styles.css` - Increased Hub section top padding to 150px

---

### v325 - 2026-01-28
**Status: Previous**

**Hub section - increase top padding:**
- Increased top padding from 40px to 100px on both desktop and mobile
- This should give enough space for the headline to be visible below the nav

**Files Modified:**
- `public/styles.css` - Increased Hub section top padding

---

### v324 - 2026-01-28
**Status: Previous**

**Hub section - fix content starting at top:**
- Added `flex-direction: column !important` to stack content vertically
- Override auto margins that were centering content: `margin-top: 0 !important`
- Both desktop and mobile now have explicit overrides
- Content should now start at top showing headline first, then scroll to images

**Files Modified:**
- `public/styles.css` - Fixed Hub section content alignment

---

### v323 - 2026-01-28
**Status: Previous**

**Hub section scroll fix:**
- Added top padding (120px desktop) so headline is visible below nav
- Mobile: align-items and justify-content set to flex-start
- Mobile: padding 30px 20px 40px 20px (matches step-3 pattern)
- Content starts at top, user scrolls down to see images
- scrollTop = 0 already set in JS for section transitions

**Files Modified:**
- `public/styles.css` - Fixed Hub section padding and alignment

---

### v322 - 2026-01-28
**Status: Previous**

**Hub styling updates:**
- Headline: Matches initiatives headline (fractul-variable, 400 weight, clamp(2.5rem, 4vw, 4rem))
- Body copy: Matches initiative descriptions (fractul-variable, clamp(1.875rem, 3vw, 3rem), #333)
- Gallery: Full width minus 20px padding on each side
- No gap between images
- No rounded corners
- Images can scroll past viewport (overflow scroll works like pillars)
- Added hero-hub-text wrapper for proper spacing

**Files Modified:**
- `public/index.html` - Added hero-hub-text wrapper
- `public/styles.css` - Updated Hub styling, added to mobile headline styles

---

### v321 - 2026-01-28
**Status: Previous**

**Added new subsection: The Hub (subsection 4)**
- Title: "THE HUB"
- Headline: "One Hub. Infinite Futures."
- Body copy about One Court Square
- 2-column image gallery with 4 renderings (Reception, Auditorium, Workspace, Cafeteria)
- Single column on mobile (< 600px)
- Updated JS navigation: Pillars → Hub → Builders
- Return from Builders now goes to Hub (subsection 4)

**Files Modified:**
- `public/index.html` - Added hero-step-4 HTML
- `public/styles.css` - Added Hub styling
- `public/script.js` - Updated maxSubsection to 4, added transitions

---

### v320 - 2026-01-28
**Status: Previous**

**Fix: Scroll up from Builders goes to header:**
- Added wheel event listener on Builders section
- When scrolling up at top of Builders, smoothly scrolls to hero section
- Restores hero section to subsection 3 (Four Pillars) at state 4
- 800ms debounce to prevent multiple triggers

**Files Modified:**
- `public/script.js`

---

### v319 - 2026-01-28
**Status: Previous**

**Fix: Scroll up skipping subsections:**
- Added post-action cooldown check based on `lastStateChangeTime`
- Subsection transitions: 700ms cooldown (animations are 600ms)
- Pillar transitions: 300ms cooldown (instant transitions)
- Prevents momentum from triggering multiple actions after animation completes

**Files Modified:**
- `public/script.js`

---

### v318 - 2026-01-28
**Status: Previous**

**Fix: Scroll up not locking / going to header:**
- Now `preventDefault()` for ALL scroll up events in hero section
- Added gesture tracking (`heroGestureActionTaken = true`) for scroll up at subsection 1
- At subsection 1, scroll to header uses controlled `window.scrollTo` with smooth behavior
- Prevents uncontrolled page scrolling that was bypassing subsections

**Files Modified:**
- `public/script.js`

---

### v317 - 2026-01-28
**Status: Previous**

**Fix: Vision subsection gap too big:**
- Changed `min-height: 100%` to `min-height: auto` on `.hero-step-2-layout`
- Added explicit `margin-top: 0; padding-top: 0` to remove extra space
- Added `margin: 0` to headline styles on mobile

**Files Modified:**
- `public/styles.css`

---

### v316 - 2026-01-28
**Status: Previous**

**Fix: Letter dispersion constrained to viewport:**
- `getRandomCoordinates()` now uses `window.innerWidth` and `window.innerHeight`
- X spread: 80% of viewport width (max 600px)
- Y spread: 60% of viewport height (max 400px)
- Letters now stay within the visible screen on all devices

**Files Modified:**
- `public/script.js`

---

### v315 - 2026-01-28
**Status: Previous**

**Fix: Rotating word line breaking at word boundaries:**
- Modified `buildWord()` function to wrap each word in a `<span>` with `white-space: nowrap`
- Line breaks now only happen between words, not mid-word
- "AI-Powered World" will break as "AI-Powered" / "World" instead of "AI-Powered Worl" / "d"

**Files Modified:**
- `public/script.js`

---

### v314 - 2026-01-28
**Status: Previous**

**Vision subsection mobile fixes (continued):**
- Changed from `min-height` to fixed `height: 160px` on title wrapper for true isolation
- Added `word-break: keep-all`, `overflow-wrap: normal`, `hyphens: none` to prevent mid-word breaks
- Changed gap to 40px to match other subsections
- Added flex-shrink/grow: 0 to prevent container size changes

**Files Modified:**
- `public/styles.css`

---

### v313 - 2026-01-28
**Status: Previous**

**Vision subsection mobile fixes:**
- Increased gap from 30px to 50px between headline and rotating words
- Changed background image to `position: fixed` on mobile for viewport centering
- Added fixed min-height (140px) to title wrapper with `justify-content: flex-end`
- This keeps baseline fixed - text grows upward when words wrap to 2 lines

**Files Modified:**
- `public/styles.css`

---

### v312 - 2026-01-28
**Status: Previous**

**Fix: Subsection title behind nav (targeted fix):**
- Reverted v311 changes that broke other sections
- Added `padding-top: 40px` specifically to `.hero-subsection-title` on mobile
- More targeted approach that doesn't affect other elements

**Files Modified:**
- `public/styles.css`

---

### v311 - 2026-01-28
**Status: Reverted**

**Fix: Subsection title behind nav on mobile:**
- Increased top padding from 40px to 100px on mobile hero-steps
- Removed auto margins on first/last child (was interfering with scroll position)
- REVERTED: Broke other sections

**Files Modified:**
- `public/styles.css`

---

### v310 - 2026-01-28
**Status: Previous**

**Fix: Scroll position not reset when re-entering hero section:**
- Added scroll reset for all steps (step1, step2, step3) when hero section becomes visible
- Resets `scrollTop = 0` and `scrollBoundaryTime = 0` in IntersectionObserver callback
- Fixes headline cutoff when returning from Builders section

**Files Modified:**
- `public/script.js`

---

### v309 - 2026-01-28
**Status: Previous**

**Added scroll boundary cooldown:**
- Added 400ms pause after reaching scroll boundary before allowing transition
- `scrollBoundaryTime` tracks when user first hits top/bottom of scrollable content
- Prevents immediate transition when scrolling to edge
- Timer resets when entering new subsection or while actively scrolling

**Files Modified:**
- `public/script.js`

---

### v308 - 2026-01-28
**Status: Previous**

**Fix: Can't advance after scrolling + header cut off on return:**
- Reset `heroGestureActionTaken = false` when at scroll boundary (allows transition after scrolling to bottom)
- Reset `scrollTop = 0` on all hero-steps when entering them (fixes header cutoff on return)

**Files Modified:**
- `public/script.js`

---

### v307 - 2026-01-28
**Status: Previous**

**Fix: Page scrolling when scrolling within hero-step:**
- Changed from allowing natural scroll to manually scrolling hero-step element
- Always `preventDefault()` on hero section wheel events
- Manually adjust `scrollTop` on the active step element
- Prevents page from scrolling and revealing Builders section

**Files Modified:**
- `public/script.js`

---

### v306 - 2026-01-28
**Status: Previous**

**Fix: Next section showing through:**
- Added `background-color: #FFF3E9` to `.hero-step` to prevent Builders section from showing through during scroll

**Files Modified:**
- `public/styles.css`

---

### v305 - 2026-01-28
**Status: Previous**

**Overflow scroll support for tall content:**
- ✅ Hero steps now allow overflow scrolling when content exceeds viewport
- ✅ Scroll to bottom of content before advancing to next subsection
- ✅ Scroll to top of content before going back to previous subsection
- ✅ Hidden scrollbars for clean look
- ✅ Mobile CSS: Changed from `justify-content: center` to `flex-start` with auto margins
- ✅ Prevents headline cutoff on mobile when content overflows

**Files Modified:**
- `public/styles.css` - Added overflow-y: auto, hidden scrollbars, mobile centering fix
- `public/script.js` - Added getScrollState() helper, scroll boundary detection

---

### v304 - 2026-01-28
**Status: Previous**

**Style update:**
- Changed subsection title font size from 0.875rem (14px) to 20px

**Files Modified:**
- `public/styles.css`

---

### v303 - 2026-01-28
**Status: Previous**

**Copy update:**
- Changed headline to "Four pillars. One vision. All of us will build the future of work–together."

**Files Modified:**
- `public/index.html`

---

### v302 - 2026-01-28
**Status: Previous**

**Copy update:**
- Changed headline to "Four pillars. One vision. All of us are building the future of work–together."

**Files Modified:**
- `public/index.html`

---

### v301 - 2026-01-28
**Status: Previous**

**Copy update:**
- Changed "Four pillars. One vision. This is how we're building the future of work." to "Four pillars. One vision. This is how we will build the future of work–together."

**Files Modified:**
- `public/index.html`

---

### v300 - 2026-01-28
**Status: Previous**

**Gesture Reset After ALL Subsection Animations**

**Change:**
- ✅ Added gesture reset after 1→2 subsection transition
- ✅ Added gesture reset after 3→2 regression
- ✅ Added gesture reset after 2→1 regression
- ✅ Reset includes: `heroGestureActionTaken`, `lastHeroWheelTime`, `lastStateChangeTime`
- ✅ Prevents momentum from blocking next intentional swipe after animation

**Files Modified:**
- `public/script.js` - Added gesture resets to advanceSubsection and regressSubsection

---

### v299 - 2026-01-28
**Status: Previous**

**Unified Gesture Detection with Proper Momentum Tracking**

**Change:**
- ✅ Track `lastHeroWheelTime` BEFORE any blocking checks (including `isAnimating`)
- ✅ Momentum events during 600ms animation now properly update wheel timestamp
- ✅ Prevents false "time gap" detection after animation ends
- ✅ Same gesture detection applies to subsections AND pillars
- ✅ One swipe = one step for entire hero section

**Files Modified:**
- `public/script.js` - Moved wheel time tracking to very start of handler

---

### v298 - 2026-01-28
**Status: Previous**

**Reduced subsection cooldown (broke sections)**
- Reduced cooldown from 500-1000ms to 150ms
- Issue: Too short, caused flying through sections

---

### v297 - 2026-01-28
**Status: Previous**

**Reverted to v294 approach (broke subsections)**
- Separated pillar gesture detection from subsection time-based cooldown
- Issue: Subsection transitions required too many swipes

---

### v296 - 2026-01-28
**Status: Previous**

**Action-based cooldowns (broke everything)**
- Used `timeSinceLastAction` instead of `timeSinceLastWheel`
- Different cooldowns for pillars (300ms) vs subsections (700ms)
- Issue: Flying through sections, long waits

---

### v295 - 2026-01-28
**Status: Previous**

**Unified Gesture Detection for Entire Hero Section**

**Change:**
- ✅ Applied same gesture detection logic to ALL hero section navigation
- ✅ Subsection 1→2→3 now uses gesture detection (was time-based cooldown)
- ✅ Going back (scroll up) now uses gesture detection
- ✅ Pillar navigation and exit to Builders unchanged
- ✅ Unified variables: `gestureActionTaken`, `lastWheelEventTime`
- ✅ Constants: `GESTURE_GAP=140ms`, `STRONG_SWIPE_THRESHOLD=50`, `ACTION_COOLDOWN=300ms`
- ✅ Cleaner, more consistent code

**Files Modified:**
- `public/script.js` - Unified gesture detection

---

### v291-v294 - 2026-01-28
**Status: Previous (consolidated)**

**Gesture detection evolution:** Bypass debounce, detailed logging, deltaY detection, strong swipe with cooldown

---

### v286-v290 - 2026-01-28
**Status: Previous (consolidated)**

**Gesture gap tuning:** 300ms → 150ms → 75ms → 100ms → 140ms

**One Swipe = One Pillar Step - Gesture Detection**

**Problem:**
- Aggressive trackpad swipes generate wheel events for 800-1000ms
- Simple cooldowns (400-600ms) weren't enough - events continued after cooldown expired
- Multiple pillar transitions happening from single long swipes

**Solution - Gesture Detection:**
- Track `pillarGestureActionTaken` flag per gesture
- Detect NEW gesture when gap between wheel events > 300ms
- On first wheel event of gesture: take action, set flag to true
- All subsequent wheel events in same gesture: ignored (flag is true)
- Reset flag only when new gesture is detected

**How it works:**
1. User swipes → generates many wheel events over ~800ms
2. First event: `NEW GESTURE detected`, action taken, flag = true
3. Remaining events: ignored because flag = true
4. User waits 300ms+ then swipes again
5. New gesture detected, flag reset, action taken

**Files Modified:**
- `public/script.js` - Added gesture detection variables and logic

---

### v277-v285 - 2026-01-28
**Status: Previous (consolidated)**

**Debugging and Iteration for Pillar Navigation:**
- v277-v278: Added console logging to debug swipe issues
- v279: Fixed lock never releasing by not resetting timer when blocked
- v280: Reduced timing values (80ms unlock, 200ms initial, 100ms guard)
- v281: Simplified to fixed 250ms lock period
- v282: Added more debugging logs
- v283: Extended lock to 400ms
- v284: Removed old resetStateUnlockTimer function, added version logging
- v285: Changed to timestamp-based 600ms cooldown (still not enough)

---

### v283 - 2026-01-28
**Status: Previous**

**One Swipe = One Step - Extended Lock Period**

**Problem:**
- With 80-250ms lock, aggressive swipes were still triggering multiple state changes
- Console showed states advancing every ~100ms within one swipe gesture

**Fix:**
- ✅ Extended lock period to 400ms - covers the full duration of most swipe gestures
- ✅ Removed debug logging for cleaner output
- ✅ Now one swipe truly equals one step, regardless of swipe intensity

**Files Modified:**
- `public/script.js` - Changed lock period from 250ms to 400ms

---

### v281 - 2026-01-28
**Status: Previous**

**One Swipe = One Step - Fixed Lock Period**

**Changes:**
- ✅ Simplified gesture handling: one swipe = one step regardless of intensity
- ✅ Fixed 250ms lock period after each action
- ✅ During lock period, ALL wheel events are ignored (no timer resetting)
- ✅ Removed timing guards and complex debouncing logic
- ✅ Cleaner, more predictable behavior

**How it works:**
1. First wheel event triggers the action immediately
2. Lock is set for exactly 250ms
3. All subsequent wheel events during lock are completely ignored
4. After 250ms, lock releases and next swipe is recognized

**Files Modified:**
- `public/script.js` - Simplified state transition logic with fixed lock period

---

### v280 - 2026-01-28
**Status: Previous**

**Faster Swipe Response in Pillars Subsection**

**Fixes:**
- ✅ Reduced unlock timer from 150ms to 80ms (faster gesture recognition)
- ✅ Reduced initial lock when entering subsection 3 from 500ms to 200ms
- ✅ Reduced timing guard between states from 200ms to 100ms
- ✅ v279: Fixed lock never releasing by not calling resetStateUnlockTimer() when blocked
- ✅ v278: Added debug logging for state transitions
- ✅ v277: Added debug logging for wheel events

**Files Modified:**
- `public/script.js` - Reduced timing values for faster response

---

### v276 - 2026-01-28
**Status: Previous**

**Fixed Transition to Builders Section**

**Fixes:**
- ✅ Lowered `isInHeroSection` visibility threshold from 0.8 (80%) to 0.3 (30%)
- ✅ Added 0.3 to IntersectionObserver threshold array
- ✅ This fixes the issue where the wheel event handler was blocked because `isInHeroSection` was false

**Root Cause:**
- The hero section visibility wasn't reaching 80% on mobile due to CSS changes
- This caused `isInHeroSection` to be `false`, blocking all wheel event handling
- The transition from subsection 3 to Builders was being ignored

**Files Modified:**
- `public/script.js` - Lowered IntersectionObserver visibility threshold

---

### v275 - 2026-01-28
**Status: Previous**

**Fixed Mobile Layout - Removed Problematic Padding**

**Fixes:**
- ✅ Removed `padding-top: 120px` from `.hero` at 900px (was causing content to push down)
- ✅ Removed duplicate padding rule in second 900px media query
- ✅ Reverted height calculation to original `vh` (removed `svh` experiment)
- ✅ This should fix the Builders section appearing below subsection 1

**Files Modified:**
- `public/styles.css` - Removed padding-top rules from .hero at 900px breakpoint

---

### v274 - 2026-01-28
**Status: Previous**

**Subsection Titles - Mobile Viewport Fix**

**Fixes:**
- ✅ Switched back to Flexbox with `!important` overrides
- ✅ Used `svh` (small viewport height) for better mobile browser support
- ✅ Adjusted `top: 70px` for mobile nav position
- ✅ Added fallback `vh` for browsers without `svh` support
- ✅ Set `flex-shrink: 0` and `flex-grow: 0` on content wrappers

**Files Modified:**
- `public/styles.css` - Updated 900px media query with viewport and flexbox fixes

---

### v273 - 2026-01-28
**Status: Previous**

**Subsection Titles - CSS Grid Centering**

**Fixes:**
- ✅ Switched from Flexbox to CSS Grid for more precise centering
- ✅ Used `display: grid` with `place-content: center` and `place-items: center`
- ✅ Grid rows defined as `auto auto` for title and content
- ✅ This should properly center the content block between nav bottom and viewport bottom

**Files Modified:**
- `public/styles.css` - Changed 900px media query to use CSS Grid instead of Flexbox

---

### v272 - 2026-01-28
**Status: Previous**

**Subsection Titles - Center Entire Content Block as Unit**

**Fixes:**
- ✅ Title and content now centered together as one unit
- ✅ Changed title from `position: absolute` back to `position: relative` (part of flex flow)
- ✅ Used `gap: 40px` on `.hero-step` for spacing between title and content
- ✅ Both title and content centered vertically with `justify-content: center`
- ✅ Added `flex-shrink: 0` to prevent content from being squeezed

**Files Modified:**
- `public/styles.css` - Updated 900px media query to center title + content as unit

---

### v271 - 2026-01-28
**Status: Previous**

**Subsection Titles - Fixed Spacing and Content Centering**

**Fixes:**
- ✅ Fixed excessive gap between title and content
- ✅ Title now positioned absolutely at `top: 100px` from section top
- ✅ Content remains centered vertically in the section (via `justify-content: center`)
- ✅ Removed `flex: 1` from content wrappers that was causing content to push to bottom

**Files Modified:**
- `public/styles.css` - Updated 900px media query positioning

---

### v270 - 2026-01-28
**Status: Previous**

**Subsection Titles - Fixed Mobile/Tablet Layout**

**Fixes:**
- ✅ Fixed subsection title not appearing horizontal on mobile/tablet
- ✅ Changed `.hero-step` to `flex-direction: column` at 900px and below
- ✅ Added `!important` flags to override absolute positioning
- ✅ Title now centered horizontally with `text-align: center` and `width: 100%`
- ✅ Title positioned 100px above content with `margin-bottom: 100px`
- ✅ Content wrappers (`.hero-text-pursuit-wrapper`, `.hero-step-2-layout`, `.hero-initiatives-wrapper`) centered with flex

**Files Modified:**
- `public/styles.css` - Updated 900px media query for hero-step and subsection titles

---

### v269 - 2026-01-28
**Status: Previous**

**Subsection Titles - Horizontal Layout on Mobile/Tablet**

**Changes:**
- ✅ At 900px and below: Subsection titles ("The Mission", "The Vision", "The How") now display horizontally instead of vertically
- ✅ Titles positioned 100px above the main content (via margin-bottom)
- ✅ Titles centered horizontally
- ✅ Titles remain visible on mobile (removed display: none at 768px)
- ✅ Cleaned up unused CSS from v268

**Files Modified:**
- `public/styles.css` - Added 900px media query for `.hero-subsection-title`, removed mobile hide rule

---

### v268 - 2026-01-28
**Status: Previous**

**Tablet Layout Attempt (superseded by v269)**

**Changes:**
- ❌ Added 900px media query for initiatives categories (not what user wanted)
- ✅ Changes cleaned up in v269

**Files Modified:**
- `public/styles.css` - Added and then removed tablet layout changes

---

### v267 - 2026-01-28
**Status: Previous**

**Image Permission Fix**

**Fixes:**
- ✅ Fixed `EPERM: operation not permitted` error for `AIJI_Image_OurPurpose_01.png`
- ✅ Applied `chmod 644` to set proper file permissions
- ✅ Applied `xattr -c` to clear macOS quarantine flags
- ✅ Removed extraneous JavaScript code that was making a non-existent `.hero-label` element visible

**Files Modified:**
- `public/script.js` - Removed unnecessary visibility code in `initLazyScrollReveal()`
- File permissions fixed via shell commands

---

### v266 - 2026-01-28
**Status: Previous**

**Asymmetric Navigation + Variable Renaming**

**Navigation Behavior:**
- ✅ Swipe UP (forward): Goes through each state one at a time (State 1 → 2 → 3 → 4 → Next subsection)
- ✅ Swipe DOWN (backward): Skips all states, jumps directly to previous subsection
- ✅ This makes going back faster since user already saw the content

**Variable Renaming for Clarity:**
- ✅ Renamed to match intuitive hierarchy:
  - `Section` = Major page section (What We Do, Builders, etc.)
  - `Subsection` = Slides within a section (1, 2, 3)
  - `State` = Animated elements within a subsection (pillar categories 1-4)
- ✅ Variables: `currentSubsection`, `currentState`, `maxSubsection`, `maxState`
- ✅ Functions: `advanceSubsection()`, `advanceState()`, `regressSubsection()`, `regressState()`

**Files Modified:**
- `public/script.js` - Renamed variables/functions, updated swipe-down behavior

---

### v252-v265 - 2026-01-28
**Status: Previous (consolidated)**

**Arrow Styling Refinements:**
- ✅ Changed all pathway stroke weight from 4px to 3px
- ✅ Arrowheads: 80° angle (was 90°), 32x32 size, matching 3px stroke
- ✅ Pathway 02 made more erratic (varying loop sizes)
- ✅ Reverted pillar numbers to black (removed colors)

**Swipe Gesture Fixes:**
- ✅ One swipe = one step (regardless of gesture intensity)
- ✅ Lock mechanism: First wheel event advances, subsequent events ignored
- ✅ 150ms unlock delay after gesture ends
- ✅ 400ms minimum gap between state changes
- ✅ 500ms lock when entering subsection 3 to prevent skipping pillar 01

**Header Text:**
- ✅ Changed from "AI for All of Us." to "For All of Us."

**Files Modified:**
- `public/index.html` - Arrow SVG paths, arrowhead sizing, header text
- `public/script.js` - Swipe handling, variable renaming

---

### v251 - 2026-01-28
**Status: Previous**

**Subsection Titles + Centering Fix + Mission Update + Mobile Layout**

**Subsection Titles:**
- ✅ Added vertical subsection titles on left edge of hero section:
  - Subsection 01: "The Mission"
  - Subsection 02: "The Vision"
  - Subsection 03: "The How"
- ✅ Fractul semi-bold font (weight 600), uppercase, 0.875rem
- ✅ Positioned at global padding (25px) from left edge
- ✅ Vertically centered between nav and screen bottom
- ✅ Uses `writing-mode: vertical-rl` with 180deg rotation for bottom-to-top reading
- ✅ Hidden on mobile (under 768px) to avoid overlap

**Centering Fix:**
- ✅ Fixed content not being vertically centered in hero subsections
- ✅ Removed JavaScript override in `handleResize()` that was incorrectly setting `minHeight: 100vh`
- ✅ CSS now correctly handles centering with `height: calc(100vh - 72px)` and flex centering

**Mission Statement Update:**
- ✅ Updated to: "Pursuit AI Jobs Institute is America's first AI workforce hub, pioneering how all of us prepare for the needs of an AI-first economy."

**Mobile Layout for "4 Pillars" Section:**
- ✅ Stacked layout on mobile: number + category name followed by description
- ✅ Arrows/pathways hidden on mobile
- ✅ Consistent headline styling across all 3 subsections on mobile

**Files Modified:**
- `public/index.html` - Added subsection title elements, updated mission text
- `public/styles.css` - Added `.hero-subsection-title` styling, mobile adjustments
- `public/script.js` - Removed problematic `minHeight: 100vh` override

---

### v250 - 2026-01-27
**Status: Previous**

**Separated Arrowheads from Lines + Colored Numbers**
- ✅ Split arrows into two separate SVG elements: `.initiative-arrow-line` and `.initiative-arrowhead`
- ✅ Arrowheads are now positioned at the END point separately (no distortion)
- ✅ Arrowheads rotate to match the line angle but don't stretch
- ✅ Added pillar number colors matching their arrows:
  - 01: Pursuit Purple #4242ea
  - 02: Pink #FFB8B6
  - 03: Blue #AEE0E5
  - 04: Green #BAEAB0

**Solution:**
- Arrowhead is a separate 24x24 SVG that gets positioned at the end point
- Arrowhead rotates using same angle as line but maintains consistent size
- Line SVG stretches with `preserveAspectRatio="none"`, arrowhead doesn't

**Files Modified:**
- `public/index.html` - Split SVGs into line + arrowhead pairs
- `public/styles.css` - Added styles for arrowheads and number colors
- `public/script.js` - Position both line and arrowhead separately

---

### v249 - 2026-01-27
**Status: Previous**

**Fixed Arrowhead Distortion with SVG Markers**
- ✅ Replaced manual arrowhead paths with SVG `<marker>` elements
- ✅ Markers use `markerUnits="userSpaceOnUse"` to maintain consistent size
- ✅ Arrowheads now maintain 90-degree angle regardless of SVG stretching
- ✅ Each arrow has its own marker with matching color
- ✅ Arrowhead is a proper "V" shape: 20x20 units with tip at center

**Problem:**
- With `preserveAspectRatio="none"`, horizontal stretching distorted arrowheads
- Arrow 01 (shortest) had most horizontal compression, widest arrowhead angle

**Solution:**
- SVG `<marker>` elements are not affected by the parent SVG's stretching
- `orient="auto"` rotates arrowhead to match line direction
- `refX` and `refY` position the arrowhead at the line endpoint

**Files Modified:**
- `public/index.html` - Replaced arrowhead paths with marker definitions

---

### v248 - 2026-01-27
**Status: Previous**

**Fixed Arrow 01 Thickness & Redesigned Arrow 02 as Coil**
- ✅ Added `preserveAspectRatio="none"` to arrow 01 SVG
- ✅ Added `vector-effect="non-scaling-stroke"` to all arrow 01 paths
- ✅ Redesigned arrow 02 with true coiled spring pattern using Bezier curves
- ✅ Spring pattern: 6 loops oscillating between y=10 and y=50

**Files Modified:**
- `public/index.html` - Fixed arrow 01 attributes, redesigned arrow 02 path

---

### v247 - 2026-01-27
**Status: Previous**

**Fixed Arrows to be Diagonal - Rotation Transform**
- ✅ Arrows now go diagonally from category to description
- ✅ Calculate delta X and delta Y between start and end points
- ✅ Calculate diagonal length (hypotenuse) for SVG width
- ✅ Calculate rotation angle using atan2(deltaY, deltaX)
- ✅ Apply CSS transform: rotate() to make arrows diagonal
- ✅ Set transform-origin: left center so arrows rotate from start point

**Problem:**
- Arrows were horizontal lines positioned at each category's Y level
- They didn't actually go UP to the description at commonY
- SVG paths were horizontal (y=30) within the viewBox

**Solution:**
- Calculate the angle from start point to end point
- Apply CSS rotation to make the SVG arrow diagonal
- Width is now the diagonal distance (hypotenuse)
- Arrow rotates from its left edge to point toward the description

**Files Modified:**
- `public/script.js` - Complete rewrite of positionInitiativeArrows()

---

### v246 - 2026-01-27
**Status: Previous**

**Fixed End Y - Use First Description's First Character**
- ✅ Using Range API to get first character position of first description
- ✅ `commonY` now calculated from actual text position, not container
- ✅ Descriptions container was at top: 0, giving wrong Y position
- ✅ Now measures where the description text actually renders

**Root Cause:**
- Descriptions container and wrapper both at same Y (relative top: 0)
- Descriptions are absolutely positioned, containers don't reflect text position
- Need to measure actual rendered text, not container boxes

**Files Modified:**
- `public/script.js` - Use first character of first description for commonY

---

### v245 - 2026-01-27
**Status: Previous**

**Fixed End Y Position - Use Descriptions Container**
- ✅ Changed from using first description's position to descriptions container position
- ✅ Descriptions are `position: absolute; top: 0` relative to their parent
- ✅ Parent `.hero-initiatives-right` has the actual Y position we need
- ✅ `commonY` now calculated from descriptions container top

**Root Cause:**
- First description and wrapper had same top (477.93)
- Because description is absolutely positioned at top: 0 of its parent
- Need parent container's position, not the description's position

**Files Modified:**
- `public/script.js` - Use `.hero-initiatives-right` for commonY calculation

---

### v243 - 2026-01-27
**Status: Previous**

**Improved Arrow Coordinate Logging**
- ✅ Clear section showing START POINT (X, Y)
- ✅ Clear section showing END POINT (X, Y)
- ✅ Shows final arrow SVG positioning (left, top, width)
- ✅ All values formatted to 2 decimal places for readability
- ✅ Easier to verify if coordinates are correct

**Files Modified:**
- `public/script.js` - Enhanced coordinate logging

---

### v242 - 2026-01-27
**Status: Previous**

**Fixed Arrow Y Position - Each Arrow Has Own Y**
- ✅ Changed from using `commonY` to calculating individual `startY` for each arrow
- ✅ Each arrow now positioned at its own category's first line Y position
- ✅ `startY` calculated from the last character's Y position + half its height
- ✅ Arrow top set to `startY - 30` instead of `commonY - 30`
- ✅ Added logging for both start and end Y coordinates

**Critical Bug Fixed:**
- All arrows were using the same Y position (from first description)
- Categories are at different vertical positions
- Each arrow now correctly aligns with its own category's first line

**Files Modified:**
- `public/script.js` - Calculate and use individual Y positions per arrow

---

### v241 - 2026-01-27
**Status: Previous**

**Fixed Range Measurement - Single Character Only**
- ✅ Changed from `range.setEnd(textNode, firstLineEndPos)` to `range.setEnd(textNode, lastCharIndex + 1)`
- ✅ Now measures ONLY the last visible character on first line
- ✅ Previously was measuring from last char to line break (including spaces and next line chars)
- ✅ Should now give correct right edge position for each category

**Bug Found:**
- For "Pilot Programs & ", was measuring range from "&" (index 15) to "T" (index 17)
- This included the space and part of the next line
- Now only measures the "&" itself (index 15 to 16)

**Files Modified:**
- `public/script.js` - Fixed range end position

---

### v240 - 2026-01-27
**Status: Previous**

**Enhanced Debug Logging - Show Y Coordinates**
- ✅ Now logs Y coordinate for EVERY character
- ✅ Shows X position range (left-right) for each character
- ✅ Uses first character's Y as baseline for first line
- ✅ Clearly marks where line break occurs
- ✅ Shows which character is detected as last on first line
- ✅ More detailed console output for debugging

**Files Modified:**
- `public/script.js` - Enhanced logging with Y coordinates

---

### v239 - 2026-01-27
**Status: Previous**

**Fixed Space Character Issue in Arrow Positioning**
- ✅ Skips trailing space characters when finding line end
- ✅ Finds last visible (non-space) character on first line
- ✅ Added logging to show which spaces are being skipped
- ✅ Should now correctly measure different end positions for each category

**Problem Identified:**
- All arrows were starting at same position (262.3125px)
- Was measuring space character at line wrap point
- All spaces happened to be at similar positions

**Files Modified:**
- `public/script.js` - Added space-skipping logic

---

### v238 - 2026-01-27
**Status: Previous**

**Added Debug Logging for Arrow Coordinates**
- ✅ Console logs showing common Y and end X positions
- ✅ Per-arrow logging with category name and text analysis
- ✅ Character-by-character position tracking to detect line breaks
- ✅ Shows detected first line text and break position
- ✅ Displays all calculated coordinates (start X, end X, width)
- ✅ Helps identify where positioning is going wrong

**Files Modified:**
- `public/script.js` - Added extensive console.log statements

---

### v237 - 2026-01-27
**Status: Previous**

**Fixed Arrow Start Position Using Range API**
- ✅ Implemented Range API to detect actual end of first line of text
- ✅ Handles multi-line category names correctly (e.g., "Support Small Businesses & Nonprofits")
- ✅ Finds where line break occurs by checking each character position
- ✅ Arrow now starts precisely at end of first line, not element bounding box
- ✅ Works for both single-line and multi-line category names

**Technical Details:**
- Uses `document.createRange()` to measure individual character positions
- Detects line break by comparing vertical positions of characters
- Gets `lastCharRect.right` for precise text end position

**Files Modified:**
- `public/script.js` - Updated `positionInitiativeArrows()` with Range API logic

---

### v236 - 2026-01-27
**Status: Previous**

**Unified Arrow Y-Position and End X-Position**
- ✅ All arrows now use common Y-coordinate (aligned with first description line)
- ✅ All arrows end at same X-coordinate (start of description column)
- ✅ Each arrow starts at different X based on its category text length
- ✅ Distance calculated individually for each arrow
- ✅ More consistent arrow positioning across all 4 pillars

**Files Modified:**
- `public/script.js` - Updated arrow positioning logic

---

### v235 - 2026-01-27
**Status: Previous**

**Fixed Arrow Length and Positioning**
- ✅ Width now calculated as exact distance between category end and description start
- ✅ Increased gap to 20px for better spacing
- ✅ Removed minimum width constraint
- ✅ Each arrow scales to fit its specific distance (different for each pillar)
- ✅ Arrows now start at end of category name and end at start of description

**Files Modified:**
- `public/script.js` - Fixed arrow width calculation

---

### v234 - 2026-01-27
**Status: Previous**

**Fixed Arrow Positioning**
- ✅ Increased gap from category text (10px → 15px)
- ✅ Increased gap before description text (10px → 15px)
- ✅ Added minimum width of 150px for arrows
- ✅ Clarified positioning calculations relative to content wrapper

**Files Modified:**
- `public/script.js` - Updated `positionInitiativeArrows()` function

---

### v233 - 2026-01-27
**Status: Previous**

**Fixed Arrows 02-04: Prevent Distortion**
- ✅ Added `preserveAspectRatio="none"` to arrows 02, 03, 04
- ✅ Added `vector-effect="non-scaling-stroke"` to all paths in arrows 02, 03, 04
- ✅ Now all arrows stretch horizontally without distorting stroke width
- ✅ Matches the fix applied to arrow 01

**Files Modified:**
- `public/index.html` - Fixed SVG properties for arrows 02-04

---

### v232 - 2026-01-27
**Status: Previous**

**All Four Pillar Arrows Complete**
- ✅ Arrow 01 (Pursuit Purple #4242ea): S-curve
- ✅ Arrow 02 (Pink #FFB8B6): Coil/spring with multiple curves
- ✅ Arrow 03 (Blue #AEE0E5): Zigzag pattern
- ✅ Arrow 04 (Green #BAEAB0): Smooth wavy pattern
- ✅ Each arrow unique in form, same 4px stroke, same arrowhead size
- ✅ Only one arrow visible at a time (matches active category)
- ✅ All arrows dynamically positioned and responsive

**Files Modified:**
- `public/index.html` - Added arrows 02, 03, 04
- `public/script.js` - Updated arrow handling for all 4 arrows

---

### v231 - 2026-01-27
**Status: Previous**

**Pillar 01 Arrow: Extended Further**
- ✅ Extended line another 10px to the right (from x=185 to x=195)
- ✅ Arrowhead adjusted to x=175 (total 20px extension from v229)
- ✅ Maintains 4px stroke width

**Files Modified:**
- `public/index.html` - Extended arrow further right

---

### v230 - 2026-01-27
**Status: Previous**

**Pillar 01 Arrow: Extended & Thicker**
- ✅ Extended line by 10px (from x=175 to x=185)
- ✅ Increased stroke width from 3px to 4px (both line and arrowhead)
- ✅ Arrowhead endpoint adjusted to x=165 to maintain 20px length

**Files Modified:**
- `public/index.html` - Extended and thickened arrow

---

### v229 - 2026-01-27
**Status: Previous**

**Pillar 01 Arrow: Even Bigger Arrowhead**
- ✅ Added explicit `viewBox` to ensure proper rendering
- ✅ Arrowhead now 20px long on each side (much more prominent)
- ✅ Adjusted line endpoint to connect properly to arrowhead
- ✅ Arrowhead spans from y=15 to y=45 (30px total height)

**Files Modified:**
- `public/index.html` - Updated arrow SVG with bigger arrowhead

---

### v228 - 2026-01-27
**Status: Previous**

**Pillar 01 Arrow: Increased Size**
- ✅ Line weight increased from 2px to 3px
- ✅ Arrowhead made much bigger (from 5px to 15px length on each side)
- ✅ All strokes now 3px weight

**Files Modified:**
- `public/index.html` - Updated arrow SVG sizing

---

### v227 - 2026-01-27
**Status: Previous**

**Pillar 01: Dynamic Arrow with Hand-Drawn Path**
- ✅ Created arrow for pillar 01 in Pursuit Purple (#4242ea)
- ✅ Gentle S-curve path with slight wobbles for hand-drawn feel
- ✅ Dynamically positioned from end of "Train AI Workers" to start of description
- ✅ 2px stroke with 45° arrowhead
- ✅ Shows only when category 01 is active
- ✅ Repositions on load and resize

**Files Modified:**
- `public/index.html` - Added pillar 01 arrow SVG
- `public/styles.css` - Added `.initiative-arrow` styling
- `public/script.js` - Added `positionInitiativeArrows()` function

---

### v226 - 2026-01-27
**Status: Previous**

**Clean Arrow - No Filter**
- ✅ Removed SVG filter completely (was causing displacement)
- ✅ Clean black line with 2px stroke
- ✅ Centered and floating on top of table
- ✅ Will add hand-drawn effect differently later

**Files Modified:**
- `public/index.html` - Removed filter and defs

---

### v225 - 2026-01-27
**Status: Previous**

**Final: Clean Arrow with Subtle Hand-Drawn Effect**
- ✅ Removed debug red tint background
- ✅ Changed arrow to black, 2px stroke
- ✅ Added gentler hand-drawn filter (baseFrequency: 0.8, scale: 0.5)
- ✅ Arrow floats on top of table content

**Files Modified:**
- `public/index.html` - Black stroke, subtle filter
- `public/styles.css` - Removed debug background

---

### v224 - 2026-01-27
**Status: Previous - DEBUG**

**Debug: Removed Filter**
- ✅ Removed `filter="url(#hand-drawn)"` from paths
- ✅ The filter was causing visual displacement
- ✅ Now the red line should be solid and in the center

**Files Modified:**
- `public/index.html` - Removed filter from all paths

---

### v223 - 2026-01-27
**Status: Previous - DEBUG**

**Debug: Made Arrow Highly Visible**
- ✅ Changed arrow to RED with 3px stroke
- ✅ Added semi-transparent red background to container
- ✅ Increased z-index to 100
- ✅ This will help us see if it's positioned correctly

**Files Modified:**
- `public/index.html` - Changed arrow to red, thicker
- `public/styles.css` - Added debug background, increased z-index

---

### v222 - 2026-01-27
**Status: Previous**

**Fixed: Arrow Container Wrapped Separately from Headline**
- ✅ Created `.hero-initiatives-content-wrapper` to wrap table + arrows only
- ✅ Headline now outside the arrow positioning context
- ✅ Arrow should be centered relative to table area, not including headline

**Files Modified:**
- `public/index.html` - Added content wrapper div around table and arrows
- `public/styles.css` - Moved positioning context to content wrapper

---

### v221 - 2026-01-27
**Status: Previous**

**Fixed: Arrow Container Positioning**
- ✅ Added `position: relative` to `.hero-initiatives-wrapper` (positioning context)
- ✅ Changed arrow container to use `top/right/bottom/left: 0` (fills parent)
- ✅ Arrow should now be centered relative to wrapper, not description text

**Files Modified:**
- `public/styles.css` - Fixed `.hero-initiatives-wrapper` and `.hero-arrows-container`

---

### v220 - 2026-01-27
**Status: Previous**

**Updated: Arrow Container Separation**
- ✅ Created `.hero-arrows-container` outside of table
- ✅ Arrow now sits on top with z-index: 10
- ✅ Container is absolutely positioned over the entire wrapper
- ✅ Pointer-events: none to allow clicking through to table

**Files Modified:**
- `public/index.html` - Moved SVG to new container outside table
- `public/styles.css` - Added `.hero-arrows-container` styling

---

### v219 - 2026-01-27
**Status: Previous**

**Reset: Simple Test Arrow**
- ✅ Removed all previous arrow code
- ✅ Created single test line centered on slide
- ✅ Straight path with hand-drawn texture filter
- ✅ 2px stroke with 45° arrowhead
- ✅ Fixed positioning (150px × 40px, centered)

**Files Modified:**
- `public/index.html` - Replaced complex arrows with single test SVG
- `public/script.js` - Removed positioning functions
- `public/styles.css` - Removed arrow CSS

---

### v218 - 2026-01-27
**Status: Previous**

**Fixed: SVG Lines Using vector-effect non-scaling-stroke**
- ✅ Reverted to `preserveAspectRatio="none"` to fill space
- ✅ Added `vector-effect="non-scaling-stroke"` to maintain 2px stroke at any scale
- ✅ Adjusted viewBox to 100x30 for better proportions
- ✅ Recentered all paths vertically at y=15
- ✅ Reduced filter scale to 1.5 for subtler texture
- ✅ Removed JS stroke-width scaling (no longer needed)

**Files Modified:**
- `public/index.html` - Updated all SVG paths with vector-effect and new coordinates
- `public/script.js` - Removed dynamic stroke-width calculation

---

### v217 - 2026-01-27
**Status: Previous**

**Fixed: SVG Line Skewing and Scaling**
- ✅ Changed `preserveAspectRatio` from "none" to "xMidYMid meet" to prevent skewing
- ✅ Adjusted viewBox to 100x50 for better proportions
- ✅ Rescaled all path coordinates to fit new viewBox
- ✅ Dynamic stroke-width calculation to maintain 2px appearance at any size
- ✅ Paths now scale proportionally without distortion

**Files Modified:**
- `public/index.html` - Updated all 4 SVG viewBox and path coordinates
- `public/script.js` - Added dynamic stroke-width scaling based on SVG dimensions

---

### v216 - 2026-01-27
**Status: Previous**

**Fixed: Dynamic Positioning for Decorative Lines**
- ✅ Lines now positioned dynamically via JavaScript
- ✅ Start point: Right edge of category name text
- ✅ End point: Left edge of description first line
- ✅ Automatically repositions on load, resize, and state changes
- ✅ Responsive to actual text layout

**Files Modified:**
- `public/styles.css` - Simplified line positioning (removed static values)
- `public/script.js` - Added `positionInitiativeLines()` function with dynamic calculations

---

### v215 - 2026-01-27
**Status: Previous**

**Added: Hand-Drawn Decorative Lines on Slide 3**
- ✅ Added 4 unique SVG connecting lines between categories and descriptions
- ✅ Each line has unique character: S-curve, coil, zigzag, wave
- ✅ Hand-drawn effect with SVG filters (feTurbulence, feDisplacementMap)
- ✅ 2px stroke weight with 45° arrowheads
- ✅ Lines fade in/out based on active category
- ✅ Positioned in gap between columns

**Files Modified:**
- `public/index.html` - Added 4 SVG elements with unique paths
- `public/styles.css` - Added `.hero-initiative-line` styling and positioning
- `public/script.js` - Updated `updateInitiativeSubState` to control line visibility

---

### v214 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Headline Margin**
- ✅ Gap between headline and table reduced from 100px to 75px

**Files Modified:**
- `public/styles.css` - Updated `.hero-initiatives-headline` margin-bottom

---

### v213 - 2026-01-27
**Status: Previous**

**Fixed: Slide 3 Headline Double Padding**
- ✅ Removed padding from `.hero-initiatives-headline` (was causing double padding)
- ✅ Headline now inherits padding from `.hero-initiatives-wrapper` only
- ✅ Headline now aligns consistently with Slides 1 & 2

**Files Modified:**
- `public/styles.css` - Removed padding and responsive media queries from `.hero-initiatives-headline`

---

### v212 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Padding Adjustment**
- ✅ Reduced padding for 1025-1400px range from 100px to 80px
- ✅ Total side padding for this range now: 20px + 80px = 100px

**Files Modified:**
- `public/styles.css` - Updated `.hero-initiatives-wrapper` responsive padding

---

### v211 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Padding Adjustment**
- ✅ Reduced padding for 1025-1400px range from 120px to 100px
- ✅ Total side padding for this range now: 20px + 100px = 120px

**Files Modified:**
- `public/styles.css` - Updated `.hero-initiatives-wrapper` responsive padding

---

### v210 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Layout Improvements**
- ✅ Reduced gap between numbers and category names from 16px to 8px
- ✅ Removed fixed min-width on numbers to close gap further
- ✅ Adjusted column ratio to 0.8fr / 1.2fr (more space for descriptions)
- ✅ Increased gap between columns from 60px to 80px
- ✅ Reduced side padding from 40px to 20px to prevent description cutoff

**Files Modified:**
- `public/styles.css` - Updated `.hero-initiatives-two-col`, `.hero-initiative-item`, `.hero-initiative-num`, `.hero-step-3`

---

### v209 - 2026-01-27
**Status: Previous**

**Fixed: Slide 3 Content Vertical Centering**
- ✅ Removed duplicate `.hero-step-3` definition
- ✅ Removed top/bottom padding that was pushing content off-center
- ✅ Content now properly centered in area between nav and bottom of viewport

**Files Modified:**
- `public/styles.css` - Fixed `.hero-step-3` padding and centering

---

### v208 - 2026-01-27
**Status: Previous**

**Updated: Header Logo Position**
- ✅ Logo moved up by 2px: `translateY(-5px)` → `translateY(-7px)`

**Files Modified:**
- `public/styles.css` - Updated `.video-header-logo` transform

---

### v207 - 2026-01-27
**Status: Previous**

**Updated: Header Logo Scale Adjustment**
- ✅ Logo scale changed from 1.65 to 1.6

**Files Modified:**
- `public/styles.css` - Updated `.video-header-logo` transform
- `public/script.js` - Updated logo animation scale

---

### v206 - 2026-01-27
**Status: Previous**

**Updated: Header Logo Size**
- ✅ Logo scaled to 110% of previous size: `scale(1.5)` → `scale(1.65)`
- ✅ Transform origin set to `left center`
- ✅ Updated animation in JavaScript to match

**Files Modified:**
- `public/styles.css` - Updated `.video-header-logo` transform
- `public/script.js` - Updated logo animation scale and transform-origin

---

### v205 - 2026-01-27
**Status: Previous**

**Updated: Slide 2 Gap Adjustment**
- ✅ Gap between rotating words and "for All of Us." reduced from 20px to 10px

**Files Modified:**
- `public/styles.css` - Updated `.hero-title-line3` margin

---

### v204 - 2026-01-27
**Status: Previous**

**Updated: Slide 2 Rotating Words Styling**
- ✅ Rotating words font size increased to 120%: `clamp(3rem, 4.8vw, 4.8rem)` (48-77px)
- ✅ Added 20px gap between rotating words and "for All of Us."

**Files Modified:**
- `public/styles.css` - Updated `.hero-title-line2` font-size and `.hero-title-line3` margin

---

### v203 - 2026-01-27
**Status: Previous**

**Fixed: Slide 3 Content Jump When Changing Categories**
- ✅ Removed `position: relative` from active description (was causing layout reflow)
- ✅ All descriptions now stay `position: absolute` - only opacity changes
- ✅ Added `min-height: 200px` to `.hero-initiatives-right` to prevent container collapse

**Files Modified:**
- `public/styles.css` - Fixed `.hero-initiative-desc.active` and `.hero-initiatives-right`

---

### v202 - 2026-01-27
**Status: Previous**

**Fixed: Slide 3 Category 04 Being Skipped**
- ✅ Added lock check to exit condition (when on sub-state 4)
- ✅ Prevents rapid wheel events from skipping category 04 and going straight to Builders

**Files Modified:**
- `public/script.js` - Added `isSubStateLocked` check before `exitHeroSection()`

---

### v201 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Headline Margin**
- ✅ Gap between headline and table changed from 60px to 100px

**Files Modified:**
- `public/styles.css` - Updated margin-bottom on `.hero-initiatives-headline`

---

### v200 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Header Text**
- ✅ Changed to: "Four pillars. One vision. This is how we're building the future of work."

**Files Modified:**
- `public/index.html` - Updated `.hero-initiatives-headline` text

---

### v199 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Description Alignment**
- ✅ Description text now left-aligned

**Files Modified:**
- `public/styles.css` - Added `text-align: left` to `.hero-initiative-desc`

---

### v198 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Categories & Description Font Size**
- ✅ Category names: 75% of header → `clamp(1.875rem, 3vw, 3rem)` (30-48px)
- ✅ Description: 75% of header → `clamp(1.875rem, 3vw, 3rem)` (30-48px)
- ✅ Numbers: Proportionally reduced → `clamp(1.125rem, 1.8vw, 1.8rem)`

**Files Modified:**
- `public/styles.css` - Updated `.hero-initiative-name`, `.hero-initiative-desc`, `.hero-initiative-num`

---

### v197 - 2026-01-27
**Status: Previous**

**Fixed: Slide 3 Headline Width**
- ✅ Changed `.hero-initiatives-headline` max-width from 800px to 1400px to match Slides 1 & 2

**Files Modified:**
- `public/styles.css` - Updated max-width for `.hero-initiatives-headline`

---

### v196 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Headline Padding**
- ✅ Added responsive padding to `.hero-initiatives-headline` matching Slides 1 & 2
- ✅ Base: 25px, 601-1400px: 80px, 1025-1400px: 120px

**Files Modified:**
- `public/styles.css` - Added padding and responsive rules for `.hero-initiatives-headline`

---

### v195 - 2026-01-27
**Status: Previous**

**Updated: Slide 3 Spacing Adjustments**
- ✅ Gap between categories (01-04) reduced from 24px to 12px
- ✅ Padding left/right for 601-1024px range changed from 80px to 25px

**Files Modified:**
- `public/styles.css` - Updated `.hero-initiatives-left` gap and responsive padding

---

### v194 - 2026-01-27
**Status: Previous**

**Updated: Initiative Categories Styling**
- ✅ Category names now same font size as header: `clamp(2.5rem, 4vw, 4rem)` (40px - 64px)
- ✅ All categories left-aligned
- ✅ Numbers proportionally sized: `clamp(1.5rem, 3vw, 2rem)`
- ✅ Font weight changed to 400 for consistency

**Files Modified:**
- `public/styles.css` - Updated `.hero-initiative-name`, `.hero-initiative-num`, `.hero-initiatives-left`

---

### v193 - 2026-01-27
**Status: Previous**

**Fixed: Sub-State - Immediate Response Approach**
- ✅ Transition starts IMMEDIATELY on first touch
- ✅ Locks during gesture, ignores all subsequent events
- ✅ Unlocks after 200ms of no wheel events (gesture complete)
- ✅ No delay - instant response to swipe

**Files Modified:**
- `public/script.js` - Replaced debounce with immediate-lock approach

---

### v192 - 2026-01-27
**Status: Previous**

**Fixed: Sub-State Skipping Issue (v3) - Debounce Approach**
- ✅ Implemented proper debounce for sub-state changes
- ✅ Waits 150ms for scroll events to stop before executing
- ✅ Only ONE sub-state change per swipe gesture regardless of aggressiveness
- ✅ Added 600ms lock after execution

**Files Modified:**
- `public/script.js` - Added `queueSubStateChange` debounce function

---

### v191 - 2026-01-27
**Status: Previous**

**Fixed: Sub-State Skipping Issue (v2)**
- ✅ Added separate `isSubStateAnimating` lock for sub-states
- ✅ Increased sub-state lock to 800ms
- ✅ Added explicit checks before sub-state function calls
- ✅ Sub-states now properly stop at each category

**Files Modified:**
- `public/script.js` - Improved sub-state locking mechanism

---

### v190 - 2026-01-27
**Status: Previous**

**Fixed: Sub-State Skipping Issue**
- ✅ Added animation lock to sub-state functions (400ms)
- ✅ Prevents skipping through categories - now stops at each one
- ✅ Adjusted cooldown to 1000ms for consistency

**Files Modified:**
- `public/script.js` - Added isAnimating lock to advanceSubState and regressSubState

---

### v189 - 2026-01-27
**Status: Previous**

**Fixed: Sub-State Cooldown Delay**
- ✅ Reduced cooldown for sub-states (initiatives) from 1500ms to 300ms
- ✅ Cycling through 01-04 is now much faster
- ✅ Main state transitions still have 1500ms cooldown

**Files Modified:**
- `public/script.js` - Reduced sub-state cooldown

---

### v188 - 2026-01-27
**Status: Previous**

**Fixed: Scroll Back to Header from State 1**
- ✅ When at state 1 and scrolling up, no longer prevents default scroll
- ✅ Allows natural scroll back to video header

**Files Modified:**
- `public/script.js` - Fixed scroll handling for state 1

---

### v187 - 2026-01-27
**Status: Previous**

**Applied: Consistent Responsive Padding to Slides 2 & 3**
- ✅ Applied same padding logic from slide 1 to slides 2 and 3
- ✅ Base: `var(--container-padding)` (25px)
- ✅ 601px - 1400px: `80px`
- ✅ 1025px - 1400px: `120px`
- ✅ Updated max-width to 1400px for consistency

**Files Modified:**
- `public/styles.css` - Added responsive padding to `.hero-text-collective-top` and `.hero-initiatives-wrapper`

---

### v186 - 2026-01-27
**Status: Previous**

**Adjusted: Slide 2 Gap**
- ✅ Increased gap between headline and word animation from 40px to 100px

**Files Modified:**
- `public/styles.css` - Updated gap in `.hero-step-2-layout`

---

### v185 - 2026-01-27
**Status: Previous**

**Centered: Slide 2 Content**
- ✅ Changed layout from `space-between` to `center`
- ✅ Both elements now grouped in center of content area
- ✅ Added 40px gap between headline and word animation

**Files Modified:**
- `public/styles.css` - Updated `.hero-step-2-layout` to center content

---

### v184 - 2026-01-27
**Status: Previous**

**Adjusted: Slide 2 Spacing**
- ✅ Closed gap between headline and word animation by 150px
- ✅ Added `margin-bottom: -75px` to headline
- ✅ Added `margin-top: -75px` to word animation stack

**Files Modified:**
- `public/styles.css` - Added negative margins to close gap

---

### v183 - 2026-01-27
**Status: Previous**

**Updated: Word Animation Stack**
- ✅ Removed "We Build" from the animation stack
- ✅ Applied same font size to rotating words and "for All of Us" (`clamp(2.5rem, 4vw, 4rem)`)

**Files Modified:**
- `public/index.html` - Removed "We Build" line
- `public/styles.css` - Updated font-size for `.hero-title-line2` and `.hero-title-line3`

---

### v182 - 2026-01-27
**Status: Previous**

**Updated: Headline Font Size Upper Range**
- ✅ All three headlines now use `clamp(2.5rem, 4vw, 4rem)` (40px - 64px)
- ✅ Increased max font size from 46px to 64px

**Files Modified:**
- `public/styles.css` - Updated font-size clamp for all three headlines

---

### v181 - 2026-01-27
**Status: Previous**

**Updated: Headline Styling Consistency**
- ✅ All three headlines now use line-height: 1.1
- ✅ Removed mobile font-size overrides for slides 1 and 2
- ✅ All headlines now use same size on mobile (40px - 46px)

**Files Modified:**
- `public/styles.css` - Updated line-height, removed mobile font-size overrides

---

### v180 - 2026-01-27
**Status: Previous**

**Unified: Headline Font Sizes (40px - 46px)**
- ✅ All three slide headlines now use `clamp(2.5rem, 3.5vw, 2.875rem)`
- ✅ Consistent sizing across Slide 1, 2, and 3

**Files Modified:**
- `public/styles.css` - Updated font-size for `.hero-text-pursuit`, `.hero-text-collective-top`, `.hero-initiatives-headline`

---

### v179 - 2026-01-27
**Status: Previous**

**Updated: "What We Do" Section Headlines**
- Slide 1: "Pursuit AI Jobs Institute is America's first AI workforce hub, pioneering how we prepare for the AI economy."
- Slide 2: "We harness our collective power to build an AI future that uplifts everyone."
- Slide 3: "Four pillars. One vision. Building the future of work."

**Files Modified:**
- `public/index.html` - Updated all three slide headlines

---

### v178 - 2026-01-26
**Status: Previous**

**Major Restructure: "What We Do" Section Slides**

**Slide 1:**
- ✅ Shortened paragraph text

**Slide 2:**
- ✅ Swapped layout: "We harness..." at top, rotating words at bottom
- ✅ Combined old steps 2 and 3 into one slide
- ✅ New CSS classes: `.hero-step-2-layout`, `.hero-text-collective-top`, `.hero-title-wrapper-bottom`

**Slide 3 (Initiatives with sub-states):**
- ✅ New header: "We are building the future of AI workforce development based on the 4 pillars."
- ✅ Two-column layout: Left (numbered items), Right (descriptions)
- ✅ Sub-state system: Swipe cycles through 01→02→03→04
- ✅ Active item in black, inactive items greyed out
- ✅ After 04, next swipe exits to Builders

**Files Modified:**
- `public/index.html` - Restructured slides, new two-column initiatives layout
- `public/styles.css` - New CSS for step 2 layout and initiatives two-column
- `public/script.js` - Rewritten state machine (3 main states + sub-states)

---

### v177 - 2026-01-26
**Status: Previous**

**Fixed: Grey Band at Bottom on Large Browsers**
- ✅ Added `scroll-snap-stop: always` to hero section
- ✅ Added `margin-top: 0` to builder-stories to ensure no gap

**Files Modified:**
- `public/styles.css` - Updated snap behavior for hero and builder-stories

---

### v176 - 2026-01-26
**Status: Previous**

**Fixed: Step 4 Overlay Issue**
- ✅ State 3→4 now properly hides both step 2 (rotating words) AND step 3
- ✅ State 4→3 now properly shows both step 2 AND step 3
- ✅ Fixed initiatives showing on top of rotating words

**Files Modified:**
- `public/script.js` - Fixed state transitions to properly hide/show all relevant steps

---

### v175 - 2026-01-26
**Status: Previous**

**Added: Initiatives as Step 4 in "What We Do" Section**
- ✅ Added new hero-step-4 with initiatives content (4 pillars)
- ✅ Updated JavaScript state machine to handle 4 states
- ✅ Added CSS styling for initiatives grid inside hero section
- ✅ Flow: Paragraph → Rotating Words → We Harness → Initiatives → Builders

**Files Modified:**
- `public/index.html` - Added hero-step-4 with initiatives content
- `public/styles.css` - Added styles for hero-initiatives
- `public/script.js` - Updated state machine for 4 states

---

### v174 - 2026-01-26
**Status: Previous**

**Updated: Rotating Words Duration**
- ✅ Changed word display time from 3 seconds to 2 seconds

**Files Modified:**
- `public/script.js` - Updated setInterval from 3000ms to 2000ms

---

### v173 - 2026-01-26
**Status: Previous**

**Fixed: "We Harness" Auto-Appearing Bug**
- ✅ Increased cooldown for state 2 from 500ms to 1500ms
- ✅ Prevents residual scroll momentum from auto-advancing to state 3

**Files Modified:**
- `public/script.js` - Updated state cooldown logic

---

### v172 - 2026-01-26
**Status: Previous**

**Moved: Animation Lockup and "We Harness" Up 75px**
- ✅ Changed `.hero-title-wrapper` transform to `translateY(-75px)`
- ✅ Changed `.hero-text-collective` transform to `translateY(-75px)`
- ✅ Mobile `.hero-text-collective` set to `translateY(-50px)`

**Files Modified:**
- `public/styles.css` - Updated transforms for both elements

---

### v171 - 2026-01-26
**Status: Previous**

**Adjusted: Animation Lockup Line Spacing**
- ✅ Decreased line-height from `1.3` to `1.1` for all three lines
- ✅ `.hero-title-line-top` (We Build): line-height 1.1
- ✅ `.hero-title-line2` (rotating words): line-height 1.1
- ✅ `.hero-title-line3` (for All of Us): line-height 1.1

**Files Modified:**
- `public/styles.css` - Updated line-height for animation lockup elements

---

### v170 - 2026-01-26
**Status: Previous**

**Adjusted: Animation Lockup and Sentence Position**
- ✅ Changed `.hero-title-wrapper` transform from `translateY(-50px)` to `translateY(0)`
- ✅ Changed `.hero-text-collective` transform from `translateY(-50px)` to `translateY(0)`
- ✅ Both now centered (moved down 50px from previous position)

**Files Modified:**
- `public/styles.css` - Updated transforms for title wrapper and collective text

---

### v169 - 2026-01-26
**Status: Previous**

**Adjusted: Image 01 Size on Large Screens**
- ✅ Increased large screen height from `55vh` to `70vh`

**Files Modified:**
- `public/styles.css` - Updated large screen height for `.hero-image-pursuit-bg`

---

### v168 - 2026-01-26
**Status: Previous**

**Fixed: Image 01 Visibility on Large Screens**
- ✅ Changed large screen (1600px+) `right` from `-120px` to `200px`
- ✅ Image 01 now stays visible on large browsers
- ✅ Adjusted height to `55vh` for large screens

**Files Modified:**
- `public/styles.css` - Updated large screen media query for `.hero-image-pursuit-bg`

---

### v167 - 2026-01-26
**Status: Previous**

**Added: "We Build" Above Animated Words**
- ✅ Added "We Build" text above the rotating words
- ✅ Uses same style as "for All of Us" (400 weight, same font size)
- ✅ New class `.hero-title-line-top`

**Files Modified:**
- `public/index.html` - Added "We Build" h1 element
- `public/styles.css` - Added `.hero-title-line-top` styles

---

### v166 - 2026-01-26
**Status: Previous**

**Updated: Animated Words Font Weight**
- ✅ Changed `.hero-title-line2` (rotating words) font weight from 400 to 600
- ✅ Animated words are now semi-bold

**Files Modified:**
- `public/styles.css` - Updated font weight for `.hero-title-line2`

---

### v165 - 2026-01-26
**Status: Previous**

**Updated: "for All of Us" Font Weight**
- ✅ Changed `.hero-title-line3` font weight from 600 to 400
- ✅ Now matches the rotating words weight (regular)

**Files Modified:**
- `public/styles.css` - Updated font weight for `.hero-title-line3`

---

### v164 - 2026-01-26
**Status: Previous**

**Updated: "for All of Us" Font Size**
- ✅ Changed `.hero-title-line3` font size to match rotating words
- ✅ From `clamp(24px, 8vw, 42px)` to `clamp(3.5rem, 8vw, 5.5rem)`

**Files Modified:**
- `public/styles.css` - Updated font size for `.hero-title-line3`

---

### v163 - 2026-01-26
**Status: Previous**

**Adjusted: Image 01 Position**
- ✅ Moved Image 01 another 100px to the left
- ✅ Right changed from `clamp(50px, calc(-10vw + 200px), 150px)` to `clamp(150px, calc(-10vw + 300px), 250px)`

**Files Modified:**
- `public/styles.css` - Updated right position for `.hero-image-pursuit-bg`

---

### v162 - 2026-01-26
**Status: Previous**

**Adjusted: Image 01 Size**
- ✅ Increased Image 01 by 25%
- ✅ Height changed from `clamp(30vh, 40vh, 42.5vh)` to `clamp(37.5vh, 50vh, 53vh)`

**Files Modified:**
- `public/styles.css` - Updated height for `.hero-image-pursuit-bg`

---

### v161 - 2026-01-26
**Status: Previous**

**Adjusted: Image 01 Size**
- ✅ Reduced Image 01 to 50% of previous size
- ✅ Height changed from `clamp(60vh, 80vh, 85vh)` to `clamp(30vh, 40vh, 42.5vh)`

**Files Modified:**
- `public/styles.css` - Updated height for `.hero-image-pursuit-bg`

---

### v160 - 2026-01-26
**Status: Previous**

**Adjusted: Image 01 Position**
- ✅ Moved Image 01 100px more to the left
- ✅ Updated right value from `clamp(-50px, calc(-10vw + 100px), 50px)` to `clamp(50px, calc(-10vw + 200px), 150px)`

**Files Modified:**
- `public/styles.css` - Updated right position for `.hero-image-pursuit-bg`

---

### v159 - 2026-01-26
**Status: Previous**

**Adjusted: Image 03 Position**
- ✅ Moved Image 03 50px more to the left (from -130px to -180px)

**Files Modified:**
- `public/styles.css` - Updated left position

---

### v158 - 2026-01-26
**Status: Previous**

**Added: Rotation to Image 03**
- ✅ Image 03 (top-left) now rotated 90° clockwise (`rotate(90deg)`)

**Files Modified:**
- `public/styles.css` - Added transform rotate to `.hero-image-pursuit-top-left`

---

### v157 - 2026-01-26
**Status: Previous**

**Reverted: Paragraph Break Changes (Back to Single Paragraph)**
- ✅ Reverted HTML back to single paragraph with `<span>` for bold
- ✅ Removed paragraph-specific CSS rules
- ✅ Both sentences now same font size in one paragraph

**Files Modified:**
- `public/index.html` - Reverted to single paragraph structure
- `public/styles.css` - Removed paragraph break styles

---

### v156 - 2026-01-26
**Status: Previous**

**Updated: First Sentence Font Size to 64px**
- ✅ First sentence now uses `clamp(2.5rem, 4.5vw, 4rem)` (40px min, 64px max)
- ✅ Adjusted line-height to 1.2 for larger text
- ✅ Reduced margin-bottom to 1em

**Files Modified:**
- `public/styles.css` - Updated first sentence font size

---

### v155 - 2026-01-26
**Status: Previous**

**Fixed: Font Size Consistency in Paragraph Break**
- ✅ Added explicit `font-size: inherit` to paragraph elements
- ✅ Ensured both sentences use same font size from parent

**Files Modified:**
- `public/styles.css` - Added inherit rules for p elements

---

### v154 - 2026-01-26
**Status: Previous**

**Added: Paragraph Break After First Sentence in "What We Do"**
- ✅ Split paragraph into two separate `<p>` elements
- ✅ First sentence (bold) now has margin-bottom of 1.5em
- ✅ Creates visual paragraph break (wider than line break)

**Files Modified:**
- `public/index.html` - Restructured paragraph into two `<p>` elements
- `public/styles.css` - Added margin styling for paragraph break

---

### v153 - 2026-01-26
**Status: Previous**

**Updated: Unified Styling for "We Harness" and "Pursuit AI Jobs" Text**
- ✅ Added `position: relative; z-index: 1;` to `.hero-text-collective`
- ✅ Changed padding to use `var(--container-padding)` for consistency
- ✅ Added `box-sizing: border-box` to prevent overflow
- ✅ Added mobile-specific styles for both text elements
- ✅ Smaller font on mobile: `clamp(1.5rem, 5vw, 2rem)`
- ✅ Less padding on mobile: `20px`
- ✅ Reduced translate offset on mobile: `-30px`

**Files Modified:**
- `public/styles.css` - Unified text styles and added mobile breakpoint

---

### v152 - 2026-01-26
**Status: Previous**

**Fixed: Mobile View - Images Overlapping Text**
- ✅ Image 01 (right): Reduced to 50vh height, scale 0.5, pushed further off screen
- ✅ Image 03 (top-left): Reduced to 25vh height, repositioned with negative offset
- ✅ Both images now 60% opacity on mobile for less interference
- ✅ Text should now be clearly readable on mobile

**Changes:**
- Image 01: `height: 50vh`, `scale(0.5)`, `right: -100px`, `opacity: 0.6`
- Image 03: `height: 25vh`, `top: -80px`, `left: -80px`, `opacity: 0.6`

**Files Modified:**
- `public/styles.css` - Updated mobile breakpoint styles

---

### v151 - 2026-01-26
**Status: Previous**

**Fixed: Moved Image 01 Left by 100px (Correctly)**
- ✅ Changed right position from `clamp(-150px, -10vw, -50px)` to `clamp(-50px, calc(-10vw + 100px), 50px)`
- ✅ Less negative = moved left (more visible in frame)
- ✅ Previous version moved it the wrong direction

**Files Modified:**
- `public/styles.css` - Corrected `.hero-image-pursuit-bg` right position

---

### v150 - 2026-01-26
**Status: Previous - WRONG DIRECTION**

**Updated: Moved Image 01 Left by 100px**
- ❌ Changed right position from `clamp(-150px, -10vw, -50px)` to `clamp(-250px, calc(-10vw - 100px), -150px)`
- ❌ Actually moved it right (off screen) - mistake!

**Files Modified:**
- `public/styles.css` - Updated `.hero-image-pursuit-bg` right position

---

### v149 - 2026-01-26
**Status: Previous**

**Updated: Image 03 Position Adjustment**
- ✅ Changed to `top: -150px; left: -130px`
- ✅ More overflow on top and left

**Files Modified:**
- `public/styles.css` - Updated positioning values

---

### v148 - 2026-01-26
**Status: Previous**

**Fixed: Image 03 Now in True Top-Left Corner**
- ✅ Increased negative positioning to `top: -100px; left: -100px`
- ✅ Image now positioned in actual top-left corner of content area
- ✅ Part of image will overflow off screen as intended

**Files Modified:**
- `public/styles.css` - Increased negative offset values

---

### v147 - 2026-01-26
**Status: Previous**

**Fixed: Image 03 Pulled Closer to Actual Corner**
- ✅ Changed position to `top: -20px; left: -20px`
- ✅ Compensates for wrapper padding
- ✅ Image now reaches closer to actual screen corner

**Files Modified:**
- `public/styles.css` - Added negative positioning to `.hero-image-pursuit-top-left`

---

### v146 - 2026-01-26
**Status: Previous**

**Updated: Image 03 Pinned to Top-Left Corner**
- ✅ Changed position from dynamic to fixed `top: 0; left: 0`
- ✅ Image now always hugs top-left corner at any size
- ✅ Part of image will overflow/cut off on smaller screens (as intended)
- ✅ Mobile view slightly larger (35vh) to ensure visible portion

**Files Modified:**
- `public/styles.css` - Changed `.hero-image-pursuit-top-left` positioning

---

### v145 - 2026-01-26
**Status: Previous**

**Updated: Dynamic Image Positioning Based on Browser Size**
- ✅ Image 01 (right side) now uses `clamp()` for responsive positioning
  - Right position scales with viewport width (-10vw)
  - Height scales between 60vh and 85vh
  - Scale adjusts dynamically
- ✅ Image 03 (top left) uses `clamp()` for responsive sizing
  - Position adjusts with viewport (2vh, 2vw)
  - Height scales between 30vh and 50vh
- ✅ Added mobile breakpoint (max-width: 768px) for smaller screens
- ✅ Added large screen breakpoint (min-width: 1600px) for bigger displays
- ✅ Images now adapt smoothly to any browser size

**Files Modified:**
- `public/styles.css` - Added dynamic clamp() values and media queries

---

### v144 - 2026-01-26
**Status: Previous**

**Added: Image 03 to Slide 1 & Adjusted Image 01**
- ✅ Added AIJI_Image_OurPurpose_03.png to top left corner of slide 1
- ✅ Image 03 positioned at top left, 40vh height
- ✅ Brought Image 01 more into frame by moving it left 100px (right: -100px)
- ✅ More of the right-side image now visible

**Files Modified:**
- `public/index.html` - Added Image 03 element
- `public/styles.css` - Added `.hero-image-pursuit-top-left` styles, adjusted Image 01 positioning

---

### v143 - 2026-01-26
**Status: Previous**

**Updated: Moved Content Up & Changed Text**
- ✅ Moved rotating words + "for All of Us." up 50px
- ✅ Moved "We harness..." text up 50px
- ✅ Updated text: "collective power" → "collective vision"
- ✅ Full sentence now: "We harness our collective vision to build an AI-powered future that benefits all of us."

**Files Modified:**
- `public/index.html` - Updated text from "power" to "vision"
- `public/styles.css` - Added `translateY(-50px)` to `.hero-title-wrapper` and `.hero-text-collective`

---

### v142 - 2026-01-26
**Status: Previous**

**Updated: Letters "Teleport" Instead of Move During Disperse**
- ✅ Removed transition animation from disperse
- ✅ Letters now instantly jump/teleport to random positions
- ✅ No visible trajectory - letters blink from position to position
- ✅ Creates glitchy, digital effect

**Files Modified:**
- `public/script.js` - Changed transition to 'none' for instant teleport

---

### v141 - 2026-01-26
**Status: Previous**

**Updated: Even Slower Disperse Animation**
- ✅ Increased disperse duration from 1.2s to 2s
- ✅ Letters scatter very slowly and gracefully

**Files Modified:**
- `public/script.js` - Increased transform transition to 2 seconds

---

### v140 - 2026-01-26
**Status: Previous**

**Updated: Slower Disperse Animation**
- ✅ Increased disperse duration from 0.6s to 1.2s (2x slower)
- ✅ Letters scatter more slowly and gracefully

**Files Modified:**
- `public/script.js` - Increased transform transition duration

---

### v139 - 2026-01-26
**Status: Previous**

**Updated: Removed Fade from Disperse Animation**
- ✅ Letters no longer fade during disperse
- ✅ Letters stay fully visible as they scatter
- ✅ Only transform animation remains

**Files Modified:**
- `public/script.js` - Removed opacity transition and change from disperse

---

### v138 - 2026-01-26
**Status: Previous**

**Updated: Disperse Animation - No Scale, Wider Range**
- ✅ Removed scale from disperse animation (letters stay same size)
- ✅ Increased disperse range from 400px to 1200px radius
- ✅ Letters now scatter much closer to screen edges

**Files Modified:**
- `public/script.js` - Removed scale from disperse, increased coordinate range

---

### v137 - 2026-01-26
**Status: Previous**

**Updated: Removed Scale from Letter Pop-In**
- ✅ Letters now appear with opacity fade only (no scale)
- ✅ Faster transition (0.15s instead of 0.2s)
- ✅ Cleaner, simpler appearance animation

**Files Modified:**
- `public/script.js` - Removed scale transform from build-in
- `public/styles.css` - Removed initial scale(0) from CSS

---

### v136 - 2026-01-26
**Status: Previous**

**New: Completely Redesigned Rotating Words Animation**
- ✅ Updated word list to new set (AI Jobs, Bright Futures, New Beginnings, etc.)
- ✅ Letters now pop in (scale from 0 to 1) instead of fading
- ✅ Letters appear in random order at their final positions
- ✅ Letters disperse to random coordinates when transitioning out
- ✅ Overlapping transitions - next word builds in while current disperses
- ✅ Removed old directional animation classes

**Animation Flow:**
1. **Build-In:** Letters pop in randomly (scale animation) at final positions
2. **Disperse:** Letters scatter to random coordinates while fading out
3. **Overlap:** Next word starts building while previous is still dispersing

**New Word List:**
1. AI Jobs, 2. AI-Powered World, 3. Bright Futures, 4. Transformation, 
5. Insightful Data, 6. Opportunity, 7. AI Workforce, 8. Innovation, 
9. New Beginnings, 10. Community, 11. Progress

**Files Modified:**
- `public/script.js` - Complete rewrite of rotating words logic
- `public/styles.css` - Simplified letter styles, removed old animations

---

### v135 - 2026-01-26
**Status: Previous**

**Fixed: Builders Section Auto-Loading (Increased Cooldown)**
- ✅ Increased state 3 cooldown from 1000ms to 1500ms (1.5 seconds)
- ✅ Added detailed cooldown logging for debugging
- ✅ Prevents auto-exit to Builders section

**The Problem:**
- 1000ms cooldown was still too short in some cases
- Residual scroll momentum could trigger exit after cooldown
- Inconsistent behavior depending on swipe strength

**The Fix:**
- State 3 now requires 1.5 second cooldown before accepting input
- Enhanced logging shows time elapsed vs required
- User has more time to view content before next action

**Files Modified:**
- `public/script.js` - Increased cooldown, added logging

---

### v134 - 2026-01-26
**Status: Previous**

**Fixed: Center Content Between Nav and Screen Bottom**
- ✅ Changed `.hero-step` to start at `top: 72px` (below nav)
- ✅ Changed height to `calc(100vh - 72px)` (viewport minus nav)
- ✅ Removed extra padding from step 1 (was double-accounting for nav)
- ✅ Adjusted step 3 bottom padding from 120px to 80px
- ✅ All content now centered in the space between nav and bottom

**Changes:**
- Step container now excludes nav area from its height
- Content centers in the available space below nav
- More accurate vertical centering

**Files Modified:**
- `public/styles.css` - Updated `.hero-step` positioning and step-specific padding

---

### v133 - 2026-01-26
**Status: Previous**

**Updated: Image 02 Size Back to 75vh**
- ✅ Changed height from `85vh` to `75vh`
- ✅ Image now covers 75% of viewport height

**Files Modified:**
- `public/styles.css` - Updated `.hero-image-bg` height

---

### v132 - 2026-01-26
**Status: Previous**

**Fixed: Image 02 Size Constraint on Large Screens**
- ✅ Removed `max-width: 100%` constraint
- ✅ Changed to `max-width: none` to allow full scaling
- ✅ Added `max-height: 85vh` to match height
- ✅ Image now properly scales to 85vh on large screens

**Files Modified:**
- `public/styles.css` - Updated `.hero-image-bg` constraints

---

### v131 - 2026-01-26
**Status: Previous**

**Updated: Image 02 Size to 85vh**
- ✅ Changed height from `75vh` to `85vh` (85% of viewport height)
- ✅ Image now covers more of the screen

**Files Modified:**
- `public/styles.css` - Updated `.hero-image-bg` height

---

### v130 - 2026-01-26
**Status: Previous**

**Updated: Image 02 Opacity and Size**
- ✅ Changed opacity from `0.6` to `1.0` (fully opaque)
- ✅ Changed height from `max-height: 500px` to `height: 75vh` (75% of viewport)
- ✅ Image covers 75% of browser screen

**Changes:**
- `.hero-image-bg` (Image 02 behind rotating words)
- Now fully opaque and significantly larger
- Fills 75% of viewport height

**Files Modified:**
- `public/styles.css` - Updated `.hero-image-bg` styles

---

### v129 - 2026-01-26
**Status: Previous**

**Fixed: Removed "What We Do" Label from HTML**
- ✅ Removed `.hero-label` div from HTML completely
- ✅ Label no longer in DOM or visible

**The Problem:**
- Previously only hidden with CSS (`opacity: 0; visibility: hidden;`)
- Element was still in HTML and potentially causing layout issues

**The Fix:**
- Removed the entire `<div class="hero-label">` from HTML
- Cleaner markup, no hidden elements

**Files Modified:**
- `public/index.html` - Removed hero-label div

---

### v128 - 2026-01-26
**Status: Previous**

**Fixed: Auto-Exit to Builders from State 3**
- ✅ Increased cooldown for state 3 from 500ms to 1000ms
- ✅ Prevents scroll momentum from auto-triggering exit transition
- ✅ User must make intentional swipe gesture to exit to Builders

**The Problem:**
- After entering state 3, the 500ms cooldown was too short
- Residual scroll momentum could trigger `exitHeroSection()` after cooldown
- "We harness..." text would appear, then immediately exit to Builders

**The Fix:**
- Variable cooldown based on current state
- State 3 requires 1000ms (1 second) cooldown
- Other states keep 500ms cooldown
- Gives user time to read content before accepting next input

**Files Modified:**
- `public/script.js` - Added variable cooldown logic

---

### v127 - 2026-01-26
**Status: Previous**

**Fixed: Hero Background Color & Removed Section Label**
- ✅ Changed hero background from `#F5F1ED` to `#FFF3E9` (matches body/nav)
- ✅ Hidden "What We Do" section label (`opacity: 0; visibility: hidden;`)

**Changes:**
1. **Background Color:**
   - Updated `.hero` background to `#FFF3E9`
   - Now matches the body background color
   - Consistent with nav area appearance

2. **Section Label:**
   - Set `.hero-label` to `opacity: 0; visibility: hidden;`
   - Label no longer visible in the content area
   - Kept in DOM for potential future use

**Files Modified:**
- `public/styles.css` - Updated hero background and hidden label

---

### v126 - 2026-01-26
**Status: Previous**

**Fixed: Grey Bottom Peek & Added Exit Transition to Builders**
- ✅ Added background color to hero section to prevent next section peek-through
- ✅ Created `exitHeroSection()` function for state 3 → Builders transition
- ✅ All content fades out and moves up before snapping to Builders
- ✅ Hero section resets to state 1 after exit for clean re-entry

**Changes:**
1. **Background Color:**
   - Added `background-color: #F5F1ED` to `.hero` section
   - Prevents Builders section grey from showing at bottom

2. **Exit Transition:**
   - When swiping down from state 3, fade out all steps
   - All content moves up 40px while fading
   - Smooth scroll to Builders section after 600ms
   - Reset hero to state 1 for next visit

**Files Modified:**
- `public/styles.css` - Added hero background color
- `public/script.js` - Added `exitHeroSection()` function

---

### v125 - 2026-01-26
**Status: Previous**

**Fixed: State 3 Auto-Appearing After State 2**
- ✅ Added 500ms cooldown between state transitions
- ✅ Prevents scroll momentum from triggering rapid state changes
- ✅ Tracks `stateChangeTime` for each transition

**The Problem:**
- After transitioning to state 2, `isAnimating` becomes false after 700ms
- Residual scroll momentum from initial swipe could trigger another wheel event
- This would immediately call `advanceState()` again (2 → 3)
- Result: "We harness..." appeared automatically without user swipe

**The Fix:**
- Track `stateChangeTime` when any state change completes
- Block wheel events for 500ms after state change
- User must make intentional swipe gesture for next transition
- Similar to 800ms section entry cooldown

**Files Modified:**
- `public/script.js` - Added state change cooldown logic

---

### v124 - 2026-01-26
**Status: Previous - DEBUG VERSION**

**Added: Debug Logging for Step 3 Visibility**
- ✅ Added console logs to check step 3 class and opacity in state 2
- ✅ Simplified state 2 → 3 transition to rely on CSS
- ✅ Need to investigate why step 3 appears without swipe

**Purpose:**
- Check if step 3 has `active` class when it shouldn't
- Verify computed opacity is actually 0 in state 2
- Identify if CSS or JS is causing premature visibility

**Files Modified:**
- `public/script.js` - Added step 3 debugging in state 2

---

### v123 - 2026-01-26
**Status: Previous**

**Fixed: "We Harness..." Text Auto-Appearing**
- ✅ Added fade-in animation when transitioning from state 2 to state 3
- ✅ Text now starts hidden and animates up when user swipes
- ✅ Consistent with other state transitions

**The Problem:**
- When advancing to state 3, step 3 was immediately visible
- No animation/transition, just appeared instantly
- Felt abrupt and inconsistent with slide-based design

**The Fix:**
- Start step 3 with `opacity: 0` and `translateY(40px)`
- Add `active` class (makes it in the DOM flow)
- Clear inline styles after 50ms to trigger CSS transition
- Text fades in and moves up smoothly

**Files Modified:**
- `public/script.js` - Updated state 2 → 3 transition

---

### v122 - 2026-01-26
**Status: Previous**

**Fixed: Step 2 Not Appearing Due to Inline Style Persistence**
- ✅ Clear inline opacity/transform styles after each transition
- ✅ Reset styles to empty string before adding `active` class
- ✅ Prevents previous inline styles from overriding CSS classes

**The Problem:**
- When regressing from state 2 to 1, we set `step2.style.opacity = '0'`
- This inline style persisted on the element
- When advancing back to state 2, adding `.active` class didn't override inline style
- Result: Step 2 had `class="active"` but `style="opacity: 0"` (inline wins!)
- Step 2 was technically active but invisible

**The Fix:**
- Clear inline styles (`style.opacity = ''`, `style.transform = ''`) after each transition
- Reset styles before making a step active
- Ensures CSS classes control visibility, not stale inline styles

**Files Modified:**
- `public/script.js` - Added style resets in all state transitions

---

### v121 - 2026-01-26
**Status: Previous - DEBUG VERSION**

**Added: Console Logging for State Machine Debugging**
- ✅ Added detailed console logs to state transitions
- ✅ Logs when advanceState() and regressState() are called
- ✅ Logs current state, animation status, and transitions
- ✅ Logs rotating words start/stop operations

**Purpose:**
- Diagnose why rotating words don't load consistently
- Track state machine behavior
- Identify if states are being skipped or transitions failing

**Files Modified:**
- `public/script.js` - Added console.log statements throughout state machine

---

### v120 - 2026-01-26
**Status: Previous**

**Fixed: Rotating Words Initialization Timing**
- ✅ Moved `initRotatingWords()` before `initHeroSwipeStates()` in init order
- ✅ Added 100ms delay before starting rotation to ensure step 2 is fully visible
- ✅ Added forced reflow and display properties to ensure element is ready
- ✅ Fixed function dependency order

**The Problem:**
- `initHeroSwipeStates()` called `window.startRotatingWords()` before it existed
- Element might not have been fully rendered when animation started
- Race condition between DOM visibility and animation start

**The Fix:**
- Initialize rotating words controls first
- Wait 100ms after step 2 becomes active before starting rotation
- Force browser reflow to ensure styles are applied
- Explicitly set display properties

**Files Modified:**
- `public/script.js` - Reordered init functions, added timing safeguards

---

### v119 - 2026-01-26
**Status: Previous**

**Fixed: Rotating Words Not Loading Consistently**
- ✅ Changed rotating words to start ONLY when state 2 is active
- ✅ Added `startRotatingWords()` and `stopRotatingWords()` control functions
- ✅ Interval now starts when entering state 2, stops when leaving
- ✅ Prevents DOM manipulation issues when element is hidden

**The Problem:**
- `initRotatingWords()` started `setInterval` on page load
- Rotating word element was inside hidden `hero-step-2`
- DOM manipulation on hidden elements caused inconsistent rendering
- Animation timing was off when element finally became visible

**The Fix:**
- Rotating words interval now controlled by state machine
- Start rotation when advancing to state 2
- Stop rotation when regressing to state 1 or leaving section
- Ensures animation only runs when element is visible

**Files Modified:**
- `public/script.js` - Refactored `initRotatingWords()` and `initHeroSwipeStates()`

---

### v118 - 2026-01-26
**Status: Previous**

**Fixed: Paragraph Auto-Advancing Without Swipe**
- ✅ Added 800ms cooldown period after hero section becomes visible
- ✅ Blocks ALL wheel events during cooldown to prevent auto-advance
- ✅ Paragraph now stays visible until user explicitly swipes

**The Problem:**
- When section snapping completed (`window.scrollTo()`), scroll momentum/events would trigger hero state machine
- Intersection Observer set `isInHeroSection = true` at 80% visibility
- Any wheel event fired immediately after → auto-advanced from state 1 to 2
- Result: Paragraph disappeared on its own

**The Fix:**
- Track `sectionEntryTime` when section becomes visible
- Ignore ALL wheel events for 800ms after entry
- Gives user time to see content before accepting input

**Files Modified:**
- `public/script.js` - Added cooldown logic to `initHeroSwipeStates()`

---

### v117 - 2026-01-26
**Status: Previous**

**Fixed: Disabled Lazy Reveal for Hero Steps**
- ✅ Removed Intersection Observer for hero steps in `initLazyScrollReveal()`
- ✅ Hero steps now ONLY controlled by swipe state machine
- ✅ Prevents automatic 'revealed' class being added to all steps
- ✅ Only the active state should be visible

**The Problem:**
- `initLazyScrollReveal()` was observing all hero steps
- When hero section became visible, it added 'revealed' class to all steps
- This made all content visible at once, overriding state machine

**The Fix:**
- Disabled Intersection Observer for hero steps
- Only `initHeroSwipeStates()` controls hero step visibility now

**Files Modified:**
- `public/script.js` - Removed hero steps from lazy reveal

---

### v116 - 2026-01-26
**Status: Previous**

**Fixed: Debouncing and State Reset on Entry**
- ✅ Added 100ms debounce to prevent rapid state changes
- ✅ Added `isInHeroSection` flag (0.8 intersection threshold)
- ✅ Explicitly remove active class from steps 2 and 3 on init
- ✅ Reset to state 1 when entering section from top
- ✅ Force step 1 opacity and transform on entry
- ✅ Prevents multiple swipes from stacking

**Fixes:**
- Prevents rapid state advancement
- Ensures only step 1 is visible initially
- Clean reset when entering section
- More reliable state tracking

**Files Modified:**
- `public/script.js` - Added debouncing and state reset logic

---

### v115 - 2026-01-26
**Status: Previous**

**Fixed: Hero State Machine Initialization and Section Advancement**
- ✅ Changed initial state from 0 to 1 (paragraph visible from start)
- ✅ Removed `hasInteractedWithHero` flag (was preventing first swipe)
- ✅ Fixed advancement to Builders section
- ✅ Changed `canAdvanceToNextSection` logic - doesn't prevent default on state 3
- ✅ Allows browser's native snap scrolling to take over after state 3
- ✅ Removed pointer-events manipulation
- ✅ Updated intersection threshold to 0.3 for earlier detection

**Fixes:**
- Paragraph now shows immediately when entering section
- First swipe works correctly (advances to state 2)
- After state 3, natural scroll to Builders section works
- Proper snap behavior maintained

**Files Modified:**
- `public/script.js` - Fixed initialization and advancement logic

---

### v114 - 2026-01-26
**Status: Previous**

**Implemented: Swipe-Based State Machine for What We Do Section**
- ✅ Created `initHeroSwipeStates()` function
- ✅ What We Do section now fixed at 100vh (no scrolling within)
- ✅ All hero steps positioned absolutely and layered
- ✅ Swipe detection on hero section triggers state changes
- ✅ State 1: Paragraph visible
- ✅ State 2: Paragraph fades out ↑, rotating words fade in
- ✅ State 3: Rotating words stay, collective text fades in at bottom
- ✅ After state 3, swipe advances to Builders section

**How it works:**
- Each swipe up = advance to next state
- Each swipe down = regress to previous state
- 600ms transitions for smooth fade in/out
- Elements move up 40px when fading out
- Intersection Observer tracks when user is in hero section
- Prevents scroll to next section until state 3 complete

**CSS Changes:**
- Hero steps: absolute positioning, layered on top of each other
- `.active` class controls visibility
- Hero section: locked to 100vh height
- Step 3: bottom-aligned with 120px padding

**Files Modified:**
- `public/script.js` - Added initHeroSwipeStates() function
- `public/styles.css` - Updated hero/hero-step positioning and layout

---

### v113 - 2026-01-26
**Status: Previous**

**Restructured: What We Do Section as 3 Snap Slides**
- ✅ Reordered hero steps to match desired flow
- ✅ Each hero step is now a full-screen snap point (100vh)
- ✅ Added `scroll-snap-align: start` and `scroll-snap-stop: always` to all steps
- ✅ Removed bottom padding from .hero section

**New slide order:**
1. **Slide 1:** "Pursuit AI Jobs Institute..." paragraph (centered with Image 01)
2. **Slide 2:** Rotating words + "for All of Us." (centered with Image 02)
3. **Slide 3:** "We harness our collective power..." (bottom-aligned)

**Step positioning:**
- Step 1: Center-aligned with top/bottom padding
- Step 2: Center-aligned (rotating words)
- Step 3: Bottom-aligned with 120px bottom padding

**Text styling:**
- "We harness..." now uses same font as paragraph (fractul-variable, 36-46px)
- Same responsive padding (80px → 120px based on screen size)
- Line-height: 1.3 (matching paragraph)

**Files Modified:**
- `public/index.html` - Reordered hero steps (swapped 2 and 3)
- `public/styles.css` - Updated hero-step styles, hero-text-collective font

---

### v112 - 2026-01-26
**Status: Previous**

**Changed: Full Page Snap Scrolling (Slide-like Behavior)**
- ✅ Changed `scroll-snap-type: y proximity` to `y mandatory`
- ✅ Now every section snaps into place like slides
- ✅ All sections already had `scroll-snap-align: start` and `scroll-snap-stop: always`
- ✅ Lazy scroll reveals still work within each section
- ✅ Creates presentation-style navigation through the site

**Sections with snap scrolling:**
- Video Header
- What We Do (hero)
- Builder Stories
- Salary Journey
- Track Record
- Press Quote
- Real People
- The Urgency
- Signup
- Pursuit (initiatives)
- Council
- Partners
- Footer

**Files Modified:**
- `public/styles.css` - Changed body scroll-snap-type to mandatory

---

### v111 - 2026-01-26
**Status: Previous**

**Added: Responsive Resize Handler**
- ✅ Created `initResponsiveResize()` function
- ✅ Listens for browser window resize events
- ✅ 150ms debounce to avoid excessive recalculations
- ✅ Forces recalculation of hero step centering
- ✅ Ensures paragraph stays centered when browser is resized
- ✅ Triggers video header layout check for mobile stacking
- ✅ Maintains flexbox centering on all screen sizes

**How it works:**
1. User resizes browser window
2. Wait 150ms after resize stops (debounce)
3. Recalculate hero step min-height and centering
4. Force reflow to apply changes
5. Trigger layout check for mobile/desktop switching

**Files Modified:**
- `public/script.js` - Added initResponsiveResize() function

---

### v110 - 2026-01-26
**Status: Previous**

**Added: Logo Click to Scroll to Top**
- ✅ Created `initLogoClick()` function
- ✅ Added click handler to all logo elements
- ✅ Smooth scrolls to top (scroll position 0) when logo clicked
- ✅ Added pointer cursor to logos
- ✅ Works with video header logo and at-top logo

**Files Modified:**
- `public/script.js` - Added initLogoClick() function

---

### v109 - 2026-01-26
**Status: Previous**

**Restructured: Section Names and Nav Order**
- ✅ Renamed "Our Purpose" section → "What We Do" (id: hero → what-we-do)
- ✅ Renamed "Initiatives" section → "Pursuit" (id: initiatives → pursuit)
- ✅ Updated section label from "Our Purpose" to "What We Do"
- ✅ Updated section tag from "What We Do" to "Pursuit"
- ✅ Removed "About" from nav
- ✅ New nav order: What We Do, Builders, The Urgency, Council, Partners, Pursuit, Get Updates

**Section IDs:**
- `#what-we-do` - First section after video (formerly Our Purpose)
- `#pursuit` - Initiatives section (formerly What We Do)

**Files Modified:**
- `public/index.html` - Updated section IDs, labels, and nav structure

---

### v108 - 2026-01-26
**Status: Previous**

**Changed: Moved "What We Do" to First Nav Position**
- ✅ Reordered nav items - "What We Do" is now first
- ✅ Updated both desktop nav and mobile menu
- ✅ New order: What We Do, Builders, About, The Urgency, Council, Partners, Get Updates

**Files Modified:**
- `public/index.html` - Reordered nav-links and mobile-menu

---

### v107 - 2026-01-26
**Status: Previous**

**Added: Active Nav Item Tracking with Animated Underline**
- ✅ Added animated underline to nav links (::after pseudo-element)
- ✅ Underline grows from left to right (0 → 100% width)
- ✅ Created `initActiveNavTracking()` function
- ✅ Tracks scroll position and highlights active section's nav item
- ✅ "What We Do" link gets underline when in #initiatives section
- ✅ Works for all nav items (Builders, About, The Urgency, What We Do, Council, Partners)

**Animation:**
- Underline: 2px height, black color
- Positioned 4px below link text
- Transition: `width 0.3s ease`
- Grows from left (0%) to right (100%)

**Files Modified:**
- `public/styles.css` - Added ::after underline styles
- `public/script.js` - Added initActiveNavTracking() function

---

### v106 - 2026-01-26
**Status: Previous**

**Changed: Increased Minimum Font Size to 36px**
- ✅ Changed min font size from 2rem (32px) to 2.25rem (36px)
- ✅ Font size now: `clamp(2.25rem, 3.5vw, 2.875rem)`
- ✅ More readable on all screen sizes

**Font Size Range:**
- **Min:** 2.25rem (36px)
- **Preferred:** 3.5vw (responsive)
- **Max:** 2.875rem (46px)

**Files Modified:**
- `public/styles.css` - Updated .hero-text-pursuit font-size clamp

---

### v105 - 2026-01-26
**Status: Previous**

**Added: Responsive Padding for Mid-Range Sizes**
- ✅ Added base padding using `var(--container-padding)` (25px)
- ✅ 601-1400px: 80px padding on both sides
- ✅ 1025-1400px: 120px padding on both sides
- ✅ Mobile (≤600px): Uses base padding (25px)
- ✅ Large screens (>1400px): Uses base padding + max-width constraint

**Padding Breakdown:**
- Mobile: 25px sides
- Tablet (601-1024px): 80px sides
- Desktop (1025-1400px): 120px sides
- Large Desktop (>1400px): 25px + max-width 1400px

**Files Modified:**
- `public/styles.css` - Added responsive padding media queries

---

### v104 - 2026-01-26
**Status: Previous**

**Changed: Increased Paragraph Max-Width**
- ✅ Changed `.hero-text-pursuit-wrapper` max-width from 1000px to 1400px
- ✅ Paragraph now has more breathing room in mid-range sizes (900-1400px)
- ✅ Still responsive on mobile and looks good on large screens

**Files Modified:**
- `public/styles.css` - Updated hero-text-pursuit-wrapper max-width

---

### v103 - 2026-01-26
**Status: Previous**

**Note: Switched to simplified incremental versioning (v103, v104, v105...)**

---

### v2.1.102 - 2026-01-26
**Status: Previous**

**Fixed: Prevent Wrapper Show During Snap-Back**
- ✅ Added global `isSnappingBack` flag
- ✅ Set flag to `true` when snap-back animation starts
- ✅ Modified `handleVideoHeaderVisible()` to check flag
- ✅ Prevents Intersection Observer from showing wrapper during snap-back
- ✅ Flag resets after 600ms (when snap animation completes)

**The Problem:**
- During snap-back scroll, Intersection Observer detected video header visible
- Called `handleVideoHeaderVisible()` which set wrapper to visible
- This overrode our hide, causing phrase to appear during animation

**The Solution:**
- `isSnappingBack` flag blocks wrapper visibility during snap-back
- Wrapper stays hidden throughout entire snap animation
- Only becomes visible after `resetLogoToOriginal()` fade-in

**Files Modified:**
- `public/script.js` - Added flag, updated handleVideoHeaderVisible()

---

### v2.1.101 - 2026-01-26
**Status: Previous**

**Fixed: Query Wrapper Directly for Snap-Back Hide**
- ✅ Changed from scope variable to direct DOM query
- ✅ `document.querySelector('.video-header-content-wrapper')` instead of `contentWrapper`
- ✅ Ensures we're targeting the correct element every time
- ✅ More reliable hide during snap-back scroll animation

**Files Modified:**
- `public/script.js` - Changed to direct wrapper query

---

### v2.1.100 - 2026-01-26
**Status: Previous**

**Fixed: Hide Wrapper During Snap-Back Scroll**
- ✅ Added immediate wrapper hide when snap-back scroll starts
- ✅ Hide happens BEFORE `window.scrollTo()` animation
- ✅ Sets `transition: none`, `opacity: 0`, `visibility: hidden`
- ✅ Prevents phrase from being visible during scroll animation
- ✅ Wrapper stays hidden until `resetLogoToOriginal()` completes and fades in

**Timeline:**
1. User scrolls up from Our Purpose
2. Snap-back detected → hide wrapper instantly
3. Smooth scroll animation to top (wrapper hidden throughout)
4. Scroll reaches 0 → `resetLogoToOriginal()` called
5. Layout composed → fade in with correct stacked layout

**Files Modified:**
- `public/script.js` - Added wrapper hide before snap-back scroll

---

### v2.1.99 - 2026-01-26
**Status: Previous**

**Fixed: No Line Break + Proper Fade In**
- ✅ Changed stacked text from `white-space: normal` back to `nowrap`
- ✅ Phrase no longer line-breaks on initial load or stacked mode
- ✅ Added `visibility: hidden` at start (in addition to opacity)
- ✅ Disable transitions during composition (`transition: none`)
- ✅ Clear custom font-size on text reset
- ✅ Three reflows: remove stacked, add stacked, final composition check
- ✅ Re-enable transition and fade in (`opacity 0.3s ease`)
- ✅ Smooth 300ms fade-in after layout is 100% complete

**Sequence:**
1. Hide wrapper instantly (no transition, opacity 0, visibility hidden)
2. Reset all elements
3. Check and apply stacked layout
4. Force final reflow
5. Make visible and fade opacity from 0 to 1

**Files Modified:**
- `public/styles.css` - Changed white-space, added opacity transition
- `public/script.js` - Added visibility hidden, transition control, fade-in

---

### v2.1.98 - 2026-01-26
**Status: Previous**

**Fixed: Text Clipping + Synchronous Layout**
- ✅ Removed `overflow: hidden` and `text-overflow: clip` (was cutting off period)
- ✅ Changed to `overflow: visible` to show all text
- ✅ Changed `max-width: calc(100% - 34px)` back to `100%`
- ✅ Adjusted padding-right to match padding-left (19px)
- ✅ Removed ALL `requestAnimationFrame` calls in reset function
- ✅ Everything now happens synchronously before paint
- ✅ Added second `void wrapper.offsetHeight` after stacked class applied

**Fixes:**
- Period no longer cut off
- No visible jump/movement of phrase
- Text fully visible with proper padding
- Layout calculated and applied before ANY render

**Files Modified:**
- `public/styles.css` - Fixed overflow and max-width
- `public/script.js` - Made all layout changes synchronous

---

### v2.1.97 - 2026-01-26
**Status: Previous**

**Fixed: Hide-Then-Show for Clean Layout + Text Overflow**
- ✅ Added `wrapper.style.opacity = '0'` at start of reset
- ✅ Layout calculation happens while hidden (no visual movement)
- ✅ Added mobile detection (`window.innerWidth <= 768`) to force stacked mode
- ✅ Added text sizing calculation for stacked mode
- ✅ Show wrapper after layout is correct (`opacity = '1'`)
- ✅ Fixed text overflow: changed `max-width: 100%` to `calc(100% - 34px)`
- ✅ Added `overflow: hidden` and `word-wrap: break-word` to prevent cutoff

**Fixes:**
- No more logo movement from right to left
- Phrase doesn't get cut off on right side
- Stacked layout applied before elements visible
- Clean snap-back with no flashing or repositioning

**Files Modified:**
- `public/script.js` - Added hide/show wrapper logic, mobile detection, text sizing
- `public/styles.css` - Fixed text max-width and overflow

---

### v2.1.96 - 2026-01-26
**Status: Previous**

**Fixed: Immediate Stacked Layout on Snap Back**
- ✅ Removed async resize event dispatch (was causing 50ms delay/flash)
- ✅ Added synchronous stacked layout check directly in `resetLogoToOriginal()`
- ✅ Layout check runs BEFORE browser paints, preventing visual flash
- ✅ Checks if logo and text overlap immediately after reset
- ✅ Adds stacked class instantly if needed

**How it works:**
1. Logo moves back to wrapper
2. Stacked class removed + force reflow
3. Immediately measure logo and text positions
4. If overlap detected → add stacked class right away
5. Browser paints with correct layout (no flash)

**Files Modified:**
- `public/script.js` - Replaced setTimeout with synchronous layout check

---

### v2.1.95 - 2026-01-26
**Status: Previous**

**Fixed: Re-trigger Layout Check After Logo Reset**
- ✅ Added resize event dispatch after `resetLogoToOriginal()` completes
- ✅ 50ms delay ensures DOM has updated before layout check runs
- ✅ This re-runs `checkLayout()` which re-applies stacked mode if needed
- ✅ Fixes issue where stacked class was removed but not re-added on mobile

**How it works:**
1. Logo resets to original state (removes stacked class)
2. After 50ms, dispatches a resize event
3. Resize listener triggers `checkLayout()`
4. `checkLayout()` detects mobile dimensions and re-adds stacked class
5. Logo and phrase stack correctly

**Files Modified:**
- `public/script.js` - Added resize event dispatch in resetLogoToOriginal()

---

### v2.1.94 - 2026-01-26
**Status: Previous**

**Fixed: Mobile Stacked Layout Z-Index Issue**
- ✅ Added `z-index: 1` to `.video-header-text` (default)
- ✅ Added `z-index: 1000` to `.video-header-content-wrapper.stacked .video-header-text`
- ✅ Logo has `z-index: 1001` and logo img has `z-index: 1002`
- ✅ Phrase now properly stacks BEHIND logo in mobile layout
- ✅ Fixes overlap issue where phrase appeared on top of logo

**Z-Index Hierarchy (Stacked Mode):**
- Text: 1000 (bottom)
- Logo container: 1001 (middle)
- Logo img: 1002 (top)

**Files Modified:**
- `public/styles.css` - Added z-index to video-header-text styles

---

### v2.1.93 - 2026-01-26
**Status: Previous**

**Fixed: Logo State Preservation When Snapping Back**
- ✅ Changed reset condition from `<= 10` to `=== 0` (exact position only)
- ✅ Logo only resets when at absolute scroll position 0
- ✅ Added guard for 0-10px range to prevent premature reset
- ✅ Logo now maintains proper state when snapping back from Our Purpose
- ✅ Works correctly on mobile dimensions

**Logic:**
- `scrollY === 0` → Reset logo to original
- `0 < scrollY <= 10` → Do nothing (transitional zone)
- `scrollY > 10` → Continue normal scroll animation

**Files Modified:**
- `public/script.js` - Updated checkScroll() reset condition

---

### v2.1.92 - 2026-01-26
**Status: Previous**

**Fixed: Logo/Phrase Reset on Mobile Dimensions**
- ✅ Simplified `animateLogoBack()` function
- ✅ Now uses CSS transition instead of requestAnimationFrame
- ✅ Properly resets transform to `translateY(-50%)` then removes inline styles
- ✅ Fixes positioning issues when returning to header at mobile dimensions
- ✅ Works correctly with both desktop and stacked mobile layouts

**Changes:**
- Replaced complex RAF animation with simple CSS transition
- Immediate transform application with 300ms transition
- Clean timeout-based cleanup after animation

**Files Modified:**
- `public/script.js` - Rewrote animateLogoBack() function

---

### v2.1.91 - 2026-01-26
**Status: Previous**

**Changed: Increased Minimum Font Size**
- ✅ Changed min font size from 1.25rem (20px) to 2rem (32px)
- ✅ Font size now: `clamp(2rem, 3.5vw, 2.875rem)`
- ✅ Ensures paragraph is always at least 32px on all screen sizes

**Font Size Range:**
- **Min:** 2rem (32px)
- **Preferred:** 3.5vw (responsive)
- **Max:** 2.875rem (46px)

**Files Modified:**
- `public/styles.css` - Updated .hero-text-pursuit font-size clamp

---

### v2.1.90 - 2026-01-26
**Status: Previous**

**Changed: Image Right-Aligned to Content Area**
- ✅ Image now right-aligned to edge of content area (1200px max-width)
- ✅ Changed positioning from `left: 50%` to `right: 0`
- ✅ Updated transform from `translate(-50%, -50%)` to `translateY(-50%)`
- ✅ Set `transform-origin: center right` for proper rotation anchor
- ✅ Respects the 25px container padding on both sides

**Transform now:**
- `transform: translateY(-50%) rotate(-90deg) scale(0.8);`
- `transform-origin: center right;`

**Files Modified:**
- `public/styles.css` - Updated .hero-image-pursuit-bg positioning

---

### v2.1.89 - 2026-01-26
**Status: Previous**

**Fixed: True Vertical Centering**
- ✅ Reverted to `min-height: 100vh` (full viewport)
- ✅ Removed `margin-top: 36px`
- ✅ Added balanced padding: `padding-top: 36px; padding-bottom: 36px;`
- ✅ Flexbox centering now works correctly with equal padding top/bottom

**Changes:**
- Back to full viewport height calculation
- Equal padding creates true visual center

**Files Modified:**
- `public/styles.css` - Updated .hero-step:first-child centering

---

### v2.1.88 - 2026-01-26
**Status: Previous**

**Updated: Paragraph Text & Semi-Bold First Sentence**
- ✅ Updated paragraph text with new wording
- ✅ Changed "pioneering how" to "We're pioneering how"
- ✅ Changed "We train" to "by training"
- ✅ Made first sentence semi-bold (font-weight: 600)
- ✅ Added `.hero-text-pursuit-bold` class with font-variation-settings: "wght" 600

**New Text:**
- Bold: "Pursuit AI Jobs Institute is the nation's first AI workforce hub."
- Regular: "We're pioneering how America prepares everyone for the AI economy by training talent, supporting businesses, and creating pathways to our fullest potential and opportunities."

**Files Modified:**
- `public/index.html` - Updated paragraph text and added span for bold
- `public/styles.css` - Added .hero-text-pursuit-bold style

---

### v2.1.87 - 2026-01-26
**Status: Previous**

**Changed: Tighter Line Spacing**
- ✅ Reduced line-height from 1.7 to 1.3
- ✅ Lines now closer together (30% extra space vs 70%)
- ✅ More compact, tighter paragraph appearance

**Files Modified:**
- `public/styles.css` - Updated .hero-text-pursuit line-height

---

### v2.1.86 - 2026-01-26
**Status: Previous**

**Fixed: Adjusted Vertical Centering**
- ✅ Removed `padding-top: 72px` (was pushing content up)
- ✅ Added `margin-top: 36px` (half of nav height for better balance)
- ✅ Keeps `min-height: calc(100vh - 72px)` for proper viewport calculation
- ✅ Content should now center better in available space

**Changes:**
- Replaced `padding-top: 72px` with `margin-top: 36px`

**Files Modified:**
- `public/styles.css` - Updated .hero-step:first-child spacing

---

### v2.1.85 - 2026-01-26
**Status: Previous**

**Fixed: Center Content Between Nav and Bottom**
- ✅ Adjusted first hero step to account for nav height (72px)
- ✅ Changed `min-height: 100vh` to `calc(100vh - 72px)`
- ✅ Added `padding-top: 72px` to push content down
- ✅ Content now centers vertically in available space below nav

**Changes:**
- `.hero-step:first-child` now:
  - `min-height: calc(100vh - 72px)`
  - `padding-top: 72px`

**Files Modified:**
- `public/styles.css` - Updated .hero-step:first-child sizing

---

### v2.1.84 - 2026-01-26
**Status: Previous**

**Changed: Image Size Reduced to 80%**
- ✅ Added `scale(0.8)` to image transform
- ✅ Image now 80% of original size
- ✅ Maintains centering, rotation, and positioning

**Transform now:**
- `transform: translate(-50%, -50%) rotate(-90deg) scale(0.8);`

**Files Modified:**
- `public/styles.css` - Updated .hero-image-pursuit-bg transform

---

### v2.1.83 - 2026-01-26
**Status: Previous**

**Fixed: Dynamic Section Heights**
- ✅ First hero step now has `height: auto` for dynamic sizing
- ✅ Keeps `min-height: 100vh` to ensure minimum viewport height
- ✅ Added `margin-bottom: 4rem` to first step for spacing
- ✅ Added `min-height: 400px` to pursuit wrapper to contain image
- ✅ Section will now grow to contain all elements

**Changes:**
- `.hero-step:first-child` - added `height: auto`, `position: relative`, adjusted margins
- `.hero-text-pursuit-wrapper` - added `min-height: 400px`

**Files Modified:**
- `public/styles.css` - Updated hero-step and wrapper heights

---

### v2.1.82 - 2026-01-26
**Status: Previous**

**Fixed: Image Bleeding into Video Header**
- ✅ Changed `.hero` from `overflow: visible` to `overflow: hidden`
- ✅ Image now clipped at hero section boundaries
- ✅ Prevents image from seeping into video header above

**Files Modified:**
- `public/styles.css` - Updated .hero overflow property

---

### v2.1.81 - 2026-01-26
**Status: Previous**

**Changed: Rotated Image 01**
- ✅ Rotated image 90 degrees counter-clockwise
- ✅ Added `rotate(-90deg)` to transform
- ✅ Combined with existing translate for proper centering

**Transform now:**
- `transform: translate(-50%, -50%) rotate(-90deg);`

**Files Modified:**
- `public/styles.css` - Updated .hero-image-pursuit-bg transform

---

### v2.1.80 - 2026-01-26
**Status: Previous**

**Added: Image 01 Behind Paragraph**
- ✅ Added `AIJI_Image_OurPurpose_01.png` behind the paragraph
- ✅ Image is vertically oriented (height: 80vh, max-height: 900px)
- ✅ Positioned absolutely, centered with transform
- ✅ Uses `object-fit: contain` to maintain aspect ratio
- ✅ Text layered on top with z-index: 1
- ✅ Image has 90% opacity for subtle effect

**CSS Changes:**
- `.hero-image-pursuit-bg` - new class for background image
- `.hero-text-pursuit-wrapper` - now uses flexbox
- `.hero-text-pursuit` - added relative positioning and z-index

**Files Modified:**
- `public/index.html` - Added img element in hero-step-1
- `public/styles.css` - Added image background styles

---

### v2.1.79 - 2026-01-26
**Status: Previous**

**Fixed: Paragraph True Center Position**
- ✅ Removed top padding from .hero section (was 120px)
- ✅ Changed padding from `120px 0 150px` to `0 0 150px`
- ✅ Paragraph now truly centers vertically in viewport
- ✅ First step's flexbox centering now works correctly

**Files Modified:**
- `public/styles.css` - Removed top padding from .hero

---

### v2.1.78 - 2026-01-26
**Status: Previous**

**Fixed: Center Paragraph Vertically**
- ✅ First hero step now centers vertically in viewport
- ✅ Uses flexbox centering (align-items + justify-content)
- ✅ Set min-height: 100vh on first step
- ✅ Works regardless of browser size

**Changes:**
- `.hero-step:first-child` now has:
  - `min-height: 100vh`
  - `display: flex`
  - `align-items: center`
  - `justify-content: center`
  - `margin-top: 0` (removed 6rem)

**Files Modified:**
- `public/styles.css` - Updated .hero-step:first-child styles

---

### v2.1.77 - 2026-01-26
**Status: Previous**

**Removed: Pink Line Under Video**
- ✅ Removed `.hero-pink-band` element from HTML
- ✅ Removed `.hero-pink-band` CSS styles
- ✅ Clean transition between video header and Our Purpose section

**Files Modified:**
- `public/index.html` - Removed hero-pink-band div
- `public/styles.css` - Removed hero-pink-band styles

---

### v2.1.76 - 2026-01-26
**Status: Previous**

**Removed: Snap Back Debounce Delay**
- ✅ Removed 150ms delay - now snaps instantly when conditions met
- ✅ Same immediate behavior as downward snap
- ✅ Added `isManualScrolling` flag to prevent snap loops
- ✅ 600ms cooldown after snap completes

**New Logic:**
- Video visible → instant snap to header (no delay)
- Cooldown prevents multiple rapid snaps
- Matches the feel of the downward snap behavior

**Files Modified:**
- `public/script.js` - Removed setTimeout, added isManualScrolling flag

---

### v2.1.75 - 2026-01-26
**Status: Previous**

**Changed: Visibility-Based Snap Back**
- ✅ Removed 50% threshold logic
- ✅ New rule: If ANY part of video header is visible → snap back to header
- ✅ Simpler, more intuitive behavior
- ✅ No more direction checking needed

**New Logic:**
- Video visible in viewport (scrollY < videoHeaderHeight) → snap to top
- Video completely out of view → stay at Our Purpose
- 150ms debounce after scroll stops

**Files Modified:**
- `public/script.js` - Simplified snap-back logic to visibility-based only

---

### v2.1.74 - 2026-01-26
**Status: Previous**

**Fixed: Swipe Detection + Snap Back Behavior**
- ✅ Fixed swipe detection when returning to header - removed hasDetectedSwipe check in wheel event
- ✅ Added snap-back behavior when scrolling between header and Our Purpose
- ✅ Prevents partial scroll states (like in screenshot)
- ✅ Scroll direction detection for smart snapping

**Snap Back Logic:**
- If scrolling UP and < 50% through video → snaps back to header (top)
- If scrolling DOWN and > 50% through video → snaps forward to Our Purpose
- 150ms debounce after scroll stops
- Smooth scroll animation

**Swipe Fix:**
- Removed `hasDetectedSwipe` check from wheel event condition
- Now only checks: `currentScroll === 0 && !isAnimating && !hasDetectedSwipe`
- Flags reset properly when reaching exact top position

**Files Modified:**
- `public/script.js` - Fixed wheel event logic, added snap-back scroll listener

---

### v2.1.73 - 2026-01-26
**Status: Previous**

**Fixed: Swipe Detection After Scrolling Back**
- ✅ Added flag reset when scrolling back to top (scroll position 0)
- ✅ Resets `hasDetectedSwipe` and `swipeDirection` flags
- ✅ Clears content wrapper transform when returning to header
- ✅ Swipe gestures now work correctly after returning from Our Purpose section

**How it works:**
- When `window.scrollY === 0` and not animating:
  - Reset `hasDetectedSwipe = false`
  - Reset `swipeDirection = 0`
  - Clear content wrapper styles
- Allows swipe detection to work again on return to header

**Files Modified:**
- `public/script.js` - Added scroll listener to reset flags at scroll position 0

---

### v2.1.72 - 2026-01-26
**Status: Previous**

**Increased Text Width:**
- ✅ Changed max-width from 600px to 1000px
- ✅ Text can now span wider on larger screens

**Files Modified:**
- `public/styles.css` - Updated .hero-text-pursuit-wrapper max-width to 1000px

---

### v2.1.71 - 2026-01-26
**Status: Previous**

**Larger Responsive Font Size:**
- ✅ Changed to `clamp(1.25rem, 3.5vw, 2.875rem)`
- ✅ Min size: 1.25rem (20px) on small screens
- ✅ Max size: 2.875rem (46px) on large screens
- ✅ Scales fluidly with viewport width (3.5vw)

**Files Modified:**
- `public/styles.css` - Updated .hero-text-pursuit font-size

---

### v2.1.70 - 2026-01-26
**Status: Previous**

**Responsive Font Size:**
- ✅ Changed from fixed `1.125rem` to responsive `clamp(1rem, 2.5vw, 1.25rem)`
- ✅ Min size: 1rem (16px) on small screens
- ✅ Max size: 1.25rem (20px) on large screens
- ✅ Scales fluidly with viewport width (2.5vw)

**Files Modified:**
- `public/styles.css` - Updated .hero-text-pursuit font-size to use clamp()

---

### v2.1.69 - 2026-01-26
**Status: Previous**

**Our Purpose Section - First Element:**
- ✅ Removed background from "Pursuit AI Jobs Institute..." text
- ✅ Removed Image 01 (no longer displayed)
- ✅ Text now displays directly on page background (#FFF3E9)
- ✅ Updated to use Fractul font family
- ✅ Clean, simple text presentation (1.125rem, line-height 1.7)

**Changes:**
- Removed `.hero-image-with-text` image display
- Removed background, border-radius, backdrop-filter from text
- Renamed wrapper to `.hero-text-pursuit-wrapper` for clarity
- Set font to `"fractul-variable", sans-serif` with font-weight 400
- Centered text, max-width 600px

**Files Modified:**
- `public/index.html` - Simplified HTML structure, removed image element
- `public/styles.css` - Removed background styling, updated font to Fractul

---

### v2.1.68 - 2026-01-26
**Status: Previous**

**Fixed: Scroll Position Lock**
- ✅ Aggressive/large swipes now stop exactly at Our Purpose top
- ✅ Added final position lock: `window.scrollTo(0, targetPosition)` after animation
- ✅ Prevents all wheel events during animation (`isAnimating` check)
- ✅ Added scroll listener that corrects position if it overshoots
- ✅ Regardless of swipe strength, always lands at exact target

**How it works:**
1. During swipe detection: All wheel events are prevented
2. During animation: All wheel events are prevented  
3. Animation completes: Final `scrollTo()` ensures exact position
4. Scroll listener: Catches any overshoot and corrects to `videoHeaderHeight`

**Technical Changes:**
- Added `preventDefault()` for all wheel events when `isAnimating || hasDetectedSwipe`
- Added final `window.scrollTo(0, targetPosition)` after animation completes
- Added scroll event listener that locks position if > videoHeaderHeight during animation

**Files Modified:**
- `public/script.js` - Added multiple safeguards to prevent overscroll

---

### v2.1.67 - 2026-01-26
**Status: Previous**

**Video Transition Improvement:**
- ✅ Added overlay element on top of video with page background color (#FFF3E9)
- ✅ Changed from fading video opacity to fading overlay opacity
- ✅ Video stays at full opacity throughout - overlay covers it instead
- ✅ Overlay fades from 0% to 100% opacity as page scrolls

**How it works:**
- Video plays at full brightness throughout
- Overlay sits on top (z-index: 2, above video)
- As page scrolls (10% - 80% of video height):
  - Overlay opacity: 0 → 1
  - Creates effect of video fading to background color
- Smoother, more natural transition

**Technical Implementation:**
- Added `.video-header-overlay` div in HTML
- CSS: `background: #FFF3E9; opacity: 0; z-index: 2;`
- JavaScript: Fades overlay.style.opacity from 0 to 1 (instead of video from 1 to 0)

**Files Modified:**
- `public/index.html` - Added video-header-overlay div
- `public/styles.css` - Added .video-header-overlay styles
- `public/script.js` - Changed fade logic to target overlay instead of video

---

### v2.1.66 - 2026-01-26
**Status: Previous**

**Timing Adjustment:**
- ✅ Removed 50ms pause between logo movement and snap
- ✅ Snap now starts immediately after logo/phrase finish moving
- ✅ More fluid, continuous animation

**New Timing:**
- Phase 1 (logo/phrase): 300ms
- Pause: 0ms (removed)
- Phase 2 (snap): 600ms
- Total: ~900ms

**Files Modified:**
- `public/script.js` - Removed setTimeout pause, direct call to startPageTransition()

---

### v2.1.65 - 2026-01-26
**Status: Previous**

**Refined Swipe Behavior:**
- ✅ Video stays fully visible during swipe - no fading or moving
- ✅ Logo/phrase movement reduced to subtle 30px (was 150px)
- ✅ Video only fades when actually scrolling through the page (scroll > 0)
- ✅ At position 0 (during swipe), video stays at full opacity

**Animation Sequence:**
1. **User swipes up on video**
   - Video stays in place (no fade, no movement)
   - Logo/phrase move up slightly (30px, 300ms)
   
2. **Snap triggers** (after 50ms pause)
   - Entire video section scrolls up
   - Video fades as it leaves viewport
   - Our Purpose snaps to top (600ms)

**Technical Changes:**
- Reduced logo/phrase translate from -150px to -30px
- Added condition to video fade: only when `currentScroll > 0`
- Video opacity locked at 1.0 when at top position
- Faster subtle movement duration (300ms)

**Result:**
More subtle, refined interaction - logo/phrase hint at movement, then the full transition happens.

**Files Modified:**
- `public/script.js` - Reduced movement distance, fixed video fade timing

---

### v2.1.64 - 2026-01-26
**Status: Previous**

**Fixed: Swipe-Triggered Animation (Not Tied to Trackpad)**
- ✅ Logo/phrase movement is NO LONGER tied to trackpad movement
- ✅ First swipe motion **immediately triggers** smooth animation
- ✅ Animation runs independently - continuous smooth motion to top
- ✅ No stuttering or stopping when fingers leave trackpad

**How it works now:**
1. **User starts swiping up** → Animation immediately begins
2. **Logo/phrase smoothly glide to top** (400ms ease-out-cubic)
3. **Brief pause** (100ms)
4. **Page transitions** to Our Purpose (600ms)
5. User's finger position doesn't matter - animation is autonomous

**Key Changes:**
- Removed `handleVideoScroll()` function that tracked finger position
- Removed `videoScrollAmount` tracking variable
- First wheel event with `deltaY > 0` immediately triggers full animation
- Logo/phrase animate from current position to -150px translate
- Single detection per swipe with `hasDetectedSwipe` flag
- Animation is completely independent of continued trackpad input

**Result:**
One smooth, continuous animation from start to finish. No tracking of finger position, no intermediate states - just trigger and animate.

**Files Modified:**
- `public/script.js` - Complete simplification of initSectionSnapping()

---

### v2.1.63 - 2026-01-26
**Status: Previous**

**Seamless Two-Phase Animation:**
- ✅ Logo and phrase now complete their journey to top BEFORE snap begins
- ✅ No more stopping/stuttering when fingers leave trackpad
- ✅ Three distinct phases with smooth transitions:

**Animation Sequence:**
1. **During Swipe:** Logo/phrase move with your fingers (up to 150px)
2. **Phase 1 (300ms):** Logo/phrase smoothly complete movement to top position
3. **Brief Pause (50ms):** Moment of anticipation
4. **Phase 2 (500ms):** Entire video section slides up, Our Purpose snaps in

**Technical Changes:**
- Split `snapToHero()` into two animation phases
- Phase 1: Completes logo/phrase movement with ease-out easing (300ms)
- 50ms pause between phases for visual clarity
- Phase 2: Page scroll animation (500ms)
- Increased max translate distance from 100px to 150px for more dramatic effect

**Visual Flow:**
- User swipes → Logo/phrase follow finger
- User releases → Logo/phrase smoothly glide to top
- Brief beat → Entire section transitions

**Files Modified:**
- `public/script.js` - Rewrote snapToHero() with sequential phase animations

---

### v2.1.62 - 2026-01-26
**Status: Previous**

**Two-Phase Scroll Animation:**
- ✅ **Phase 1 (During Swipe):** Only logo and "AI for All of Us" phrase move up as you scroll
- ✅ **Phase 2 (After Release):** Video slides up and Our Purpose snaps into place
- ✅ Video and page stay locked in place while you're swiping
- ✅ Page scroll is temporarily disabled during video scroll interaction

**How it works:**
1. **User swipes up on video header**
   - Page scroll is locked (body overflow hidden)
   - Only logo and phrase translate upward (up to 100px)
   - Video background stays fixed in place
   
2. **User releases (stops scrolling)**
   - If swiped up: Entire video section smoothly scrolls up, Our Purpose snaps to top (600ms)
   - If swiped down: Logo/phrase smoothly return to original position (400ms)
   - Page scroll is unlocked

**Technical Implementation:**
- Intercepts `wheel` events on video header with `preventDefault()`
- Locks body scroll with `position: fixed` during interaction
- Tracks scroll amount within video (max 300px virtual scroll)
- Translates content wrapper based on scroll progress
- Custom animations for both snap and reset using `requestAnimationFrame`

**Files Modified:**
- `public/script.js` - Complete rewrite of initSectionSnapping() with two-phase animation

---

### v2.1.61 - 2026-01-26
**Status: Previous**

**Simplified Snapping:**
- ✅ Removed all thresholds - pure direction-based snapping
- ✅ **ANY upward swipe** motion → immediately snaps to Our Purpose top
- ✅ **ANY downward swipe** motion → immediately snaps back to video top
- ✅ No more threshold calculations or minimum distance requirements
- ✅ Instant commitment based solely on swipe direction

**How it works:**
- In transition zone (between video and Our Purpose)
- User swipes UP (scrolls down) → smooth snap to Our Purpose
- User swipes DOWN (scrolls up) → smooth snap back to video
- No thresholds to cross - direction is the only factor

**Technical Changes:**
- Removed `videoThreshold` and `heroThreshold` calculations
- Simplified logic: `scrollDirection === 1` → snap to hero, `scrollDirection === -1` → snap to video
- Same smooth 600ms ease-out-cubic animation

**Files Modified:**
- `public/script.js` - Removed threshold logic, pure direction-based snapping

---

### v2.1.60 - 2026-01-26
**Status: Previous**

**Major Improvements:**
- ✅ Fixed snap behavior - now direction-based and consistent regardless of swipe strength
- ✅ Smooth custom animation using `requestAnimationFrame` with ease-out-cubic easing
- ✅ No more jarring stop-then-snap motion - continuous smooth scroll to target
- ✅ Intelligent thresholds based on scroll direction:
  - **Scrolling DOWN**: Pass 30% of video → snap to Our Purpose
  - **Scrolling UP**: Go below 70% of video → snap back to video top
- ✅ Faster response time (100ms vs 150ms)

**How it works now:**
1. **Light swipe up** (>30% threshold) → smoothly snaps to Our Purpose top
2. **Light swipe down** from Our Purpose (<70% threshold) → smoothly snaps back to video
3. **Any swipe strength** triggers the same smooth animation
4. Uses custom `requestAnimationFrame` animation (600ms duration) instead of browser's smooth scroll
5. Ease-out-cubic easing for natural, smooth deceleration

**Technical Details:**
- Direction-aware thresholds (30% down / 70% up)
- Custom animation loop with easing function
- Faster snap detection (100ms idle time)
- Consistent behavior regardless of scroll velocity

**Files Modified:**
- `public/script.js` - Completely rewrote initSectionSnapping() with direction-based logic

---

### v2.1.59 - 2026-01-26
**Status: Previous**

**Major Fix:**
- ✅ Implemented programmatic section snapping with JavaScript
- ✅ Changed CSS from `scroll-snap-type: mandatory` to `proximity` (less aggressive baseline)
- ✅ Added intelligent JavaScript snap detection that triggers after scroll stops
- ✅ Snaps to nearest section within 150ms of scroll ending
- ✅ Smooth scroll animation to snap target with `behavior: 'smooth'`

**How it works:**
1. User scrolls/swipes from video header
2. When scroll stops (150ms idle), JavaScript detects nearest section
3. If section is close (within 50% of viewport height), smooth snap to section top
4. Prevents snap conflicts with 800ms cooldown

**Technical Implementation:**
- `scroll-snap-type: y proximity` on body (backup behavior)
- JavaScript `initSectionSnapping()` function handles intelligent snapping
- Detects scroll end with debounced timeout
- Calculates closest section and snaps with `window.scrollTo()`

**Files Modified:**
- `public/styles.css` - Changed mandatory to proximity, moved snap-type to body
- `public/script.js` - Added initSectionSnapping() function with smart snap detection

---

### v2.1.58 - 2026-01-26
**Status: Previous**

**Fixes:**
- ✅ Fixed snap scrolling - one swipe from header video now immediately snaps Our Purpose section to top
- ✅ Moved `scroll-snap-type: y mandatory` from body to html element for proper snap behavior
- ✅ Added `scroll-snap-stop: always` enforcement on video-header and hero sections
- ✅ Video header locked to exactly 100vh (min/max height) to prevent expansion
- ✅ Removed conflicting scroll-behavior settings that interfered with snapping
- ✅ Adjusted hero padding from 150px to 120px top for better alignment

**Technical Changes:**
- `scroll-snap-type` now on `html` element instead of `body`
- Video header: `height: 100vh; min-height: 100vh; max-height: 100vh;`
- Hero section: `scroll-snap-align: start; scroll-snap-stop: always;`
- Removed duplicate html scroll settings that caused conflicts

**Files Modified:**
- `public/styles.css` - Updated scroll snap configuration and section heights

---

### v2.1.57 - 2026-01-26
**Status: Previous**

**Fixes:**
- ✅ Fixed section snapping - sections now snap properly when scrolling
- ✅ Changed all sections from fixed `height: 100vh` to dynamic `min-height: 100vh` + `height: auto`
- ✅ Each section now adjusts to its content height while maintaining minimum viewport height
- ✅ Changed overflow from `auto` to `visible` to prevent nested scrolling issues
- ✅ Added proper spacing to hero steps (4rem between, 6rem at top/bottom)
- ✅ Next section no longer appears at bottom while scrolling within current section

**Technical Changes:**
- All sections use `min-height: 100vh` instead of fixed `height: 100vh`
- Sections expand naturally based on content with `height: auto`
- `overflow: visible` prevents scroll containers within scroll containers
- Snap points work correctly with dynamic heights

**Files Modified:**
- `public/styles.css` - Updated all section height and overflow properties

---

### v2.1.56 - 2026-01-26
**Status: Previous**

**Major Features:**
- ✅ Implemented two-layer scroll system: section-level snapping + within-section lazy reveals
- ✅ Video header fades out smoothly as you swipe up to next section
- ✅ "Our Purpose" section with sequential lazy scroll reveals
- ✅ Hidden scrollbar throughout entire site (no visible scrollbar)
- ✅ Restructured "Our Purpose" content with correct reveal order:
  1. Image 01 with "Pursuit AI Jobs Institute..." text overlaid
  2. "We harness our collective power..." text
  3. Three lines with Image 02 behind them
- ✅ "Our Purpose" label stays fixed at vertical center throughout section

**Reveal Sequence:**
- Elements appear one by one as you scroll within the "Our Purpose" section
- Video fades to opacity 0 as it scrolls off screen (30%-90% scroll range)
- Logo and nav animations remain intact from previous versions

**Files Modified:**
- `public/index.html` - Restructured hero section HTML with new step-based layout
- `public/styles.css` - Added scrollbar hiding, new hero step styles, image overlay styles
- `public/script.js` - Implemented lazy scroll reveal system and video fade transitions

---

### v2.1.55 - 2025-01-25
**Status: Previous**

**Configuration:**
- ✅ Port set to 3003 (default)
- ✅ Added better error handling for port binding issues
- ✅ Server provides helpful error messages if port is blocked

**Note:** If you encounter permission errors, run the server manually in your terminal:
```bash
cd /Users/yoshiyukiminami/Desktop/BUILDS/aiji-website/v02
node server.js
```

**Files Modified:**
- `server.js` - Added error handling for port binding issues

---

### v2.1.54 - 2025-01-25
**Status: Previous**

**Configuration:**
- ✅ Changed server port from 3000 to 3003

**Files Modified:**
- `server.js` - Updated default port to 3003

---

### v2.1.53 - 2025-01-25
**Status: Previous**

**Fixes & Improvements:**
- ✅ Made heroTop calculation dynamic with getHeroTop() function for accurate positioning
- ✅ Added recalculation of heroTop on window load and resize events
- ✅ Improved scroll locking to be less aggressive and only trigger on actual scroll changes
- ✅ Added explicit `left: 50%` positioning in all steps to ensure horizontal centering
- ✅ Added proper initialization check for DOM ready state
- ✅ Fixed potential timing issues with heroTop calculation

**Files Modified:**
- `public/script.js` - Improved heroTop calculation, scroll locking logic, and initialization

---

### v2.1.52 - 2025-01-25
**Status: Previous**

**Major Restructure:**
- ✅ Restructured hero section to move content as a unified unit
- ✅ Changed .hero-content to absolute positioning, centered at 50%
- ✅ Changed .hero-title-wrapper and .hero-description to relative positioning within .hero-content
- ✅ Entire hero-content container now moves up as a unit (50% → 45% → 40%) while staying centered
- ✅ Description appears below title within the same container (no overlap)
- ✅ Pattern established for reusable lazy scroll reveal system

**Sequence:**
- Step 1: Three lines appear centered (hero-content at 50%)
- Step 2: Entire unit moves up to 45%, "We believe..." appears below with lazy scroll
- Step 3: Entire unit moves up to 40%, rest of sentence appears with lazy scroll
- Step 4: Next section loads

**Files Modified:**
- `public/styles.css` - Restructured .hero-content, .hero-title-wrapper, and .hero-description positioning
- `public/script.js` - Updated to move entire hero-content container as a unit instead of individual elements

---

### v2.1.51 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed description appearing on top of three lines in step 2
- ✅ Positioned description dynamically below three lines: at 58% when title is at 40%, at 53% when title is at 35%
- ✅ Added explicit top, left, and transform positioning in JavaScript for steps 2-3
- ✅ Changed CSS default description position from 55% to 60% for better initial spacing

**Files Modified:**
- `public/styles.css` - Changed .hero-description default top from 55% to 60%
- `public/script.js` - Added dynamic description positioning in steps 2-3 (58% and 53% respectively)

---

### v2.1.50 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed three lines not moving up and description not appearing in steps 2-3
- ✅ Added explicit `left: 50%` and transition properties in steps 2-3 to ensure smooth movement
- ✅ Fixed duplicate CSS rule for .hero-description.revealed
- ✅ Changed description position from 60vh to 55% to better align with title movement
- ✅ Ensured description visibility and opacity are properly set when revealed
- ✅ Increased transition timeout to 800ms to allow animations to complete
- ✅ Added proper transform reset for description parts in step 2

**Files Modified:**
- `public/styles.css` - Fixed duplicate .hero-description.revealed rule, changed description top to 55%
- `public/script.js` - Added explicit positioning and transitions in steps 2-3, ensured description visibility

---

### v2.1.49 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed three lines being cut off at bottom of screen
- ✅ Changed positioning from `50vh` to `50%` to position relative to hero section (100vh) instead of viewport
- ✅ This ensures proper centering within the hero section container
- ✅ Updated all step positions to use percentage (50% → 40% → 35%) instead of viewport units
- ✅ Added `left: 50%` to ensure horizontal centering is maintained

**Files Modified:**
- `public/styles.css` - Changed .hero-title-wrapper top from 50vh to 50%, added top transition
- `public/script.js` - Updated all step positions to use percentage values (50%, 40%, 35%) instead of vh units

---

### v2.1.48 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed centering issue - separated three lines from description paragraph
- ✅ Three lines now centered independently at 50vh (middle of screen) in step 1
- ✅ Three lines move up (to 40vh then 35vh) as description appears in steps 2-3
- ✅ Description positioned separately below three lines (at 60vh)
- ✅ Added lazy scroll animation (fade in + slide up) for description parts as they appear
- ✅ Changed .hero-title-wrapper to absolute positioning for independent centering
- ✅ Changed .hero-description to absolute positioning separate from title wrapper

**Files Modified:**
- `public/styles.css` - Separated .hero-title-wrapper and .hero-description positioning, made title wrapper absolutely positioned at 50vh
- `public/script.js` - Updated step logic to move title wrapper up (50vh → 40vh → 35vh) as content appears, added lazy scroll animations

---

### v2.1.47 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed vertical centering issue - changed from `top: 50%` to `top: 50vh` to use viewport height units directly
- ✅ Removed transition from transform property to prevent override of centering transform
- ✅ Ensured transform: translate(-50%, -50%) is maintained for perfect centering

**Files Modified:**
- `public/styles.css` - Changed .hero-content top position to use 50vh, removed transform from transition property

---

### v2.1.46 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed three lines not appearing in center of screen - removed padding from .hero that was offsetting content
- ✅ Changed .hero-content to use absolute positioning with translate(-50%, -50%) for perfect viewport centering
- ✅ Removed padding from .hero section to prevent offset
- ✅ Updated .hero-content to use absolute positioning: top: 50%, left: 50%, transform: translate(-50%, -50%)

**Files Modified:**
- `public/styles.css` - Removed padding from .hero, changed .hero-content to absolute positioning for perfect centering
- `public/script.js` - Updated margin setting in step 1

---

### v2.1.45 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Ensured three lines are perfectly centered both vertically and horizontally on screen
- ✅ Set .hero-content to full height (100%) with no padding/margin to ensure proper centering
- ✅ Set .hero-title-wrapper to width: 100% with margin: 0 auto for horizontal centering
- ✅ Simplified JavaScript to rely on CSS flexbox for centering instead of manual positioning

**Files Modified:**
- `public/styles.css` - Added height: 100%, margin: 0, padding: 0 to .hero-content; set width: 100% and margin: 0 auto to .hero-title-wrapper
- `public/script.js` - Simplified step 1 code to remove manual positioning, let CSS handle centering

---

### v2.1.44 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Ensured three lines are centered on screen when they appear in step 1
- ✅ Added flexbox centering to .hero-content wrapper for proper vertical centering
- ✅ Explicitly set justify-content and align-items on hero-content to center title wrapper

**Files Modified:**
- `public/styles.css` - Added flexbox properties to .hero-content to ensure proper centering
- `public/script.js` - Added explicit centering styles when three lines appear in step 1

---

### v2.1.43 - 2025-01-25
**Status: Previous**

**Features:**
- ✅ Implemented discrete swipe-based navigation system
- ✅ Step 0: Header visible
- ✅ Step 1: Header exits upward, nav appears, hero section shows three lines centered
- ✅ Step 2: Reveals "We believe in our collective power..." text
- ✅ Step 3: Reveals "Pursuit AI Jobs Institute is the nation's first AI workforce hub..." text
- ✅ "Our Purpose" label stays fixed at vertical center throughout all steps
- ✅ Prevents scrolling to next section until step 3 is complete
- ✅ Supports both trackpad/mouse wheel and touch swipe gestures
- ✅ Supports keyboard navigation (arrow keys, page up/down)

**Files Modified:**
- `public/script.js` - Replaced scroll-based reveal with discrete step-based swipe navigation system
- `public/styles.css` - Added transitions for video header exit animation, initialized hero title opacity to 0

---

### v2.1.42 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Limited scroll snapping to only video header and "Our Purpose" section (removed from other sections)
- ✅ Moved scroll-snap-type from html to body for better control

**Files Modified:**
- `public/styles.css` - Removed scroll-snap-align from .salary-journey-section, moved scroll-snap-type to body

---

### v2.1.41 - 2025-01-25
**Status: Previous**

**Features:**
- ✅ Re-implemented scroll snapping for sections (video header and hero)
- ✅ Added progressive scroll-based reveal for "Our Purpose" section
- ✅ Positioned "Our Purpose" label at vertical center, left-aligned
- ✅ Three lines ("We Build", rotating words, "for All of Us") move up as user scrolls within section
- ✅ Description text reveals progressively: "We believe..." appears first, then "Pursuit AI Jobs Institute..." text

**Files Modified:**
- `public/styles.css` - Added scroll-snap-type to html, scroll-snap-align to sections, repositioned .label-meta-hero to vertical center, added reveal animations for .hero-description
- `public/index.html` - Split hero description into parts for progressive reveal
- `public/script.js` - Added initHeroScrollReveal() function to handle scroll-based progressive content reveal

---

### v2.1.40 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Removed background image from hero section (temporarily)

**Files Modified:**
- `public/styles.css` - Removed background-image and ::before pseudo-element from .hero section

---

### v2.1.39 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Added opacity overlay to background image - image now displays at 80% opacity using ::before pseudo-element

**Files Modified:**
- `public/styles.css` - Added .hero::before pseudo-element with opacity: 0.8, moved background-image from .hero to ::before

---

### v2.1.38 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Changed background-size to 80% auto - image width is now 80% of browser width, height scales proportionally to maintain original aspect ratio

**Files Modified:**
- `public/styles.css` - Updated .hero background-size to 80% auto

---

### v2.1.37 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Changed background-size from cover to auto to preserve original image size
- ✅ Image now centered in section without scaling

**Files Modified:**
- `public/styles.css` - Updated .hero background-size to auto to maintain original image dimensions

---

### v2.1.36 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Added AIJI_Image_OurPurpose.png as background image for "Our Purpose" (hero) section
- ✅ Background set to cover with center positioning

**Files Modified:**
- `public/styles.css` - Added background-image to .hero section

---

### v2.1.35 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Removed "Anchor Funders" section and associated partner logos from hero section

**Files Modified:**
- `public/index.html` - Removed .hero-partners-bottom-left div containing Anchor Funders label and partner logos

---

### v2.1.34 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Changed span from display: block to display: inline to remove line break after "hub"
- ✅ Text now flows continuously: "hub, pioneering..." on same line

**Files Modified:**
- `public/index.html` - Changed span display property from block to inline

---

### v2.1.33 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Removed line break after "hub" - text now flows continuously after "Pursuit AI Jobs Institute is the nation's first AI workforce hub,"

**Files Modified:**
- `public/index.html` - Moved comma inside the span to remove line break after "hub"

---

### v2.1.32 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Changed paragraph max-width from 700px to 500px

**Files Modified:**
- `public/styles.css` - Updated .hero-description max-width to 500px

---

### v2.1.31 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Separated max-width for title and paragraph
- ✅ Removed max-width from .hero-content container
- ✅ Title wrapper now has max-width: 900px (can be wider)
- ✅ Paragraph (.hero-description) has max-width: 700px (narrower than title)

**Files Modified:**
- `public/styles.css` - Moved max-width constraint from .hero-content to .hero-description, set .hero-title-wrapper to 900px

---

### v2.1.30 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Changed hero-content max-width from 800px to 700px

**Files Modified:**
- `public/styles.css` - Updated .hero-content max-width to 700px

---

### v2.1.29 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Added paragraph break with line spacing of 2 between first sentence and "Pursuit AI Jobs Institute" text
- ✅ Used styled `<br>` tag with line-height: 2 and margin-bottom for clear visual separation

**Files Modified:**
- `public/index.html` - Added styled line break with line-height: 2 in hero-description paragraph

---

### v2.1.28 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Updated hero description copy: Changed "AIJI believes" to "We believe"
- ✅ Added line break after "...future that benefits all of us?"
- ✅ Changed "We are the nation's first..." to "Pursuit AI Jobs Institute is the nation's first AI workforce hub" and made it semi-bold (font-weight: 600)

**Files Modified:**
- `public/index.html` - Updated hero-description paragraph with new copy and formatting

---

### v2.1.27 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Moved entire nav (including logo) up 2px
- ✅ Updated nav top position from 0 to -2px
- ✅ Updated logo top position from 0px to -2px
- ✅ Updated topPadding constant from 0 to -2 to maintain alignment

**Files Modified:**
- `public/styles.css` - Updated .nav and .video-header-logo.at-top top positions to -2px
- `public/script.js` - Updated topPadding constant to -2

---

### v2.1.26 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Moved nav items 3px more up by changing translateY from 5px to 2px

**Files Modified:**
- `public/styles.css` - Updated .nav-links translateY from 5px to 2px

---

### v2.1.25 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Moved nav items (excluding logo) 5px up by changing translateY from 10px to 5px

**Files Modified:**
- `public/styles.css` - Updated .nav-links translateY from 10px to 5px

---

### v2.1.24 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Changed nav background height from 56px to 72px

**Files Modified:**
- `public/styles.css` - Updated .nav and .nav.scrolled height to 72px

---

### v2.1.23 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Added logoAnimationStarted flag to prevent animation from triggering multiple times
- ✅ Comprehensive duplicate detection and removal on initialization and during animation
- ✅ Safety checks before moving logo to body (verify it's not already there)
- ✅ Prevent duplicate black image creation during animation
- ✅ Added console warnings for debugging duplicate issues

**Files Modified:**
- `public/script.js` - Added animation flag, duplicate detection, safety checks, and prevention of duplicate black images

---

### v2.1.22 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Added logoMovedToBody flag to prevent logo duplication
- ✅ Flag is set BEFORE moving logo to prevent race conditions
- ✅ Flag is reset when scrolling back to top
- ✅ All three locations where logo is moved now check the flag

**Files Modified:**
- `public/script.js` - Added logoMovedToBody flag and checks in all logo movement locations

---

### v2.1.21 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed logo duplication bug - logo was being moved to body multiple times
- ✅ Added check to prevent moving logo if placeholder already exists
- ✅ Added proper parentNode checks to prevent duplicate logo instances

**Files Modified:**
- `public/script.js` - Added guards to prevent logo from being moved multiple times

---

### v2.1.20 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Delayed logo animation (fade + shrink) until phrase goes off screen
- ✅ White logo now stays at same size until phrase is completely off screen
- ✅ Logo animation and nav elements loading now start simultaneously after phrase is off screen
- ✅ Added nav background fade-in (#FFF3E9) after all nav elements are loaded

**Files Modified:**
- `public/script.js` - Added phrase off-screen detection, delayed logo animation, added nav background fade-in

---

### v2.1.19 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Moved nav items 10px down to better align with logo center

**Files Modified:**
- `public/styles.css` - Added translateY(10px) to .nav-links

---

### v2.1.18 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Adjusted nav alignment - nav elements should now be better centered with logo
- ✅ Added explicit height to nav-links to ensure proper vertical centering
- ✅ Added justify-content: flex-end to nav for proper right alignment

**Files Modified:**
- `public/styles.css` - Added height to .nav-links and justify-content to .nav

---

### v2.1.17 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Nav elements now center-aligned vertically with logo
- ✅ Nav height set to 56px to match logo height
- ✅ Removed nav padding, using flexbox center alignment instead

**Files Modified:**
- `public/styles.css` - Updated .nav height to 56px and align-items: center for vertical centering

---

### v2.1.16 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Changed video fade behavior: video now stays at full opacity, overlay fades in instead
- ✅ Overlay matches page background color (#FFF3E9) and increases from 0-100% opacity
- ✅ Video appears to fade into beige background rather than black
- ✅ Removed black background from video-header container

**Files Modified:**
- `public/script.js` - Replaced video opacity fade with overlay opacity fade (0-100%)
- `public/styles.css` - Removed black background from .video-header

---

### v2.1.15 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed white borders appearing on top and left of video when opacity decreases
- ✅ Added black background to video-header container to prevent beige background showing through
- ✅ Ensured video player has no margins, padding, or borders

**Files Modified:**
- `public/styles.css` - Added black background to .video-header and removed any potential gaps on .video-header-player

---

### v2.1.14 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Added video fade-out animation: video opacity decreases from 1 to 0 as it scrolls off screen
- ✅ Fade starts when 70% of video height has scrolled off screen
- ✅ Video fades to opacity 0 by the time it's fully off screen

**Files Modified:**
- `public/script.js` - Added video opacity fade logic in checkScroll function

---

### v2.1.13 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Changed shrink animation easing from ease-out to ease-in-out for smoother acceleration and deceleration

**Files Modified:**
- `public/script.js` - Updated shrink animation easing to ease-in-out for height, width, and transform transitions

---

### v2.1.12 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Reduced logo shrink animation duration from 0.6s to 0.3s for faster transition
- ✅ Fade remains at 0.6s while shrink is now 0.3s

**Files Modified:**
- `public/script.js` - Changed shrink animation duration to 0.3s (height, width, transform transitions)

---

### v2.1.11 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Logo fade (white to black) and shrink now happen simultaneously
- ✅ Both animations run in parallel for smoother, faster transition
- ✅ Nav elements continue loading while logo animates

**Files Modified:**
- `public/script.js` - Combined fade and shrink animations to run simultaneously with same duration (0.6s)

---

### v2.1.10 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Logo now starts shrinking immediately after black version appears (removed 100ms delay)
- ✅ Smoother transition from fade to shrink with no gap

**Files Modified:**
- `public/script.js` - Removed setTimeout delay before shrink animation, shrink now starts immediately after fade completes

---

### v2.1.9 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Nav elements now start appearing when logo animation begins (not after it completes)
- ✅ Nav animation runs in parallel with logo fade and shrink animations for smoother experience

**Files Modified:**
- `public/script.js` - Moved nav appearance trigger to start of logo animation sequence

---

### v2.1.8 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Nav elements now appear only after logo shrink animation completes (not just fade)
- ✅ Added smooth transition (0.4s) for logo shrink animation
- ✅ Improved timing: nav appears 450ms after shrink starts (allowing shrink to complete)

**Files Modified:**
- `public/script.js` - Added transition for shrink animation and delayed nav appearance until shrink completes

---

### v2.1.7 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Added smooth fade in/out animation when swapping white to black logo
- ✅ Improved transition timing and z-index layering to prevent white logo showing behind black
- ✅ White logo now properly fades out completely before being removed

**Files Modified:**
- `public/script.js` - Enhanced fade transition with proper opacity transitions, z-index layering, and timing

---

### v2.1.6 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Moved logo 5px up on header to better align baseline with phrase

**Files Modified:**
- `public/styles.css` - Added translateY(-5px) to .video-header-logo transform

---

### v2.1.5 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed logo and phrase misalignment when scrolling back to header from other sections
- ✅ Improved reset logic to properly clear all inline styles when logo returns to original position
- ✅ Ensured transform-origin and all positioning styles are reset to allow CSS to take over

**Files Modified:**
- `public/script.js` - Enhanced reset logic to clear all inline styles (transform-origin, z-index, display, etc.) when scrolling back to top

---

### v2.1.4 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed vertical alignment between logo and phrase on video header
- ✅ Removed translateY(-7px) from logo to properly center-align with phrase

**Files Modified:**
- `public/styles.css` - Removed translateY(-7px) from .video-header-logo to fix center alignment

---

### v2.1.3 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed white logo going off screen - now stops when top edge reaches 0px from viewport top
- ✅ Changed transform origin from "left center" to "top left" for shrink animation
- ✅ Logo now properly stops at top before switching to black version
- ✅ Black logo shrinks from top-left corner instead of left-center

**Files Modified:**
- `public/script.js` - Improved logo stop detection using getBoundingClientRect, changed transform-origin to top left
- `public/styles.css` - Updated transform-origin to top left for animating and at-top states

---

### v2.1.2 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Changed top padding for fixed logo from 20px to 10px, then to 0px
- ✅ White logo now stops at top (0px) before black version appears - no longer scrolls off screen

**Files Modified:**
- `public/script.js` - Updated topPadding constant from 20 to 10 to 0, white logo stops at top position
- `public/styles.css` - Updated CSS top values from 20px to 10px to 0px

---

### v2.1.1 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ **ROOT CAUSE FIXED:** Logo now properly stays fixed at top - moved logo outside transformed parent container
- ✅ When logo becomes fixed, it's moved from `.video-header-content-wrapper` to `body` level
- ✅ This fixes the issue where `position: fixed` was relative to transformed parent instead of viewport
- ✅ Logo is moved back to original position when scrolling to top

**Root Cause:**
The `.video-header-content-wrapper` has `transform: translateY(-50%)`. In CSS, when a parent has a transform property, it creates a new containing block. This means `position: fixed` on a child element becomes relative to that transformed parent, NOT the viewport. So the logo was scrolling with the video header instead of staying fixed.

**Solution:**
When the logo becomes fixed, we now move it from the transformed wrapper to the `body` element (outside the transformed parent). This allows `position: fixed` to work correctly relative to the viewport. When scrolling back to top, we move it back to its original position.

**Files Modified:**
- `public/script.js` - Move logo to body when fixed, move back to wrapper when reset

---

### v2.1.0 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed black logo scrolling off screen - now maintains fixed position continuously during scroll
- ✅ Added code to ensure logo container stays fixed at top (20px from top, 15px from left) after animation
- ✅ Logo now properly stays at top even as user continues scrolling past video header

**Root Cause:**
The logo container's fixed positioning wasn't being continuously maintained during scroll. Once the logo reached the top and the black logo appeared, the fixed positioning needed to be re-enforced on every scroll event to prevent it from scrolling with the video header.

**Files Modified:**
- `public/script.js` - Added continuous fixed positioning enforcement in scroll handler

---

### v2.0.9 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed phrase jumping to left - prevented `initVideoHeaderLayout` from running when logo is fixed
- ✅ Added placeholder element to maintain flexbox spacing when logo becomes fixed
- ✅ Removed "stacked" class when logo animation starts to prevent text repositioning
- ✅ Phrase now scrolls naturally with video header instead of jumping left

**Root Cause:**
When the logo became `position: fixed`, it was removed from document flow, causing the flexbox wrapper to recalculate. The `initVideoHeaderLayout` function detected this as overlap and added the "stacked" class, which moved the text to the left with padding.

**Files Modified:**
- `public/script.js` - Added check to prevent layout recalculation when logo is fixed, added placeholder element

---

### v2.0.8 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed phrase jumping to left - removed position fixing code, phrase now scrolls naturally with video header
- ✅ Hero section text ("We Build...") no longer affected by logo animation - stays in place

**Files Modified:**
- `public/script.js` - Removed phrase position fixing code that was causing jump to left

---

### v2.0.7 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed phrase position - phrase no longer moves to left when logo hits top, stays in original position
- ✅ Right-aligned nav elements - nav links and CTA button now align to right edge of browser with 25px padding
- ✅ Updated nav-container to use full width and flex-end justification

**Files Modified:**
- `public/styles.css` - Updated nav-container and nav-links for right alignment
- `public/script.js` - Added logic to keep phrase in original position when logo reaches top

---

### v2.0.6 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Removed scroll snapping behavior for easier debugging
- ✅ Removed `scroll-snap-type` from html
- ✅ Removed `scroll-snap-align` and `scroll-snap-stop` from all sections

**Files Modified:**
- `public/styles.css` - Removed all scroll-snap properties

---

### v2.0.5 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Enhanced logo visibility enforcement - now also sets visibility on the img element itself
- ✅ Added explicit width/height auto to logo image
- ✅ Added z-index to logo image to ensure it's above other elements
- ✅ JavaScript now explicitly sets visibility on both logo container and img element

**Files Modified:**
- `public/styles.css` - Added z-index and explicit width/height to logo image
- `public/script.js` - Enhanced visibility enforcement to include img element

---

### v2.0.4 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed JavaScript syntax error (missing closing braces and incorrect indentation)
- ✅ Fixed brace structure in logo animation code
- ✅ Corrected indentation for code inside `if (initialLogoTop !== null)` block

**Files Modified:**
- `public/script.js` - Fixed syntax errors, corrected indentation and brace structure

---

### v2.0.3 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed logo completely disappearing - added explicit `display: block !important` to base logo CSS
- ✅ Added logo visibility enforcement on page load
- ✅ Fixed JavaScript setting display to empty string (changed to 'block')
- ✅ Ensured logo is always visible regardless of scroll state

**Files Modified:**
- `public/styles.css` - Added `display: block !important` to `.video-header-logo` and `.video-header-logo img`
- `public/script.js` - Added explicit visibility enforcement on load, changed display from '' to 'block'

---

### v2.0.2 - 2025-01-25
**Status: Previous**

**Fixes:**
- ✅ Fixed logo visibility issue in hero section - logo now visible when at top (fixed position)
- ✅ Removed black background from nav (now fully transparent with !important flags)
- ✅ Ensured logo stays visible throughout scroll animation with proper z-index and visibility
- ✅ Added explicit visibility/opacity/display properties to logo when at top
- ✅ Added transparent background to all nav states (hidden-on-video, scrolled, etc.)
- ✅ Improved scroll detection - handles page load when already scrolled past video header
- ✅ Added explicit visibility properties to logo image element
- ✅ Enhanced initial logo position detection with fallback estimation

**Files Modified:**
- `public/styles.css` - Removed nav background (with !important), ensured logo visibility with z-index, added explicit img visibility
- `public/script.js` - Added explicit visibility properties, improved scroll detection, added load event handlers

---

### v2.0.1 - 2025-01-25
**Status: Previous**

**Logo animation and nav updates:**
- ✅ Removed logo from nav (using header logo as single element)
- ✅ Logo scrolls up naturally, stops at top (20px padding)
- ✅ White logo fades out, black logo fades in (same size)
- ✅ Black logo smoothly shrinks to 56px height after fade
- ✅ Nav elements appear staggered left-to-right when logo hits top
- ✅ Nav has transparent background (no background)
- ✅ Nav font color set to #000000

**Files Modified:**
- `public/index.html` - Removed nav logo
- `public/styles.css` - Updated nav styling (transparent bg, black text, staggered animations), logo animation styles
- `public/script.js` - Implemented logo scroll animation with fade and shrink

---

### v2.0.0 - 2025-01-25
**Status: Previous**

**Restored all features after revert:**
- ✅ Video header section with video background, white logo, and "AI for All of Us." text
- ✅ Updated hero section with "We Build" / rotating words / "for All of Us." structure
- ✅ "Our Purpose" label (replaced "NYC & NY State Backed Initiative")
- ✅ Updated description text
- ✅ Nav with black logo SVG (56px height, 15px padding)
- ✅ Background color #FFF3E9 throughout
- ✅ Label styling with consistent naming (`label-{type}`) and Proxima Nova Semi Bold
- ✅ Rotating words animation with building letter effect
- ✅ Video header layout with responsive stacking
- ✅ Salary journey section moved below "Real Stories of Transformation"
- ✅ Active nav highlighting
- ✅ Nav hide/show functionality (hidden on video header, appears when scrolled past)

**Files Modified:**
- `public/index.html` - Added video header, updated hero structure
- `public/styles.css` - All styling updates, video header, hero, nav, labels
- `public/script.js` - Rotating words, video header layout, nav functionality

---

## How to Use This Log

1. **Before making changes**: Note the current version number (currently v2.0.0)
2. **After making changes**: 
   - I will update this file with the new version number
   - Describe what changed
   - List files that were modified
3. **To rollback**: 
   - Find the version you want in this log
   - Ask me to restore that version
   - I can use git or manually revert based on the log

---

## Quick Reference

**Current Version:** v390  
**Last Updated:** 2026-01-29  
**Next Version:** v391 (for next change)

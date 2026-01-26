# Version Control Log

This file tracks all changes made to the AIJI website with version numbers for easy rollback.

## Version Numbering System

- **Major** (v3.0.0): Breaking changes, major redesigns
- **Minor** (v2.1.0): New features, significant additions  
- **Patch** (v2.0.1): Bug fixes, small adjustments, styling tweaks

---

## Version History

### v103 - 2026-01-26
**Status: ✅ Current**

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

**Current Version:** v2.1.40  
**Last Updated:** 2025-01-25  
**Next Version:** v2.1.41 (for next patch change)

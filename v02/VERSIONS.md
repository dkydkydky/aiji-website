# Version Control Log

This file tracks all changes made to the AIJI website with version numbers for easy rollback.

## Version Numbering System

- **Major** (v3.0.0): Breaking changes, major redesigns
- **Minor** (v2.1.0): New features, significant additions  
- **Patch** (v2.0.1): Bug fixes, small adjustments, styling tweaks

---

## Version History

### v2.1.55 - 2025-01-25
**Status: ✅ Current**

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

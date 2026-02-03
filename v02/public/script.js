/**
 * AI Jobs Institute - Website JavaScript
 * 
 * Architecture:
 * 1. Section-based scroll snapping between major sections
 * 2. Lazy scroll reveal for content within sections
 * 3. Section fade transitions
 * 4. Logo animation with proper reset
 */

document.addEventListener('DOMContentLoaded', () => {
  // Force scroll to top on page load to ensure clean state
  window.scrollTo(0, 0);
  
  // DEBUG: Scroll-stuck detector - logs when wheel events fire but scroll doesn't move
  let lastWheelTime = 0;
  let lastScrollTop = -1;
  let stuckCount = 0;
  let stuckLogged = false;
  document.addEventListener('wheel', (e) => {
    const wwdSection = document.querySelector('.wwd');
    const currentScroll = wwdSection ? wwdSection.scrollTop : window.scrollY;
    const now = Date.now();
    if (now - lastWheelTime < 100 && currentScroll === lastScrollTop && Math.abs(e.deltaY) > 5) {
      stuckCount++;
      if (stuckCount > 5 && !stuckLogged) {
        // Only log once per stuck episode to reduce spam
        const missionText = document.querySelector('.wwd-mission-text-fixed');
        console.error('🔴 SCROLL STUCK!', {
          scrollTop: currentScroll,
          maxScroll: wwdSection ? wwdSection.scrollHeight - wwdSection.clientHeight : 'n/a',
          videoComplete: document.body.classList.contains('video-complete'),
          missionPointerEvents: missionText ? getComputedStyle(missionText).pointerEvents : 'n/a',
          eventTarget: e.target?.className || e.target?.tagName
        });
        stuckLogged = true;
      }
    } else {
      stuckCount = 0;
      stuckLogged = false;
    }
    lastWheelTime = now;
    lastScrollTop = currentScroll;
  }, { passive: true });
  console.log('🔍 Scroll-stuck detector active (CSS pointer-events fix applied)');
  
  // AGGRESSIVE CLEANUP: Remove any stray logo elements and black images
  document.querySelectorAll('body > .video-header-logo').forEach(el => el.remove());
  document.querySelectorAll('.video-header-logo-placeholder').forEach(el => el.remove());
  
  // Remove ALL black logo images anywhere on the page
  document.querySelectorAll('img[src*="Black"]').forEach(img => {
    if (img.closest('.video-header-logo')) {
      img.remove();
    }
  });
  
  // Ensure the wrapper logo has only white image and reset styles
  const wrapperLogo = document.querySelector('.video-header-content-wrapper .video-header-logo');
  if (wrapperLogo) {
    wrapperLogo.style.cssText = '';
    wrapperLogo.classList.remove('animating', 'at-top');
    const whiteImg = wrapperLogo.querySelector('img[src*="White"]');
    if (whiteImg) {
      whiteImg.style.cssText = '';
      whiteImg.style.display = 'block';
      whiteImg.style.opacity = '1';
    }
  }
  
  initSectionSnapping();
  initSectionTransitions();
  initRotatingWords();
  initLazyScrollReveal();
  initLogoAnimation();
  initVideoHeaderLayout();
  initScrollEffects();
  initFormHandling();
  initAnimations();
  initActiveNavTracking();
  initBuilderMoreButton();
  initBuilderVideoOverlay();
  initLogoClick();
  initResponsiveResize();
  
  // Mission page Microsoft-style animations
  initMissionPageAnimations();
  initMissionParallax();
  
  // Enable continuous scroll for WWD
  initWwdContinuousScroll();
  
  // Advanced page transitions
  initAdvancedPageTransitions();
  
  // Position initiative arrows for The How page
  if (typeof positionInitiativeArrows === 'function') {
    positionInitiativeArrows();
    window.addEventListener('resize', positionInitiativeArrows);
  }
  
  // Initialize pillar state (01 active by default)
  initPillarState();
  
  // Initialize stagger animations for multi-element pages
  initStaggerAnimations();
});

/**
 * Initialize pillar state for The How page
 * Sets pillar 01 as active on load
 */
function initPillarState() {
  // Target elements in the fixed container
  const fixedContainer = document.querySelector('.wwd-how-content-fixed');
  const initiativeItems = fixedContainer ? fixedContainer.querySelectorAll('.wwd-initiative-item') : document.querySelectorAll('.wwd-initiative-item');
  
  if (!initiativeItems.length) return;
  
  // Set first pillar as active
  updatePillarState(1);
  
  // Position arrows initially and on resize
  positionInitiativeArrows();
  window.addEventListener('resize', positionInitiativeArrows);
  
  // Add click handlers
  initiativeItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      updatePillarState(index + 1);
    });
  });
  
  console.log('Pillar state initialized');
}

/**
 * Update which pillar is active
 */
function updatePillarState(pillarNum) {
  // Target elements in the fixed container
  const fixedContainer = document.querySelector('.wwd-how-content-fixed');
  const initiativeItems = fixedContainer ? fixedContainer.querySelectorAll('.wwd-initiative-item') : document.querySelectorAll('.wwd-initiative-item');
  const initiativeDescs = fixedContainer ? fixedContainer.querySelectorAll('.wwd-initiative-desc') : document.querySelectorAll('.wwd-initiative-desc');
  const arrowLines = fixedContainer ? fixedContainer.querySelectorAll('.initiative-arrow-line') : document.querySelectorAll('.initiative-arrow-line');
  const arrowHeads = fixedContainer ? fixedContainer.querySelectorAll('.initiative-arrowhead') : document.querySelectorAll('.initiative-arrowhead');
  
  // Update items
  initiativeItems.forEach((item, index) => {
    if (index + 1 === pillarNum) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update descriptions
  initiativeDescs.forEach((desc, index) => {
    const descPillar = parseInt(desc.getAttribute('data-initiative'));
    if (descPillar === pillarNum) {
      desc.classList.add('active');
    } else {
      desc.classList.remove('active');
    }
  });
  
  // Update arrows
  arrowLines.forEach(arrow => {
    const arrowPillar = parseInt(arrow.getAttribute('data-arrow'));
    if (arrowPillar === pillarNum) {
      arrow.classList.add('active');
    } else {
      arrow.classList.remove('active');
    }
  });
  
  arrowHeads.forEach(arrow => {
    const arrowPillar = parseInt(arrow.getAttribute('data-arrow'));
    if (arrowPillar === pillarNum) {
      arrow.classList.add('active');
    } else {
      arrow.classList.remove('active');
    }
  });
  
  // Reposition arrows for active pillar
  positionInitiativeArrows();
}

/**
 * Position initiative arrows - connects last letter of category name to first letter of description
 * Arrow endpoints form a pathway between category and description
 */
function positionInitiativeArrows() {
  // Look in the fixed container first, then fall back to the old location
  let contentWrapper = document.querySelector('.wwd-how-content-fixed .wwd-initiatives-content-wrapper');
  if (!contentWrapper) {
    contentWrapper = document.querySelector('.wwd-initiatives-content-wrapper');
  }
  const initiativeItems = document.querySelectorAll('.wwd-how-content-fixed .wwd-initiative-item');
  const initiativeDescs = document.querySelectorAll('.wwd-how-content-fixed .wwd-initiative-desc');
  
  if (!contentWrapper || !initiativeItems.length || !initiativeDescs.length) return;
  
  // Target arrows in the fixed container
  const fixedContainer = document.querySelector('.wwd-how-content-fixed');
  const arrowLines = fixedContainer ? fixedContainer.querySelectorAll('.initiative-arrow-line') : document.querySelectorAll('.initiative-arrow-line');
  const arrowHeads = fixedContainer ? fixedContainer.querySelectorAll('.initiative-arrowhead') : document.querySelectorAll('.initiative-arrowhead');
  
  // Get the first description for the END position reference
  const firstDesc = initiativeDescs[0];
  if (!firstDesc) return;
  
  const wrapperRect = contentWrapper.getBoundingClientRect();
  
  // Get the Y position of the first character of the first description (arrow END point)
  const range = document.createRange();
  const firstDescTextNode = firstDesc.firstChild;
  if (!firstDescTextNode || firstDescTextNode.nodeType !== Node.TEXT_NODE) {
    return;
  }
  
  range.setStart(firstDescTextNode, 0);
  range.setEnd(firstDescTextNode, 1);
  const firstDescCharRect = range.getBoundingClientRect();
  
  // All arrows END at the same point (first letter of description)
  const endX = firstDescCharRect.left - wrapperRect.left - 10; // 10px before first letter
  const endY = firstDescCharRect.top - wrapperRect.top + (firstDescCharRect.height / 2); // Center of character
  
  arrowLines.forEach((arrowLine) => {
    const arrowNum = parseInt(arrowLine.getAttribute('data-arrow'));
    const categoryItem = initiativeItems[arrowNum - 1];
    // Find arrowhead in the same container
    const arrowHead = fixedContainer 
      ? fixedContainer.querySelector(`.initiative-arrowhead[data-arrow="${arrowNum}"]`)
      : document.querySelector(`.initiative-arrowhead[data-arrow="${arrowNum}"]`);
    
    if (!categoryItem) return;
    
    const categoryName = categoryItem.querySelector('.wwd-initiative-name');
    if (!categoryName) return;
    
    // Use Range API to get the actual end position of the first line of text
    const textNode = categoryName.firstChild;
    
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
    
    // Find where the first line ends by checking character positions
    const text = textNode.textContent;
    
    // Get the Y position of the first character to establish the baseline
    range.setStart(textNode, 0);
    range.setEnd(textNode, 1);
    const firstCharRect = range.getBoundingClientRect();
    const baselineY = firstCharRect.top;
    
    // Find the last character on the first line (same Y as first character)
    let lastCharOnFirstLine = 0;
    for (let i = 0; i < text.length; i++) {
      range.setStart(textNode, i);
      range.setEnd(textNode, i + 1);
      const charRect = range.getBoundingClientRect();
      
      // If this character is significantly below the baseline, we've wrapped
      if (charRect.top > baselineY + 5) {
        break;
      }
      lastCharOnFirstLine = i;
    }
    
    // Get the position of the last character on the first line
    range.setStart(textNode, lastCharOnFirstLine);
    range.setEnd(textNode, lastCharOnFirstLine + 1);
    const lastCharRect = range.getBoundingClientRect();
    
    // Arrow START point: right edge of last character + small gap
    const startX = lastCharRect.right - wrapperRect.left + 8;
    const startY = lastCharRect.top - wrapperRect.top + (lastCharRect.height / 2);
    
    // Calculate the angle of the line (for arrowhead rotation)
    const dx = endX - startX;
    const dy = endY - startY;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = angleRad * (180 / Math.PI);
    
    // Position and size the arrow line SVG
    const padding = 20;
    const minX = Math.min(startX, endX) - padding;
    const maxX = Math.max(startX, endX) + padding;
    const minY = Math.min(startY, endY) - padding;
    const maxY = Math.max(startY, endY) + padding;
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    arrowLine.style.left = `${minX}px`;
    arrowLine.style.top = `${minY}px`;
    arrowLine.style.width = `${width}px`;
    arrowLine.style.height = `${height}px`;
    
    // Update the path within the SVG
    const path = arrowLine.querySelector('path');
    if (path) {
      const localStartX = startX - minX;
      const localStartY = startY - minY;
      
      // End the line at the arrowhead BASE (14px before the tip)
      // This prevents the line from overlapping the arrowhead
      const cosAngle = Math.cos(angleRad);
      const sinAngle = Math.sin(angleRad);
      const arrowBaseOffset = 14; // Distance from tip to base
      const lineEndX = endX - (arrowBaseOffset * cosAngle);
      const lineEndY = endY - (arrowBaseOffset * sinAngle);
      
      const localEndX = lineEndX - minX;
      const localEndY = lineEndY - minY;
      
      // Control points for smooth curve
      const midX = (localStartX + localEndX) / 2;
      const curveStrength = 20;
      
      // Create a smooth S-curve path
      const newPath = `M ${localStartX},${localStartY} C ${localStartX + 30},${localStartY} ${midX},${localStartY + curveStrength} ${midX},${(localStartY + localEndY) / 2} S ${localEndX - 30},${localEndY} ${localEndX},${localEndY}`;
      path.setAttribute('d', newPath);
    }
    
    // Update viewBox to match dimensions
    arrowLine.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Position the ARROWHEAD at the END point
    // The arrowhead SVG (32x32) has tip at (30,16), center at (16,16)
    // We want the TIP to be at the line endpoint, with arms evenly on each side
    if (arrowHead) {
      // Distance from SVG center to tip = 14px (30-16)
      const tipOffset = 14;
      
      // Calculate SVG center position so that after rotation, tip lands at (endX, endY)
      // After rotation around center (16,16), the tip (originally at 30,16) moves to:
      // center + (tipOffset * cos(angle), tipOffset * sin(angle))
      // So: center = endpoint - (tipOffset * cos(angle), tipOffset * sin(angle))
      const cosAngle = Math.cos(angleRad);
      const sinAngle = Math.sin(angleRad);
      
      const svgCenterX = endX - (tipOffset * cosAngle);
      const svgCenterY = endY - (tipOffset * sinAngle);
      
      // Position SVG so its center (16,16) is at (svgCenterX, svgCenterY)
      arrowHead.style.left = `${svgCenterX - 16}px`;
      arrowHead.style.top = `${svgCenterY - 16}px`;
      arrowHead.style.transformOrigin = 'center center';
      // Rotate to match line angle - arms will be evenly on each side of the line
      arrowHead.style.transform = `rotate(${angleDeg}deg)`;
    }
  });
}

/**
 * Section Snapping - Programmatic snap to sections on scroll
 */
// Global flag for snap-back state
let isSnappingBack = false;

function initSectionSnapping() {
  const videoHeader = document.querySelector('.video-header');
  const wwdSection = document.querySelector('.wwd');
  const videoPlayer = videoHeader ? videoHeader.querySelector('.video-header-player') : null;
  const contentWrapper = videoHeader ? videoHeader.querySelector('.video-header-content-wrapper') : null;
  
  if (!videoHeader || !wwdSection || !videoPlayer || !contentWrapper) return;
  
  const videoHeaderHeight = videoHeader.offsetHeight;
  let isAnimating = false;
  let hasDetectedSwipe = false;
  let swipeDirection = 0;
  
  function animateLogoToTop() {
    if (isAnimating) return;
    isAnimating = true;
    console.log('🚀 Animation started - isAnimating=true (scroll blocked for ~900ms)');
    
    const nav = document.querySelector('.nav');
    const videoHeaderLogo = videoHeader.querySelector('.video-header-logo');
    
    // Phase 1: Subtle logo/phrase movement (very slight)
    const duration = 300; // Quick subtle movement
    const startTime = performance.now();
    const targetTranslate = -30; // Only move 30px up (subtle)
    
    function animatePhase1(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out for smooth deceleration)
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      
      const translateY = targetTranslate * easeProgress;
      
      if (contentWrapper) {
        contentWrapper.style.transform = `translateY(calc(-50% + ${translateY}px))`;
        contentWrapper.style.transition = 'none';
        // Ensure horizontal positioning stays intact during animation
        contentWrapper.style.left = '15px';
        contentWrapper.style.right = '25px';
      }
      
      if (progress < 1) {
        requestAnimationFrame(animatePhase1);
      } else {
        // Phase 1 complete, start fade out
        startFadeOut();
      }
    }
    
    function startFadeOut() {
      // Phase 2: Fade out everything
      const fadeStartTime = performance.now();
      const fadeDuration = 600; // 600ms fade
      
      function animateFade(currentTime) {
        const elapsed = currentTime - fadeStartTime;
        const progress = Math.min(elapsed / fadeDuration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // Fade out video header content (logo and phrase)
        if (contentWrapper) {
          contentWrapper.style.opacity = 1 - easeProgress;
        }
        
        // Fade out video player
        if (videoPlayer) {
          videoPlayer.style.opacity = 1 - easeProgress;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateFade);
        } else {
          // Fade complete, now transition to mission page
          completeVideoTransition();
        }
      }
      
      requestAnimationFrame(animateFade);
    }
    
    function completeVideoTransition() {
      const nav = document.querySelector('.nav');
      const videoHeaderLogo = videoHeader.querySelector('.video-header-logo');
      const wwdSection = document.querySelector('.wwd');
      
      // FIX: Reset all fixed container styles BEFORE showing them (synchronous)
      // This prevents stale opacity values from causing visual flash
      const howContent = document.querySelector('.wwd-how-content-fixed');
      const visionContent = document.querySelector('.wwd-vision-content-fixed');
      const missionText = document.querySelector('.wwd-mission-text-fixed');
      
      console.log('🔄 Resetting fixed container styles BEFORE video-complete');
      [howContent, visionContent].forEach(el => {
        if (el) {
          el.style.cssText = 'opacity: 0; pointer-events: none; transition: none;';
        }
      });
      if (missionText) {
        missionText.style.cssText = 'opacity: 1; pointer-events: none; transition: none;';
      }
      
      // Reset WWD scroll position BEFORE it becomes visible
      if (wwdSection) {
        wwdSection.scrollTop = 0;
      }
      
      // NOW add video-complete class to show section pages and nav
      document.body.classList.add('video-complete');
      console.log('✅ video-complete class added');
      
      // Setup nav with logo - clear inline styles and set visibility
      if (nav) {
        nav.classList.add('logo-at-top');
        nav.classList.remove('hidden-on-video');
        nav.style.opacity = '1';
        nav.style.visibility = 'visible';
        nav.style.pointerEvents = 'auto';
        
        // Set "What We Do" as the active nav link
        const navLinks = nav.querySelectorAll('.nav-links a');
        const wwdLink = nav.querySelector('a[href="#what-we-do"]');
        if (wwdLink && navLinks) {
          navLinks.forEach(link => link.classList.remove('active'));
          wwdLink.classList.add('active');
        }
      }
      
      // Move logo OUT of video-header to body so it stays visible when video-header is hidden
      if (videoHeaderLogo) {
        // Change logo from white to black version
        const logoImg = videoHeaderLogo.querySelector('img');
        if (logoImg && logoImg.src.includes('White')) {
          logoImg.src = logoImg.src.replace('White', 'Black');
        }
        
        videoHeaderLogo.classList.remove('animating');
        videoHeaderLogo.classList.add('at-top');
        // Move to body to escape hidden parent
        document.body.appendChild(videoHeaderLogo);
      }
      
      // Reset everything
      isAnimating = false;
      console.log('🏁 Animation ended - isAnimating=false (scroll unblocked)');
      hasDetectedSwipe = false;
      if (contentWrapper) {
        contentWrapper.style.transform = '';
        contentWrapper.style.transition = '';
      }
      
      // Re-enable transitions after a frame (styles were reset synchronously above)
      requestAnimationFrame(() => {
        [howContent, visionContent, missionText].forEach(el => {
          if (el) el.style.transition = '';
        });
        // If What We Do is the active section (e.g. after logo click then swipe down), init its content
        const activeSection = document.querySelector('.section-page.active');
        
        if (activeSection && activeSection.id === 'what-we-do') {
          // Reset ALL WWD step inline styles (they may have stale opacity from previous visit)
          document.querySelectorAll('.wwd-step').forEach((step, index) => {
            // Step 1 should be visible, others hidden (scroll logic will show them)
            if (index === 0) {
              step.style.opacity = '1';
              step.style.transform = 'translateY(0)';
            } else {
              step.style.opacity = '';
              step.style.transform = '';
            }
          });
          
          resetWwdSection();
          
          // Set mission text visible explicitly AFTER reset (so it's not cleared by resetWwdSection)
          const missionTextEl = document.querySelector('.wwd-mission-text-fixed');
          if (missionTextEl) {
            missionTextEl.style.opacity = '1';
            missionTextEl.style.transform = 'translateY(-50%)';
            missionTextEl.style.pointerEvents = 'auto';
            missionTextEl.classList.add('visible');
          }
          
          // Use 50ms delay (same as nav-click path) so layout is stable before scroll handlers run
          setTimeout(() => {
            updatePageTitleFade();
            updatePageTransitions();
          }, 50);
        } else {
          // For other sections, trigger scroll handlers immediately
          window.dispatchEvent(new Event('scroll'));
          if (wwdSection) {
            wwdSection.dispatchEvent(new Event('scroll'));
          }
          console.log('✅ Transitions re-enabled, scroll handlers triggered');
        }
      });
    }
    
    requestAnimationFrame(animatePhase1);
  }
  
  function animateLogoBack() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Immediately reset to original position with smooth transition
    if (contentWrapper) {
      contentWrapper.style.transition = 'transform 300ms ease-out';
      contentWrapper.style.transform = 'translateY(-50%)';
    }
    
    // After animation completes, clean up
    setTimeout(() => {
      isAnimating = false;
      hasDetectedSwipe = false;
      swipeDirection = 0;
      if (contentWrapper) {
        // Remove inline styles to let CSS take over
        contentWrapper.style.transform = '';
        contentWrapper.style.transition = '';
      }
    }, 300);
  }
  
  // Detect swipe direction
  let swipeStartTime = 0;
  let swipeTimeout = null;
  let snapBackTimeout = null;
  
  videoHeader.addEventListener('wheel', (e) => {
    // DEBUG: Log all wheel events on video header
    console.log('🎥 videoHeader wheel:', { videoComplete: document.body.classList.contains('video-complete'), isAnimating, hasDetectedSwipe, deltaY: e.deltaY });
    
    // FIRST CHECK: If video transition is complete, NEVER block scroll
    if (document.body.classList.contains('video-complete')) {
      console.log('✅ video-complete - allowing scroll through');
      return; // Allow natural scroll - don't call preventDefault
    }
    
    const currentScroll = window.scrollY;
    
    // Prevent scrolling past target during animation (only before video-complete)
    if (isAnimating) {
      console.warn('🚫 BLOCKING: isAnimating=true');
      e.preventDefault();
      return;
    }
    
    // Only intercept if we're at the top and not already animating
    if (currentScroll === 0 && !hasDetectedSwipe) {
      console.warn('🚫 BLOCKING: at top, starting animation');
      e.preventDefault();
      
      // Detect scroll direction on first movement
      if (e.deltaY > 0) {
        hasDetectedSwipe = true;
        // Immediately trigger animation to enter site
        animateLogoToTop();
      } else if (e.deltaY < 0) {
        hasDetectedSwipe = true;
        // Trigger back animation
        animateLogoBack();
      }
    }
  }, { passive: false });
  
  // Handle scroll events - snap behavior and flag resets
  let lastKnownScroll = 0;
  let isManualScrolling = false;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    // Prevent overshoot during animation
    if (isAnimating && currentScroll > videoHeaderHeight) {
      window.scrollTo(0, videoHeaderHeight);
      return;
    }
    
    // Snap back to header if any part of video is visible
    if (currentScroll > 0 && currentScroll < videoHeaderHeight && !isAnimating && !isManualScrolling) {
      // If ANY part of the video header is still visible, snap back to header
      isManualScrolling = true;
      isSnappingBack = true;
      
      // Hide wrapper immediately before scroll animation starts
      const wrapper = document.querySelector('.video-header-content-wrapper');
      if (wrapper) {
        wrapper.style.transition = 'none';
        wrapper.style.opacity = '0';
        wrapper.style.visibility = 'hidden';
      }
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Reset flags after animation completes
      setTimeout(() => {
        isManualScrolling = false;
        isSnappingBack = false;
      }, 600);
    }
    
    // Reset flags when at exact top position
    if (currentScroll === 0 && !isAnimating) {
      hasDetectedSwipe = false;
      swipeDirection = 0;
      if (contentWrapper) {
        contentWrapper.style.transform = '';
        contentWrapper.style.transition = '';
      }
    }
    
    lastKnownScroll = currentScroll;
  }, { passive: true });
}

/**
 * Section Transitions - Handle snap scrolling and fade effects between sections
 */
function initSectionTransitions() {
  const sections = document.querySelectorAll('.video-header, .wwd, .builder-stories, .salary-journey-section, .track-record, .press-quote, .real-people, .urgency, .signup-section, .footer');
  
  if (sections.length === 0) return;
  
  const videoHeader = document.querySelector('.video-header');
  const videoPlayer = videoHeader ? videoHeader.querySelector('.video-header-player') : null;
  const videoOverlay = videoHeader ? videoHeader.querySelector('.video-header-overlay') : null;
  const wwdSection = document.querySelector('.wwd');
  
  // Handle overlay fade on scroll
  let lastScrollPosition = 0;
  
  function handleScrollTransitions() {
    const currentScroll = window.scrollY;
    const videoHeaderHeight = videoHeader ? videoHeader.offsetHeight : 0;
    
    // Only fade overlay when we're actually scrolling through the page
    // (not when at position 0 - that's when user is swiping on video)
    if (videoHeader && videoOverlay && currentScroll > 0) {
      // Overlay fades from transparent to opaque as video scrolls off screen
      const fadeStart = videoHeaderHeight * 0.1;
      const fadeEnd = videoHeaderHeight * 0.8;
      
      if (currentScroll < fadeStart) {
        videoOverlay.style.opacity = '0';
      } else if (currentScroll > fadeEnd) {
        videoOverlay.style.opacity = '1';
      } else {
        const progress = (currentScroll - fadeStart) / (fadeEnd - fadeStart);
        videoOverlay.style.opacity = String(progress); // Fade overlay IN (0 to 1)
      }
    } else if (videoOverlay && currentScroll === 0) {
      // At top - overlay is transparent
      videoOverlay.style.opacity = '0';
    }
    
    lastScrollPosition = currentScroll;
  }
  
  // Listen for scroll with passive for performance
  window.addEventListener('scroll', handleScrollTransitions, { passive: true });
  
  // Create intersection observer for section visibility
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      
      if (entry.isIntersecting) {
        section.classList.add('section-visible');
        section.classList.remove('section-hidden');
        
        if (section.classList.contains('video-header')) {
          handleVideoHeaderVisible(section);
        }
      } else {
        section.classList.add('section-hidden');
        section.classList.remove('section-visible');
        
        if (section.classList.contains('video-header')) {
          handleVideoHeaderHidden(section);
        }
      }
    });
  }, {
    threshold: [0.1, 0.5, 0.9],
    rootMargin: '-10% 0px -10% 0px'
  });
  
  // Observe all sections
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Initial state
  if (videoHeader) {
    videoHeader.classList.add('section-visible', 'initial-load');
  }
  
  // Initial check
  handleScrollTransitions();
}

/**
 * Handle video header becoming visible
 */
function handleVideoHeaderVisible(videoHeader) {
  const video = videoHeader.querySelector('.video-header-player');
  if (video) {
    video.play().catch(e => console.log('Video play error:', e));
  }
  
  // Only make content visible if NOT in the middle of a snap-back animation
  if (!isSnappingBack) {
    const wrapper = videoHeader.querySelector('.video-header-content-wrapper');
    if (wrapper) {
      wrapper.style.opacity = '1';
      wrapper.style.visibility = 'visible';
    }
  }
}

/**
 * Handle video header becoming hidden
 */
function handleVideoHeaderHidden(videoHeader) {
  // Video continues playing in background
}

/**
 * Lazy Scroll Reveal - Content within sections appears as you scroll
 */
function initLazyScrollReveal() {
  // WWD section uses continuous scroll with scroll-based animations

  // WWD label is now hidden via CSS (replaced by page titles)
  
  // Other sections - reveal elements on scroll
  const revealElements = document.querySelectorAll(
    '.builder-stories-headline, .builder-stories-description, .builder-stories-media, ' +
    '.stat-card, .demo-card, .initiative-card, .council-card, .partner-card, .urgency-card, .investment-card, ' +
    '.quote-block, .signup-card'
  );
  
  if (revealElements.length > 0) {
    revealElements.forEach(el => {
      el.classList.add('reveal-element');
    });
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const siblings = Array.from(element.parentElement.querySelectorAll('.reveal-element'));
          const index = siblings.indexOf(element);
          
          setTimeout(() => {
            element.classList.add('revealed');
          }, index * 100);
          
          revealObserver.unobserve(element);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }
}

/**
 * Logo Animation - Microsoft-style scroll-progress-based animation
 * Smooth transitions tied to scroll position instead of discrete phases
 */
function initLogoAnimation() {
  const nav = document.querySelector('.nav');
  const videoHeader = document.querySelector('#video-header');
  const videoHeaderText = document.querySelector('.video-header-text');
  const wrapper = document.querySelector('.video-header-content-wrapper');
  
  if (!videoHeader || !wrapper || !nav) return;
  
  // CLEANUP: Remove any duplicate logos or logos in wrong places
  document.querySelectorAll('body > .video-header-logo').forEach(logo => {
    logo.remove();
  });
  document.querySelectorAll('.video-header-logo-placeholder').forEach(el => {
    el.remove();
  });
  
  // Ensure there's exactly one logo in the wrapper
  let videoHeaderLogo = wrapper.querySelector('.video-header-logo');
  if (!videoHeaderLogo) {
    videoHeaderLogo = document.createElement('div');
    videoHeaderLogo.className = 'video-header-logo';
    const img = document.createElement('img');
    img.src = 'assets/images/AIJI_Logo_Full_White.svg';
    img.alt = 'AI Jobs Institute';
    img.className = 'logo-full-svg';
    videoHeaderLogo.appendChild(img);
    wrapper.insertBefore(videoHeaderLogo, wrapper.firstChild);
  }
  
  // Remove any duplicate logos in the wrapper
  const allLogosInWrapper = wrapper.querySelectorAll('.video-header-logo');
  if (allLogosInWrapper.length > 1) {
    for (let i = 1; i < allLogosInWrapper.length; i++) {
      allLogosInWrapper[i].remove();
    }
  }
  
  // Ensure the logo has only the white image initially
  const allImgs = videoHeaderLogo.querySelectorAll('img');
  allImgs.forEach(img => {
    if (img.src.includes('Black')) {
      img.remove();
    } else if (img.src.includes('White')) {
      img.style.cssText = '';
    }
  });
  
  // Ensure white logo exists
  if (!videoHeaderLogo.querySelector('img[src*="White"]')) {
    const whiteImg = document.createElement('img');
    whiteImg.src = 'assets/images/AIJI_Logo_Full_White.svg';
    whiteImg.className = 'logo-full-svg';
    whiteImg.alt = 'AI Jobs Institute';
    videoHeaderLogo.appendChild(whiteImg);
  }
  
  // Reset logo inline styles
  videoHeaderLogo.style.cssText = '';
  videoHeaderLogo.classList.remove('animating', 'at-top');
  
  let videoHeaderHeight = videoHeader.offsetHeight || window.innerHeight;
  const topPadding = -2;
  
  // Black logo reference (created on demand)
  let blackLogo = null;
  
  // Check if video intro is already complete (e.g., page reload after transition)
  const isVideoComplete = document.body.classList.contains('video-complete');
  const activeSectionPage = document.querySelector('.section-page.active');
  
  if (isVideoComplete && activeSectionPage) {
    // Video complete and section page active - show nav
    nav.classList.remove('hidden-on-video');
    nav.classList.add('logo-at-top');
    nav.style.opacity = '1';
    nav.style.visibility = 'visible';
    document.body.classList.add('logo-at-top');
  } else {
    // Initially hide nav for video header
    nav.classList.add('hidden-on-video');
    nav.style.opacity = '0';
    nav.style.visibility = 'hidden';
    document.body.classList.remove('logo-at-top');
    nav.classList.remove('logo-at-top');
  }
  
  // Update video header height on resize
  window.addEventListener('resize', () => {
    videoHeaderHeight = videoHeader.offsetHeight;
  });
  
  // Get nav links for staggered animation
  const navLinks = document.querySelectorAll('.nav-links a');
  
  // Microsoft-style scroll-progress animation
  function handleScroll() {
    // Skip scroll handling if video intro is not complete
    if (!document.body.classList.contains('video-complete')) {
      return;
    }
    
    // Skip scroll handling if a section-page is active (they have their own scrolling)
    const activeSectionPage = document.querySelector('.section-page.active');
    if (activeSectionPage) {
      // Ensure nav stays visible when on section pages
      nav.classList.remove('hidden-on-video');
      nav.classList.add('logo-at-top'); // Add to nav for link visibility
      nav.style.opacity = '1';
      nav.style.visibility = 'visible';
      document.body.classList.add('logo-at-top');
      return;
    }
    
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / videoHeaderHeight, 1);
    
    const whiteLogo = videoHeaderLogo.querySelector('img[src*="White"]');
    if (!whiteLogo) return;
    
    // Phase 1: Logo becomes fixed at 50% scroll progress
    if (progress >= 0.5) {
      videoHeaderLogo.style.position = 'fixed';
      videoHeaderLogo.style.top = `${topPadding}px`;
      videoHeaderLogo.style.left = '15px';
      videoHeaderLogo.style.transformOrigin = 'left center';
      videoHeaderLogo.style.zIndex = '1001';
      videoHeaderLogo.style.transition = 'transform 0.8s cubic-bezier(0.43, 0.195, 0.02, 1)';
      
      // Phase 2: Logo shrinks progressively (50% → 100%)
      const shrinkProgress = (progress - 0.5) / 0.5; // 0 to 1
      const scale = 1.6 - (0.6 * shrinkProgress); // 1.6 → 1.0
      videoHeaderLogo.style.transform = `scale(${scale})`;
      
      // Phase 3: Color transition (75% → 100%)
      if (progress >= 0.75) {
        const colorProgress = (progress - 0.75) / 0.25; // 0 to 1
        
        // Create black logo if doesn't exist
        if (!blackLogo) {
          blackLogo = document.createElement('img');
          blackLogo.src = whiteLogo.src.replace('White', 'Black');
          blackLogo.className = 'logo-full-svg';
          blackLogo.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            transition: opacity 0.8s cubic-bezier(0.43, 0.195, 0.02, 1);
            pointer-events: none;
          `;
          videoHeaderLogo.appendChild(blackLogo);
        }
        
        // Crossfade logos
        whiteLogo.style.transition = 'opacity 0.8s cubic-bezier(0.43, 0.195, 0.02, 1)';
        whiteLogo.style.opacity = 1 - colorProgress;
        blackLogo.style.opacity = colorProgress;
        
        // Phase 4: Nav appearance (85% → 100%)
        if (progress >= 0.85) {
          const navProgress = (progress - 0.85) / 0.15; // 0 to 1
          
          nav.classList.remove('hidden-on-video');
          nav.style.opacity = navProgress;
          nav.style.backgroundColor = `rgba(255, 243, 233, ${0.6 * navProgress})`;
          nav.style.backdropFilter = `blur(${20 * navProgress}px) saturate(${100 + (80 * navProgress)}%)`;
          nav.style.webkitBackdropFilter = `blur(${20 * navProgress}px) saturate(${100 + (80 * navProgress)}%)`;
          nav.style.transition = 'opacity 0.5s cubic-bezier(0.43, 0.195, 0.02, 1), background-color 0.5s cubic-bezier(0.43, 0.195, 0.02, 1), backdrop-filter 0.5s cubic-bezier(0.43, 0.195, 0.02, 1)';
          
          // Stagger nav links
          navLinks.forEach((link, index) => {
            const linkDelay = index * 0.05; // 50ms per link
            const linkProgress = Math.max(0, Math.min(1, (navProgress - linkDelay) / 0.3));
            link.style.opacity = linkProgress;
            link.style.transform = `translateX(${-10 * (1 - linkProgress)}px)`;
            link.style.transition = 'opacity 0.6s cubic-bezier(0.43, 0.195, 0.02, 1), transform 0.6s cubic-bezier(0.43, 0.195, 0.02, 1)';
          });
          
          if (navProgress >= 1) {
            document.body.classList.add('logo-at-top');
            nav.classList.add('logo-at-top');
          }
        } else {
          // Reset nav when scrolling back
          nav.style.opacity = '0';
          document.body.classList.remove('logo-at-top');
          nav.classList.remove('logo-at-top');
        }
      } else {
        // Reset color transition when scrolling back
        if (blackLogo) {
          blackLogo.style.opacity = '0';
        }
        whiteLogo.style.opacity = '1';
      }
    } else {
      // Reset when scrolling back to top (below 50%)
      videoHeaderLogo.style.position = 'absolute';
      videoHeaderLogo.style.transform = 'scale(1)';
      videoHeaderLogo.style.transition = 'transform 0.8s cubic-bezier(0.43, 0.195, 0.02, 1)';
      
      if (blackLogo) {
        blackLogo.style.opacity = '0';
      }
      whiteLogo.style.opacity = '1';
      
      nav.classList.add('hidden-on-video');
      nav.style.opacity = '0';
      document.body.classList.remove('logo-at-top');
      nav.classList.remove('logo-at-top');
      
      // Reset nav links
      navLinks.forEach(link => {
        link.style.opacity = '0';
        link.style.transform = 'translateX(-10px)';
      });
    }
  }
  
  // Listen for scroll with passive flag for performance
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial check
  setTimeout(() => {
    handleScroll();
  }, 100);
}

/**
 * Video header layout - stack logo and tagline when they touch
 */
function initVideoHeaderLayout() {
  const wrapper = document.querySelector('.video-header-content-wrapper');
  const logo = document.querySelector('.video-header-logo');
  const text = document.querySelector('.video-header-text');
  
  if (!wrapper || !logo || !text) return;
  
  function checkLayout() {
    if (logo.classList.contains('animating') || logo.classList.contains('at-top')) {
      return;
    }
    
    wrapper.classList.remove('stacked');
    void wrapper.offsetHeight;
    
    const logoRect = logo.getBoundingClientRect();
    const textRect = text.getBoundingClientRect();
    
    if (logoRect.right + 20 >= textRect.left) {
      wrapper.classList.add('stacked');
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          text.style.fontSize = '5.5rem';
          void text.offsetWidth;
          
          requestAnimationFrame(() => {
            const wrapperRect = wrapper.getBoundingClientRect();
            const textStyles = window.getComputedStyle(text);
            const availableWidth = wrapperRect.width - 25;
            
            const measureEl = document.createElement('span');
            measureEl.style.cssText = `
              position: absolute; visibility: hidden; white-space: nowrap;
              font-family: ${textStyles.fontFamily}; font-weight: ${textStyles.fontWeight};
              font-size: 5.5rem; letter-spacing: ${textStyles.letterSpacing};
            `;
            measureEl.textContent = text.textContent.trim();
            document.body.appendChild(measureEl);
            
            const textContentWidth = measureEl.offsetWidth;
            document.body.removeChild(measureEl);
            
            if (textContentWidth > availableWidth && availableWidth > 0) {
              const scale = availableWidth / textContentWidth;
              text.style.fontSize = `${Math.max(2, 5.5 * scale)}rem`;
            }
          });
        });
      });
    } else {
      text.style.fontSize = '';
    }
  }
  
  checkLayout();
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(checkLayout, 50);
  });
  
  const logoImg = logo.querySelector('img');
  if (logoImg) {
    logoImg.addEventListener('load', checkLayout);
    if (logoImg.complete) checkLayout();
  }
}

/**
 * Rotating words animation for WWD title
 */
let rotatingWordsInterval = null;

function initRotatingWords() {
  const rotatingWordEl = document.getElementById('rotating-word');
  if (!rotatingWordEl) return;
  
  const words = [
    'AI Jobs',
    'AI-Powered World',
    'Bright Futures',
    'Transformation',
    'Insightful Data',
    'Opportunity',
    'AI Workforce',
    'Innovation',
    'New Beginnings',
    'Community',
    'Progress'
  ];
  
  let currentIndex = 0;
  let isTransitioning = false;
  
  // Generate random coordinates for disperse animation - constrained to viewport
  function getRandomCoordinates() {
    // Use viewport dimensions to keep letters on screen
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Calculate max spread based on viewport (use smaller dimension, leave some margin)
    const maxSpreadX = Math.min(vw * 0.8, 600); // 80% of viewport width, max 600px
    const maxSpreadY = Math.min(vh * 0.6, 400); // 60% of viewport height, max 400px
    
    const x = (Math.random() - 0.5) * maxSpreadX * 2; // Spread across width
    const y = (Math.random() - 0.5) * maxSpreadY * 2; // Spread across height
    return { x, y };
  }
  
  // Shuffle array to get random order
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  // Build word with letters appearing in random order
  // Words are wrapped in nowrap spans so line breaks only happen between words
  function buildWord(phrase) {
    rotatingWordEl.innerHTML = '';
    const words = phrase.split(' ');
    const letterElements = [];
    
    words.forEach((word, wordIndex) => {
      // Create word wrapper to prevent mid-word line breaks
      const wordWrapper = document.createElement('span');
      wordWrapper.style.whiteSpace = 'nowrap';
      wordWrapper.style.display = 'inline-block';
      
      // Create letter spans within the word
      const letters = word.split('');
      letters.forEach((char) => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'rotating-word-letter';
        letterSpan.textContent = char;
        letterSpan.style.opacity = '0';
        wordWrapper.appendChild(letterSpan);
        letterElements.push(letterSpan);
      });
      
      rotatingWordEl.appendChild(wordWrapper);
      
      // Add space between words (not after last word)
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.display = 'inline-block';
        space.style.width = '0.3em';
        rotatingWordEl.appendChild(space);
      }
    });
    
    // Animate letters in random order
    const letterIndices = letterElements.map((el, idx) => idx);
    const randomOrder = shuffle(letterIndices);
    
    randomOrder.forEach((index, i) => {
      setTimeout(() => {
        const letter = letterElements[index];
        letter.style.transition = 'opacity 0.15s ease';
        letter.style.opacity = '1';
      }, i * 50); // 50ms delay between each letter
    });
  }
  
  // Disperse current word and build next word simultaneously
  function rotateWord() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Get all current letters
    const currentLetters = Array.from(rotatingWordEl.querySelectorAll('.rotating-word-letter'));
    const randomOrder = shuffle([...Array(currentLetters.length).keys()]);
    
    // Disperse current word - fade out while moving to random position
    randomOrder.forEach((index, i) => {
      setTimeout(() => {
        const letter = currentLetters[index];
        if (letter) {
          const coords = getRandomCoordinates();
          // Fade out and move to random position
          letter.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          letter.style.opacity = '0';
          letter.style.transform = `translate(${coords.x}px, ${coords.y}px)`;
        }
      }, i * 30);
    });
    
    // Start building next word after short delay (overlapping transition)
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      buildWord(words[currentIndex]);
      
      // Reset transition flag after animation completes
      setTimeout(() => {
        isTransitioning = false;
      }, 1000);
    }, 400); // Start building next word while current is still dispersing
  }
  
  // Expose functions for external control
  window.startRotatingWords = function() {
    console.log('startRotatingWords called, interval exists:', !!rotatingWordsInterval);
    if (rotatingWordsInterval) {
      console.log('Already running, returning');
      return; // Already running
    }
    
    // Ensure the element is visible and ready
    rotatingWordEl.style.opacity = '1';
    rotatingWordEl.style.visibility = 'visible';
    rotatingWordEl.style.display = 'inline-block';
    rotatingWordEl.style.transition = 'opacity 0.3s ease';
    
    // Force a reflow to ensure styles are applied
    rotatingWordEl.offsetHeight;
    
    console.log('Building initial word:', words[currentIndex]);
    // Build the word and start rotation
    buildWord(words[currentIndex]);
    
    console.log('Starting interval');
    rotatingWordsInterval = setInterval(rotateWord, 2000);
  };
  
  window.stopRotatingWords = function() {
    console.log('stopRotatingWords called');
    if (rotatingWordsInterval) {
      clearInterval(rotatingWordsInterval);
      rotatingWordsInterval = null;
      console.log('Interval cleared');
    }
  };
  
  // Initial build so text is there (but hidden until step 2 is active)
  console.log('Initial rotating words setup');
  buildWord(words[0]);
}

/**
 * Scroll-triggered effects
 */
function initScrollEffects() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Add visible styles
  const style = document.createElement('style');
  style.textContent = `
    /* Section transitions */
    .section-visible {
      opacity: 1;
      visibility: visible;
    }
    
    .section-hidden {
      opacity: 0.3;
    }
    
    .video-header.initial-load {
      opacity: 1 !important;
    }
    
    .video-header.section-visible:not(.initial-load) {
      animation: fadeIn 0.6s ease forwards;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Reveal elements - initial hidden state */
    .reveal-element {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .reveal-element.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Ensure wwd label is always visible */
    .wwd-label.revealed {
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    /* Cards and other elements animation */
    .initiative-card.visible,
    .council-card.visible,
    .partner-card.visible,
    .stat-card.visible,
    .signup-card.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Form handling with Formspree
 */
function initFormHandling() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const button = form.querySelector('button[type="submit"]');
      const originalContent = button.innerHTML;
      const formData = new FormData(form);
      
      button.innerHTML = '<span>Sending...</span>';
      button.disabled = true;
      
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          const formGroup = form.querySelector('.form-group');
          formGroup.innerHTML = `
            <div class="form-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 8px;">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p>Thanks! We'll be in touch.</p>
            </div>
          `;
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        button.innerHTML = originalContent;
        button.disabled = false;
        
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Something went wrong. Please try again.';
        errorMsg.style.color = '#ff4444';
        errorMsg.style.fontSize = '0.875rem';
        errorMsg.style.marginTop = '0.5rem';
        form.appendChild(errorMsg);
        
        setTimeout(() => errorMsg.remove(), 3000);
      }
    });
  });
}

/**
 * Additional animations
 */
function initAnimations() {
  const stats = document.querySelectorAll('.stat-number');
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => statsObserver.observe(stat));
}

/**
 * Animate number counting up
 */
function animateValue(element) {
  const text = element.textContent;
  const hasPrefix = text.match(/^[^0-9]*/)[0];
  const hasSuffix = text.match(/[^0-9]*$/)[0];
  const value = parseInt(element.dataset.value) || parseInt(text.replace(/[^0-9]/g, ''));
  
  if (isNaN(value)) return;
  
  const duration = 2000;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(value * easeOutQuart);
    
    element.textContent = hasPrefix + current.toLocaleString() + hasSuffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = text;
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Parallax effect for salary journey section
 */
document.addEventListener('mousemove', (e) => {
  const section = document.querySelector('.salary-journey-section');
  if (!section) return;
  
  const rect = section.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;
  
  if (isInView) {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    const salaryJourney = section.querySelector('.salary-journey');
    if (salaryJourney) {
      salaryJourney.style.transform = `translate(${x}px, ${y}px)`;
    }
  }
});

/**
 * Active Nav Tracking - Highlights nav items when in their section
 */
function initActiveNavTracking() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [];
  
  // Build array of sections with their corresponding nav links
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const sectionId = href.substring(1); // Remove #
    const section = document.getElementById(sectionId);
    if (section) {
      sections.push({ link, section });
    }
  });
  
  if (sections.length === 0) return;
  
  // Check which section is currently in view
  function updateActiveNav() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    let activeSection = null;
    
    sections.forEach(({ link, section }) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      // Check if scroll position is within this section
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeSection = link;
      }
      
      // Remove active class from all
      link.classList.remove('active');
    });
    
    // Add active class to current section's link
    if (activeSection) {
      activeSection.classList.add('active');
    }
  }
  
  // Listen for scroll events
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  
  // Initial check
  updateActiveNav();
}

/**
 * Builder gallery: "More" reveals 4 videos at a time; hide button when all visible
 */
function initBuilderMoreButton() {
  const btn = document.getElementById('builder-more-btn');
  const gallery = document.getElementById('builder-video-gallery');
  if (!btn || !gallery) return;

  const hiddenClass = 'builder-video-card--hidden';
  const visibleClass = 'builder-video-card--visible';
  const VISIBLE_BATCH = 4;

  function getHiddenCards() {
    return Array.from(gallery.querySelectorAll('.builder-video-card.' + hiddenClass));
  }

  btn.addEventListener('click', () => {
    const hidden = getHiddenCards();
    const toShow = hidden.slice(0, VISIBLE_BATCH);
    toShow.forEach(card => {
      card.classList.remove(hiddenClass);
      card.classList.add(visibleClass);
    });
    if (getHiddenCards().length === 0) {
      btn.classList.add('builder-more-btn--hidden');
    }
  });

  if (getHiddenCards().length === 0) {
    btn.classList.add('builder-more-btn--hidden');
  }
}

/**
 * Builder video overlay: play from thumbnail, blurred backdrop, Vimeo embed, close
 */
function initBuilderVideoOverlay() {
  const overlay = document.getElementById('builder-video-overlay');
  const iframe = document.getElementById('builder-video-iframe');
  const closeBtn = document.getElementById('builder-overlay-close');
  const gallery = document.getElementById('builder-video-gallery');

  if (!overlay || !iframe || !closeBtn || !gallery) return;

  let vimeoPlayer = null;
  let lastFocusedElement = null;
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function getVideoIdFromCard(card) {
    const id = card.getAttribute('data-video-id');
    if (id) return id;
    const href = card.getAttribute('href') || '';
    const m = href.match(/vimeo\.com\/(\d+)/);
    return m ? m[1] : null;
  }

  function getVideoHashFromCard(card) {
    return card.getAttribute('data-video-hash') || null;
  }

  function openOverlay(videoId, triggerElement) {
    const card = triggerElement && triggerElement.closest ? triggerElement.closest('.builder-video-card') : null;
    const hash = card ? getVideoHashFromCard(card) : null;
    lastFocusedElement = triggerElement;
    let url = 'https://player.vimeo.com/video/' + videoId + '?autoplay=1';
    if (hash) url += '&h=' + encodeURIComponent(hash);
    iframe.src = url;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    iframe.onload = function onIframeLoad() {
      iframe.onload = null;
      if (typeof Vimeo !== 'undefined' && Vimeo.Player) {
        try {
          vimeoPlayer = new Vimeo.Player(iframe);
        } catch (e) {
          console.warn('Vimeo Player init:', e);
        }
      }
    };

    closeBtn.focus();

    const focusable = overlay.querySelectorAll(focusableSelector);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    overlay._trapFocus = trapFocus;
    overlay.addEventListener('keydown', trapFocus);
  }

  function closeOverlay() {
    if (vimeoPlayer) {
      try {
        vimeoPlayer.pause();
      } catch (e) {}
      vimeoPlayer = null;
    }
    iframe.src = 'about:blank';
    overlay.hidden = true;
    document.body.style.overflow = '';

    if (overlay._trapFocus) {
      overlay.removeEventListener('keydown', overlay._trapFocus);
      overlay._trapFocus = null;
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  gallery.addEventListener('click', (e) => {
    const card = e.target.closest('.builder-video-card');
    if (!card) return;
    const videoId = getVideoIdFromCard(card);
    if (!videoId) return;
    e.preventDefault();
    openOverlay(videoId, e.target.closest('.builder-play-btn') || card);
  });

  closeBtn.addEventListener('click', () => closeOverlay());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && !overlay.hidden) {
      closeOverlay();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('builder-video-overlay__backdrop')) {
      closeOverlay();
    }
  });
}

/**
 * Logo Click Handler - Return to video header when logo is clicked
 */
function initLogoClick() {
  document.addEventListener('click', (e) => {
    const logo = e.target.closest('.video-header-logo');
    if (!logo || !logo.classList.contains('at-top')) return;
    
    e.preventDefault();
    
    // Get references
    const videoHeader = document.querySelector('.video-header');
    const nav = document.querySelector('.nav');
    const videoHeaderContent = document.querySelector('.video-header-content-wrapper');
    const videoPlayer = videoHeader ? videoHeader.querySelector('.video-header-player') : null;
    
    // Step 1: Remove video-complete class FIRST to allow video header to be visible
    document.body.classList.remove('video-complete');
    
    // Step 2: Force video header to be visible (CSS no longer has !important blocking it)
    if (videoHeader) {
      videoHeader.style.opacity = '1';
      videoHeader.style.visibility = 'visible';
      videoHeader.style.pointerEvents = 'auto';
      videoHeader.style.display = 'block';
    }
    
    // Reset video player opacity if needed
    if (videoPlayer) {
      videoPlayer.style.opacity = '1';
    }
    
    // Reset content wrapper opacity
    if (videoHeaderContent) {
      videoHeaderContent.style.opacity = '1';
    }
    
    // Step 3: Reset logo to white version and move back to video header
    const logoImg = logo.querySelector('img');
    if (logoImg && logoImg.src.includes('Black')) {
      logoImg.src = logoImg.src.replace('Black', 'White');
    }
    logo.classList.remove('at-top');
    
    // Clear all inline styles to restore CSS defaults (scale 1.6)
    logo.style.cssText = '';
    
    if (videoHeaderContent) {
      videoHeaderContent.insertBefore(logo, videoHeaderContent.firstChild);
      // Reset content wrapper transform
      videoHeaderContent.style.transform = '';
      videoHeaderContent.style.transition = '';
    }
    
    // Step 4: Hide nav
    if (nav) {
      nav.style.opacity = '0';
      nav.style.visibility = 'hidden';
      nav.classList.remove('logo-at-top');
    }
    
    // Step 4b: Hide fixed overlays from Our Impact and What We Do so they don't stick on screen
    hideImpactFixedContent();
    hideWwdFixedContent();
    
    // Step 4c: Clear Our Impact background so next section (e.g. What We Do) shows correct color
    const bgOverlay = document.getElementById('section-bg-overlay');
    if (bgOverlay) bgOverlay.classList.remove('our-impact-active');
    
    // Step 5: Reset section pages - IMPORTANT: clear inline opacity from previous transitions
    document.querySelectorAll('.section-page').forEach(page => {
      page.classList.remove('active');
      page.style.opacity = '';  // Clear any inline opacity from fade transitions
      page.style.transition = '';
    });
    
    // Step 6: Re-activate "What We Do" section (but it will be hidden until video transition)
    const wwdSection = document.querySelector('#what-we-do');
    if (wwdSection) {
      wwdSection.classList.add('active');
      wwdSection.style.opacity = '1';  // Explicitly ensure opacity is 1
    }
    
    // Step 7: Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Set cursor pointer for logo
    logo.style.cursor = 'pointer';
  });
}

/**
 * Responsive Resize Handler - Ensure content readjusts on browser resize
 */
function initResponsiveResize() {
  let resizeTimeout;
  
  function handleResize() {
    // Clear existing timeout
    clearTimeout(resizeTimeout);
    
    // Debounce resize event (wait 150ms after user stops resizing)
    resizeTimeout = setTimeout(() => {
      // CSS handles the centering correctly - no JS overrides needed
      // Just trigger video header layout check for mobile stacking
      const layoutCheckEvent = new Event('resize');
      window.dispatchEvent(layoutCheckEvent);
    }, 150);
  }
  
  // Listen for window resize
  window.addEventListener('resize', handleResize);
}

/**
 * Mission Page Animations - Microsoft-style word-by-word reveal
 */

// Split text into individual word spans
function splitTextIntoWords(element) {
  const text = element.textContent.trim();
  const words = text.split(' ');
  element.innerHTML = words.map((word, index) => 
    `<span class="word" data-index="${index}">${word}</span>`
  ).join(' ');
}

// Microsoft AI-style background image configuration
// Vertical/horizontal only, Mission_01 largest, no overlap, vertical stack
const MISSION_BG_CONFIG = [
  {
    src: 'assets/images/AIJI_Artwork_Mission_01.png',
    orientation: 'vertical', // Fully vertical
    size: 'large', // Largest image
    position: { top: '20vh' },
    opacity: 1.0 // Full opacity for watercolor effect
  },
  {
    src: 'assets/images/AIJI_Artwork_Mission_02.png',
    orientation: 'horizontal', // Fully horizontal
    size: 'medium',
    position: { top: '90vh' },
    opacity: 0.95 // Near full opacity
  },
  {
    src: 'assets/images/AIJI_Artwork_Mission_03.png',
    orientation: 'vertical', // Fully vertical
    size: 'medium',
    position: { top: '160vh' },
    opacity: 0.95 // Near full opacity
  },
  {
    src: 'assets/images/AIJI_Artwork_Mission_04.png',
    orientation: 'horizontal', // Fully horizontal
    size: 'medium',
    position: { top: '230vh' },
    opacity: 0.95 // Near full opacity
  }
];

// Create background artwork elements with Microsoft AI-style layout
function createBackgroundArtwork() {
  const container = document.querySelector('.wwd-mission-bg-scroll');
  if (!container) return;
  
  MISSION_BG_CONFIG.forEach((config, index) => {
    const img = document.createElement('img');
    img.src = config.src;
    img.className = `mission-bg-art ${config.orientation} ${config.size}`;
    img.dataset.opacity = config.opacity;
    img.alt = 'Mission background artwork';
    
    // Position
    Object.entries(config.position).forEach(([key, value]) => {
      img.style[key] = value;
    });
    
    // Initial state - invisible
    img.style.opacity = '0';
    
    container.appendChild(img);
  });
  
  console.log('Mission background images created:', MISSION_BG_CONFIG.length);
}

// Microsoft AI-style fade in/out for Mission background images
function initMissionBackgroundFade() {
  const images = document.querySelectorAll('.mission-bg-art');
  const wwdSection = document.querySelector('.wwd');
  
  if (!images.length || !wwdSection) return;
  
  function updateImageVisibility() {
    const viewportHeight = window.innerHeight;
    
    images.forEach(img => {
      const imgRect = img.getBoundingClientRect();
      
      // Calculate visibility based on viewport position
      const isInViewport = imgRect.top < viewportHeight && imgRect.bottom > 0;
      
      if (!isInViewport) {
        img.style.opacity = '0';
        return;
      }
      
      // Fade in/out based on distance from viewport center
      const imgCenter = (imgRect.top + imgRect.bottom) / 2;
      const viewportCenter = viewportHeight / 2;
      const distanceFromCenter = Math.abs(imgCenter - viewportCenter);
      const fadeThreshold = viewportHeight * 0.6; // Increased from 0.4 to make images reach 100% opacity sooner
      
      // Calculate opacity: 1 at center, 0 at threshold distance
      const opacityMultiplier = Math.max(0, 1 - (distanceFromCenter / fadeThreshold));
      const targetOpacity = parseFloat(img.dataset.opacity) || 0.7;
      
      // Reach full opacity faster with a power curve
      const adjustedMultiplier = Math.pow(opacityMultiplier, 0.7); // Power < 1 makes it reach 1.0 faster
      
      img.style.opacity = adjustedMultiplier * targetOpacity;
    });
  }
  
  // Listen to WWD section scroll (since it's the scrolling container)
  wwdSection.addEventListener('scroll', updateImageVisibility, { passive: true });
  
  // Also listen to window scroll for initial load
  window.addEventListener('scroll', updateImageVisibility, { passive: true });
  
  // Initial check
  updateImageVisibility();
  
  console.log('Mission background fade initialized');
}

// Initialize Mission page animations
function initMissionPageAnimations() {
  const missionPage = document.querySelector('.wwd-step-1');
  const missionText = document.querySelector('.wwd-text-pursuit');
  
  if (!missionPage || !missionText) return;
  
  // Create background artwork
  createBackgroundArtwork();
  
  // Initialize fade in/out effect
  initMissionBackgroundFade();
  
  console.log('Mission page animations initialized');
}

// Parallax scroll effect - DISABLED for Microsoft AI-style (text stays fixed, images scroll naturally)
function initMissionParallax() {
  // Parallax disabled - using natural scroll with fade in/out instead
  console.log('Mission parallax disabled - using Microsoft AI-style fade');
}

// Add scroll boundary detection for all sections
/**
 * WWD Continuous Scroll - Microsoft AI-style navigation
 * All pages visible, animations driven by scroll position
 */
function initWwdContinuousScroll() {
  const wwdSection = document.querySelector('.wwd');
  const allSteps = document.querySelectorAll('.wwd-step');
  
  if (!wwdSection || !allSteps.length) return;
  
  // Make all steps visible for continuous scroll
  allSteps.forEach(step => {
    step.classList.add('active');
    step.style.opacity = '1';
    step.style.visibility = 'visible';
    step.style.position = 'relative';
  });
  
  // Note: Don't set scrollBehavior = 'smooth' - it conflicts with trackpad momentum
  
  console.log('WWD continuous scroll enabled - all steps visible');
}

const PAGE_TITLES = ['The Mission', 'The Vision', 'The How', 'The Hub', 'Leadership', 'Ecosystem'];
const IMPACT_PAGE_TITLES = ['Decade of Work', 'NYT', 'Demography', 'Economic Impact', 'Builders'];
let _lastTitleStepIndex = -1;
let _lastImpactStepIndex = -1;
let _decadeEntrancePlayed = false;
let _decadeEntranceInProgress = false;

/** Set to true in console to debug Decade entrance: window.DEBUG_DECADE = true */
window.DEBUG_DECADE = false;

function toTitleCase(str) {
  const small = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'in', 'on', 'at', 'to'];
  return str.split(' ').map((word, i, arr) => {
    // Preserve all-uppercase words (acronyms like NYT, AI, etc.)
    if (word === word.toUpperCase() && word.length > 1) return word;
    const lower = word.toLowerCase();
    if (i > 0 && i < arr.length - 1 && small.includes(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(' ');
}

/**
 * Update page title progress bar - dots above (past), title (current), dots below (future).
 * Titles fade in / fade out only (no vertical movement).
 */
function updatePageTitleFade() {
  const steps = document.querySelectorAll('.wwd-step');
  const titlesAbove = document.getElementById('titles-above');
  const titlesCurrent = document.getElementById('titles-current');
  const titlesBelow = document.getElementById('titles-below');
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;

  if (!titlesAbove || !titlesCurrent || !titlesBelow) return;

  const howContent = document.querySelector('.wwd-how-content-fixed');
  const howContentVisible = howContent && parseFloat(howContent.style.opacity) > 0.2;

  let currentStep = null;
  let currentStepIndex = -1;

  steps.forEach((step, index) => {
    const rect = step.getBoundingClientRect();
    if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
      currentStep = step;
      currentStepIndex = index + 1;
    }
  });

  if (howContentVisible && currentStepIndex !== 3) {
    const howStep = document.querySelector('.wwd-step-3');
    if (howStep) {
      const rect = howStep.getBoundingClientRect();
      if (rect.top < viewportHeight) {
        currentStepIndex = 3;
        currentStep = howStep;
      }
    }
  }

  let usedClosestFallback = false;
  // If no step contains viewport center (e.g. gap between Hub and How), pick step whose center is closest
  if (currentStepIndex < 1 || currentStepIndex > 6) {
    usedClosestFallback = true;
    let bestIndex = 1;
    let bestDist = Infinity;
    steps.forEach((step, index) => {
      const stepNum = index + 1;
      if (stepNum === 7) return; // skip footer
      const rect = step.getBoundingClientRect();
      const stepCenter = (rect.top + rect.bottom) / 2;
      const dist = Math.abs(stepCenter - viewportCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = stepNum;
      }
    });
    currentStepIndex = bestIndex;
    currentStep = steps[currentStepIndex - 1];
  }

  // Footer (step 7) - show Our Partners as last; steps 1-6 for progress bar
  const displayStep = currentStepIndex >= 1 && currentStepIndex <= 6 ? currentStepIndex : (currentStepIndex === 7 ? 6 : 1);

  // Only rebuild DOM when step changes
  if (displayStep !== _lastTitleStepIndex) {
    _lastTitleStepIndex = displayStep;
    titlesAbove.innerHTML = '';
    titlesCurrent.innerHTML = '';
    titlesBelow.innerHTML = '';

    for (let i = 1; i < displayStep; i++) {
      const dot = document.createElement('div');
      dot.className = 'title-dot';
      titlesAbove.appendChild(dot);
    }

    const titleEl = document.createElement('div');
    titleEl.className = 'wwd-title-item active';
    titleEl.setAttribute('data-for-step', displayStep);
    titleEl.textContent = toTitleCase(PAGE_TITLES[displayStep - 1]);
    titlesCurrent.appendChild(titleEl);

    for (let i = displayStep + 1; i <= 6; i++) {
      const dot = document.createElement('div');
      dot.className = 'title-dot';
      titlesBelow.appendChild(dot);
    }
  }

  const titleEl = titlesCurrent.querySelector('.wwd-title-item');
  if (!titleEl) return;

  const displayStepElement = document.querySelector(`.wwd-step-${displayStep}`);

  if (displayStepElement) {
    const stepRect = displayStepElement.getBoundingClientRect();
    const entranceThreshold = viewportHeight * 0.55;  // longer scroll range for fade in
    const exitThreshold = viewportHeight * 0.55;      // longer scroll range for fade out
    const exitFadeRange = viewportHeight * 0.4;       // distance over which exit fades to 0
    let opacity = 1;
    let zone = 'locked';

    // Ease curve: gentler than linear (ease-in-out-ish)
    function easeProgress(t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return t * t * (3 - 2 * t); // smoothstep
    }

    // Entrance: only when section is clearly entering from below (bottom in lower part of band).
    // When scrolling away, the current section's bottom passes through (viewportCenter, viewportCenter+entranceThreshold)
    // and was incorrectly treated as "entrance" (fade in). So only use entrance when bottom > center + 0.7*threshold.
    const entranceBandStart = viewportCenter + entranceThreshold * 0.7;
    if (stepRect.bottom > entranceBandStart && stepRect.bottom < viewportCenter + entranceThreshold) {
      zone = 'entrance';
      const raw = (viewportCenter + entranceThreshold - stepRect.bottom) / (entranceThreshold * 0.3);
      const progress = easeProgress(Math.min(1, Math.max(0, raw)));
      opacity = progress;
    } else if (stepRect.bottom < viewportCenter - exitThreshold) {
      zone = 'exit';
      // Exit: section above center — fade out (slower)
      const distancePastExit = viewportCenter - exitThreshold - stepRect.bottom;
      const raw = Math.max(0, 1 - (distancePastExit / exitFadeRange));
      const progress = easeProgress(Math.min(1, raw));
      opacity = progress;
    }

    titleEl.style.opacity = opacity;
    titleEl.style.transform = 'rotate(180deg)';
  } else {
    titleEl.style.opacity = '1';
    titleEl.style.transform = 'rotate(180deg)';
  }

}

/**
 * Update progress bar when in Our Impact section - dots above (past), title (current), dots below (future).
 * Uses impact steps (data-impact-step) and IMPACT_PAGE_TITLES.
 */
function updateImpactPageTitleFade() {
  const impactSection = document.getElementById('our-impact');
  const titlesFixed = document.getElementById('wwd-titles-fixed');
  if (!impactSection || !impactSection.classList.contains('active')) return;

  // Show the progress bar for Our Impact section
  if (titlesFixed) {
    titlesFixed.style.opacity = '1';
    titlesFixed.style.transition = 'opacity 0.4s ease';
  }

  const steps = Array.from(impactSection.querySelectorAll('[data-impact-step]'))
    .map(el => ({ el, step: parseInt(el.getAttribute('data-impact-step'), 10) }))
    .filter(({ step }) => !isNaN(step))
    .sort((a, b) => a.step - b.step)
    .map(({ el }) => el);

  const titlesAbove = document.getElementById('titles-above');
  const titlesCurrent = document.getElementById('titles-current');
  const titlesBelow = document.getElementById('titles-below');
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;

  if (!titlesAbove || !titlesCurrent || !titlesBelow || !steps.length) return;

  let currentStepIndex = -1;
  steps.forEach((step, index) => {
    const rect = step.getBoundingClientRect();
    if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
      currentStepIndex = index + 1;
    }
  });

  if (currentStepIndex < 1) {
    let bestIndex = 1;
    let bestDist = Infinity;
    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const stepCenter = (rect.top + rect.bottom) / 2;
      const dist = Math.abs(stepCenter - viewportCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = index + 1;
      }
    });
    currentStepIndex = bestIndex;
  }

  const displayStep = Math.max(1, Math.min(currentStepIndex, IMPACT_PAGE_TITLES.length));

  if (displayStep !== _lastImpactStepIndex) {
    _lastImpactStepIndex = displayStep;
    titlesAbove.innerHTML = '';
    titlesCurrent.innerHTML = '';
    titlesBelow.innerHTML = '';

    for (let i = 1; i < displayStep; i++) {
      const dot = document.createElement('div');
      dot.className = 'title-dot';
      titlesAbove.appendChild(dot);
    }

    const titleEl = document.createElement('div');
    titleEl.className = 'wwd-title-item active';
    titleEl.setAttribute('data-for-step', displayStep);
    titleEl.textContent = toTitleCase(IMPACT_PAGE_TITLES[displayStep - 1]);
    titlesCurrent.appendChild(titleEl);

    for (let i = displayStep + 1; i <= IMPACT_PAGE_TITLES.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'title-dot';
      titlesBelow.appendChild(dot);
    }
  }

  const titleEl = titlesCurrent.querySelector('.wwd-title-item');
  if (titleEl) titleEl.style.opacity = '1';
}

/** Builder photos for Decade of Work background (assets/images/builders). */
const BUILDERS_IMAGE_FILES = [
  '2025Sept_Brian_Williams_02.jpg', '2025Sept_David_Del_Rio.jpg', '2025Sept_Edwin_Perez.jpg',
  '2025Sept_Endy_Diaz.jpg', '2025Sept_Ergash_Ruzehaji.jpg', '2025Sept_Gamaliel_Leguista.jpg',
  '2025Sept_Headshot_Name.jpg', '2025Sept_Ibrahima_Diallo.jpg', '2025Sept_Ismael_Caraballo.jpg',
  '2025Sept_Jaun_Franco.jpg', '2025Sept_Jawad_Ashraf.jpg', '2025Sept_Joel_Philip.jpg',
  '2025Sept_Jonel_Richardson.jpg', '2025Sept_Kevin_Natera.jpg', '2025Sept_Letisha_Gary.jpg',
  '2025Sept_Manar_Marouf.jpg', '2025Sept_Manual_Roman_01.jpg', '2025Sept_Michael_Fehdrau.jpg',
  '2025Sept_Midea_Steward.jpg', '2025Sept_Nate_Hamlin_01.jpg', '2025Sept_OLayemi_Adaramola.jpg',
  '2025Sept_Pape_Sy_01.jpg', '2025Sept_Paula_Lawton.jpg', '2025Sept_Rene_Ugarte_01.jpg',
  '2025Sept_Renee_Jackson.jpg', '2025Sept_Victor_Castillo_02.jpg', '2025Sept_Yaasameen Perez_01.jpg',
  '2025Sept_Yaasameen_Perez_02.jpg', '2025Sept_Yutong_Hu_01.jpg'
];
const BUILDERS_BASE_PATH = 'assets/images/builders/';
const DECADE_BUILDER_PHOTO_COUNT = 12;

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Extract person name from filename to detect duplicates.
 * E.g., '2025Sept_Brian_Williams_02.jpg' -> 'brian_williams'
 */
function extractPersonName(filename) {
  // Remove date prefix (e.g., '2025Sept_') and file extension
  let name = filename.replace(/^\d+[A-Za-z]+_/, '').replace(/\.(jpg|jpeg|png)$/i, '');
  // Remove trailing numbers (e.g., '_01', '_02', ' 01', ' 02')
  name = name.replace(/[\s_]?\d+$/, '');
  // Normalize: lowercase, replace spaces and underscores with single underscore
  name = name.toLowerCase().replace(/[\s_]+/g, '_');
  // Remove trailing underscore if any
  name = name.replace(/_+$/, '');
  return name;
}

/**
 * Select unique people from the builders array (no same person twice)
 */
function selectUniqueBuilders(files, count) {
  const shuffled = shuffleArray(files);
  const selected = [];
  const seenPeople = new Set();
  
  for (const file of shuffled) {
    if (selected.length >= count) break;
    const personName = extractPersonName(file);
    if (!seenPeople.has(personName)) {
      seenPeople.add(personName);
      selected.push(file);
    }
  }
  return selected;
}

let decadeBuilderPhotosInitialized = false;
const DECADE_BUILDER_GAP_BELOW_COPY_PX = 100;
const DECADE_BUILDER_IMG_SIZE_PX = 300;
const DECADE_BUILDER_SLOT_ROWS = 3;  /* 12 images: 3 rows of 4 */
const DECADE_BUILDER_SLOT_COLS = 4;
const DECADE_BUILDER_ROW_GAP_PX = 30;

function initDecadeBuilderPhotos() {
  const container = document.getElementById('impact-decade-bg');
  const decadeStep = document.querySelector('#our-impact [data-impact-step="1"]');
  const decadeContent = document.getElementById('impact-decade-content-fixed');
  if (!container || !decadeStep || decadeBuilderPhotosInitialized) return;

  const stepW = decadeStep.offsetWidth || window.innerWidth;
  const stepH = decadeStep.offsetHeight;
  if (stepH < 100 || stepW < 100) return;
  const stepRect = decadeStep.getBoundingClientRect();
  const bodyEl = decadeContent ? decadeContent.querySelector('.impact-decade-body') : null;
  let firstImageMinTopPx;
  if (bodyEl) {
    const bodyRect = bodyEl.getBoundingClientRect();
    firstImageMinTopPx = bodyRect.bottom - stepRect.top + DECADE_BUILDER_GAP_BELOW_COPY_PX;
  } else {
    const contentHeight = decadeContent ? decadeContent.offsetHeight : 200;
    const viewportCenter = window.innerHeight / 2;
    firstImageMinTopPx = viewportCenter + contentHeight / 2 + DECADE_BUILDER_GAP_BELOW_COPY_PX;
  }
  if (firstImageMinTopPx >= stepH - 100) firstImageMinTopPx = Math.max(0, stepH * 0.2);
  const bottomMargin = 20;
  const availableHeight = Math.max(100, stepH - firstImageMinTopPx - bottomMargin);
  const totalGapPx = (DECADE_BUILDER_SLOT_ROWS - 1) * DECADE_BUILDER_ROW_GAP_PX;
  const availableHeightForSlots = Math.max(100, availableHeight - totalGapPx);
  const slotHeight = availableHeightForSlots / DECADE_BUILDER_SLOT_ROWS;
  const slotWidth = stepW / DECADE_BUILDER_SLOT_COLS;

  const chosen = selectUniqueBuilders(BUILDERS_IMAGE_FILES, DECADE_BUILDER_PHOTO_COUNT);
  
  // Place images row by row, calculating next row start from actual image bottoms
  let currentRowTop = firstImageMinTopPx;
  let globalLowestBottom = 0; // Track the lowest point of all images
  const ROW_GAP = 50; // Gap between rows (from lowest image bottom to next row top)
  const MIN_HORIZONTAL_GAP = 20; // Minimum gap between images on the same row
  
  for (let row = 0; row < DECADE_BUILDER_SLOT_ROWS; row++) {
    let maxBottomInRow = 0;
    
    // First pass: calculate sizes and positions for all images in this row
    const rowImages = [];
    for (let col = 0; col < DECADE_BUILDER_SLOT_COLS; col++) {
      const i = row * DECADE_BUILDER_SLOT_COLS + col;
      if (i >= chosen.length) break;
      
      const scale = 0.6 + Math.random() * 0.4;
      const size = DECADE_BUILDER_IMG_SIZE_PX * scale;
      rowImages.push({ index: i, scale, size, filename: chosen[i] });
    }
    
    // Calculate available width per image accounting for gaps
    const totalGapWidth = (rowImages.length - 1) * MIN_HORIZONTAL_GAP;
    const availableWidth = stepW - totalGapWidth;
    const maxImageWidth = availableWidth / rowImages.length;
    
    // Second pass: place images with guaranteed gaps
    let currentLeft = 0;
    for (let col = 0; col < rowImages.length; col++) {
      const imgData = rowImages[col];
      // Cap size to fit within allocated space
      const size = Math.min(imgData.size, maxImageWidth);
      
      const img = document.createElement('img');
      img.className = 'builder-photo';
      img.src = BUILDERS_BASE_PATH + encodeURIComponent(imgData.filename);
      img.alt = '';
      
      // Horizontal position: within allocated slot, with small random offset
      const slotWidthForImage = maxImageWidth;
      const maxOffset = Math.max(0, slotWidthForImage - size);
      const randomOffset = maxOffset > 0 ? Math.random() * maxOffset * 0.5 : 0; // Only use half the available offset
      const left = currentLeft + randomOffset;
      
      // Vertical position: first row pinned to top, others have small random offset (0-30px)
      const isFirstRow = row === 0;
      const verticalOffset = isFirstRow ? 0 : Math.random() * 30;
      const top = currentRowTop + verticalOffset;
      
      // Recalculate scale based on capped size
      const actualScale = size / DECADE_BUILDER_IMG_SIZE_PX;
      
      img.style.left = left + 'px';
      img.style.top = top + 'px';
      img.style.transform = 'scale(' + actualScale + ')';
      img.style.opacity = '0';
      container.appendChild(img);
      
      // Move to next slot position
      currentLeft += slotWidthForImage + MIN_HORIZONTAL_GAP;
      
      // Track the lowest point in this row
      const imageBottom = top + size;
      if (imageBottom > maxBottomInRow) {
        maxBottomInRow = imageBottom;
      }
      if (imageBottom > globalLowestBottom) {
        globalLowestBottom = imageBottom;
      }
    }
    
    // Next row starts at the lowest image bottom + gap
    currentRowTop = maxBottomInRow + ROW_GAP;
  }

  // Set the step height dynamically based on actual image positions + 150px padding
  const BOTTOM_PADDING = 150;
  const requiredHeight = globalLowestBottom + BOTTOM_PADDING;
  decadeStep.style.minHeight = requiredHeight + 'px';

  // Delay image visibility until copy entrance animation completes (0.5s + 0.25s delay = 750ms)
  const photos = container.querySelectorAll('.builder-photo');
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.style.opacity = '1';
      });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    photos.forEach((el) => observer.observe(el));
  }, 800);
  decadeBuilderPhotosInitialized = true;
}

function updateBuilderPhotosVisibility() {
  /* Visibility is driven by Intersection Observer in initDecadeBuilderPhotos(); no-op here for API compatibility. */
}

/**
 * Update Decade of Work fixed content - same entrance/exit logic as Vision page.
 * Single container: slides up/fades in, slides up/fades out. Rect-based so animation runs reliably.
 */
function updateDecadeEntrance() {
  const impactSection = document.getElementById('our-impact');
  const decadeContent = document.getElementById('impact-decade-content-fixed');
  const decadeStep = impactSection && impactSection.querySelector('[data-impact-step="1"]');

  if (window.DEBUG_DECADE) {
    console.log('[Decade] updateDecadeEntrance called', {
      hasImpactSection: !!impactSection,
      hasDecadeContent: !!decadeContent,
      hasDecadeStep: !!decadeStep,
      impactActive: impactSection ? impactSection.classList.contains('active') : false,
      _decadeEntrancePlayed
    });
  }

  if (!decadeContent || !decadeStep) return;

  if (!impactSection || !impactSection.classList.contains('active')) {
    if (window.DEBUG_DECADE) console.log('[Decade] section not active -> hide, reset _decadeEntrancePlayed');
    decadeContent.style.opacity = '0';
    decadeContent.style.transform = 'translate(-50%, calc(-50% + 30px))';
    decadeContent.style.pointerEvents = 'none';
    _decadeEntrancePlayed = false;
    _decadeEntranceInProgress = false;
    return;
  }

  const rect = decadeStep.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;
  const stepH = decadeStep.offsetHeight;

  const isDecadeActive = rect.top < viewportCenter && rect.bottom > viewportCenter;
  const decadeTopPastCenter = rect.top < viewportCenter;

  // Text exits based on scroll progress through the step
  // Step is 240vh; second row is roughly at 25-30% of step height
  // Exit should start around 12% scroll and complete by 22%
  const scrollProgress = Math.max(0, -rect.top / (stepH - viewportHeight));
  const exitStartProgress = 0.12;
  const exitEndProgress = 0.22;
  const textInExitZone = scrollProgress >= exitStartProgress && scrollProgress < exitEndProgress;
  const textPastExit = scrollProgress >= exitEndProgress;

  const bodyEl = decadeContent.querySelector('.impact-decade-body');
  const distancePastCenter = viewportCenter - rect.top;
  const entranceZone = viewportHeight * 0.25;
  const inEntranceZone = distancePastCenter < entranceZone && distancePastCenter > 0;

  if (window.DEBUG_DECADE) {
    console.log('[Decade] rect & zones', {
      rectTop: rect.top,
      rectBottom: rect.bottom,
      viewportHeight,
      viewportCenter,
      scrollProgress,
      textInExitZone,
      textPastExit,
      isDecadeActive,
      decadeTopPastCenter,
      inEntranceZone,
      branch: !(isDecadeActive && decadeTopPastCenter) ? 'inactive' : textPastExit ? 'pastExit' : textInExitZone ? 'exitZone' : inEntranceZone ? 'entranceZone' : 'fullyVisible'
    });
  }

  if (isDecadeActive && decadeTopPastCenter) {
    if (textPastExit) {
      decadeContent.style.opacity = '0';
      decadeContent.style.transform = 'translate(-50%, calc(-50% - 30px))';
      decadeContent.style.pointerEvents = 'none';
    } else if (textInExitZone) {
      // exitProgress: 0 at exitStartProgress, 1 at exitEndProgress
      const exitProgress = (scrollProgress - exitStartProgress) / (exitEndProgress - exitStartProgress);
      const opacity = Math.max(0, Math.min(1, 1 - exitProgress));
      decadeContent.style.opacity = opacity;
      decadeContent.style.transform = `translate(-50%, calc(-50% - ${exitProgress * 30}px))`;
      decadeContent.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    } else if (inEntranceZone) {
      const progress = distancePastCenter / entranceZone;
      decadeContent.style.opacity = progress;
      decadeContent.style.transform = `translate(-50%, calc(-50% + ${(1 - progress) * 30}px))`;
      decadeContent.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
    } else {
      if (!_decadeEntrancePlayed) {
        _decadeEntrancePlayed = true;
        _decadeEntranceInProgress = true;
        decadeContent.style.pointerEvents = 'none';
        decadeContent.classList.add('decade-entrance-animate');
        const onEntranceDone = () => {
          decadeContent.classList.remove('decade-entrance-animate');
          decadeContent.style.opacity = '1';
          decadeContent.style.transform = 'translate(-50%, -50%)';
          decadeContent.style.pointerEvents = 'auto';
          _decadeEntranceInProgress = false;
          if (bodyEl) bodyEl.removeEventListener('animationend', onEntranceDone);
        };
        if (bodyEl) bodyEl.addEventListener('animationend', onEntranceDone);
        setTimeout(() => {
          if (_decadeEntranceInProgress) {
            if (bodyEl) bodyEl.removeEventListener('animationend', onEntranceDone);
            onEntranceDone();
          }
        }, 750);
      } else if (!_decadeEntranceInProgress) {
        decadeContent.style.opacity = '1';
        decadeContent.style.transform = 'translate(-50%, -50%)';
        decadeContent.style.pointerEvents = 'auto';
      }
    }
  } else {
    if (window.DEBUG_DECADE) console.log('[Decade] step not active -> hide');
    decadeContent.style.opacity = '0';
    decadeContent.style.pointerEvents = 'none';
    if (rect.top >= viewportCenter) {
      decadeContent.style.transform = 'translate(-50%, calc(-50% + 30px))';
    } else {
      decadeContent.style.transform = 'translate(-50%, calc(-50% - 30px))';
    }
  }
}

/**
 * Update builder photos exit - fade out entire container when the lowest image bottom hits 50% viewport
 */
function updateBuilderPhotosExit() {
  const impactSection = document.getElementById('our-impact');
  const container = document.getElementById('impact-decade-bg');
  const decadeStep = impactSection && impactSection.querySelector('[data-impact-step="1"]');
  
  if (!container || !decadeStep) return;
  if (!impactSection || !impactSection.classList.contains('active')) {
    container.style.opacity = '1'; // Reset when not active
    return;
  }
  
  // Find the actual lowest image bottom
  const photos = container.querySelectorAll('.builder-photo');
  if (photos.length === 0) return;
  
  let lowestBottom = 0;
  photos.forEach((photo) => {
    const photoRect = photo.getBoundingClientRect();
    if (photoRect.bottom > lowestBottom) {
      lowestBottom = photoRect.bottom;
    }
  });
  
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;
  const exitZone = viewportHeight * 0.15;
  
  // Exit when lowest image bottom hits viewport center
  if (lowestBottom <= viewportCenter - exitZone) {
    // Fully exited
    container.style.opacity = '0';
  } else if (lowestBottom < viewportCenter + exitZone && lowestBottom > viewportCenter - exitZone) {
    // In exit zone - fade out as a unit
    const exitProgress = (viewportCenter + exitZone - lowestBottom) / (2 * exitZone);
    const opacity = Math.max(0, Math.min(1, 1 - exitProgress));
    container.style.opacity = opacity;
  } else {
    // Not in exit zone yet - keep visible
    container.style.opacity = '1';
  }
}

/**
 * Update NYT Quote page entrance/exit animation
 * Fixed content at viewport center (like Mission/Vision) - fade in/out based on page position, no translateY
 * Background image scrolls naturally with the page (always visible via CSS)
 * Uses hysteresis (buffer) at boundaries to prevent appear/disappear flicker.
 */
function updateNYTEntrance() {
  const impactSection = document.getElementById('our-impact');
  const nytPage = impactSection && impactSection.querySelector('[data-impact-step="2"]');
  const nytContent = document.getElementById('nyt-content-fixed');

  if (!nytPage || !nytContent) return;
  if (!impactSection || !impactSection.classList.contains('active')) {
    nytContent.style.opacity = '0';
    return;
  }

  const rect = nytPage.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;
  const buffer = viewportHeight * 0.03; // 3vh hysteresis to avoid boundary flicker

  // Active when viewport center is clearly inside the page (with buffer so we don't flip at edges)
  const isNytActive = rect.top < viewportCenter + buffer && rect.bottom > viewportCenter - buffer;

  // Entrance: how much of page has passed viewport center from top
  const visibleFromTop = viewportHeight - rect.top;
  const entranceThreshold = viewportHeight * 0.10; // Fast fade-in (10vh)

  if (!isNytActive) {
    nytContent.style.opacity = '0';
    return;
  }

  // Past exit: require bottom to be clearly above center (avoids flicker when rect.bottom ~ viewportCenter)
  if (rect.bottom <= viewportCenter - buffer) {
    nytContent.style.opacity = '0';
    return;
  }

  // Exit zone - stay at opacity 1 longer, then fade out over a shorter scroll distance
  // Start fading only when page bottom is 20vh past viewport (stay visible longer)
  const exitZoneStart = viewportHeight + viewportHeight * 0.20; // 120vh
  // End fade when page bottom is 25vh below center (shorter fade duration ~35vh of scroll)
  const exitZoneEnd = viewportCenter + viewportHeight * 0.25; // 75vh
  if (rect.bottom < exitZoneStart && rect.bottom > exitZoneEnd) {
    const distanceIntoExitZone = exitZoneStart - rect.bottom;
    const exitZoneHeight = exitZoneStart - exitZoneEnd;
    const exitProgress = Math.min(1, Math.max(0, distanceIntoExitZone / exitZoneHeight));
    const opacity = Math.max(0, 1 - exitProgress);
    nytContent.style.opacity = opacity;
    return;
  }
  if (rect.bottom <= exitZoneEnd) {
    nytContent.style.opacity = '0';
    return;
  }

  // Entrance - fade in (no translateY; content is fixed at center)
  if (visibleFromTop > 0 && visibleFromTop < entranceThreshold) {
    const progress = visibleFromTop / entranceThreshold;
    nytContent.style.opacity = progress;
  } else if (visibleFromTop >= entranceThreshold) {
    nytContent.style.opacity = '1';
  } else {
    nytContent.style.opacity = '0';
  }
}

/**
 * Update Stats (Demography) page entrance/exit animation
 * Content is centered and fades in when page top hits viewport center
 */
function updateStatsEntrance() {
  const impactSection = document.getElementById('our-impact');
  const statsPage = impactSection && impactSection.querySelector('[data-impact-step="3"]'); // Demography
  const statsContent = statsPage ? statsPage.querySelector('.real-people-content') : null;
  const nextStep = impactSection && impactSection.querySelector('[data-impact-step="4"]'); // Economic Impact

  if (!statsPage || !statsContent) return;
  if (!impactSection || !impactSection.classList.contains('active')) {
    statsContent.style.opacity = '0';
    statsContent.style.transform = 'translateY(20px)';
    return;
  }

  const rect = statsPage.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;
  const entranceZone = viewportHeight * 0.2; // Smaller zone for quicker fade
  const exitZoneHeight = viewportHeight * 0.25;
  
  // Entrance starts when page top approaches viewport center
  const distanceFromCenter = viewportCenter - rect.top;

  // Exit when next step approaches (bottom of page hits viewport center)
  const inExitZone = rect.bottom > viewportCenter && rect.bottom < viewportCenter + exitZoneHeight;
  const pastExit = rect.bottom <= viewportCenter;
  
  if (pastExit) {
    statsContent.style.opacity = '0';
    statsContent.style.transform = 'translateY(-20px)';
    return;
  }
  
  if (inExitZone) {
    const exitProgress = (viewportCenter + exitZoneHeight - rect.bottom) / exitZoneHeight;
    const opacity = Math.max(0, Math.min(1, 1 - exitProgress));
    statsContent.style.opacity = opacity;
    statsContent.style.transform = `translateY(-${exitProgress * 20}px)`;
    return;
  }

  // Entrance - fade in when page top passes viewport center
  if (distanceFromCenter > 0 && distanceFromCenter < entranceZone) {
    const progress = Math.min(1, distanceFromCenter / entranceZone);
    statsContent.style.opacity = progress;
    statsContent.style.transform = `translateY(${(1 - progress) * 20}px)`;
  } else if (distanceFromCenter >= entranceZone) {
    statsContent.style.opacity = '1';
    statsContent.style.transform = 'translateY(0)';
  } else {
    // Page top hasn't reached viewport center yet
    statsContent.style.opacity = '0';
    statsContent.style.transform = 'translateY(30px)';
  }
}

/**
 * Update Economic Impact section entrance/exit animation
 * Same pattern as Demography section
 */
function updateEconomicImpactEntrance() {
  const impactSection = document.getElementById('our-impact');
  const economicPage = impactSection && impactSection.querySelector('[data-impact-step="4"]');
  const economicContent = economicPage ? economicPage.querySelector('.real-people-content') : null;

  if (!economicPage || !economicContent) return;
  if (!impactSection || !impactSection.classList.contains('active')) {
    economicContent.style.opacity = '0';
    economicContent.style.transform = 'translateY(20px)';
    return;
  }

  const rect = economicPage.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;
  const entranceZone = viewportHeight * 0.2;
  const exitZoneHeight = viewportHeight * 0.25;
  
  const distanceFromCenter = viewportCenter - rect.top;

  // Exit when bottom of page hits viewport center
  const inExitZone = rect.bottom > viewportCenter && rect.bottom < viewportCenter + exitZoneHeight;
  const pastExit = rect.bottom <= viewportCenter;
  
  if (pastExit) {
    economicContent.style.opacity = '0';
    economicContent.style.transform = 'translateY(-20px)';
    return;
  }
  
  if (inExitZone) {
    const exitProgress = (viewportCenter + exitZoneHeight - rect.bottom) / exitZoneHeight;
    const opacity = Math.max(0, Math.min(1, 1 - exitProgress));
    economicContent.style.opacity = opacity;
    economicContent.style.transform = `translateY(-${exitProgress * 20}px)`;
    return;
  }

  // Entrance - fade in when page top passes viewport center
  if (distanceFromCenter > 0 && distanceFromCenter < entranceZone) {
    const progress = Math.min(1, distanceFromCenter / entranceZone);
    economicContent.style.opacity = progress;
    economicContent.style.transform = `translateY(${(1 - progress) * 20}px)`;
  } else if (distanceFromCenter >= entranceZone) {
    economicContent.style.opacity = '1';
    economicContent.style.transform = 'translateY(0)';
  } else {
    economicContent.style.opacity = '0';
    economicContent.style.transform = 'translateY(30px)';
  }
}

/**
 * Update Builders Stories (Step 5) exit animation
 * Same logic as What We Do: page-progress-based exit at 90-115%, content + progress bar fade together
 */
function updateBuildersStoriesExit() {
  const impactSection = document.getElementById('our-impact');
  const buildersStep = impactSection && impactSection.querySelector('[data-impact-step="5"]');
  const buildersContent = buildersStep && buildersStep.querySelector('.builder-stories-content');
  const titlesFixed = document.getElementById('wwd-titles-fixed');

  if (!buildersStep || !buildersContent) return;
  if (!impactSection || !impactSection.classList.contains('active')) {
    buildersContent.style.opacity = '1';
    buildersContent.style.transform = 'translateY(0)';
    return;
  }

  const viewportHeight = window.innerHeight;
  const stepRect = buildersStep.getBoundingClientRect();
  const stepHeight = buildersStep.offsetHeight;

  // Short step (same as WWD): use simple in-view check
  if (stepHeight <= viewportHeight) {
    const inView = stepRect.top < viewportHeight && stepRect.bottom > 0;
    buildersContent.style.opacity = inView ? '1' : '0';
    buildersContent.style.transform = inView ? 'translateY(0)' : 'translateY(-30px)';
    if (titlesFixed) titlesFixed.style.opacity = inView ? '1' : '0';
    return;
  }

  // Same formula as WWD: scroll progress through the page
  const pageProgress = -stepRect.top / (stepHeight - viewportHeight);

  // Exit at 90-115% (same as WWD)
  if (pageProgress > 0.90 && pageProgress < 1.15) {
    const fadeProgress = Math.min(1, (pageProgress - 0.90) / 0.25);
    buildersContent.style.opacity = 1 - fadeProgress;
    buildersContent.style.transform = `translateY(${-30 * fadeProgress}px)`;
    if (titlesFixed) {
      titlesFixed.style.opacity = 1 - fadeProgress;
      titlesFixed.style.transition = 'opacity 0.4s ease';
    }
  } else if (pageProgress <= 0.90) {
    buildersContent.style.opacity = '1';
    buildersContent.style.transform = 'translateY(0)';
  } else {
    buildersContent.style.opacity = '0';
    buildersContent.style.transform = 'translateY(-30px)';
    if (titlesFixed) titlesFixed.style.opacity = '0';
  }
}

/**
 * Update page transitions - crossfade between pages with slight movement
 */
function updatePageTransitions() {
  const steps = document.querySelectorAll('.wwd-step');
  const viewportHeight = window.innerHeight;
  const titlesFixed = document.getElementById('wwd-titles-fixed');
  let progressBarOpacity = 1;

  steps.forEach((step, index) => {
    // Footer step never fades - always fully visible
    if (step.classList.contains('wwd-step-7')) {
      step.style.opacity = '1';
      step.style.transform = 'translateY(0)';
      step.classList.remove('fading-out', 'fading-in');
      return;
    }

    const stepRect = step.getBoundingClientRect();
    const nextStep = steps[index + 1];
    const stepHeight = step.offsetHeight;
    const isLastContentStep = nextStep && nextStep.classList.contains('wwd-step-7');
    if (!isLastContentStep && titlesFixed) progressBarOpacity = 1;

    // Steps shorter than viewport: pageProgress formula breaks (negative denominator).
    // Use simple overlap check instead — Council and Partners use min-height: auto.
    if (stepHeight <= viewportHeight) {
      const inView = stepRect.top < viewportHeight && stepRect.bottom > 0;
      step.style.opacity = inView ? '1' : '0';
      step.style.transform = inView ? 'translateY(0)' : 'translateY(-30px)';
      step.classList.toggle('fading-out', !inView);
      step.classList.toggle('fading-in', false);
      if (titlesFixed && isLastContentStep) progressBarOpacity = inView ? 1 : 0;
      return;
    }

    // Calculate progress through current page (tall steps only)
    const pageProgress = -stepRect.top / (stepHeight - viewportHeight);
    
    // Fade out current page when near bottom (90% - 115%) - delayed so content stays longer
    if (pageProgress > 0.90 && pageProgress < 1.15) {
      const fadeProgress = Math.min(1, (pageProgress - 0.90) / 0.25);
      step.classList.add('fading-out');
      step.style.opacity = 1 - fadeProgress;
      step.style.transform = `translateY(${-30 * fadeProgress}px)`;
      if (titlesFixed && isLastContentStep) progressBarOpacity = 1 - fadeProgress;
      
      // Fade in next page (footer step 7 never fades - always full opacity)
      if (nextStep) {
        if (nextStep.classList.contains('wwd-step-7')) {
          nextStep.style.opacity = '1';
          nextStep.style.transform = 'translateY(0)';
        } else {
          nextStep.classList.add('fading-in');
          nextStep.classList.remove('fading-out');
          nextStep.style.opacity = fadeProgress;
          nextStep.style.transform = `translateY(${30 * (1 - fadeProgress)}px)`;
        }
      }
    } else if (pageProgress <= 0.90) {
      // Normal state - page is visible
      step.classList.remove('fading-out', 'fading-in');
      step.style.opacity = '1';
      step.style.transform = 'translateY(0)';
    } else if (pageProgress >= 1.15) {
      if (titlesFixed && isLastContentStep) progressBarOpacity = 0;
      // Completely scrolled past
      step.style.opacity = '0';
      step.style.transform = 'translateY(-30px)';
    }
  });

  if (titlesFixed) {
    titlesFixed.style.opacity = progressBarOpacity;
    titlesFixed.style.transition = 'opacity 0.4s ease';
  }
}

/**
 * Update Vision page background - scrolls up with page and scales
 * Starts at 75% scale at browser bottom, scales up to 100% as it scrolls up
 */
function updateVisionBackgroundScale() {
  const visionPage = document.querySelector('.wwd-step-2');
  const bgContainer = document.querySelector('.wwd-vision-bg-container');
  const bgImage = document.querySelector('.wwd-vision-bg-image');
  
  if (!visionPage || !bgImage || !bgContainer) return;
  
  const rect = visionPage.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  // Calculate scroll progress through Vision page (0 = just entered, 1 = exiting)
  const scrollProgress = -rect.top / (visionPage.offsetHeight - viewportHeight);
  
  // Also check if Vision page is entering (before scrollProgress = 0)
  const isEntering = rect.top > 0 && rect.top < viewportHeight;
  
  if (isEntering) {
    // Vision page is entering from bottom
    // Calculate entrance progress (0 = at bottom, 1 = top at viewport top)
    const entranceProgress = 1 - (rect.top / viewportHeight);
    
    // Start at 75% scale, grow to 100% as it enters
    const scale = 0.75 + (entranceProgress * 0.25); // 0.75 → 1.0
    
    // Position background - starts at bottom, moves up
    const yPosition = viewportHeight - (entranceProgress * viewportHeight * 0.5);
    
    bgContainer.style.top = `${yPosition}px`;
    bgImage.style.transform = `scale(${scale})`;
  } else if (scrollProgress >= 0 && scrollProgress <= 1) {
    // Scrolling through Vision page
    
    // Move background up with scroll
    const scrollOffset = scrollProgress * (visionPage.offsetHeight - viewportHeight) * 0.5;
    
    // Scale from 1.0 to 1.75 (100% to 175%)
    const scale = 1 + (scrollProgress * 0.75);
    
    // Update background position and scale
    bgContainer.style.top = `calc(50vh - ${scrollOffset}px)`;
    bgImage.style.transform = `scale(${scale})`;
  } else if (scrollProgress < 0) {
    // Before Vision page is visible
    bgContainer.style.top = `${viewportHeight}px`;
    bgImage.style.transform = 'scale(0.75)';
  } else {
    // After exiting
    bgImage.style.transform = 'scale(1.75)';
  }
}

/**
 * Initialize advanced page transitions - integrate all scroll effects
 */
function initAdvancedPageTransitions() {
  const wwdSection = document.querySelector('.wwd');
  const visionPage = document.querySelector('.wwd-step-2');
  const visionContent = document.querySelector('.wwd-vision-content-fixed');
  const missionPage = document.querySelector('.wwd-step-1');
  const missionText = document.querySelector('.wwd-mission-text-fixed');
  let rotatingWordsStarted = false;
  
  if (!wwdSection) return;
  
  // DEBUG: Log WWD scroll events (every 500px)
  let lastLoggedScrollTop = -1;
  wwdSection.addEventListener('scroll', () => {
    const currentScrollTop = wwdSection.scrollTop;
    if (Math.abs(currentScrollTop - lastLoggedScrollTop) > 500) {
      console.log('📜 WWD scroll:', { scrollTop: currentScrollTop, scrollHeight: wwdSection.scrollHeight, clientHeight: wwdSection.clientHeight });
      lastLoggedScrollTop = currentScrollTop;
    }
  }, { passive: true });
  
  function handleScroll() {
    if (document.querySelector('.wwd.active')) {
      updatePageTitleFade();
    }
    updatePageTransitions();
    updateVisionBackgroundScale();
    updateMissionEntrance();
    updateVisionEntrance();
    updateHowPageEntrance();
    updatePillarScrollProgress();
    updateHubEntrance();
    updateCouncilEntrance();
    updatePartnersEntrance();
    
    // Start rotating words when Vision page is in view
    if (visionPage && !rotatingWordsStarted && visionContent) {
      const rect = visionPage.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if Vision page is visible (at least 30% in viewport)
      if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
        if (window.startRotatingWords) {
          window.startRotatingWords();
          rotatingWordsStarted = true;
          console.log('Rotating words animation started');
        }
      }
    }
  }
  
  /**
   * Update Advisory Council (Step 5) entrance/exit animation
   * Content scrolls with page; exit when Partners (step 6) approaches
   */
  function updateCouncilEntrance() {
    const councilPage = document.querySelector('.wwd-step-5');
    const councilWrapper = councilPage ? councilPage.querySelector('.wwd-council-wrapper') : null;
    const nextStep = document.querySelector('.wwd-step-6');
    if (!councilPage || !councilWrapper) return;

    const rect = councilPage.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const entranceZone = viewportHeight * 0.4;
    const exitZoneHeight = viewportHeight * 0.5;
    const distanceIntoViewport = viewportHeight - rect.top;

    if (nextStep) {
      const nextRect = nextStep.getBoundingClientRect();
      const nextTopInExitZone = nextRect.top <= viewportCenter + exitZoneHeight && nextRect.top >= viewportCenter - exitZoneHeight;
      const nextPastCenter = nextRect.top < viewportCenter - exitZoneHeight;
      if (nextTopInExitZone) {
        const exitProgress = Math.max(0, Math.min(1, (viewportCenter + exitZoneHeight - nextRect.top) / (2 * exitZoneHeight)));
        councilWrapper.style.opacity = 1 - exitProgress;
        councilWrapper.style.transform = `translateY(${exitProgress * 30}px)`;
        return;
      }
      if (nextPastCenter) {
        councilWrapper.style.opacity = '0';
        councilWrapper.style.transform = 'translateY(30px)';
        return;
      }
    }

    if (rect.top < viewportHeight && (rect.top < viewportCenter || rect.bottom > viewportCenter)) {
      if (distanceIntoViewport < entranceZone && distanceIntoViewport > 0) {
        const progress = Math.min(1, distanceIntoViewport / entranceZone);
        councilWrapper.style.opacity = progress;
        councilWrapper.style.transform = `translateY(${(1 - progress) * 30}px)`;
      } else {
        councilWrapper.style.opacity = '1';
        councilWrapper.style.transform = 'translateY(0)';
      }
    } else if (rect.top >= viewportHeight) {
      councilWrapper.style.opacity = '0';
      councilWrapper.style.transform = 'translateY(30px)';
    }
  }
  
  /**
   * Update Partners (Step 6) entrance/exit animation
   * Content scrolls with page; exit when step 7 (footer) approaches
   */
  function updatePartnersEntrance() {
    const partnersPage = document.querySelector('.wwd-step-6');
    const partnersWrapper = partnersPage ? partnersPage.querySelector('.wwd-partners-wrapper') : null;
    const nextStep = document.querySelector('.wwd-step-7');
    if (!partnersPage || !partnersWrapper) return;

    const rect = partnersPage.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const entranceZone = viewportHeight * 0.4;
    const exitZoneHeight = viewportHeight * 0.5;
    const distanceIntoViewport = viewportHeight - rect.top;

    if (nextStep) {
      const nextRect = nextStep.getBoundingClientRect();
      const nextTopInExitZone = nextRect.top <= viewportCenter + exitZoneHeight && nextRect.top >= viewportCenter - exitZoneHeight;
      const nextPastCenter = nextRect.top < viewportCenter - exitZoneHeight;
      if (nextTopInExitZone) {
        const exitProgress = Math.max(0, Math.min(1, (viewportCenter + exitZoneHeight - nextRect.top) / (2 * exitZoneHeight)));
        partnersWrapper.style.opacity = 1 - exitProgress;
        partnersWrapper.style.transform = `translateY(${exitProgress * 30}px)`;
        return;
      }
      if (nextPastCenter) {
        partnersWrapper.style.opacity = '0';
        partnersWrapper.style.transform = 'translateY(30px)';
        return;
      }
    }

    if (rect.top < viewportHeight && (rect.top < viewportCenter || rect.bottom > viewportCenter)) {
      if (distanceIntoViewport < entranceZone && distanceIntoViewport > 0) {
        const progress = Math.min(1, distanceIntoViewport / entranceZone);
        partnersWrapper.style.opacity = progress;
        partnersWrapper.style.transform = `translateY(${(1 - progress) * 30}px)`;
      } else {
        partnersWrapper.style.opacity = '1';
        partnersWrapper.style.transform = 'translateY(0)';
      }
    } else if (rect.top >= viewportHeight) {
      partnersWrapper.style.opacity = '0';
      partnersWrapper.style.transform = 'translateY(30px)';
    }
  }
  
  /**
   * Update The How page entrance/exit animation
   * Content is in FIXED container - positioned 100px below nav
   * Content STAYS LOCKED in position while cycling through 4 pillars
   */
  function updateHowPageEntrance() {
    const howPage = document.querySelector('.wwd-step-3');
    const howContent = document.querySelector('.wwd-how-content-fixed');
    
    if (!howPage || !howContent) return;
    
    const rect = howPage.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Show content earlier - when How page top enters bottom 30% of viewport
    const earlyTriggerPoint = viewportHeight * 0.7;
    const howPageEntering = rect.top < earlyTriggerPoint && rect.bottom > 0;
    const howPageActive = rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5;
    
    // Calculate scroll progress through page
    const scrollProgress = Math.max(0, -rect.top / (howPage.offsetHeight - viewportHeight));
    
    if (howPageEntering) {
      // How page is entering or active
      
      const exitStartProgress = 0.90; // Start exit later to give more time for pillars
      const exitEndProgress = 0.99;
      
      if (scrollProgress > exitStartProgress) {
        // Exiting - fade out and slide up
        const exitProgress = 1 - ((scrollProgress - exitStartProgress) / (exitEndProgress - exitStartProgress));
        const opacity = Math.max(0, Math.min(1, exitProgress));
        
        howContent.style.opacity = opacity;
        howContent.style.transform = `translateX(-50%) translateY(${-(1 - opacity) * 30}px)`;
        howContent.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      } else if (!howPageActive && rect.top > 0) {
        // ENTRANCE phase - fading in as page enters
        const entranceProgress = 1 - (rect.top / earlyTriggerPoint);
        const opacity = Math.max(0, Math.min(1, entranceProgress));
        
        howContent.style.opacity = opacity;
        howContent.style.transform = `translateX(-50%) translateY(${(1 - opacity) * 20}px)`;
        howContent.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      } else {
        // Content LOCKED in position - no parallax/scrolling movement
        howContent.style.opacity = '1';
        howContent.style.transform = 'translateX(-50%)';
        howContent.style.pointerEvents = 'auto';
      }
    } else {
      // Not visible
      if (rect.top >= earlyTriggerPoint) {
        // Before entering - hidden
        howContent.style.opacity = '0';
        howContent.style.transform = 'translateX(-50%) translateY(30px)';
        howContent.style.pointerEvents = 'none';
      } else {
        // After exiting - hidden above
        howContent.style.opacity = '0';
        howContent.style.transform = 'translateX(-50%) translateY(-30px)';
        howContent.style.pointerEvents = 'none';
      }
    }
  }
  
  /**
   * Update pillar state based on scroll progress through The How page
   */
  function updatePillarScrollProgress() {
    const howPage = document.querySelector('.wwd-step-3');
    if (!howPage) return;
    
    const rect = howPage.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    
    // Only update if How page is active
    const isHowActive = rect.top < viewportCenter && rect.bottom > viewportCenter;
    if (!isHowActive) return;
    
    // Calculate scroll progress (0 to 1)
    const scrollProgress = Math.max(0, Math.min(1, -rect.top / (howPage.offsetHeight - viewportHeight)));
    
    // Divide into 4 sections for 4 pillars (with entrance and exit zones)
    // 0-15% = entrance, 15-70% = pillars, 70-100% = exit
    const pillarZoneStart = 0.15;
    const pillarZoneEnd = 0.70;
    
    if (scrollProgress >= pillarZoneStart && scrollProgress <= pillarZoneEnd) {
      const pillarProgress = (scrollProgress - pillarZoneStart) / (pillarZoneEnd - pillarZoneStart);
      const pillarNum = Math.min(4, Math.floor(pillarProgress * 4) + 1);
      
      if (typeof updatePillarState === 'function') {
        updatePillarState(pillarNum);
      }
    }
  }
  
  /**
   * Update Hub page (Step 4) entrance/exit animation
   * Content in document flow - scrolls with page; exit when Leadership (step 5) approaches
   */
  function updateHubEntrance() {
    const hubPage = document.querySelector('.wwd-step-4');
    const hubWrapper = hubPage ? hubPage.querySelector('.wwd-hub-wrapper') : null;
    const nextStep = document.querySelector('.wwd-step-5');
    if (!hubPage || !hubWrapper) return;

    const rect = hubPage.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const entranceZone = viewportHeight * 0.4;
    const exitZoneHeight = viewportHeight * 0.5;
    const distanceIntoViewport = viewportHeight - rect.top;

    if (nextStep) {
      const nextRect = nextStep.getBoundingClientRect();
      const nextTopInExitZone = nextRect.top <= viewportCenter + exitZoneHeight && nextRect.top >= viewportCenter - exitZoneHeight;
      const nextPastCenter = nextRect.top < viewportCenter - exitZoneHeight;
      if (nextTopInExitZone) {
        const exitProgress = Math.max(0, Math.min(1, (viewportCenter + exitZoneHeight - nextRect.top) / (2 * exitZoneHeight)));
        hubWrapper.style.opacity = 1 - exitProgress;
        hubWrapper.style.transform = `translateY(${exitProgress * 30}px)`;
        return;
      }
      if (nextPastCenter) {
        hubWrapper.style.opacity = '0';
        hubWrapper.style.transform = 'translateY(30px)';
        return;
      }
    }

    if (rect.top < viewportHeight && (rect.top < viewportCenter || rect.bottom > viewportCenter)) {
      if (distanceIntoViewport < entranceZone && distanceIntoViewport > 0) {
        const progress = Math.min(1, distanceIntoViewport / entranceZone);
        hubWrapper.style.opacity = progress;
        hubWrapper.style.transform = `translateY(${(1 - progress) * 30}px)`;
      } else {
        hubWrapper.style.opacity = '1';
        hubWrapper.style.transform = 'translateY(0)';
      }
    } else if (rect.top >= viewportHeight) {
      hubWrapper.style.opacity = '0';
      hubWrapper.style.transform = 'translateY(30px)';
    }
  }
  
  /**
   * Update Mission page entrance animation
   * Text fades in while moving up, fades out BEFORE Vision enters
   */
  function updateMissionEntrance() {
    if (!missionPage || !missionText) return;
    
    const rect = missionPage.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    
    // Check if Mission page covers the center of viewport
    const isMissionActive = rect.top < viewportCenter && rect.bottom > viewportCenter;
    
    // Calculate how much of Mission page is visible from top
    const visibleFromTop = viewportHeight - rect.top;
    const entranceThreshold = viewportHeight * 0.25; // 25vh to fully reveal (match Vision)
    
    // Exit threshold - start fading out well before Vision page arrives
    const exitThreshold = viewportHeight * 0.5; // Start exit when 50vh from bottom
    
    if (!isMissionActive) {
      // Mission is not the active page - hide it
      missionText.style.opacity = '0';
      missionText.style.pointerEvents = 'none';
      missionText.classList.remove('visible');
      return;
    }
    
    // Check if we're near the exit (bottom of Mission approaching viewport)
    if (rect.bottom < viewportHeight + exitThreshold && rect.bottom > viewportCenter) {
      // Calculate exit progress - fade out as we approach Vision
      const distanceToExit = rect.bottom - viewportCenter;
      const exitProgress = Math.min(1, distanceToExit / exitThreshold);
      
      missionText.style.opacity = exitProgress;
      missionText.style.transform = `translateY(calc(-50% - ${(1 - exitProgress) * 30}px))`;
      missionText.style.pointerEvents = exitProgress > 0.5 ? 'auto' : 'none';
    }
    // Check entrance
    else if (visibleFromTop > 0 && visibleFromTop < entranceThreshold) {
      // Calculate entrance progress (0 to 1)
      const progress = visibleFromTop / entranceThreshold;
      
      // Text fades in and moves up
      missionText.style.opacity = progress;
      missionText.style.transform = `translateY(calc(-50% + ${(1 - progress) * 30}px))`;
      missionText.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
      missionText.classList.add('visible');
    } else if (visibleFromTop >= entranceThreshold) {
      // Fully visible (including when at top of section)
      missionText.style.opacity = '1';
      missionText.style.transform = 'translateY(-50%)';
      missionText.style.pointerEvents = 'auto';
      missionText.classList.add('visible');
    } else if (rect.top <= 0 && rect.bottom > viewportHeight) {
      // At very top of section (scroll = 0), should be fully visible
      missionText.style.opacity = '1';
      missionText.style.transform = 'translateY(-50%)';
      missionText.style.pointerEvents = 'auto';
      missionText.classList.add('visible');
    } else {
      // Not visible yet
      missionText.style.opacity = '0';
      missionText.style.transform = 'translateY(calc(-50% + 30px))';
      missionText.style.pointerEvents = 'none';
      missionText.classList.remove('visible');
    }
  }
  
  /**
   * Update Vision page entrance animation
   * Text is FIXED at vertical center - only fades in/out
   * Only starts appearing AFTER Mission is fully gone
   * Starts fading out when background is near top of screen
   */
  function updateVisionEntrance() {
    if (!visionPage || !visionContent) {
      return;
    }
    
    const rect = visionPage.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    
    // Check if Vision page covers the center of viewport
    const isVisionActive = rect.top < viewportCenter && rect.bottom > viewportCenter;
    
    // Only start showing Vision when its TOP has crossed the viewport center
    const visionTopPastCenter = rect.top < viewportCenter;
    
    // Calculate scroll progress through Vision page
    const scrollProgress = -rect.top / (visionPage.offsetHeight - viewportHeight);
    
    if (isVisionActive && visionTopPastCenter) {
      // Vision is active - show content
      
      // Calculate entrance progress (0 to 1 as Vision top moves past center)
      const distancePastCenter = viewportCenter - rect.top;
      const entranceZone = viewportHeight * 0.25; // 25vh to fully fade in
      
      // Start exit earlier - when 50% through the page (background near top)
      const exitStartProgress = 0.5; // Start fading at 50% through page
      const exitEndProgress = 0.8; // Fully faded by 80%
      
      if (scrollProgress > exitStartProgress) {
        // Exiting - fade out based on scroll progress
        const exitProgress = 1 - ((scrollProgress - exitStartProgress) / (exitEndProgress - exitStartProgress));
        const opacity = Math.max(0, Math.min(1, exitProgress));
        
        visionContent.style.opacity = opacity;
        visionContent.style.transform = `translate(-50%, calc(-50% - ${(1 - opacity) * 30}px))`;
        visionContent.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      } else if (distancePastCenter < entranceZone && distancePastCenter > 0) {
        // Entrance - fading in
        const progress = distancePastCenter / entranceZone;
        visionContent.style.opacity = progress;
        visionContent.style.transform = `translate(-50%, calc(-50% + ${(1 - progress) * 30}px))`;
        visionContent.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
      } else {
        // Fully visible
        visionContent.style.opacity = '1';
        visionContent.style.transform = 'translate(-50%, -50%)';
        visionContent.style.pointerEvents = 'auto';
      }
    } else {
      // Vision is not active - hide content
      visionContent.style.opacity = '0';
      visionContent.style.pointerEvents = 'none';
      
      if (rect.top >= viewportCenter) {
        // Before entering
        visionContent.style.transform = 'translate(-50%, calc(-50% + 30px))';
      } else {
        // After exiting
        visionContent.style.transform = 'translate(-50%, calc(-50% - 30px))';
      }
    }
  }
  
  // Listen to WWD section scroll (primary container)
  wwdSection.addEventListener('scroll', handleScroll, { passive: true });
  
  // Also listen to window scroll for initial load
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Our Impact section: update progress bar and Decade of Work fixed content when scrolling
  const impactSection = document.getElementById('our-impact');
  initDecadeBuilderPhotos();
  if (impactSection) {
    impactSection.addEventListener('scroll', () => {
      updateImpactPageTitleFade();
      requestAnimationFrame(updateDecadeEntrance);
      requestAnimationFrame(updateBuilderPhotosExit);
      requestAnimationFrame(updateNYTEntrance);
      requestAnimationFrame(updateStatsEntrance);
      requestAnimationFrame(updateEconomicImpactEntrance);
      requestAnimationFrame(updateBuildersStoriesExit);
    }, { passive: true });
  }
  
  // Initial update
  handleScroll();
  if (impactSection && impactSection.classList.contains('active')) {
    requestAnimationFrame(() => {
      updateImpactPageTitleFade();
      updateDecadeEntrance();
      updateBuilderPhotosExit();
      updateNYTEntrance();
      updateStatsEntrance();
      updateEconomicImpactEntrance();
      updateBuildersStoriesExit();
    });
  }

  console.log('Advanced page transitions initialized');
}

function initSectionScrollBoundaries() {
  const sections = [
    document.querySelector('.wwd'),             // What We Do
    document.querySelector('.builder-stories'), // Our Impact
    document.querySelector('.urgency')          // The Urgency
  ];
  
  sections.forEach(section => {
    if (!section) return;
    
    let bounceTimeout = null;
    let isBouncing = false;
    let lastBounceTime = 0;
    const BOUNCE_COOLDOWN = 1500; // Prevent re-trigger for 1.5s after bounce
    
    section.addEventListener('scroll', (e) => {
      const maxScroll = section.scrollHeight - section.clientHeight;
      const currentScroll = section.scrollTop;
      const atBottom = Math.abs(maxScroll - currentScroll) < 5;
      const now = Date.now();
      const inCooldown = (now - lastBounceTime) < BOUNCE_COOLDOWN;
      
      if (atBottom && !bounceTimeout && !isBouncing && !inCooldown) {
        isBouncing = true;
        lastBounceTime = now;
        
        // Trigger bounce animation
        section.classList.add('bounce-bottom');
        
        bounceTimeout = setTimeout(() => {
          section.classList.remove('bounce-bottom');
          
          // Ensure we're at the true bottom after bounce
          requestAnimationFrame(() => {
            const trueBottom = section.scrollHeight - section.clientHeight;
            if (section.scrollTop !== trueBottom) {
              section.scrollTop = trueBottom;
            }
            isBouncing = false;
          });
          
          bounceTimeout = null;
        }, 500);
      }
    });
    
    // REMOVED: Bottom-of-section wheel blocking - allow natural scroll behavior
  });
}

// Initialize scroll boundaries
initSectionScrollBoundaries();

/**
 * Hide What We Do fixed overlays so they do not persist when switching to another section.
 * Also resets impact step index so progress bar re-renders when switching back to Our Impact.
 */
function hideWwdFixedContent() {
  const titlesFixed = document.getElementById('wwd-titles-fixed');
  const visionContent = document.querySelector('.wwd-vision-content-fixed');
  const howContent = document.querySelector('.wwd-how-content-fixed');
  const missionText = document.querySelector('.wwd-mission-text-fixed');
  [titlesFixed, visionContent, howContent, missionText].forEach((el) => {
    if (el) {
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    }
  });
  // Reset impact step index so progress bar re-renders on next visit
  _lastImpactStepIndex = -1;
}

/**
 * Hide Our Impact fixed overlays and reset state when leaving the section.
 */
function hideImpactFixedContent() {
  // Hide the fixed decade content
  const decadeContent = document.getElementById('impact-decade-content-fixed');
  if (decadeContent) {
    decadeContent.style.opacity = '0';
    decadeContent.style.pointerEvents = 'none';
    decadeContent.classList.remove('decade-entrance-animate');
  }
  
  const nytContentFixed = document.getElementById('nyt-content-fixed');
  if (nytContentFixed) {
    nytContentFixed.style.opacity = '0';
  }
  
  // Hide progress bar so it doesn't stick when leaving Our Impact (e.g. logo click)
  const titlesFixed = document.getElementById('wwd-titles-fixed');
  if (titlesFixed) {
    titlesFixed.style.opacity = '0';
    titlesFixed.style.pointerEvents = 'none';
  }
  
  // Reset entrance animation flags so they play again on next visit
  _decadeEntrancePlayed = false;
  
  // Reset WWD step index for progress bar
  _lastTitleStepIndex = -1;
}

/**
 * Reset What We Do section to initial state (scroll position and fixed content).
 */
function resetWwdSection() {
  const wwdSection = document.getElementById('what-we-do');
  if (wwdSection) {
    // Force scroll to very top using multiple methods
    wwdSection.scrollTop = 0;
    wwdSection.scrollTo(0, 0);
  }
  
  // Reset fixed content inline styles so scroll-based animations can work again
  const titlesFixed = document.getElementById('wwd-titles-fixed');
  const visionContent = document.querySelector('.wwd-vision-content-fixed');
  const howContent = document.querySelector('.wwd-how-content-fixed');
  const missionText = document.querySelector('.wwd-mission-text-fixed');
  
  // Titles - clear to let scroll logic take over
  if (titlesFixed) {
    titlesFixed.style.opacity = '';
    titlesFixed.style.pointerEvents = '';
    titlesFixed.style.transform = '';
  }
  
  // Vision and How should be HIDDEN at scroll 0 (not visible until user scrolls)
  // Explicitly set opacity 0 to prevent flash before scroll logic runs
  if (visionContent) {
    visionContent.style.opacity = '0';
    visionContent.style.pointerEvents = 'none';
    visionContent.style.transform = 'translate(-50%, calc(-50% + 30px))';
  }
  if (howContent) {
    howContent.style.opacity = '0';
    howContent.style.pointerEvents = 'none';
  }
  
  // Mission should be VISIBLE at scroll 0 - clear to default/let scroll logic show it
  if (missionText) {
    missionText.style.opacity = '';
    missionText.style.pointerEvents = '';
    missionText.style.transform = '';
    missionText.classList.add('visible');
  }
  
  // Reset title step index so progress bar re-renders
  _lastTitleStepIndex = -1;
}

/**
 * Reset Our Impact section to initial state (scroll position and animations).
 */
function resetImpactSection() {
  const impactSection = document.getElementById('our-impact');
  if (impactSection) {
    // Force scroll to very top using multiple methods
    impactSection.scrollTop = 0;
    impactSection.scrollTo(0, 0);
  }
  
  // Reset decade entrance state
  _decadeEntrancePlayed = false;
  
  // Reset builder photos exit state
  const bgContainer = document.getElementById('impact-decade-bg');
  if (bgContainer) {
    bgContainer.style.opacity = '';
    bgContainer.style.transition = '';
  }
  
  // Reset individual builder photo opacity (they will fade in again via intersection observer)
  const photos = document.querySelectorAll('.builder-photo');
  photos.forEach(photo => {
    photo.style.opacity = '0';
  });
  
  // Reset the fixed decade content
  const decadeContent = document.getElementById('impact-decade-content-fixed');
  if (decadeContent) {
    decadeContent.style.opacity = '';
    decadeContent.style.transform = '';
    decadeContent.classList.remove('decade-entrance-animate');
  }
  
  // Reset NYT fixed content
  const nytContentFixed = document.getElementById('nyt-content-fixed');
  if (nytContentFixed) {
    nytContentFixed.style.opacity = '0';
  }
  
  // Reset real people (demography) content
  const realPeopleContent = document.querySelector('.real-people-content');
  if (realPeopleContent) {
    realPeopleContent.style.opacity = '';
    realPeopleContent.style.transform = '';
  }
  
  // Reset economic impact content
  const economicContent = document.querySelector('.economic-impact-content');
  if (economicContent) {
    economicContent.style.opacity = '';
    economicContent.style.transform = '';
  }
}

/**
 * Section Switching - Switch between independent sections via navigation
 */
function initSectionSwitching() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
  const sectionPages = document.querySelectorAll('.section-page');
  const nav = document.querySelector('.nav');
  
  // Set initial background overlay state based on currently active section
  const bgOverlay = document.getElementById('section-bg-overlay');
  const impactSection = document.getElementById('our-impact');
  if (bgOverlay && impactSection && impactSection.classList.contains('active')) {
    bgOverlay.classList.add('our-impact-active');
  }
  
  // Function to show nav for section pages
  function showNavForSectionPage() {
    // Only show nav if video intro is complete
    if (!document.body.classList.contains('video-complete')) {
      return;
    }
    
    if (nav) {
      nav.classList.remove('hidden-on-video');
      nav.classList.add('logo-at-top'); // Add to nav for link visibility
      nav.style.opacity = '1';
      nav.style.visibility = 'visible';
      nav.style.pointerEvents = 'auto';
      document.body.classList.add('logo-at-top');
    }
  }
  
  // Only show nav if video is complete and section-page is active
  const isVideoComplete = document.body.classList.contains('video-complete');
  const activeSection = document.querySelector('.section-page.active');
  if (isVideoComplete && activeSection) {
    showNavForSectionPage();
  }
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      const targetId = href.substring(1); // Remove #
      const targetSection = document.getElementById(targetId);
      
      // Only handle section-page elements
      if (targetSection && targetSection.classList.contains('section-page')) {
        e.preventDefault();
        
        // Determine which section we're leaving
        const currentSection = document.querySelector('.section-page.active');
        const leavingImpact = currentSection && currentSection.id === 'our-impact';
        const leavingWwd = currentSection && currentSection.id === 'what-we-do';
        
        // Hide fixed content of sections we're leaving (so it doesn't persist on the next section)
        if (leavingImpact) {
          hideImpactFixedContent();
        }
        if (leavingWwd) {
          hideWwdFixedContent();
        }
        
        // Start background color transition
        const bgOverlay = document.getElementById('section-bg-overlay');
        if (bgOverlay) {
          if (targetId === 'our-impact') {
            bgOverlay.classList.add('our-impact-active');
          } else {
            bgOverlay.classList.remove('our-impact-active');
          }
        }
        
        // Fade out current section content, then switch
        if (currentSection) {
          currentSection.style.transition = 'opacity 0.5s ease-out';
          currentSection.style.opacity = '0';
        }
        
        // After fade out, switch sections and fade in
        setTimeout(() => {
          // Remove active from all section-pages. Only clear opacity/transition on the
          // target section so the section we're leaving stays at opacity 0 and never flashes.
          sectionPages.forEach(section => {
            section.classList.remove('active');
            if (section === targetSection) {
              section.style.opacity = '';
              section.style.transition = '';
            }
          });

          // Reset target section to initial state before showing
          if (targetId === 'our-impact') {
            resetImpactSection();
          } else if (targetId === 'what-we-do') {
            resetWwdSection();
          }
          
          // Force scroll to top multiple times to ensure it sticks
          targetSection.scrollTop = 0;
          targetSection.scrollTo(0, 0);

          // When switching to WWD, hide all steps so they don't flash before updatePageTransitions runs
          if (targetId === 'what-we-do') {
            document.querySelectorAll('.wwd-step').forEach((step) => {
              step.style.opacity = '0';
              step.style.transform = 'translateY(-30px)';
            });
          }

          // Add active to target section with fade-in
          targetSection.style.opacity = '0';
          targetSection.classList.add('active');
          
          // Force scroll to top again after becoming active
          targetSection.scrollTop = 0;
          targetSection.scrollTo(0, 0);
          
          // Trigger reflow, then fade in
          targetSection.offsetHeight;
          targetSection.style.transition = 'opacity 0.5s ease-in';
          targetSection.style.opacity = '1';
          
          // Clean up inline styles after animation
          setTimeout(() => {
            targetSection.style.opacity = '';
            targetSection.style.transition = '';
          }, 500);
          
          // Update progress bar and animations for the active section
          // Use a small delay to ensure scroll position is set first
          setTimeout(() => {
            if (targetId === 'our-impact') {
              initDecadeBuilderPhotos();
              updateImpactPageTitleFade();
              updateDecadeEntrance();
              updateBuilderPhotosExit();
              updateNYTEntrance();
              updateStatsEntrance();
              updateEconomicImpactEntrance();
              updateBuildersStoriesExit();
            } else if (targetId === 'what-we-do') {
              // Trigger all WWD update functions to properly show content
              updatePageTitleFade();
              updatePageTransitions();
            }
          }, 50);
        }, 500); // Wait for fade out
        
        // Show nav when on section pages
        showNavForSectionPage();
        
        // Update active nav state
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
        
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if (hamburger) hamburger.classList.remove('active');
        }
        
        console.log('Switching to section:', targetId);
      }
    });
  });
  
  console.log('Section switching initialized for', sectionPages.length, 'sections');
}

// Initialize section switching
initSectionSwitching();

/**
 * Stagger Animations - Auto-loading animations for multi-element pages
 * Elements load in sequence when page enters viewport (not scroll-dependent)
 */
function initStaggerAnimations() {
  // Track which pages have been animated
  const animatedPages = {
    step3: false, // The How - pillars
    step4: false, // The Hub - gallery
    step5: false, // Advisory Council - cards
    step6: false  // Partners - cards
  };
  
  // Add stagger-item class to elements
  function setupStaggerItems() {
    // Step 3: How page elements (headline, pillars, description, arrows)
    const howHeadline = document.querySelector('.wwd-how-content-fixed .wwd-initiatives-headline');
    if (howHeadline) howHeadline.classList.add('stagger-item', 'stagger-how-headline');
    
    const pillarItems = document.querySelectorAll('.wwd-how-content-fixed .wwd-initiative-item');
    pillarItems.forEach(item => item.classList.add('stagger-item', 'stagger-how-pillar'));
    
    const pillarDescs = document.querySelectorAll('.wwd-how-content-fixed .wwd-initiative-desc');
    pillarDescs.forEach(desc => desc.classList.add('stagger-item', 'stagger-how-desc'));
    
    const arrows = document.querySelectorAll('.wwd-how-content-fixed .initiative-arrow-line, .wwd-how-content-fixed .initiative-arrowhead');
    arrows.forEach(arrow => arrow.classList.add('stagger-item', 'stagger-how-arrow'));
    
    // Step 4: Hub elements (headline, body, gallery)
    const hubHeadline = document.querySelector('.wwd-step-4 .wwd-hub-headline');
    if (hubHeadline) hubHeadline.classList.add('stagger-item', 'stagger-hub-headline');
    
    const hubBody = document.querySelector('.wwd-step-4 .wwd-hub-body');
    if (hubBody) hubBody.classList.add('stagger-item', 'stagger-hub-body');
    
    const galleryImages = document.querySelectorAll('#wwd-hub-gallery .wwd-hub-image');
    galleryImages.forEach(img => img.classList.add('stagger-item', 'stagger-hub-gallery'));
    
    // Step 5: Council elements (headline, description, cards)
    const councilHeadline = document.querySelector('.wwd-step-5 .wwd-council-headline');
    if (councilHeadline) councilHeadline.classList.add('stagger-item', 'stagger-council-headline');
    
    const councilDesc = document.querySelector('.wwd-step-5 .wwd-council-description');
    if (councilDesc) councilDesc.classList.add('stagger-item', 'stagger-council-desc');
    
    const councilCards = document.querySelectorAll('.wwd-step-5 .council-card');
    councilCards.forEach(card => card.classList.add('stagger-item', 'stagger-council-card'));
    
    // Step 6: Partners elements (headline, description, cards)
    const partnersHeadline = document.querySelector('.wwd-step-6 .wwd-partners-headline');
    if (partnersHeadline) partnersHeadline.classList.add('stagger-item', 'stagger-partners-headline');
    
    const partnersDesc = document.querySelector('.wwd-step-6 .wwd-partners-description');
    if (partnersDesc) partnersDesc.classList.add('stagger-item', 'stagger-partners-desc');
    
    const partnerCards = document.querySelectorAll('.wwd-step-6 .partner-card');
    partnerCards.forEach(card => card.classList.add('stagger-item', 'stagger-partners-card'));
  }
  
  // Trigger sequential animation for How page
  // Sequence: 1. Headline → 2. Pillars → 3. First description → 4. Arrows
  function triggerHowSequence() {
    let delay = 0;
    const baseDelay = 100;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-how-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 2. Four pillar categories (staggered)
    const pillars = document.querySelectorAll('.stagger-how-pillar');
    pillars.forEach((pillar, i) => {
      setTimeout(() => pillar.classList.add('stagger-revealed'), delay + i * baseDelay);
    });
    delay += pillars.length * baseDelay + 150;
    
    // 3. First pillar description
    const firstDesc = document.querySelector('.wwd-initiative-desc[data-initiative="1"]');
    if (firstDesc) {
      setTimeout(() => firstDesc.classList.add('stagger-revealed'), delay);
      delay += 150;
    }
    
    // 4. Arrows (only the active one)
    const activeArrows = document.querySelectorAll('.initiative-arrow-line[data-arrow="1"], .initiative-arrowhead[data-arrow="1"]');
    activeArrows.forEach(arrow => {
      setTimeout(() => arrow.classList.add('stagger-revealed'), delay);
    });
    
    console.log('How page sequence triggered');
  }
  
  // Trigger sequential animation for Hub page
  // Sequence: 1. Headline → 2. Body copy → 3. Images (grid order)
  function triggerHubSequence() {
    let delay = 0;
    const baseDelay = 100;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-hub-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 2. Body copy
    const body = document.querySelector('.stagger-hub-body');
    if (body) {
      setTimeout(() => body.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 3. Gallery images (left-right, top-bottom)
    const images = document.querySelectorAll('.stagger-hub-gallery');
    images.forEach((img, i) => {
      setTimeout(() => img.classList.add('stagger-revealed'), delay + i * 120);
    });
    
    console.log('Hub page sequence triggered');
  }
  
  // Trigger sequential animation for Council page
  // Sequence: 1. Headline → 2. Description → 3. Cards
  function triggerCouncilSequence() {
    let delay = 0;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-council-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 2. Description
    const desc = document.querySelector('.stagger-council-desc');
    if (desc) {
      setTimeout(() => desc.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 3. Cards
    const cards = document.querySelectorAll('.stagger-council-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('stagger-revealed'), delay + i * 100);
    });
    
    console.log('Council page sequence triggered');
  }
  
  // Trigger sequential animation for Partners page
  // Sequence: 1. Headline → 2. Description → 3. Cards per category
  function triggerPartnersSequence() {
    let delay = 0;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-partners-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 2. Description
    const desc = document.querySelector('.stagger-partners-desc');
    if (desc) {
      setTimeout(() => desc.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 3. Cards per category
    const partnersPage = document.querySelector('.wwd-step-6');
    if (partnersPage) {
      const categories = partnersPage.querySelectorAll('.partners-category');
      categories.forEach(category => {
        const cards = category.querySelectorAll('.partner-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('stagger-revealed'), delay + i * 60);
        });
        delay += cards.length * 60 + 150;
      });
    }
    
    console.log('Partners page sequence triggered');
  }
  
  // Check which pages are active and trigger animations
  function checkAndTriggerStagger() {
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    
    // Step 3: The How - trigger EARLIER (when top enters bottom half of viewport)
    const howPage = document.querySelector('.wwd-step-3');
    if (howPage && !animatedPages.step3) {
      const rect = howPage.getBoundingClientRect();
      // Trigger when How page top enters the bottom 30% of viewport (earlier trigger)
      const earlyTriggerPoint = viewportHeight * 0.7;
      if (rect.top < earlyTriggerPoint && rect.bottom > 0) {
        animatedPages.step3 = true;
        triggerHowSequence();
      }
    }
    
    // Step 4: The Hub
    const hubPage = document.querySelector('.wwd-step-4');
    if (hubPage && !animatedPages.step4) {
      const rect = hubPage.getBoundingClientRect();
      // Trigger when Hub page top crosses viewport center
      if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
        animatedPages.step4 = true;
        triggerHubSequence();
      }
    }
    
    // Step 5: Advisory Council
    const councilPage = document.querySelector('.wwd-step-5');
    if (councilPage && !animatedPages.step5) {
      const rect = councilPage.getBoundingClientRect();
      if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
        animatedPages.step5 = true;
        triggerCouncilSequence();
      }
    }
    
    // Step 6: Partners
    const partnersPage = document.querySelector('.wwd-step-6');
    if (partnersPage && !animatedPages.step6) {
      const rect = partnersPage.getBoundingClientRect();
      if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
        animatedPages.step6 = true;
        triggerPartnersSequence();
      }
    }
  }
  
  // Reset animations when scrolling back
  function resetStaggerIfNeeded() {
    const viewportHeight = window.innerHeight;
    
    // Reset Step 3 if scrolled before it
    const howPage = document.querySelector('.wwd-step-3');
    if (howPage && animatedPages.step3) {
      const rect = howPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.step3 = false;
        document.querySelectorAll('.wwd-how-content-fixed .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
    
    // Reset Step 4 if scrolled before it
    const hubPage = document.querySelector('.wwd-step-4');
    if (hubPage && animatedPages.step4) {
      const rect = hubPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.step4 = false;
        document.querySelectorAll('.wwd-step-4 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
    
    // Reset Step 5 if scrolled before it
    const councilPage = document.querySelector('.wwd-step-5');
    if (councilPage && animatedPages.step5) {
      const rect = councilPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.step5 = false;
        document.querySelectorAll('.wwd-step-5 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
    
    // Reset Step 6 if scrolled before it
    const partnersPage = document.querySelector('.wwd-step-6');
    if (partnersPage && animatedPages.step6) {
      const rect = partnersPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.step6 = false;
        document.querySelectorAll('.wwd-step-6 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
  }
  
  // Setup elements
  setupStaggerItems();
  
  // Listen for scroll to trigger animations
  const wwdSection = document.querySelector('.wwd');
  if (wwdSection) {
    wwdSection.addEventListener('scroll', () => {
      checkAndTriggerStagger();
      resetStaggerIfNeeded();
    }, { passive: true });
  }
  
  // Also listen to window scroll
  window.addEventListener('scroll', () => {
    checkAndTriggerStagger();
    resetStaggerIfNeeded();
  }, { passive: true });
  
  console.log('Stagger animations initialized');
}

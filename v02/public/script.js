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
  
  // AGGRESSIVE CLEANUP: Remove any stray logo elements and black images
  document.querySelectorAll('body > .video-header-logo').forEach(el => el.remove());
  document.querySelectorAll('.video-header-logo-placeholder').forEach(el => el.remove());
  
  // Skip video header - go straight to landing page
  // Set video-complete so CSS shows the landing page
  document.body.classList.add('video-complete');
  
  // Initialize landing page immediately
  initLandingPlaceholders();
  initLandingPageLayout();
  initLandingPageTransitions();
  
  // Start the landing page intro animation sequence
  initLandingAnimation();
  
  // Add resize listener for live responsive video layout
  let landingResizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(landingResizeTimeout);
    landingResizeTimeout = setTimeout(() => {
      updateLandingLayout();
    }, 16); // ~60fps for smooth real-time updates
  });
  
  initSectionTransitions();
  initRotatingWords();
  initLazyScrollReveal();
  initLogoAnimation();
  initScrollEffects();
  initFormHandling();
  initAnimations();
  initActiveNavTracking();
  initBuilderMoreButton();
  initBuilderVideoOverlay();
  initBuilderArticleOverlay();
  initGetInvolvedOverlay();
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
  
  // Pillar state removed - cards are self-contained
  
  // Initialize stagger animations for multi-element pages
  initStaggerAnimations();

  // Fallback: Document-level event delegation for "Get Involved" buttons
  // Ensures clicks are caught even if direct handlers fail due to stacking issues
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="get-involved"]');
    if (btn) {
      e.preventDefault();
      const overlay = document.getElementById('get-involved-overlay');
      if (overlay && overlay.hidden) {
        // Trigger the overlay open
        const formSection = document.getElementById('get-involved-form-section');
        const thanksSection = document.getElementById('get-involved-thanks');
        if (formSection) formSection.hidden = false;
        if (thanksSection) thanksSection.hidden = true;
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
        const firstInput = overlay.querySelector('input');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
      }
    }
  });
});

/**
 * Keep body background in sync with section overlay so site and page background always match.
 */
function syncBodyBackgroundToOverlay() {
  const overlay = document.getElementById('section-bg-overlay');
  if (!overlay) return;
  document.body.classList.toggle('urgency-active', overlay.classList.contains('urgency-active'));
  document.body.classList.toggle('our-impact-active', overlay.classList.contains('our-impact-active'));
}

// Pillar state functions removed - cards are self-contained and don't need active state switching or arrow positioning

/**
 * Section Snapping - Programmatic snap to sections on scroll
 */
// Global flag for snap-back state
let isSnappingBack = false;

function initSectionSnapping() {
  const videoHeader = document.querySelector('.video-header');
  const videoPlayer = videoHeader ? videoHeader.querySelector('.video-header-player') : null;
  const contentWrapper = videoHeader ? videoHeader.querySelector('.video-header-content-wrapper') : null;
  
  if (!videoHeader || !videoPlayer || !contentWrapper) return;
  
  const videoHeaderHeight = videoHeader.offsetHeight;
  let isAnimating = false;
  let hasDetectedSwipe = false;
  let swipeDirection = 0;
  
  function animateLogoToTop() {
    if (isAnimating) return;
    isAnimating = true;
    
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
      // Video transition complete - show landing page instead of mission
      // CSS rules using body.video-complete:not(.landing-complete) handle hiding
      // sections, nav, footer, and mission content automatically
      document.body.classList.add('video-complete');
      
      // Initialize landing page placeholders
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initLandingPlaceholders();
        });
      });
      
      // Reset everything
      isAnimating = false;
      hasDetectedSwipe = false;
      if (contentWrapper) {
        contentWrapper.style.transform = '';
        contentWrapper.style.transition = '';
      }
      
      // Initialize landing page wheel-based transitions
      initLandingPageTransitions();
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
    // FIRST CHECK: If video transition is complete, NEVER block scroll
    if (document.body.classList.contains('video-complete')) {
      return; // Allow natural scroll - don't call preventDefault
    }
    
    const currentScroll = window.scrollY;
    
    // Prevent scrolling past target during animation (only before video-complete)
    if (isAnimating) {
      e.preventDefault();
      return;
    }
    
    // Only intercept if we're at the top and not already animating
    if (currentScroll === 0 && !hasDetectedSwipe) {
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
    
    // Snap back to header if any part of video is visible (only BEFORE video transition completes)
    if (currentScroll > 0 && currentScroll < videoHeaderHeight && !isAnimating && !isManualScrolling && !document.body.classList.contains('video-complete')) {
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
  // Note: .press-quote and .real-people are NOT observed here anymore
  // They're inside steps 5-9 which handle their own visibility via stagger animations
  const sections = document.querySelectorAll('.video-header, .section-content, .salary-journey-section, .track-record, .urgency, .signup-section, .footer');
  
  if (sections.length === 0) return;
  
  const videoHeader = document.querySelector('.video-header');
  const videoPlayer = videoHeader ? videoHeader.querySelector('.video-header-player') : null;
  const videoOverlay = videoHeader ? videoHeader.querySelector('.video-header-overlay') : null;
  
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
  if (isVideoComplete) {
    // Video complete - show nav
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
    
    // Skip if landing page transition is complete - logo is already at top in black,
    // no scroll-progress animation needed. This prevents re-hiding the nav at scrollY=0.
    if (document.body.classList.contains('landing-complete')) {
      return;
    }
    
    // After video complete, ensure nav stays visible
    nav.classList.remove('hidden-on-video');
    nav.classList.add('logo-at-top');
    nav.style.opacity = '1';
    nav.style.visibility = 'visible';
    document.body.classList.add('logo-at-top');
    
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
          nav.style.backgroundColor = 'transparent'; /* Site background shows through */
          nav.style.backdropFilter = `blur(${20 * navProgress}px) saturate(${100 + (80 * navProgress)}%)`;
          nav.style.webkitBackdropFilter = `blur(${20 * navProgress}px) saturate(${100 + (80 * navProgress)}%)`;
          nav.style.transition = 'opacity 0.5s cubic-bezier(0.43, 0.195, 0.02, 1), backdrop-filter 0.5s cubic-bezier(0.43, 0.195, 0.02, 1)';
          
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
 * Landing Page Intro Animation
 * Sequential: 1) tagline word-by-word, 2) logo fade, 3) video frames radiate from center
 */
function initLandingAnimation() {
  const WORD_DELAY = 250;       // ms between each word
  const WORD_DURATION = 400;    // ms for each word's fade
  const TEXT_EXIT_DELAY = 200;  // ms pause after last word before tagline exits
  const TEXT_EXIT_DURATION = 400; // ms for tagline fade-out + move-up
  const LOGO_DELAY = 200;       // ms pause after tagline exits before logo enters
  const LOGO_DURATION = 600;    // ms for logo fade + slide-up
  const FRAMES_DELAY = 200;     // ms pause after logo before frames start
  const FRAME_STAGGER = 100;    // ms between each frame's animation start
  
  const ARROW_DELAY = 300;      // ms after radiate finishes before arrow appears
  
  const words = document.querySelectorAll('.landing-word');
  const tagline = document.querySelector('.landing-text');
  const logo = document.querySelector('.landing-logo');
  const placeholders = document.querySelectorAll('.landing-bg .video-placeholder');
  const scrollArrow = document.getElementById('landing-swipe-btn');
  
  // Phase 1: Tagline word-by-word fade in
  let currentDelay = 300; // initial delay before sequence starts
  
  words.forEach((word, i) => {
    setTimeout(() => {
      word.classList.add('anim-visible');
    }, currentDelay + (i * WORD_DELAY));
  });
  
  // Calculate when the last word finishes appearing
  const lastWordStart = currentDelay + ((words.length - 1) * WORD_DELAY);
  const afterWords = lastWordStart + WORD_DURATION;
  
  // Phase 2: Tagline fades out + moves up 30px
  const textExitStart = afterWords + TEXT_EXIT_DELAY;
  setTimeout(() => {
    if (tagline) tagline.classList.add('anim-fade-out');
  }, textExitStart);
  
  const afterTextExit = textExitStart + TEXT_EXIT_DURATION;
  
  // Phase 3: Logo fades in + slides up 30px to lock at center
  const logoStart = afterTextExit + LOGO_DELAY;
  setTimeout(() => {
    if (logo) logo.classList.add('anim-visible');
  }, logoStart);
  
  const afterLogo = logoStart + LOGO_DURATION;
  
  // Phase 4: Video frames appear one by one at center, then radiate out
  // Start frames at the same time as logo (not after)
  const framesStart = logoStart;
  const FRAME_APPEAR_STAGGER = 60; // ms between each video appearing at center
  const RADIATE_PAUSE = 300;        // ms pause after last video appears before radiating
  
  if (placeholders.length === 0) return;
  
  // Calculate viewport center
  const viewportCenterX = window.innerWidth / 2;
  const viewportCenterY = window.innerHeight / 2;
  
  // Position all frames at center (hidden initially via opacity: 0 in CSS)
  placeholders.forEach((el) => {
    const left = parseFloat(el.style.left) || 0;
    const top = parseFloat(el.style.top) || 0;
    const width = parseFloat(el.style.width) || 0;
    const height = parseFloat(el.style.height) || 0;
    
    const frameCenterX = left + width / 2;
    const frameCenterY = top + height / 2;
    const translateX = viewportCenterX - frameCenterX;
    const translateY = viewportCenterY - frameCenterY;
    
    el.style.transform = `translate(${translateX}px, ${translateY}px)`;
  });
  
  // Convert to array for ordering
  const placeholderArray = Array.from(placeholders);
  
  // Appear one by one at center (stacking on top of each other)
  placeholderArray.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('anim-at-center');
    }, framesStart + (i * FRAME_APPEAR_STAGGER));
  });
  
  // After all have appeared, radiate them all out to final positions
  const allAppearedTime = framesStart + (placeholderArray.length * FRAME_APPEAR_STAGGER);
  const RADIATE_TRANSITION_DURATION = 800; // matches CSS transition: 0.8s
  setTimeout(() => {
    placeholderArray.forEach((el) => {
      el.classList.remove('anim-at-center');
      el.classList.add('anim-radiate');
    });
    // Enable parallax after radiate transition finishes
    setTimeout(() => {
      landingParallaxReady = true;
      placeholderArray.forEach((el) => {
        el.style.transform = 'translate(0, 0)'; // clear old center-stack transform
        el.classList.remove('anim-radiate');
        el.classList.add('parallax-ready');
      });
      // Phase 4: Scroll arrow fades in as the last element
      setTimeout(() => {
        if (scrollArrow) scrollArrow.classList.add('anim-visible');
      }, ARROW_DELAY);
    }, RADIATE_TRANSITION_DURATION);
  }, allAppearedTime + RADIATE_PAUSE);
  
  // Scroll arrow click: scroll to the next section
  if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
      const landing = document.querySelector('.landing');
      if (landing && landing.nextElementSibling) {
        landing.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Landing Page - Video Placeholder Positioning
 * Adapts the Decade of Work organic layout algorithm for landing page rectangles
 */
const LANDING_PLACEHOLDER_COUNT = 12;
const LANDING_PLACEHOLDER_BASE_WIDTH = 300;
const LANDING_PLACEHOLDER_BASE_HEIGHT = 200;
const LANDING_SLOT_ROWS = 3;
const LANDING_SLOT_COLS = 4;

// Landing page videos - fixed order with custom adjustments per slot
const LANDING_VIDEO_FILES = [
  'AIJI_Website_Video_Landing_01.mp4',
  'AIJI_Website_Video_Landing_02.mp4',
  'AIJI_Website_Video_Landing_03.mp4',
  'AIJI_Website_Video_Landing_04.mp4',
  'AIJI_Website_Video_Landing_05.mp4',
  'AIJI_Website_Video_Landing_06.mp4',
  'AIJI_Website_Video_Landing_07.mp4',
  'AIJI_Website_Video_Landing_Cherice.mp4',
  'AIJI_Website_Video_Landing_Jay.mp4',
  'AIJI_Website_Video_Landing_Lee.mp4',
  'AIJI_Website_Video_Landing_Ruth.mp4'
];
const LANDING_VIDEOS_BASE_PATH = 'assets/videos/';

// Custom adjustments per rectangle (1-indexed to match your numbering)
// videoIndex is 0-indexed (0 = Video_01, 1 = Video_02, etc.)
// Video array: [01, 02, 03, 04, 05, 06, 07, Cherice, Jay, Lee, Ruth]
//              [0,  1,  2,  3,  4,  5,  6,  7,       8,   9,   10]
const LANDING_CUSTOM_ADJUSTMENTS = {
  1: { scaleMultiplier: 0.8, offsetX: 400, offsetY: 250 }, // Visible frame 1 - moved 400px right, 250px down (300-50)
  2: { scaleMultiplier: 1.44, offsetX: -400, offsetY: 60, videoIndex: 1 }, // Visible frame 2 - Video 02, moved 400px left, 60px down (110-50)
  3: { scaleMultiplier: 1.2552, offsetX: 0, offsetY: 110, videoIndex: 9 }, // Visible frame 3 - video Lee, down 110px, scaled to 125.52% (1.046×1.2)
  4: { scaleMultiplier: 1.1, offsetX: 50, offsetY: -5 }, // Visible frame 4 - moved up 10px (5-10=-5)
  5: { scaleMultiplier: 2.0, offsetX: -150, offsetY: -225, videoIndex: 1, transformOrigin: 'bottom right' }, // Video 02, 80% of 2.5 = 2.0 scale
  6: { scaleMultiplier: 1.656, offsetX: 175, offsetY: 100, videoIndex: 7, transformOrigin: 'top right' }, // Visible frame 5 - video Cherice, moved right 175px (225-50), down 100px, scaled 165.6% (1.44×1.15)
  7: { scaleMultiplier: 1.1, offsetX: 50, offsetY: 0, videoIndex: 99 }, // Gray (no video) - skipped
  8: { scaleMultiplier: 1.4, offsetX: 100, offsetY: 25, videoIndex: 6 }, // Visible frame 6 - video 07, right 100px, 25px down (75-50), scaled to 140%
  9: { scaleMultiplier: 1.44, offsetX: -25, offsetY: 0 }, // Visible frame 7 - Jay, moved left 75px (50-75=-25), scaled to 144% (1.2×1.2)
  10: { scaleMultiplier: 1.0, offsetX: 100, offsetY: 15, videoIndex: 2 }, // Visible frame 8 - Video 03, moved right 100px (150-50), up 35px (25-10=15)
  11: { scaleMultiplier: 1.44, offsetX: 300, offsetY: 0 }, // Visible frame 9 - scaled to 144% (1.2×1.2)
  12: { scaleMultiplier: 1.0, offsetX: 0, offsetY: 0, videoIndex: 5 }  // video 06 (swapped with 7)
};

let landingPlaceholdersInitialized = false;
let landingPlaceholderElements = [];
let landingParallaxReady = false;

function initLandingPlaceholders() {
  const container = document.getElementById('landing-bg');
  const landing = document.querySelector('.landing');
  
  if (!container || !landing || landingPlaceholdersInitialized) return;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  if (viewportHeight < 100 || viewportWidth < 100) return;
  
  // Reference viewport dimensions (where the current layout was designed)
  const REFERENCE_WIDTH = 1440;
  const REFERENCE_HEIGHT = 900;
  
  // Calculate proportional scale factor based on viewport size
  const scaleFactorX = viewportWidth / REFERENCE_WIDTH;
  const scaleFactorY = viewportHeight / REFERENCE_HEIGHT;
  const viewportScaleFactor = Math.min(scaleFactorX, scaleFactorY);
  
  const ROW_GAP = 20 * viewportScaleFactor;
  const MIN_HORIZONTAL_GAP = 15 * viewportScaleFactor;
  const PADDING = 0; // No padding - fill to edges
  
  // Available space for the grid = full viewport
  const gridAvailableWidth = viewportWidth;
  const gridAvailableHeight = viewportHeight;
  
  // Fixed base scales per rectangle (no randomization)
  const FIXED_SCALES = [0.75, 0.85, 0.95, 0.80, 0.70, 0.90, 0.85, 0.75, 0.95, 0.80, 0.90, 0.85];
  
  // First pass: calculate all rectangle sizes with fixed scales
  const allRects = [];
  
  for (let row = 0; row < LANDING_SLOT_ROWS; row++) {
    const rowRects = [];
    
    for (let col = 0; col < LANDING_SLOT_COLS; col++) {
      const i = row * LANDING_SLOT_COLS + col;
      if (i >= LANDING_PLACEHOLDER_COUNT) break;
      
      const scale = FIXED_SCALES[i]; // Fixed scale per rectangle
      const width = LANDING_PLACEHOLDER_BASE_WIDTH * scale * viewportScaleFactor;
      const height = LANDING_PLACEHOLDER_BASE_HEIGHT * scale * viewportScaleFactor;
      rowRects.push({ index: i, scale, width, height });
    }
    
    allRects.push(rowRects);
  }
  
  // Divide viewport height evenly into row slots
  const rowSlotHeight = gridAvailableHeight / LANDING_SLOT_ROWS;
  
  // Place rectangles row by row, filling the full viewport
  for (let row = 0; row < LANDING_SLOT_ROWS; row++) {
    const rowRects = allRects[row];
    if (!rowRects || rowRects.length === 0) continue;
    
    // Each row occupies a vertical band of the viewport
    const rowTopBand = row * rowSlotHeight;
    
    // Calculate available width per rectangle
    const totalGapWidth = (rowRects.length - 1) * MIN_HORIZONTAL_GAP;
    const availableWidth = gridAvailableWidth - totalGapWidth;
    const maxRectWidth = availableWidth / rowRects.length;
    
    // Horizontal offset to center the row
    const rowLeftOffset = (viewportWidth - gridAvailableWidth) / 2;
    
    // Place rectangles
    let currentLeft = rowLeftOffset;
    for (let col = 0; col < rowRects.length; col++) {
      const rectData = rowRects[col];
      const rectNumber = rectData.index + 1; // 1-12
      
      // Calculate slot width for position tracking
      const slotWidthForRect = maxRectWidth;
      
      // Skip frames #5, #7 and #12 (not used) but still advance position
      if (rectNumber === 5 || rectNumber === 7 || rectNumber === 12) {
        currentLeft += slotWidthForRect + MIN_HORIZONTAL_GAP;
        continue;
      }
      
      // Get custom adjustments for this rectangle
      const adjustments = LANDING_CUSTOM_ADJUSTMENTS[rectNumber] || { scaleMultiplier: 1.0, offsetX: 0, offsetY: 0 };
      
      // viewportScaleFactor already handles proportional scaling across all viewport sizes
      // No additional responsive multiplier needed — it caused overlap on larger screens
      const finalScaleMultiplier = adjustments.scaleMultiplier;
      
      // Use fixed base dimensions with custom scale multiplier
      let height = rectData.height * finalScaleMultiplier; // Apply custom scale with responsive adjustment
      let width = rectData.width * finalScaleMultiplier; // Apply custom scale with responsive adjustment
      
      // Cap width to fit within allocated horizontal space (but allow overflow for custom scales > 1.0)
      if (width > maxRectWidth && adjustments.scaleMultiplier <= 1.0) {
        width = maxRectWidth;
        height = (width / (rectData.width * scaleFactor)) * height;
      }
      
      const rect = document.createElement('div');
      rect.className = 'video-placeholder';
      rect.setAttribute('data-rect-number', rectNumber);
      
      // Determine which video to use (handle swaps)
      const videoIndex = adjustments.videoIndex !== undefined ? adjustments.videoIndex : rectData.index;
      const videoFile = videoIndex < LANDING_VIDEO_FILES.length ? LANDING_VIDEO_FILES[videoIndex] : null;
      
      // Add video if available
      if (videoFile) {
        const video = document.createElement('video');
        video.className = 'video-placeholder-video';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        const source = document.createElement('source');
        source.src = LANDING_VIDEOS_BASE_PATH + videoFile;
        source.type = 'video/mp4';
        video.appendChild(source);
        rect.appendChild(video);
      }
      
      // // Add number label to rectangle
      // const label = document.createElement('div');
      // label.className = 'video-placeholder-label';
      // label.textContent = rectNumber;
      // rect.appendChild(label);
      
      // Horizontal position: X offsets scale by scaleFactorX to match column widths
      const baseLeft = currentLeft;
      const left = baseLeft + (adjustments.offsetX * scaleFactorX);
      
      // Vertical position: Y offsets scale by scaleFactorY to match row heights
      let baseTop;
      const isFirstRow = row === 0;
      const isLastRow = row === LANDING_SLOT_ROWS - 1;
      
      if (isFirstRow) {
        // First row: align to top edge
        baseTop = rowTopBand;
      } else if (isLastRow) {
        // Last row: align to bottom edge
        baseTop = rowTopBand + rowSlotHeight - height;
      } else {
        // Middle rows: center within band
        const verticalCenter = rowTopBand + (rowSlotHeight - height) / 2;
        baseTop = verticalCenter;
      }
      
      const top = baseTop + (adjustments.offsetY * scaleFactorY);
      
      rect.style.left = left + 'px';
      rect.style.top = top + 'px';
      rect.style.width = width + 'px';
      rect.style.height = height + 'px';
      
      // Apply transform origin if specified
      if (adjustments.transformOrigin) {
        rect.style.transformOrigin = adjustments.transformOrigin;
      }
      
      container.appendChild(rect);
      
      // Store reference for live resize updates
      landingPlaceholderElements.push({ rect, rectData, rectNumber });
      
      // Move to next slot position
      currentLeft += slotWidthForRect + MIN_HORIZONTAL_GAP;
    }
  }
  
  // // Renumber visible frames sequentially (animation is handled by initLandingAnimation)
  // const allPlaceholders = container.querySelectorAll('.video-placeholder');
  // let visibleIndex = 1;
  // allPlaceholders.forEach((el) => {
  //   const label = el.querySelector('.video-placeholder-label');
  //   if (label) {
  //     label.textContent = visibleIndex;
  //   }
  //   visibleIndex++;
  // });
  
  landingPlaceholdersInitialized = true;
}

/**
 * Update landing placeholder positions/sizes on resize (no DOM rebuild)
 */
function updateLandingLayout() {
  if (landingPlaceholderElements.length === 0) return;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  if (viewportHeight < 100 || viewportWidth < 100) return;
  
  // Same scale factor logic as initLandingPlaceholders
  const REFERENCE_WIDTH = 1440;
  const REFERENCE_HEIGHT = 900;
  const scaleFactorX = viewportWidth / REFERENCE_WIDTH;
  const scaleFactorY = viewportHeight / REFERENCE_HEIGHT;
  const viewportScaleFactor = Math.min(scaleFactorX, scaleFactorY);
  
  const MIN_HORIZONTAL_GAP = 15 * viewportScaleFactor;
  const gridAvailableWidth = viewportWidth;
  const rowSlotHeight = viewportHeight / LANDING_SLOT_ROWS;
  
  const FIXED_SCALES = [0.75, 0.85, 0.95, 0.80, 0.70, 0.90, 0.85, 0.75, 0.95, 0.80, 0.90, 0.85];
  
  // Recalculate grid layout (same logic as init)
  const allRects = [];
  for (let row = 0; row < LANDING_SLOT_ROWS; row++) {
    const rowRects = [];
    for (let col = 0; col < LANDING_SLOT_COLS; col++) {
      const i = row * LANDING_SLOT_COLS + col;
      if (i >= LANDING_PLACEHOLDER_COUNT) break;
      const scale = FIXED_SCALES[i];
      const width = LANDING_PLACEHOLDER_BASE_WIDTH * scale * viewportScaleFactor;
      const height = LANDING_PLACEHOLDER_BASE_HEIGHT * scale * viewportScaleFactor;
      rowRects.push({ index: i, scale, width, height });
    }
    allRects.push(rowRects);
  }
  
  // Update each stored element's position and size
  let elementIdx = 0;
  for (let row = 0; row < LANDING_SLOT_ROWS; row++) {
    const rowRects = allRects[row];
    if (!rowRects || rowRects.length === 0) continue;
    
    const rowTopBand = row * rowSlotHeight;
    const totalGapWidth = (rowRects.length - 1) * MIN_HORIZONTAL_GAP;
    const availableWidth = gridAvailableWidth - totalGapWidth;
    const maxRectWidth = availableWidth / rowRects.length;
    const rowLeftOffset = (viewportWidth - gridAvailableWidth) / 2;
    
    let currentLeft = rowLeftOffset;
    for (let col = 0; col < rowRects.length; col++) {
      const rectData = rowRects[col];
      const rectNumber = rectData.index + 1;
      const slotWidthForRect = maxRectWidth;
      
      // Skip frames not used but still advance position (must match initLandingPlaceholders)
      if (rectNumber === 5 || rectNumber === 7 || rectNumber === 12) {
        currentLeft += slotWidthForRect + MIN_HORIZONTAL_GAP;
        continue;
      }
      
      // Get custom adjustments
      const adjustments = LANDING_CUSTOM_ADJUSTMENTS[rectNumber] || { scaleMultiplier: 1.0, offsetX: 0, offsetY: 0 };
      
      // viewportScaleFactor already handles proportional scaling across all viewport sizes
      // No additional responsive multiplier needed — it caused overlap on larger screens
      const finalScaleMultiplier = adjustments.scaleMultiplier;
      
      let height = rectData.height * finalScaleMultiplier;
      let width = rectData.width * finalScaleMultiplier;
      
      if (width > maxRectWidth && adjustments.scaleMultiplier <= 1.0) {
        width = maxRectWidth;
      }
      
      // Calculate positions
      // X offsets scale by scaleFactorX to match column widths
      // Y offsets scale by scaleFactorY to match row heights
      const baseLeft = currentLeft;
      const left = baseLeft + (adjustments.offsetX * scaleFactorX);
      
      let baseTop;
      const isFirstRow = row === 0;
      const isLastRow = row === LANDING_SLOT_ROWS - 1;
      
      if (isFirstRow) {
        baseTop = rowTopBand;
      } else if (isLastRow) {
        baseTop = rowTopBand + rowSlotHeight - height;
      } else {
        baseTop = rowTopBand + (rowSlotHeight - height) / 2;
      }
      
      const top = baseTop + (adjustments.offsetY * scaleFactorY);
      
      // Update existing element styles (no DOM rebuild)
      if (elementIdx < landingPlaceholderElements.length) {
        const el = landingPlaceholderElements[elementIdx].rect;
        el.style.left = left + 'px';
        el.style.top = top + 'px';
        el.style.width = width + 'px';
        el.style.height = height + 'px';
        elementIdx++;
      }
      
      currentLeft += slotWidthForRect + MIN_HORIZONTAL_GAP;
    }
  }
}

/**
 * Landing Page Transitions - Handle wheel events between landing and mission
 * Uses wheel events (not scroll) because the landing page is position:fixed
 * and doesn't generate scroll events. Same pattern as the video header.
 */
let landingTransitionInitialized = false;
let isLandingAnimating = false;
let hasDetectedLandingSwipe = false;

function initLandingPageTransitions() {
  if (landingTransitionInitialized) return;
  landingTransitionInitialized = true;
  
  const landing = document.querySelector('.landing');
  const landingContentWrapper = document.querySelector('.landing-content-wrapper');
  
  if (!landing || !landingContentWrapper) return;
  
  // Use wheel event on the landing element (same pattern as video header)
  landing.addEventListener('wheel', (e) => {
    // If landing is already hidden, allow natural scroll
    if (document.body.classList.contains('landing-complete')) {
      return;
    }
    
    if (isLandingAnimating || hasDetectedLandingSwipe) {
      e.preventDefault();
      return;
    }
    
    // Detect scroll down to transition to mission
    if (e.deltaY > 0) {
      e.preventDefault();
      hasDetectedLandingSwipe = true;
      transitionLandingToMission();
    }
  }, { passive: false });
  
  // Also listen for touch events on mobile
  let touchStartY = 0;
  landing.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  landing.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('landing-complete')) return;
    if (isLandingAnimating || hasDetectedLandingSwipe) return;
    
    const touchDelta = touchStartY - e.touches[0].clientY;
    // Swipe up (finger moves up) = scroll down
    if (touchDelta > 30) {
      hasDetectedLandingSwipe = true;
      transitionLandingToMission();
    }
  }, { passive: true });
  
  // Listen for scroll up from mission to return to landing
  window.addEventListener('scroll', () => {
    if (isLandingAnimating) return;
    
    const isLandingComplete = document.body.classList.contains('landing-complete');
    const isVideoComplete = document.body.classList.contains('video-complete');
    
    if (isLandingComplete && isVideoComplete && window.scrollY === 0) {
      // User is at top of mission - listen for wheel up to go back to landing
      // This is handled by a one-time wheel listener below
    }
  }, { passive: true });
  
  // Global wheel listener for returning to landing from mission
  window.addEventListener('wheel', (e) => {
    if (isLandingAnimating) return;
    
    const isLandingComplete = document.body.classList.contains('landing-complete');
    const isVideoComplete = document.body.classList.contains('video-complete');
    
    // Only intercept at the very top of mission page, scrolling up
    if (isLandingComplete && isVideoComplete && window.scrollY === 0 && e.deltaY < 0) {
      e.preventDefault();
      transitionMissionToLanding();
    }
  }, { passive: false });
  
  // Touch swipe-up support for returning from mission to landing
  let missionTouchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    missionTouchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  window.addEventListener('touchmove', (e) => {
    if (isLandingAnimating) return;
    
    const isLandingComplete = document.body.classList.contains('landing-complete');
    const isVideoComplete = document.body.classList.contains('video-complete');
    
    // Only intercept at the very top of mission page, swiping down (finger moves down = scroll up)
    if (isLandingComplete && isVideoComplete && window.scrollY === 0) {
      const touchDelta = e.touches[0].clientY - missionTouchStartY;
      // Swipe down (finger moves down) = scroll up = go back to landing
      if (touchDelta > 30) {
        transitionMissionToLanding();
      }
    }
  }, { passive: true });
  
  function transitionLandingToMission() {
    if (isLandingAnimating) return;
    isLandingAnimating = true;
    
    const landingLogo = document.querySelector('.landing-logo');
    const landingBg = document.querySelector('.landing-bg');
    const landingSwipeBtn = document.getElementById('landing-swipe-btn');
    
    // Disable CSS transition on swipe button so JS-driven fade isn't delayed
    if (landingSwipeBtn) {
      landingSwipeBtn.style.transition = 'none';
    }
    
    // Fade out landing page content AND background rectangles
    const fadeStartTime = performance.now();
    const fadeDuration = 600;
    
    function animateFade(currentTime) {
      const elapsed = currentTime - fadeStartTime;
      const progress = Math.min(elapsed / fadeDuration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      if (landingContentWrapper) {
        landingContentWrapper.style.opacity = 1 - easeProgress;
      }
      if (landingBg) {
        landingBg.style.opacity = 1 - easeProgress;
      }
      if (landingSwipeBtn) {
        landingSwipeBtn.style.opacity = 1 - easeProgress;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateFade);
      } else {
        completeLandingTransition();
      }
    }
    
    function completeLandingTransition() {
      // Pin scroll to 0 BEFORE making sections visible
      window.scrollTo(0, 0);
      
      // Show mission section (CSS rules using :not(.landing-complete) will now allow content)
      document.body.classList.add('landing-complete');
      
      // Pin scroll again after class change causes layout shift
      window.scrollTo(0, 0);
      
      // Reset all fixed container styles
      const howContent = document.querySelector('.wwd-how-content-fixed');
      const visionContent = document.querySelector('.wwd-vision-content-fixed');
      const missionText = document.querySelector('.wwd-mission-text-fixed');
      const nav = document.querySelector('.nav');
      
      [howContent, visionContent].forEach(el => {
        if (el) {
          el.style.cssText = 'opacity: 0; pointer-events: none;';
        }
      });
      if (missionText) {
        missionText.style.cssText = 'opacity: 1; pointer-events: none;';
      }
      
      // Setup navigation - force visible with all links
      if (nav) {
        nav.classList.remove('hidden-on-video');
        nav.classList.add('logo-at-top');
        document.body.classList.add('logo-at-top');
        // Clear stale inline styles then explicitly set visible
        nav.style.cssText = '';
        nav.style.opacity = '1';
        nav.style.visibility = 'visible';
        nav.style.pointerEvents = 'auto';
        
        // Reset all nav link inline styles (stagger animation may have left them hidden)
        const navLinks = nav.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
          link.style.opacity = '1';
          link.style.transform = 'translateX(0)';
          link.style.transition = '';
          link.classList.remove('active');
        });
        
        const visionLink = nav.querySelector('a[href="#our-vision"]');
        if (visionLink) {
          visionLink.classList.add('active');
        }
      }
      
      // Move landing logo to body (already black)
      if (landingLogo) {
        landingLogo.classList.add('at-top');
        landingLogo.classList.remove('landing-logo');
        landingLogo.classList.add('video-header-logo');
        document.body.appendChild(landingLogo);
      }
      
      // Let elements settle, then finalize state WITHOUT triggering scroll
      requestAnimationFrame(() => {
        // Pin scroll one more time after layout settles
        window.scrollTo(0, 0);
        
        const howContent2 = document.querySelector('.wwd-how-content-fixed');
        const visionContent2 = document.querySelector('.wwd-vision-content-fixed');
        const missionText2 = document.querySelector('.wwd-mission-text-fixed');
        
        [howContent2, visionContent2, missionText2].forEach(el => {
          if (el) el.style.transition = '';
        });
        
        // Reset WWD step styles - step 1 visible, others hidden
        document.querySelectorAll('.wwd-step').forEach((step, index) => {
          if (index === 0) {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
          } else {
            step.style.opacity = '';
            step.style.transform = '';
          }
        });
        
        // Set mission text visible
        const missionTextEl = document.querySelector('.wwd-mission-text-fixed');
        if (missionTextEl) {
          missionTextEl.style.opacity = '1';
          missionTextEl.style.transform = 'translateY(-50%)';
          missionTextEl.style.pointerEvents = 'auto';
          missionTextEl.classList.add('visible');
        }
        
        // Initialize Decade photos (needs real dimensions from visible step)
        requestAnimationFrame(() => {
          initDecadeBuilderPhotos();
        });
        
        // DO NOT call updatePageTransitions() or dispatchEvent('scroll') here.
        // Let the page sit still. The user's own scroll will trigger everything naturally.
        
        // Block wheel events temporarily to prevent momentum from the swipe
        // that triggered the transition from auto-scrolling the mission page
        function blockWheel(e) {
          e.preventDefault();
          window.scrollTo(0, 0);
        }
        window.addEventListener('wheel', blockWheel, { passive: false });
        
        // Release animation lock after a longer delay to absorb wheel momentum
        setTimeout(() => {
          window.scrollTo(0, 0); // Final scroll pin
          window.removeEventListener('wheel', blockWheel);
          isLandingAnimating = false;
          hasDetectedLandingSwipe = false;
        }, 500);
      });
    }
    
    requestAnimationFrame(animateFade);
  }
  
  function transitionMissionToLanding() {
    if (isLandingAnimating) return;
    isLandingAnimating = true;
    
    const nav = document.querySelector('.nav');
    const bodyLogo = document.querySelector('body > .video-header-logo.at-top');
    const landingBg = document.querySelector('.landing-bg');
    
    // Hide navigation
    if (nav) {
      nav.style.opacity = '0';
      nav.style.visibility = 'hidden';
      nav.style.pointerEvents = 'none';
      nav.classList.remove('logo-at-top');
    }
    
    // Move logo back to landing page (keep black logo)
    if (bodyLogo) {
      bodyLogo.classList.remove('at-top', 'video-header-logo');
      bodyLogo.classList.add('landing-logo');
      
      const landingContentWrapperEl = document.querySelector('.landing-content-wrapper');
      if (landingContentWrapperEl) {
        landingContentWrapperEl.insertBefore(bodyLogo, landingContentWrapperEl.firstChild);
      }
    }
    
    // Show landing page (CSS handles hiding sections automatically via :not(.landing-complete))
    document.body.classList.remove('landing-complete');
    
    // Fade in landing content and background
    const swipeBtn = document.getElementById('landing-swipe-btn');
    if (landingContentWrapper) {
      landingContentWrapper.style.opacity = '0';
    }
    if (landingBg) {
      landingBg.style.opacity = '0';
    }
    if (swipeBtn) {
      swipeBtn.style.opacity = '0';
    }
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (landingContentWrapper) {
          landingContentWrapper.style.transition = 'opacity 0.6s ease';
          landingContentWrapper.style.opacity = '1';
        }
        if (landingBg) {
          landingBg.style.transition = 'opacity 0.6s ease';
          landingBg.style.opacity = '1';
        }
        if (swipeBtn) {
          swipeBtn.style.transition = 'opacity 0.6s ease';
          swipeBtn.style.opacity = '1';
        }
        
        setTimeout(() => {
          if (landingContentWrapper) landingContentWrapper.style.transition = '';
          if (landingBg) landingBg.style.transition = '';
          if (swipeBtn) swipeBtn.style.transition = '';
          isLandingAnimating = false;
          hasDetectedLandingSwipe = false;
        }, 600);
      });
    });
  }
}

/**
 * Landing Page Layout - Responsive stacking for logo and text
 */
function initLandingPageLayout() {
  const wrapper = document.querySelector('.landing-content-wrapper');
  const logo = document.querySelector('.landing-logo');
  const text = document.querySelector('.landing-text');
  
  if (!wrapper || !logo || !text) return;
  
  function checkLayout() {
    wrapper.classList.remove('stacked');
    void wrapper.offsetHeight;
    
    const logoRect = logo.getBoundingClientRect();
    const textRect = text.getBoundingClientRect();
    
    if (logoRect.right + 20 >= textRect.left) {
      wrapper.classList.add('stacked');
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
    
    // Calculate max spread based on viewport - full width and height distribution
    const maxSpreadX = vw * 0.9; // 90% of viewport width (no cap)
    const maxSpreadY = vh * 0.7; // 70% of viewport height (no cap)
    
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
    if (rotatingWordsInterval) {
      return; // Already running
    }
    
    // Ensure the element is visible and ready
    rotatingWordEl.style.opacity = '1';
    rotatingWordEl.style.visibility = 'visible';
    rotatingWordEl.style.display = 'inline-block';
    rotatingWordEl.style.transition = 'opacity 0.3s ease';
    
    // Force a reflow to ensure styles are applied
    rotatingWordEl.offsetHeight;
    
    // Build the word and start rotation
    buildWord(words[currentIndex]);
    
    rotatingWordsInterval = setInterval(rotateWord, 2000);
  };
  
  window.stopRotatingWords = function() {
    if (rotatingWordsInterval) {
      clearInterval(rotatingWordsInterval);
      rotatingWordsInterval = null;
    }
  };
  
  // Initial build so text is there (but hidden until step 2 is active)
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
    
    /* Override section-hidden for elements inside steps 5-9 */
    /* These steps handle their own visibility via stagger animations */
    .wwd-step-5 .section-hidden,
    .wwd-step-6 .section-hidden,
    .wwd-step-7 .section-hidden,
    .wwd-step-8 .section-hidden,
    .wwd-step-9 .section-hidden,
    .wwd-step-5.section-hidden,
    .wwd-step-6.section-hidden,
    .wwd-step-7.section-hidden,
    .wwd-step-8.section-hidden,
    .wwd-step-9.section-hidden {
      opacity: 1 !important;
    }
    
    /* Override section-hidden for #our-work parent container */
    /* This section contains steps 5-9 and should never fade */
    #our-work.section-hidden {
      opacity: 1 !important;
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
        console.error('Form submission error:', error);
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
 * Parallax effect for landing page video placeholders
 * Uniform shift based on cursor position, active only after intro animation completes
 */
(function initLandingParallax() {
  const PARALLAX_INTENSITY = 18; // max px shift in each axis
  let rafId = null;
  
  document.addEventListener('mousemove', (e) => {
    if (!landingParallaxReady) return;
    
    const landingSection = document.querySelector('.landing');
    if (!landingSection) return;
    
    const rect = landingSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isInView) return;
    
    // Throttle to one update per frame
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const offsetX = (e.clientX / window.innerWidth - 0.5) * PARALLAX_INTENSITY;
      const offsetY = (e.clientY / window.innerHeight - 0.5) * PARALLAX_INTENSITY;
      
      const placeholders = landingSection.querySelectorAll('.video-placeholder.parallax-ready');
      placeholders.forEach((el) => {
        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
      rafId = null;
    });
  });
})();

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
 * Builder Article Overlay - Open scrollable article reader from article cards
 */
function initBuilderArticleOverlay() {
  const overlay = document.getElementById('builder-article-overlay');
  const scrollContainer = document.getElementById('builder-article-scroll');
  const closeBtn = document.getElementById('builder-article-close');
  const gallery = document.getElementById('builder-video-gallery');

  if (!overlay || !scrollContainer || !closeBtn || !gallery) return;

  let lastFocusedElement = null;
  let currentArticleCard = null;
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  // Get all article cards in gallery order
  function getArticleCards() {
    return Array.from(gallery.querySelectorAll('.builder-article-card'));
  }

  function openArticleOverlay(articleCard, triggerElement) {
    const template = articleCard.querySelector('template.builder-article-content');
    if (!template) return;

    lastFocusedElement = triggerElement;
    currentArticleCard = articleCard;

    // Clone template content and inject into scroll container
    scrollContainer.innerHTML = '';
    const content = template.content.cloneNode(true);
    scrollContainer.appendChild(content);

    // Wire up Previous / Next buttons inside the overlay
    scrollContainer.querySelectorAll('[data-action="prev-article"]').forEach(btn => {
      btn.addEventListener('click', () => navigateArticle(-1));
    });
    scrollContainer.querySelectorAll('[data-action="next-article"]').forEach(btn => {
      btn.addEventListener('click', () => navigateArticle(1));
    });

    // Show overlay
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    // Reset scroll position to top (after overlay is visible so layout is computed)
    scrollContainer.scrollTop = 0;
    requestAnimationFrame(() => { scrollContainer.scrollTop = 0; });

    closeBtn.focus();

    // Focus trap
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

  function navigateArticle(direction) {
    const cards = getArticleCards();
    if (cards.length <= 1) return;
    const currentIndex = cards.indexOf(currentArticleCard);
    const nextIndex = (currentIndex + direction + cards.length) % cards.length;
    openArticleOverlay(cards[nextIndex], lastFocusedElement);
  }

  function closeArticleOverlay() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    scrollContainer.innerHTML = '';

    if (overlay._trapFocus) {
      overlay.removeEventListener('keydown', overlay._trapFocus);
      overlay._trapFocus = null;
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  // Click on article card in gallery
  gallery.addEventListener('click', (e) => {
    const card = e.target.closest('.builder-article-card');
    if (!card) return;
    e.preventDefault();
    openArticleOverlay(card, e.target);
  });

  closeBtn.addEventListener('click', () => closeArticleOverlay());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && !overlay.hidden) {
      closeArticleOverlay();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('builder-article-overlay__backdrop')) {
      closeArticleOverlay();
    }
  });
}

/**
 * Logo Click Handler - Return to landing page when logo is clicked
 */
function initLogoClick() {
  // Add cursor pointer style to logo when it has at-top class
  const style = document.createElement('style');
  style.textContent = `
    .video-header-logo.at-top,
    .video-header-logo.at-top * {
      cursor: pointer !important;
    }
  `;
  document.head.appendChild(style);
  
  document.addEventListener('click', (e) => {
    // Check if click is on logo or its children
    const logo = e.target.closest('.video-header-logo.at-top');
    
    if (!logo) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Reload the page to restart the landing animation sequence
    window.location.reload();
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

// Mission background image configuration - single image
const MISSION_BG_CONFIG = [
  {
    src: 'assets/images/AIJI_Artwork_Mission_01.png',
    orientation: 'vertical', // Fully vertical
    size: 'large', // Largest image
    opacity: 1.0 // Full opacity for watercolor effect
  }
];

// Create background artwork elements - append directly to body for true fixed positioning
function createBackgroundArtwork() {
  MISSION_BG_CONFIG.forEach((config, index) => {
    const img = document.createElement('img');
    img.src = config.src;
    img.className = `mission-bg-art ${config.orientation} ${config.size}`;
    img.dataset.opacity = config.opacity;
    img.alt = 'Mission background artwork';
    
    // Don't set inline styles - let CSS handle initial state via stagger-item class
    
    // Append directly to body for true fixed positioning
    document.body.appendChild(img);
  });
  
}

// Microsoft AI-style fade in/out for Mission background images
function initMissionBackgroundFade() {
  const images = document.querySelectorAll('.mission-bg-art');
  const missionTextFixed = document.querySelector('.wwd-mission-text-fixed');
  const missionStep = document.querySelector('.wwd-step-1');
  
  if (!images.length) return;
  
  // Track when stagger animation completes for each image
  const staggerCompleteTime = new Map();
  
  function updateImageVisibility() {
    const viewportHeight = window.innerHeight;
    
    // Get Mission page bounds for scroll-based calculations
    if (!missionStep) return;
    const missionRect = missionStep.getBoundingClientRect();
    const missionHeight = missionStep.offsetHeight;
    
    // Check if Mission page is in view
    const missionInView = missionRect.top < viewportHeight && missionRect.bottom > 0;
    
    images.forEach((img, index) => {
      const hasStaggerRevealed = img.classList.contains('stagger-revealed');
      
      // Track when stagger-revealed was first added
      if (hasStaggerRevealed && !staggerCompleteTime.has(img)) {
        staggerCompleteTime.set(img, Date.now());
      }
      
      // If mission page is not in view
      if (!missionInView) {
        // If stagger has revealed, hide it when scrolling away
        if (hasStaggerRevealed) {
          img.style.opacity = '0';
        }
        // Otherwise, don't touch it - let CSS handle the initial hidden state
        return;
      }
      
      // Mission page IS in view
      // If stagger hasn't revealed yet, don't apply any inline styles
      // Let the CSS stagger animation handle the entrance
      if (!hasStaggerRevealed) {
        return;
      }
      
      // Wait 800ms after stagger-revealed before applying scroll animation
      // This allows the CSS transition (0.6s) to complete fully
      const timeSinceStaggerComplete = Date.now() - (staggerCompleteTime.get(img) || 0);
      if (timeSinceStaggerComplete < 800) {
        return;
      }
      
      // Stagger animation has completed - now apply scroll-based animation
      // Calculate scroll progress through Mission page
      const scrollableDistance = missionHeight - viewportHeight;
      const scrolled = Math.max(0, -missionRect.top);
      
      // Use 80% of scroll distance so image fades out before Vision page
      const fadeOutPoint = scrollableDistance * 0.8;
      const scrollProgress = Math.max(0, Math.min(1, scrolled / fadeOutPoint));
      
      // Scale grows as user scrolls down (0.9 → 1.4)
      const scale = 0.9 + (scrollProgress * 0.5);
      
      // Opacity fades out as user scrolls down (1.0 → 0)
      const targetOpacity = parseFloat(img.dataset.opacity) || 1.0;
      const opacity = (1.0 - scrollProgress) * targetOpacity;
      
      img.style.opacity = opacity;
      img.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });
    
    // Fade mission text and logos based on mission step visibility
    if (missionTextFixed && missionStep) {
      const stepRect = missionStep.getBoundingClientRect();
      const triggerPoint = viewportHeight * 0.6; // Trigger at 60% of viewport (earlier than center)
      
      // Fade in when entering viewport, fade out when leaving
      if (stepRect.top < triggerPoint && stepRect.bottom > triggerPoint) {
        missionTextFixed.classList.add('visible');
      } else {
        missionTextFixed.classList.remove('visible');
      }
    }
  }
  
  // Listen to window scroll (body now scrolls)
  window.addEventListener('scroll', updateImageVisibility, { passive: true });
  
  // Initial check
  updateImageVisibility();
  
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
  
}

// Parallax scroll effect - DISABLED for Microsoft AI-style (text stays fixed, images scroll naturally)
function initMissionParallax() {
  // Parallax disabled - using natural scroll with fade in/out instead
}

// Add scroll boundary detection for all sections
/**
 * WWD Continuous Scroll - Microsoft AI-style navigation
 * All pages visible, animations driven by scroll position
 */
function initWwdContinuousScroll() {
  const allSteps = document.querySelectorAll('.wwd-step');
  
  if (!allSteps.length) return;
  
  // Make all steps visible for continuous scroll
  allSteps.forEach(step => {
    step.classList.add('active');
    step.style.opacity = '1';
    step.style.visibility = 'visible';
    step.style.position = 'relative';
  });
  
  // Note: Don't set scrollBehavior = 'smooth' - it conflicts with trackpad momentum
  
}

const PAGE_TITLES = ['The Mission', 'The Vision', 'The How', 'The Urgency', 'Decade of Work', 'NYT', 'Builders Demography', 'Economic Impact', 'Transformation Stories', 'The Hub', 'Leadership', 'Ecosystem'];
const IMPACT_PAGE_TITLES = ['Decade of Work', 'NYT', 'Builders Demography', 'Economic Impact', 'Transformation Stories'];
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
  if (currentStepIndex < 1 || currentStepIndex > 12) {
    usedClosestFallback = true;
    let bestIndex = 1;
    let bestDist = Infinity;
    steps.forEach((step, index) => {
      const stepNum = index + 1;
      if (stepNum === 13) return; // skip footer
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

  // Footer (step 13) - show Ecosystem as last; steps 1-12 for progress bar
  const displayStep = currentStepIndex >= 1 && currentStepIndex <= 12 ? currentStepIndex : (currentStepIndex === 13 ? 12 : 1);

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

    for (let i = displayStep + 1; i <= 12; i++) {
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
  const decadeStep = document.querySelector('.wwd-step-5');
  const decadeContent = document.getElementById('impact-decade-content-fixed');
  if (!container || !decadeStep || decadeBuilderPhotosInitialized) return;

  const stepW = decadeStep.offsetWidth || window.innerWidth;
  const stepH = decadeStep.offsetHeight;
  if (stepH < 100 || stepW < 100) return;

  // Calculate where the first row of images should start.
  // The fixed copy (.impact-decade-content-fixed) is centered at ~50vh when in view.
  // We want images to start 100px below the bottom of that copy.
  // Use the copy's actual height to compute its bottom edge relative to viewport center.
  const viewportHeight = window.innerHeight;
  const copyHeight = decadeContent ? decadeContent.offsetHeight : 200;
  // Copy is vertically centered at (50vh - 75px), so its center is at that point
  // Copy bottom = (viewportHeight / 2 - 75) + copyHeight / 2
  const copyBottomInViewport = (viewportHeight / 2 - 75) + (copyHeight / 2);
  // When user scrolls step 5 into view (step top at 0), images should start at copyBottomInViewport + 100px
  let firstImageMinTopPx = copyBottomInViewport + DECADE_BUILDER_GAP_BELOW_COPY_PX;
  
  // Clamp so images stay inside step
  firstImageMinTopPx = Math.max(0, firstImageMinTopPx);
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
  const minStepHeight = Math.max(stepH, 800); /* keep at least current or 800px so layout doesn't collapse */
  const requiredHeight = Math.max(globalLowestBottom + BOTTOM_PADDING, minStepHeight);
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
  const decadeContent = document.getElementById('impact-decade-content-fixed');
  const decadeStep = document.querySelector('.wwd-step-5');

  if (window.DEBUG_DECADE) {
    console.log('[Decade] updateDecadeEntrance called', {
      hasDecadeContent: !!decadeContent,
      hasDecadeStep: !!decadeStep,
      _decadeEntrancePlayed
    });
  }

  if (!decadeContent || !decadeStep) return;

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
      /* Trigger staggered entrance (headline then body) on first time in entrance zone */
      if (!_decadeEntrancePlayed) {
        _decadeEntrancePlayed = true;
        _decadeEntranceInProgress = true;
        decadeContent.style.pointerEvents = 'none';
        decadeContent.classList.remove('decade-entrance-done');
        decadeContent.classList.add('decade-entrance-animate');
        const onEntranceDone = () => {
          decadeContent.classList.remove('decade-entrance-animate');
          decadeContent.classList.add('decade-entrance-done');
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
      }
    } else {
      /* Fully visible: keep content visible */
      if (!_decadeEntranceInProgress) {
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
 * Also ensures photos become visible when step is active (fallback for IntersectionObserver)
 */
function updateBuilderPhotosExit() {
  const container = document.getElementById('impact-decade-bg');
  const decadeStep = document.querySelector('.wwd-step-5');
  
  if (!container || !decadeStep) return;
  
  // Find the actual lowest image bottom
  const photos = container.querySelectorAll('.builder-photo');
  if (photos.length === 0) return;
  
  // Fallback: force photos visible when they're in viewport (backup for IntersectionObserver)
  const viewportHeight = window.innerHeight;
  photos.forEach((photo) => {
    const photoRect = photo.getBoundingClientRect();
    // Photo is in viewport
    if (photoRect.top < viewportHeight && photoRect.bottom > 0) {
      photo.style.opacity = '1';
    }
  });
  
  let lowestBottom = 0;
  photos.forEach((photo) => {
    const photoRect = photo.getBoundingClientRect();
    if (photoRect.bottom > lowestBottom) {
      lowestBottom = photoRect.bottom;
    }
  });
  
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
  const nytPage = document.querySelector('.wwd-step-6');
  const nytContent = document.getElementById('nyt-content-fixed');

  if (!nytPage || !nytContent) return;

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
    nytContent.style.pointerEvents = 'none';
    return;
  }

  // Past exit: require bottom to be clearly above center (avoids flicker when rect.bottom ~ viewportCenter)
  if (rect.bottom <= viewportCenter - buffer) {
    nytContent.style.opacity = '0';
    nytContent.style.pointerEvents = 'none';
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
    nytContent.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    return;
  }
  if (rect.bottom <= exitZoneEnd) {
    nytContent.style.opacity = '0';
    nytContent.style.pointerEvents = 'none';
    return;
  }

  // Entrance - fade in (no translateY; content is fixed at center)
  if (visibleFromTop > 0 && visibleFromTop < entranceThreshold) {
    const progress = visibleFromTop / entranceThreshold;
    nytContent.style.opacity = progress;
    nytContent.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
  } else if (visibleFromTop >= entranceThreshold) {
    nytContent.style.opacity = '1';
    nytContent.style.pointerEvents = 'auto';
  } else {
    nytContent.style.opacity = '0';
    nytContent.style.pointerEvents = 'none';
  }
}

/**
 * Update Stats (Demography) page - no-op
 * Exit animations removed for cross-browser consistency.
 * Entrance handled by stagger system; natural scroll handles exit.
 */
function updateStatsEntrance() {
  // No exit animation - let natural scroll handle it
}

/**
 * Update Economic Impact section - no-op
 * Exit animations removed for cross-browser consistency.
 * Entrance handled by stagger system; natural scroll handles exit.
 */
function updateEconomicImpactEntrance() {
  // No exit animation - let natural scroll handle it
}

/**
 * Update Builders Stories (Step 5) exit animation
 * Same logic as What We Do: page-progress-based exit at 90-115%, content + progress bar fade together
 */
function updateBuildersStoriesExit() {
  const buildersStep = document.querySelector('.wwd-step-9');
  const buildersContent = buildersStep && buildersStep.querySelector('.builder-stories-content');

  if (!buildersStep || !buildersContent) return;

  const viewportHeight = window.innerHeight;
  const stepRect = buildersStep.getBoundingClientRect();
  const stepHeight = buildersStep.offsetHeight;

  // Short step (same as WWD): use simple in-view check
  if (stepHeight <= viewportHeight) {
    const inView = stepRect.top < viewportHeight && stepRect.bottom > 0;
    buildersContent.style.opacity = inView ? '1' : '0';
    buildersContent.style.transform = inView ? 'translateY(0)' : 'translateY(-30px)';
    return;
  }

  // Same formula as WWD: scroll progress through the page
  const pageProgress = -stepRect.top / (stepHeight - viewportHeight);

  // Exit at 90-115% (same as WWD)
  if (pageProgress > 0.90 && pageProgress < 1.15) {
    const fadeProgress = Math.min(1, (pageProgress - 0.90) / 0.25);
    buildersContent.style.opacity = 1 - fadeProgress;
    buildersContent.style.transform = `translateY(${-30 * fadeProgress}px)`;
  } else if (pageProgress <= 0.90) {
    buildersContent.style.opacity = '1';
    buildersContent.style.transform = 'translateY(0)';
  } else {
    buildersContent.style.opacity = '0';
    buildersContent.style.transform = 'translateY(-30px)';
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
    if (step.classList.contains('wwd-step-13')) {
      step.style.opacity = '1';
      step.style.transform = 'translateY(0)';
      step.classList.remove('fading-out', 'fading-in');
      return;
    }
    
    // Steps 5-9 have their own visibility handling via dedicated functions:
    // - Step 5: updateDecadeEntrance() and updateBuilderPhotosExit()
    // - Step 6: updateNYTEntrance() for fixed content; background always visible
    // - Steps 7-8: Stagger animations handle content visibility
    // - Step 9: updateBuildersStoriesExit()
    // Keep parent step at full opacity so children (backgrounds, stagger items) are visible
    if (step.classList.contains('wwd-step-5') ||
        step.classList.contains('wwd-step-6') ||
        step.classList.contains('wwd-step-7') ||
        step.classList.contains('wwd-step-8') ||
        step.classList.contains('wwd-step-9')) {
      step.style.opacity = '1';
      step.style.transform = 'translateY(0)';
      step.classList.remove('fading-out', 'fading-in');
      return;
    }
    
    const stepRect = step.getBoundingClientRect();
    const nextStep = steps[index + 1];
    const stepHeight = step.offsetHeight;
    const isLastContentStep = nextStep && nextStep.classList.contains('wwd-step-13');
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
        if (nextStep.classList.contains('wwd-step-13')) {
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

/**
 * Initialize advanced page transitions - integrate all scroll effects
 */
function initAdvancedPageTransitions() {
  const visionPage = document.querySelector('.wwd-step-2');
  const visionContent = document.querySelector('.wwd-vision-content-fixed');
  const missionPage = document.querySelector('.wwd-step-1');
  const missionText = document.querySelector('.wwd-mission-text-fixed');
  let rotatingWordsStarted = false;
  
  // Check if any steps exist
  if (!document.querySelector('.wwd-step')) return;
  
  
  function handleScroll() {
    // Skip scroll handling if video intro is not complete
    if (!document.body.classList.contains('video-complete')) return;
    
    // Update fixed content entrance/exit animations
    updateDecadeEntrance();
    updateBuilderPhotosExit();
    updateNYTEntrance();
    updateStatsEntrance();
    updateEconomicImpactEntrance();
    updateBuildersStoriesExit();
    
    // Site background mapping based on current step in viewport:
    //   Steps 1–3, 10:  default (Our Vision)      → no class
    //   Step 4:         urgency (The Urgency)     → .urgency-active
    //   Steps 5–9:      our-work (Our Work)       → .our-impact-active
    //   Steps 11–12:    default (Leadership)      → no class
    const bgOverlay = document.getElementById('section-bg-overlay');
    if (bgOverlay) {
      const steps = document.querySelectorAll('.wwd-step');
      const vh = window.innerHeight;
      const vc = vh / 2;
      let onUrgencyStep = false;
      let onImpactStep = false;
      steps.forEach((step) => {
        const stepNum = parseInt(step.getAttribute('data-step'), 10);
        const rect = step.getBoundingClientRect();
        const inView = rect.top < vc && rect.bottom > vc;
        if (stepNum === 4 && inView) onUrgencyStep = true;
        if (stepNum >= 5 && stepNum <= 9 && inView) onImpactStep = true;
      });
      bgOverlay.classList.toggle('urgency-active', onUrgencyStep);
      bgOverlay.classList.toggle('our-impact-active', onImpactStep);
      syncBodyBackgroundToOverlay();
    }
    
    // Update active nav state based on current section
    updateActiveNavOnScroll();
    
    updatePageTransitions();
    updateMissionEntrance();
    updateVisionEntrance();
    updateHowPageEntrance();
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
        }
      }
    }
  }
  
  /**
   * Update Advisory Council (Step 5) entrance/exit animation
   * Content scrolls with page; exit when Partners (step 6) approaches
   */
  function updateCouncilEntrance() {
    const councilPage = document.querySelector('.wwd-step-11');
    const councilWrapper = councilPage ? councilPage.querySelector('.wwd-council-wrapper') : null;
    const nextStep = document.querySelector('.wwd-step-12');
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
    const partnersPage = document.querySelector('.wwd-step-12');
    const partnersWrapper = partnersPage ? partnersPage.querySelector('.wwd-partners-wrapper') : null;
    const nextStep = document.querySelector('.wwd-step-13');
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
        howContent.style.transform = `translate(-50%, calc(-50% + ${-(1 - opacity) * 30}px))`;
        howContent.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      } else if (!howPageActive && rect.top > 0) {
        // ENTRANCE phase - fading in as page enters
        const entranceProgress = 1 - (rect.top / earlyTriggerPoint);
        const opacity = Math.max(0, Math.min(1, entranceProgress));
        
        howContent.style.opacity = opacity;
        howContent.style.transform = `translate(-50%, calc(-50% + ${(1 - opacity) * 20}px))`;
        howContent.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      } else {
        // Content LOCKED in position - no parallax/scrolling movement
        howContent.style.opacity = '1';
        howContent.style.transform = 'translate(-50%, -50%)';
        howContent.style.pointerEvents = 'auto';
      }
    } else {
      // Not visible
      if (rect.top >= earlyTriggerPoint) {
        // Before entering - hidden
        howContent.style.opacity = '0';
        howContent.style.transform = 'translate(-50%, calc(-50% + 30px))';
        howContent.style.pointerEvents = 'none';
      } else {
        // After exiting - hidden above
        howContent.style.opacity = '0';
        howContent.style.transform = 'translate(-50%, calc(-50% - 30px))';
        howContent.style.pointerEvents = 'none';
      }
    }
  }
  
  // updatePillarScrollProgress removed - cards don't need scroll-based state switching
  
  /**
   * Update Hub page (Step 4) entrance/exit animation
   * Content in document flow - scrolls with page; exit when Leadership (step 5) approaches
   */
  function updateHubEntrance() {
    const hubPage = document.querySelector('.wwd-step-10');
    const hubWrapper = hubPage ? hubPage.querySelector('.wwd-hub-wrapper') : null;
    const nextStep = document.querySelector('.wwd-step-11');
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
    const visionHeight = visionPage.offsetHeight;
    
    // Animation settings
    const animationDuration = 150; // 150px for both entrance and exit animations
    const entranceStartPoint = 0.4; // Start entrance at 40% of page height
    const exitStartPoint = 0.8; // Start exit at 80% of page height
    
    // Calculate scroll progress through the Vision page (0 = just entered, 1 = about to exit)
    const scrolled = viewportHeight - rect.top; // How much we've scrolled into Vision
    
    // Check if Vision is in view at all
    const isInView = rect.top < viewportHeight && rect.bottom > 0;
    
    if (!isInView) {
      visionContent.style.opacity = '0';
      visionContent.style.pointerEvents = 'none';
      visionContent.style.transform = 'translate(-50%, calc(-50% + 30px))';
      return;
    }
    
    // Calculate trigger points based on page height
    const entranceStartScrolled = visionHeight * entranceStartPoint;
    const exitStartScrolled = visionHeight * exitStartPoint;
    
    // Before entrance phase
    if (scrolled < entranceStartScrolled) {
      visionContent.style.opacity = '0';
      visionContent.style.transform = 'translate(-50%, calc(-50% + 30px))';
      visionContent.style.pointerEvents = 'none';
      return;
    }
    
    // Entrance phase: starts at 20%, completes in 150px
    if (scrolled >= entranceStartScrolled && scrolled < entranceStartScrolled + animationDuration) {
      const distanceIntoEntrance = scrolled - entranceStartScrolled;
      const progress = distanceIntoEntrance / animationDuration;
      visionContent.style.opacity = progress;
      visionContent.style.transform = `translate(-50%, calc(-50% + ${(1 - progress) * 30}px))`;
      visionContent.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
      return;
    }
    
    // Exit phase: starts at 60%, completes in 150px
    if (scrolled >= exitStartScrolled) {
      const distanceIntoExit = scrolled - exitStartScrolled;
      const exitProgress = 1 - Math.min(1, distanceIntoExit / animationDuration);
      
      visionContent.style.opacity = exitProgress;
      visionContent.style.transform = `translate(-50%, calc(-50% - ${(1 - exitProgress) * 30}px))`;
      visionContent.style.pointerEvents = exitProgress > 0.5 ? 'auto' : 'none';
      return;
    }
    
    // Stable phase: fully visible between entrance complete and exit start
    visionContent.style.opacity = '1';
    visionContent.style.transform = 'translate(-50%, -50%)';
    visionContent.style.pointerEvents = 'auto';
  }
  
  // Listen to window scroll (body now scrolls directly)
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initialize decade builder photos
  initDecadeBuilderPhotos();
  
  // Initial update
  handleScroll();
  requestAnimationFrame(() => {
    updateDecadeEntrance();
    updateBuilderPhotosExit();
    updateNYTEntrance();
    updateStatsEntrance();
    updateEconomicImpactEntrance();
    updateBuildersStoriesExit();
  });

}

function initSectionScrollBoundaries() {
  // With continuous scroll, section boundaries are no longer needed
  // This function is kept for compatibility but does nothing
  return;
  
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
  const decadeContent = document.getElementById('impact-decade-content-fixed');
  const nytContentFixed = document.getElementById('nyt-content-fixed');
  [titlesFixed, visionContent, howContent, missionText, decadeContent, nytContentFixed].forEach((el) => {
    if (el) {
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    }
  });
  if (decadeContent) {
    decadeContent.classList.remove('decade-entrance-animate');
    decadeContent.classList.remove('decade-entrance-done');
  }
  _decadeEntrancePlayed = false;
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
    decadeContent.classList.remove('decade-entrance-done');
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
 * Reset page to initial state (scroll position and fixed content).
 */
function resetWwdSection() {
  // Scroll to top of page
  window.scrollTo(0, 0);
  
  // Reset fixed content inline styles so scroll-based animations can work again
  const visionContent = document.querySelector('.wwd-vision-content-fixed');
  const howContent = document.querySelector('.wwd-how-content-fixed');
  const missionText = document.querySelector('.wwd-mission-text-fixed');
  
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
    decadeContent.classList.remove('decade-entrance-done');
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
/**
 * Section Navigation - Smooth scroll to section anchors
 * (Continuous scroll architecture - no section switching needed)
 */
function initSectionSwitching() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
  const nav = document.querySelector('.nav');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      const targetId = href.substring(1); // Remove #
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        e.preventDefault();
        
        // Get nav height for offset (fixed nav is 72px)
        const navHeight = nav ? nav.offsetHeight : 72;
        const targetPosition = targetSection.offsetTop - navHeight - 20; // 20px extra spacing
        
        // Smooth scroll to section with offset
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active nav state immediately
        navLinks.forEach(navLink => {
          if (!navLink.classList.contains('nav-cta')) {
            navLink.classList.remove('active');
          }
        });
        if (!link.classList.contains('nav-cta')) {
          link.classList.add('active');
        }
        
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if (hamburger) hamburger.classList.remove('active');
        }
      }
    });
  });
}

/**
 * Update active nav link based on which section is in viewport center
 */
function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('.section-content');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const viewportCenter = window.innerHeight / 2;
  
  let activeSection = null;
  
  // Find which section's center is closest to viewport center
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
      activeSection = section.id;
    }
  });
  
  // Update nav link active states
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${activeSection}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
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
    mission: false,  // Step 1: Mission - headline and logos
    step3: false,  // The How - pillars
    step4: false,  // The Hub - gallery
    step5: false,  // Advisory Council - cards
    step6: false,  // Partners - cards
    urgency: false,      // Step 4: The Urgency
    demography: false,   // Step 7: Builders Demography
    economic: false,     // Step 8: Economic Impact
    transformation: false // Step 9: Transformation Stories
  };
  
  // Add stagger-item class to elements
  function setupStaggerItems() {
    // Step 1: Mission page elements (headline, logos, and background)
    const missionHeadline = document.querySelector('.wwd-step-1 .wwd-text-pursuit');
    if (missionHeadline) missionHeadline.classList.add('stagger-item', 'stagger-mission-headline');
    
    const missionLogos = document.querySelectorAll('.wwd-step-1 .wwd-mission-logo');
    missionLogos.forEach(logo => logo.classList.add('stagger-item', 'stagger-mission-logo'));
    
    const missionBgImages = document.querySelectorAll('.mission-bg-art');
    missionBgImages.forEach(img => img.classList.add('stagger-item', 'stagger-mission-bg'));
    
    // Step 3: How page elements (headline and pillar cards)
    const howHeadline = document.querySelector('.wwd-how-content-fixed .wwd-initiatives-headline');
    if (howHeadline) howHeadline.classList.add('stagger-item', 'stagger-how-headline');
    
    const pillarCards = document.querySelectorAll('.wwd-how-content-fixed .wwd-pillar-card');
    pillarCards.forEach(card => card.classList.add('stagger-item', 'stagger-how-card'));
    
    // Step 10: Hub elements (headline, body, gallery)
    const hubHeadline = document.querySelector('.wwd-step-10 .wwd-hub-headline');
    if (hubHeadline) hubHeadline.classList.add('stagger-item', 'stagger-hub-headline');
    
    const hubBody = document.querySelector('.wwd-step-10 .wwd-hub-body');
    if (hubBody) hubBody.classList.add('stagger-item', 'stagger-hub-body');
    
    const galleryImages = document.querySelectorAll('#wwd-hub-gallery .wwd-hub-image');
    galleryImages.forEach(img => img.classList.add('stagger-item', 'stagger-hub-gallery'));
    
    // Step 11: Council elements (headline, description, cards)
    const councilHeadline = document.querySelector('.wwd-step-11 .wwd-council-headline');
    if (councilHeadline) councilHeadline.classList.add('stagger-item', 'stagger-council-headline');
    
    const councilDesc = document.querySelector('.wwd-step-11 .wwd-council-description');
    if (councilDesc) councilDesc.classList.add('stagger-item', 'stagger-council-desc');
    
    const councilCards = document.querySelectorAll('.wwd-step-11 .council-card');
    councilCards.forEach(card => card.classList.add('stagger-item', 'stagger-council-card'));
    
    // Step 12: Partners elements (headline, description, cards)
    const partnersHeadline = document.querySelector('.wwd-step-12 .wwd-partners-headline');
    if (partnersHeadline) partnersHeadline.classList.add('stagger-item', 'stagger-partners-headline');
    
    const partnersDesc = document.querySelector('.wwd-step-12 .wwd-partners-description');
    if (partnersDesc) partnersDesc.classList.add('stagger-item', 'stagger-partners-desc');
    
    const partnerCards = document.querySelectorAll('.wwd-step-12 .partner-card');
    partnerCards.forEach(card => card.classList.add('stagger-item', 'stagger-partners-card'));
    
    // Step 4: Urgency elements (headline, body, grid, gap visual)
    const urgencyHeadline = document.querySelector('.wwd-step-4 .urgency-headline');
    if (urgencyHeadline) urgencyHeadline.classList.add('stagger-item', 'stagger-urgency-headline');
    
    const urgencyBody = document.querySelector('.wwd-step-4 .urgency-body');
    if (urgencyBody) urgencyBody.classList.add('stagger-item', 'stagger-urgency-body');
    
    const urgencyGrid = document.querySelector('.wwd-step-4 .urgency-grid');
    if (urgencyGrid) urgencyGrid.classList.add('stagger-item', 'stagger-urgency-grid');
    
    const gapVisual = document.querySelector('.wwd-step-4 .gap-visual');
    if (gapVisual) gapVisual.classList.add('stagger-item', 'stagger-urgency-gap');
    
    // Step 7: Demography elements (headline, body, grid)
    const demoHeadline = document.querySelector('.wwd-step-7 .real-people-headline');
    if (demoHeadline) demoHeadline.classList.add('stagger-item', 'stagger-demo-headline');
    
    const demoBody = document.querySelector('.wwd-step-7 .real-people-body');
    if (demoBody) demoBody.classList.add('stagger-item', 'stagger-demo-body');
    
    const demoGrid = document.querySelector('.wwd-step-7 .demographics-grid');
    if (demoGrid) demoGrid.classList.add('stagger-item', 'stagger-demo-grid');
    
    // Step 8: Economic Impact elements (headline, body, grid)
    const econHeadline = document.querySelector('.wwd-step-8 .real-people-headline');
    if (econHeadline) econHeadline.classList.add('stagger-item', 'stagger-econ-headline');
    
    const econBody = document.querySelector('.wwd-step-8 .real-people-body');
    if (econBody) econBody.classList.add('stagger-item', 'stagger-econ-body');
    
    const econGrid = document.querySelector('.wwd-step-8 .demographics-grid');
    if (econGrid) econGrid.classList.add('stagger-item', 'stagger-econ-grid');
    
    // Step 9: Transformation Stories elements (headline, description, video gallery)
    const transHeadline = document.querySelector('.wwd-step-9 .builder-stories-headline');
    if (transHeadline) transHeadline.classList.add('stagger-item', 'stagger-trans-headline');
    
    const transDesc = document.querySelector('.wwd-step-9 .builder-stories-description');
    if (transDesc) transDesc.classList.add('stagger-item', 'stagger-trans-desc');
    
    const transGallery = document.querySelector('.wwd-step-9 .builder-video-gallery');
    if (transGallery) transGallery.classList.add('stagger-item', 'stagger-trans-gallery');
  }
  
  // Trigger sequential animation for Mission page
  // Sequence: 1. Headline → 2. Logos (left to right) → 3. Background image
  function triggerMissionSequence() {
    let delay = 0;
    const baseDelay = 150;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-mission-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 300;
    }
    
    // 2. Logos (staggered left to right)
    const logos = document.querySelectorAll('.stagger-mission-logo');
    logos.forEach((logo, i) => {
      setTimeout(() => logo.classList.add('stagger-revealed'), delay + i * baseDelay);
    });
    
    // Calculate delay after all logos complete
    if (logos.length > 0) {
      delay += (logos.length - 1) * baseDelay + baseDelay;
    }
    
    // 3. Background image (scale up and fade in)
    const bgImages = document.querySelectorAll('.stagger-mission-bg');
    bgImages.forEach(img => {
      setTimeout(() => img.classList.add('stagger-revealed'), delay);
    });
  }
  
  // Trigger sequential animation for How page
  // Sequence: 1. Headline → 2. Cards (left to right)
  function triggerHowSequence() {
    let delay = 0;
    const baseDelay = 100;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-how-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 2. Four pillar cards (staggered left to right)
    const cards = document.querySelectorAll('.stagger-how-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('stagger-revealed'), delay + i * baseDelay);
    });
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
    const partnersPage = document.querySelector('.wwd-step-12');
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
  }
  
  // Trigger sequential animation for Urgency page
  // Sequence: 1. Headline → 2. Body → 3. Grid → 4. Gap visual
  function triggerUrgencySequence() {
    let delay = 0;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-urgency-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 2. Body
    const body = document.querySelector('.stagger-urgency-body');
    if (body) {
      setTimeout(() => body.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 3. Grid
    const grid = document.querySelector('.stagger-urgency-grid');
    if (grid) {
      setTimeout(() => grid.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 4. Gap visual
    const gap = document.querySelector('.stagger-urgency-gap');
    if (gap) {
      setTimeout(() => gap.classList.add('stagger-revealed'), delay);
    }
  }
  
  // Trigger sequential animation for Demography page
  // Sequence: 1. Headline → 2. Body → 3. Grid
  function triggerDemographySequence() {
    let delay = 0;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-demo-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 2. Body
    const body = document.querySelector('.stagger-demo-body');
    if (body) {
      setTimeout(() => body.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 3. Grid
    const grid = document.querySelector('.stagger-demo-grid');
    if (grid) {
      setTimeout(() => grid.classList.add('stagger-revealed'), delay);
    }
  }
  
  // Trigger sequential animation for Economic Impact page
  // Sequence: 1. Headline → 2. Body → 3. Grid
  function triggerEconomicSequence() {
    let delay = 0;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-econ-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 2. Body
    const body = document.querySelector('.stagger-econ-body');
    if (body) {
      setTimeout(() => body.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 3. Grid
    const grid = document.querySelector('.stagger-econ-grid');
    if (grid) {
      setTimeout(() => grid.classList.add('stagger-revealed'), delay);
    }
  }
  
  // Trigger sequential animation for Transformation Stories page
  // Sequence: 1. Headline → 2. Description → 3. Video gallery
  function triggerTransformationSequence() {
    let delay = 0;
    
    // 1. Headline
    const headline = document.querySelector('.stagger-trans-headline');
    if (headline) {
      setTimeout(() => headline.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 2. Description
    const desc = document.querySelector('.stagger-trans-desc');
    if (desc) {
      setTimeout(() => desc.classList.add('stagger-revealed'), delay);
      delay += 200;
    }
    
    // 3. Video gallery
    const gallery = document.querySelector('.stagger-trans-gallery');
    if (gallery) {
      setTimeout(() => gallery.classList.add('stagger-revealed'), delay);
    }
  }
  
  // Check which pages are active and trigger animations
  function checkAndTriggerStagger() {
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    
    // Step 1: Mission - trigger when page is in view
    const missionPage = document.querySelector('.wwd-step-1');
    if (missionPage && !animatedPages.mission) {
      const rect = missionPage.getBoundingClientRect();
      // Trigger when Mission page top crosses viewport center
      if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
        animatedPages.mission = true;
        triggerMissionSequence();
      }
    }
    
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
    
    // Step 10: The Hub
    const hubPage = document.querySelector('.wwd-step-10');
    if (hubPage && !animatedPages.step4) {
      const rect = hubPage.getBoundingClientRect();
      // Trigger when Hub page top crosses viewport center
      if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
        animatedPages.step4 = true;
        triggerHubSequence();
      }
    }
    
    // Step 11: Advisory Council
    const councilPage = document.querySelector('.wwd-step-11');
    if (councilPage && !animatedPages.step5) {
      const rect = councilPage.getBoundingClientRect();
      if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
        animatedPages.step5 = true;
        triggerCouncilSequence();
      }
    }
    
    // Step 12: Partners
    const partnersPage = document.querySelector('.wwd-step-12');
    if (partnersPage && !animatedPages.step6) {
      const rect = partnersPage.getBoundingClientRect();
      if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
        animatedPages.step6 = true;
        triggerPartnersSequence();
      }
    }
    
    // Step 4: The Urgency
    const urgencyPage = document.querySelector('.wwd-step-4');
    if (urgencyPage && !animatedPages.urgency) {
      const rect = urgencyPage.getBoundingClientRect();
      if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
        animatedPages.urgency = true;
        triggerUrgencySequence();
      }
    }
    
    // Step 7: Builders Demography - trigger when top enters bottom 30% of viewport
    const demoPage = document.querySelector('.wwd-step-7');
    if (demoPage && !animatedPages.demography) {
      const rect = demoPage.getBoundingClientRect();
      const earlyTrigger = viewportHeight * 0.7;
      if (rect.top < earlyTrigger && rect.bottom > 0) {
        animatedPages.demography = true;
        triggerDemographySequence();
      }
    }
    
    // Step 8: Economic Impact - trigger when top enters bottom 30% of viewport
    const econPage = document.querySelector('.wwd-step-8');
    if (econPage && !animatedPages.economic) {
      const rect = econPage.getBoundingClientRect();
      const earlyTrigger = viewportHeight * 0.7;
      if (rect.top < earlyTrigger && rect.bottom > 0) {
        animatedPages.economic = true;
        triggerEconomicSequence();
      }
    }
    
    // Step 9: Transformation Stories - trigger when top enters bottom 30% of viewport
    const transPage = document.querySelector('.wwd-step-9');
    if (transPage && !animatedPages.transformation) {
      const rect = transPage.getBoundingClientRect();
      const earlyTrigger = viewportHeight * 0.7;
      if (rect.top < earlyTrigger && rect.bottom > 0) {
        animatedPages.transformation = true;
        triggerTransformationSequence();
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
    
    // Reset Step 10 if scrolled before it
    const hubPage = document.querySelector('.wwd-step-10');
    if (hubPage && animatedPages.step4) {
      const rect = hubPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.step4 = false;
        document.querySelectorAll('.wwd-step-10 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
    
    // Reset Step 11 if scrolled before it
    const councilPage = document.querySelector('.wwd-step-11');
    if (councilPage && animatedPages.step5) {
      const rect = councilPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.step5 = false;
        document.querySelectorAll('.wwd-step-11 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
    
    // Reset Step 12 if scrolled before it
    const partnersPage = document.querySelector('.wwd-step-12');
    if (partnersPage && animatedPages.step6) {
      const rect = partnersPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.step6 = false;
        document.querySelectorAll('.wwd-step-12 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
    
    // Reset Step 4 (Urgency) if scrolled before it
    const urgencyPage = document.querySelector('.wwd-step-4');
    if (urgencyPage && animatedPages.urgency) {
      const rect = urgencyPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.urgency = false;
        document.querySelectorAll('.wwd-step-4 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
    
    // Reset Step 7 (Demography) if scrolled before it
    const demoPage = document.querySelector('.wwd-step-7');
    if (demoPage && animatedPages.demography) {
      const rect = demoPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.demography = false;
        document.querySelectorAll('.wwd-step-7 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
    
    // Reset Step 8 (Economic Impact) if scrolled before it
    const econPage = document.querySelector('.wwd-step-8');
    if (econPage && animatedPages.economic) {
      const rect = econPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.economic = false;
        document.querySelectorAll('.wwd-step-8 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
    
    // Reset Step 9 (Transformation Stories) if scrolled before it
    const transPage = document.querySelector('.wwd-step-9');
    if (transPage && animatedPages.transformation) {
      const rect = transPage.getBoundingClientRect();
      if (rect.top > viewportHeight) {
        animatedPages.transformation = false;
        document.querySelectorAll('.wwd-step-9 .stagger-item').forEach(el => {
          el.classList.remove('stagger-revealed');
        });
      }
    }
  }
  
  // Setup elements
  setupStaggerItems();
  
  // Listen for scroll to trigger animations (body scrolls now)
  window.addEventListener('scroll', () => {
    checkAndTriggerStagger();
    resetStaggerIfNeeded();
  }, { passive: true });
  
}

/**
 * Get Involved Overlay - Form for contact and interests
 */
function initGetInvolvedOverlay() {
  const overlay = document.getElementById('get-involved-overlay');
  const form = document.getElementById('get-involved-form');
  const formSection = document.getElementById('get-involved-form-section');
  const thanksSection = document.getElementById('get-involved-thanks');
  const closeBtn = document.getElementById('get-involved-close');

  if (!overlay || !form || !formSection || !thanksSection || !closeBtn) return;

  let lastFocusedElement = null;
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  // Attach event listeners to all "Get Involved" buttons
  document.querySelectorAll('[data-action="get-involved"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openGetInvolvedOverlay(btn);
    });
  });

  function openGetInvolvedOverlay(triggerElement) {
    lastFocusedElement = triggerElement;
    
    // Reset form and show form section
    resetForm();
    formSection.hidden = false;
    thanksSection.hidden = true;
    
    // Show overlay
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus first input field
    const firstInput = form.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    // Set up keyboard focus trap
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

  function closeGetInvolvedOverlay() {
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

  function resetForm() {
    form.reset();
    document.querySelectorAll('.field-error-arrow').forEach(arrow => arrow.remove());
    const submitBtn = form.querySelector('.get-involved-submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  }

  function showFieldError(input) {
    // Remove any existing arrow for this field
    const existingArrow = input.parentElement.querySelector('.field-error-arrow');
    if (existingArrow) existingArrow.remove();

    // Create arrow element
    const arrow = document.createElement('span');
    arrow.className = 'field-error-arrow';
    
    // Insert arrow after the input
    input.parentElement.appendChild(arrow);
  }

  // Remove error arrows when user starts typing
  form.querySelectorAll('input[required]').forEach(input => {
    input.addEventListener('input', () => {
      const arrow = input.parentElement.querySelector('.field-error-arrow');
      if (arrow && input.value.trim() !== '') {
        arrow.remove();
      }
    });
  });

  async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Remove any previous arrows
    document.querySelectorAll('.field-error-arrow').forEach(arrow => arrow.remove());

    // Get form data
    const formData = new FormData(form);
    const email = formData.get('email');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const companyName = formData.get('companyName') || '';
    const role = formData.get('role') || '';
    const phone = formData.get('phone') || '';
    
    // Get selected interests
    const interests = [];
    form.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
      interests.push(cb.value);
    });

    // Validate required fields and show arrows
    let hasErrors = false;
    const requiredFields = [
      { value: email, input: form.querySelector('#gi-email') },
      { value: firstName, input: form.querySelector('#gi-first-name') },
      { value: lastName, input: form.querySelector('#gi-last-name') }
    ];

    requiredFields.forEach(field => {
      if (!field.value || field.value.trim() === '') {
        hasErrors = true;
        showFieldError(field.input);
      }
    });

    if (hasErrors) {
      return;
    }

    // Prepare data for submission
    const data = {
      email,
      firstName,
      lastName,
      companyName,
      role,
      phone,
      interests
    };

    // Show loading state
    const submitBtn = form.querySelector('.get-involved-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      // TODO: Replace with your Google Apps Script deployment URL
      const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
      
      // If URL is not set, show success for testing
      if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        console.log('Form data (not submitted - no URL configured):', data);
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Show thank you message
        formSection.hidden = true;
        thanksSection.hidden = false;
        return;
      }

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script requires no-cors
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      // With no-cors, we can't read the response, so assume success
      console.log('Form submitted successfully:', data);
      
      // Show thank you message
      formSection.hidden = true;
      thanksSection.hidden = false;

    } catch (error) {
      console.error('Form submission error:', error);
      
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    }
  }

  // Form submission handler
  form.addEventListener('submit', handleFormSubmit);

  // Close button handler
  closeBtn.addEventListener('click', () => closeGetInvolvedOverlay());

  // Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && !overlay.hidden) {
      closeGetInvolvedOverlay();
    }
  });

  // Backdrop click handler
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('get-involved-overlay__backdrop')) {
      closeGetInvolvedOverlay();
    }
  });
}

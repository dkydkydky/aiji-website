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
  initRotatingWords(); // Must be before initHeroSwipeStates
  initHeroSwipeStates();
  initLazyScrollReveal();
  initLogoAnimation();
  initVideoHeaderLayout();
  initScrollEffects();
  initFormHandling();
  initAnimations();
  initActiveNavTracking();
  initLogoClick();
  initResponsiveResize();
});

/**
 * Section Snapping - Programmatic snap to sections on scroll
 */
// Global flag for snap-back state
let isSnappingBack = false;

function initSectionSnapping() {
  const videoHeader = document.querySelector('.video-header');
  const heroSection = document.querySelector('.hero');
  const videoPlayer = videoHeader ? videoHeader.querySelector('.video-header-player') : null;
  const contentWrapper = videoHeader ? videoHeader.querySelector('.video-header-content-wrapper') : null;
  
  if (!videoHeader || !heroSection || !videoPlayer || !contentWrapper) return;
  
  const videoHeaderHeight = videoHeader.offsetHeight;
  let isAnimating = false;
  let hasDetectedSwipe = false;
  let swipeDirection = 0;
  
  function animateLogoToTop() {
    if (isAnimating) return;
    isAnimating = true;
    
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
      }
      
      if (progress < 1) {
        requestAnimationFrame(animatePhase1);
      } else {
        // Phase 1 complete, immediately start Phase 2
        startPageTransition();
      }
    }
    
    function startPageTransition() {
      // Phase 2: Now animate everything together - video scrolls up, Our Purpose appears
      const startPosition = 0;
      const targetPosition = videoHeaderHeight;
      const phase2Duration = 600;
      const phase2StartTime = performance.now();
      
      function animatePhase2(currentTime) {
        const elapsed = currentTime - phase2StartTime;
        const progress = Math.min(elapsed / phase2Duration, 1);
        
        // Easing function (ease-out-cubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const newPosition = startPosition + (targetPosition - startPosition) * easeProgress;
        window.scrollTo(0, newPosition);
        
        if (progress < 1) {
          requestAnimationFrame(animatePhase2);
        } else {
          // Animation complete - ensure we're exactly at target position
          window.scrollTo(0, targetPosition);
          
          // Reset everything
          isAnimating = false;
          hasDetectedSwipe = false;
          if (contentWrapper) {
            contentWrapper.style.transform = '';
            contentWrapper.style.transition = '';
          }
        }
      }
      
      requestAnimationFrame(animatePhase2);
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
    const currentScroll = window.scrollY;
    
    // Prevent scrolling past target during animation
    if (isAnimating) {
      e.preventDefault();
      return;
    }
    
    // Only intercept if we're at the top and not already animating
    if (currentScroll === 0 && !isAnimating && !hasDetectedSwipe) {
      e.preventDefault();
      
      // Detect swipe direction on first movement
      if (e.deltaY > 0) {
        swipeDirection = 1; // Swipe UP (scrolling down)
        hasDetectedSwipe = true;
        // Immediately trigger animation
        animateLogoToTop();
      } else if (e.deltaY < 0) {
        swipeDirection = -1; // Swipe DOWN (scrolling up)
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
 * Hero Swipe States - Progressive element reveal within What We Do section
 */
function initHeroSwipeStates() {
  const heroSection = document.querySelector('.hero');
  const step1 = document.querySelector('.hero-step-1');
  const step2 = document.querySelector('.hero-step-2');
  const step3 = document.querySelector('.hero-step-3');
  
  if (!heroSection || !step1 || !step2 || !step3) return;
  
  // Initiative items and descriptions for sub-states
  const initiativeItems = document.querySelectorAll('.hero-initiative-item');
  const initiativeDescs = document.querySelectorAll('.hero-initiative-desc');
  
  let currentState = 1; // Main states: 1, 2, 3
  let currentSubState = 1; // Sub-states for initiatives: 1, 2, 3, 4
  let isAnimating = false;
  let isSubStateLocked = false; // Lock during gesture
  let subStateUnlockTimer = null; // Timer to unlock after gesture ends
  let isInHeroSection = false;
  let lastWheelTime = 0;
  let sectionEntryTime = 0; // Track when section becomes visible
  let stateChangeTime = 0; // Track when state changes to prevent rapid transitions
  const maxState = 3; // Total main states
  const maxSubState = 4; // Total sub-states in state 3
  
  // Initially show only step 1
  step1.classList.add('active');
  step2.classList.remove('active');
  step3.classList.remove('active');
  
  // Initialize initiatives - first one active
  function updateInitiativeSubState(subState) {
    initiativeItems.forEach((item, index) => {
      if (index + 1 === subState) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    initiativeDescs.forEach((desc, index) => {
      if (index + 1 === subState) {
        desc.classList.add('active');
      } else {
        desc.classList.remove('active');
      }
    });
  }
  
  // Set initial sub-state
  updateInitiativeSubState(1);
  
  // Detect when user enters hero section
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
        isInHeroSection = true;
        sectionEntryTime = Date.now(); // Mark entry time
        // Reset to state 1 when entering from top
        if (window.scrollY < heroSection.offsetTop + 100) {
          currentState = 1;
          step1.classList.add('active');
          step1.style.opacity = '1';
          step1.style.transform = 'translateY(0)';
          step2.classList.remove('active');
          step3.classList.remove('active');
          currentSubState = 1;
          updateInitiativeSubState(1);
          
          // Stop rotating words when resetting to state 1
          if (window.stopRotatingWords) {
            window.stopRotatingWords();
          }
        }
      } else {
        isInHeroSection = false;
        // Stop rotating words when leaving section
        if (window.stopRotatingWords) {
          window.stopRotatingWords();
        }
      }
    });
  }, { threshold: [0.5, 0.8] });
  
  heroObserver.observe(heroSection);
  
  // Handle wheel events on hero section
  heroSection.addEventListener('wheel', (e) => {
    const now = Date.now();
    
    // Debounce - prevent multiple rapid triggers
    if (now - lastWheelTime < 100) {
      e.preventDefault();
      return;
    }
    
    // CRITICAL: Ignore ALL wheel events for 800ms after section becomes visible
    // This prevents auto-advance from scroll momentum/snap completion
    if (now - sectionEntryTime < 800) {
      e.preventDefault();
      return;
    }
    
    // Prevent rapid state changes - require cooldown between state transitions
    // Same cooldown for sub-states to ensure stopping at each category
    const requiredCooldown = (currentState >= 2) ? 1000 : 500;
    const timeSinceStateChange = now - stateChangeTime;
    if (timeSinceStateChange < requiredCooldown) {
      e.preventDefault();
      console.log(`Cooldown active (${timeSinceStateChange}ms / ${requiredCooldown}ms required), ignoring wheel event`);
      return;
    }
    
    if (isAnimating || !isInHeroSection) {
      if (isAnimating) e.preventDefault();
      return;
    }
    
    const scrollingDown = e.deltaY > 0;
    const scrollingUp = e.deltaY < 0;
    
    if (scrollingDown) {
      e.preventDefault();
      lastWheelTime = now;
      
      if (currentState < maxState) {
        // Advance to next main state
        advanceState();
      } else if (currentState === maxState && currentSubState < maxSubState) {
        // In state 3, advance sub-state - immediate response
        if (isSubStateLocked) {
          resetSubStateUnlockTimer();
          return;
        }
        advanceSubState();
      } else if (currentState === maxState && currentSubState === maxSubState) {
        // Last sub-state → Exit to Builders (also check lock to prevent skipping)
        if (isSubStateLocked) {
          resetSubStateUnlockTimer();
          return;
        }
        console.log('Transitioning to Builders section');
        exitHeroSection();
      }
      return;
    } else if (scrollingUp) {
      lastWheelTime = now;
      
      if (currentState === maxState && currentSubState > 1) {
        // In state 3, regress sub-state - immediate response
        if (isSubStateLocked) {
          resetSubStateUnlockTimer();
          e.preventDefault();
          return;
        }
        e.preventDefault();
        regressSubState();
      } else if (currentState > 1) {
        // Go back to previous main state
        e.preventDefault();
        regressState();
      } else if (currentState === 1) {
        // At state 1, allow scroll to go back to video header
        // Don't prevent default - let natural scroll happen
        console.log('At state 1, allowing scroll to header');
      }
    }
  }, { passive: false });
  
  // Reset the unlock timer - called on each wheel event during gesture
  function resetSubStateUnlockTimer() {
    if (subStateUnlockTimer) {
      clearTimeout(subStateUnlockTimer);
    }
    // Unlock after 200ms of no wheel events (gesture ended)
    subStateUnlockTimer = setTimeout(() => {
      isSubStateLocked = false;
      console.log('Sub-state unlocked - ready for next gesture');
    }, 200);
  }
  
  function advanceSubState() {
    isSubStateLocked = true;
    currentSubState++;
    updateInitiativeSubState(currentSubState);
    console.log('Advanced to sub-state:', currentSubState);
    resetSubStateUnlockTimer();
  }
  
  function regressSubState() {
    isSubStateLocked = true;
    currentSubState--;
    updateInitiativeSubState(currentSubState);
    console.log('Regressed to sub-state:', currentSubState);
    resetSubStateUnlockTimer();
  }
  
  function advanceState() {
    console.log('advanceState called, currentState:', currentState, 'isAnimating:', isAnimating);
    if (isAnimating) return;
    isAnimating = true;
    
    if (currentState === 1) {
      // State 1 → 2: Fade out paragraph, fade in "We harness" + rotating words
      console.log('Transitioning 1 → 2');
      step1.style.opacity = '0';
      step1.style.transform = 'translateY(-40px)';
      
      setTimeout(() => {
        step1.classList.remove('active');
        console.log('Step 1 removed, adding step 2');
        
        // Reset step 2 styles before making it active
        step2.style.opacity = '';
        step2.style.transform = '';
        step2.classList.add('active');
        
        currentState = 2;
        stateChangeTime = Date.now();
        
        // Start rotating words after a brief delay
        setTimeout(() => {
          if (window.startRotatingWords) {
            window.startRotatingWords();
          }
          isAnimating = false;
        }, 100);
      }, 600);
      
    } else if (currentState === 2) {
      // State 2 → 3: Fade out step 2, show initiatives (step 3)
      console.log('Transitioning 2 → 3');
      
      // Stop rotating words
      if (window.stopRotatingWords) {
        window.stopRotatingWords();
      }
      
      step2.style.opacity = '0';
      step2.style.transform = 'translateY(-40px)';
      
      setTimeout(() => {
        step2.classList.remove('active');
        step2.style.opacity = '';
        step2.style.transform = '';
        
        // Show step 3 with initiatives
        step3.style.opacity = '';
        step3.style.transform = '';
        step3.classList.add('active');
        
        // Reset sub-state to 1
        currentSubState = 1;
        updateInitiativeSubState(1);
        
        currentState = 3;
        stateChangeTime = Date.now();
        console.log('State 3 active (initiatives)');
        
        isAnimating = false;
      }, 600);
    }
  }
  
  function exitHeroSection() {
    if (isAnimating) return;
    isAnimating = true;
    
    console.log('Exiting hero section, fading all content');
    
    // Fade out all active steps
    step1.style.opacity = '0';
    step1.style.transform = 'translateY(-40px)';
    step2.style.opacity = '0';
    step2.style.transform = 'translateY(-40px)';
    step3.style.opacity = '0';
    step3.style.transform = 'translateY(-40px)';
    
    // After fade out, scroll to Builders section
    setTimeout(() => {
      const buildersSection = document.querySelector('.builder-stories');
      if (buildersSection) {
        const targetScroll = buildersSection.offsetTop;
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
      
      // Reset hero section for next time
      setTimeout(() => {
        step1.classList.remove('active');
        step2.classList.remove('active');
        step3.classList.remove('active');
        step1.style.opacity = '';
        step1.style.transform = '';
        step2.style.opacity = '';
        step2.style.transform = '';
        step3.style.opacity = '';
        step3.style.transform = '';
        currentState = 1;
        currentSubState = 1;
        updateInitiativeSubState(1);
        isAnimating = false;
      }, 600);
    }, 600);
  }
  
  function regressState() {
    console.log('regressState called, currentState:', currentState, 'isAnimating:', isAnimating);
    if (isAnimating) return;
    isAnimating = true;
    
    if (currentState === 3) {
      // State 3 → 2: Fade out initiatives (step3), show step2
      console.log('Transitioning 3 → 2');
      step3.style.opacity = '0';
      step3.style.transform = 'translateY(40px)';
      
      setTimeout(() => {
        step3.classList.remove('active');
        step3.style.opacity = '';
        step3.style.transform = '';
        
        // Show step 2
        step2.style.opacity = '';
        step2.style.transform = '';
        step2.classList.add('active');
        
        // Restart rotating words
        if (window.startRotatingWords) {
          window.startRotatingWords();
        }
        
        currentState = 2;
        stateChangeTime = Date.now();
        console.log('Back to state 2');
        isAnimating = false;
      }, 600);
      
    } else if (currentState === 2) {
      // State 2 → 1: Fade out step2, fade in paragraph
      console.log('Transitioning 2 → 1');
      step2.style.opacity = '0';
      step2.style.transform = 'translateY(40px)';
      
      // Stop rotating words animation
      if (window.stopRotatingWords) {
        window.stopRotatingWords();
      }
      
      setTimeout(() => {
        step2.classList.remove('active');
        step2.style.opacity = '';
        step2.style.transform = '';
        
        // Reset and activate step 1
        step1.style.opacity = '';
        step1.style.transform = '';
        step1.classList.add('active');
        
        currentState = 1;
        stateChangeTime = Date.now();
        console.log('Back to state 1');
        isAnimating = false;
      }, 600);
    }
  }
}

/**
 * Section Transitions - Handle snap scrolling and fade effects between sections
 */
function initSectionTransitions() {
  const sections = document.querySelectorAll('.video-header, .hero, .builder-stories, .salary-journey-section, .track-record, .press-quote, .real-people, .urgency, .signup-section, .initiatives, .council, .partners, .footer');
  
  if (sections.length === 0) return;
  
  const videoHeader = document.querySelector('.video-header');
  const videoPlayer = videoHeader ? videoHeader.querySelector('.video-header-player') : null;
  const videoOverlay = videoHeader ? videoHeader.querySelector('.video-header-overlay') : null;
  const heroSection = document.querySelector('.hero');
  
  // Handle overlay fade ONLY when actually scrolling (not during swipe detection)
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
  // Hero section - now controlled by initHeroSwipeStates(), skip lazy reveal
  // (Hero steps are now managed by the swipe state machine)
  
  // Always keep hero label visible
  const heroLabel = document.querySelector('.hero-label');
  if (heroLabel) {
    heroLabel.style.opacity = '1';
    heroLabel.style.visibility = 'visible';
  }
  
  // Other sections - reveal elements on scroll
  const revealElements = document.querySelectorAll(
    '.builder-stories-text, .builder-stories-video, ' +
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
 * Logo Animation - Handles the logo transition from video header to nav
 */
function initLogoAnimation() {
  const nav = document.querySelector('.nav');
  const videoHeader = document.querySelector('#video-header');
  const videoHeaderText = document.querySelector('.video-header-text');
  const wrapper = document.querySelector('.video-header-content-wrapper');
  
  if (!videoHeader || !wrapper || !nav) return;
  
  // Prevent animation from running for first 100ms to allow page to settle
  let animationEnabled = false;
  setTimeout(() => {
    animationEnabled = true;
  }, 100);
  
  // CLEANUP: Remove any duplicate logos or logos in wrong places
  // Remove any logo elements that are direct children of body
  document.querySelectorAll('body > .video-header-logo').forEach(logo => {
    logo.remove();
  });
  
  // Remove any placeholders
  document.querySelectorAll('.video-header-logo-placeholder').forEach(el => {
    el.remove();
  });
  
  // Ensure there's exactly one logo in the wrapper
  let videoHeaderLogo = wrapper.querySelector('.video-header-logo');
  if (!videoHeaderLogo) {
    // Create the logo element
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
  
  // Ensure the logo has only the white image
  const allImgs = videoHeaderLogo.querySelectorAll('img');
  allImgs.forEach(img => {
    if (img.src.includes('Black')) {
      img.remove();
    } else if (img.src.includes('White')) {
      img.style.cssText = ''; // Reset all inline styles
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
  
  // Animation state
  let state = {
    logoReachedTop: false,
    logoFadeComplete: false,
    logoShrinkComplete: false,
    phraseOffScreen: false,
    logoMovedToBody: false,
    initialLogoTop: null
  };
  
  // Initially hide nav
  nav.classList.add('hidden-on-video');
  document.body.classList.remove('logo-at-top');
  nav.classList.remove('logo-at-top');
  
  // Update video header height on resize
  window.addEventListener('resize', () => {
    videoHeaderHeight = videoHeader.offsetHeight;
  });
  
  // Get initial logo position
  function getInitialLogoPosition() {
    if (state.initialLogoTop === null && window.scrollY === 0) {
      const logoRect = videoHeaderLogo.getBoundingClientRect();
      state.initialLogoTop = logoRect.top + window.scrollY;
    }
  }
  
  // Reset logo to original state
  function resetLogoToOriginal() {
    console.log('Resetting logo to original state');
    
    // Immediately hide wrapper with no transition
    wrapper.style.transition = 'none';
    wrapper.style.opacity = '0';
    wrapper.style.visibility = 'hidden';
    
    // Force reflow to ensure hide is applied
    void wrapper.offsetHeight;
    
    // Reset state flags
    state.logoReachedTop = false;
    state.logoFadeComplete = false;
    state.logoShrinkComplete = false;
    state.phraseOffScreen = false;
    state.logoMovedToBody = false;
    state.initialLogoTop = null;
    
    // Remove animation classes
    videoHeaderLogo.classList.remove('animating', 'at-top');
    
    // Reset inline styles
    videoHeaderLogo.style.cssText = '';
    
    // Move logo back to wrapper if it was moved to body
    if (videoHeaderLogo.parentNode === document.body) {
      // Remove any placeholder
      const placeholder = wrapper.querySelector('.video-header-logo-placeholder');
      if (placeholder) {
        wrapper.insertBefore(videoHeaderLogo, placeholder);
        placeholder.remove();
      } else {
        wrapper.insertBefore(videoHeaderLogo, wrapper.firstChild);
      }
    }
    
    // Remove black logo, ensure white logo exists
    const allImgs = videoHeaderLogo.querySelectorAll('img');
    allImgs.forEach(img => {
      if (img.src.includes('Black')) {
        img.remove();
      } else if (img.src.includes('White')) {
        img.style.cssText = ''; // Reset all inline styles
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
    
    // Reset phrase position first
    if (videoHeaderText) {
      videoHeaderText.style.cssText = '';
      videoHeaderText.style.fontSize = ''; // Clear any custom sizing
    }
    
    // IMMEDIATELY check if we need stacked layout BEFORE showing
    wrapper.classList.remove('stacked');
    void wrapper.offsetHeight; // Force reflow
    
    const logoRect = videoHeaderLogo.getBoundingClientRect();
    const textRect = videoHeaderText.getBoundingClientRect();
    
    // If elements overlap OR on mobile, add stacked class immediately
    const isMobile = window.innerWidth <= 768;
    if (logoRect.right + 20 >= textRect.left || isMobile) {
      wrapper.classList.add('stacked');
      void wrapper.offsetHeight; // Force another reflow with stacked class applied
      
      // For mobile stacked layout, adjust text size to fit - do it synchronously
      const wrapperRect = wrapper.getBoundingClientRect();
      const textStyles = window.getComputedStyle(videoHeaderText);
      const availableWidth = wrapperRect.width - 40; // Account for padding
      
      videoHeaderText.style.fontSize = '5.5rem';
      
      const measureEl = document.createElement('span');
      measureEl.style.cssText = `
        position: absolute; visibility: hidden; white-space: nowrap;
        font-family: ${textStyles.fontFamily}; font-weight: ${textStyles.fontWeight};
        font-size: 5.5rem; letter-spacing: ${textStyles.letterSpacing};
      `;
      measureEl.textContent = videoHeaderText.textContent.trim();
      document.body.appendChild(measureEl);
      
      const textContentWidth = measureEl.offsetWidth;
      document.body.removeChild(measureEl);
      
      if (textContentWidth > availableWidth && availableWidth > 0) {
        const scale = availableWidth / textContentWidth;
        videoHeaderText.style.fontSize = `${Math.max(2, 5.5 * scale)}rem`;
      }
    }
    
    // Reset nav
    nav.style.background = '';
    nav.style.transition = '';
    document.body.classList.remove('logo-at-top');
    nav.classList.add('hidden-on-video');
    nav.classList.remove('logo-at-top');
    
    // Force one final reflow to ensure all layout is complete
    void wrapper.offsetHeight;
    
    // Now fade in with transition
    wrapper.style.visibility = 'visible';
    wrapper.style.transition = 'opacity 0.3s ease';
    wrapper.style.opacity = '1';
  }
  
  // Check scroll position and animate logo
  function checkScroll() {
    // Don't run animation until page has settled
    if (!animationEnabled) return;
    
    const currentScroll = window.scrollY;
    
    // Only reset if at absolute top AND user manually scrolled there (not snapped back)
    // Don't reset if we're anywhere below the video header
    if (currentScroll === 0) {
      if (state.logoReachedTop) {
        resetLogoToOriginal();
      }
      return;
    }
    
    // If we're in the video header zone but not at absolute top, don't reset
    if (currentScroll > 0 && currentScroll <= 10) {
      return;
    }
    
    // Get initial position if not set
    if (state.initialLogoTop === null) {
      getInitialLogoPosition();
      if (state.initialLogoTop === null && currentScroll > 0) {
        state.initialLogoTop = videoHeaderHeight * 0.5;
      }
    }
    
    if (state.initialLogoTop === null) return;
    
    // Calculate logo position
    const naturalLogoTop = state.initialLogoTop - currentScroll;
    const logoRect = videoHeaderLogo.getBoundingClientRect();
    const logoTopInViewport = logoRect.top;
    
    // Check if phrase is off screen
    if (videoHeaderText && !state.phraseOffScreen) {
      const phraseRect = videoHeaderText.getBoundingClientRect();
      if (phraseRect.bottom < 0) {
        state.phraseOffScreen = true;
      }
    }
    
    // Phase 1: Logo reaches top and becomes fixed
    if (!state.logoReachedTop && (logoTopInViewport <= topPadding || naturalLogoTop <= topPadding || currentScroll > videoHeaderHeight * 0.8)) {
      state.logoReachedTop = true;
      videoHeaderLogo.classList.add('animating', 'at-top');
      
      // Move logo to body for proper fixed positioning
      if (videoHeaderLogo.parentNode === wrapper && !state.logoMovedToBody) {
        const logoWidth = videoHeaderLogo.offsetWidth || 200;
        const logoHeight = videoHeaderLogo.offsetHeight || 100;
        
        state.logoMovedToBody = true;
        document.body.appendChild(videoHeaderLogo);
        
        // Add placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'video-header-logo-placeholder';
        placeholder.style.cssText = `width: ${logoWidth}px; height: ${logoHeight}px; flex-shrink: 0; visibility: hidden;`;
        wrapper.insertBefore(placeholder, wrapper.firstChild);
        wrapper.classList.remove('stacked');
      }
      
      // Fix position at top
      videoHeaderLogo.style.position = 'fixed';
      videoHeaderLogo.style.top = `${topPadding}px`;
      videoHeaderLogo.style.left = '15px';
      videoHeaderLogo.style.transform = 'scale(1.6)';
      videoHeaderLogo.style.transformOrigin = 'left center';
      videoHeaderLogo.style.zIndex = '1001';
    }
    
    // Phase 2: Start fade and shrink after phrase is off screen
    if (state.logoReachedTop && state.phraseOffScreen && !state.logoFadeComplete) {
      // Show nav
      document.body.classList.add('logo-at-top');
      nav.classList.remove('hidden-on-video');
      nav.classList.add('logo-at-top');
      
      // Fade white to black and shrink
      const img = videoHeaderLogo.querySelector('img');
      if (img && img.src.includes('White') && !videoHeaderLogo.querySelector('img[src*="Black"]')) {
        img.style.transition = 'opacity 0.6s ease-out';
        img.style.position = 'relative';
        img.style.zIndex = '1';
        
        // Create black logo
        const blackImg = document.createElement('img');
        blackImg.src = img.src.replace('White', 'Black');
        blackImg.className = 'logo-full-svg';
        blackImg.style.cssText = `
          position: absolute; top: 0; left: 0; opacity: 0;
          transition: opacity 0.6s ease-in, height 0.3s ease-in-out;
          height: auto; width: auto; pointer-events: none; z-index: 2;
        `;
        videoHeaderLogo.appendChild(blackImg);
        
        // Animate
        setTimeout(() => {
          img.style.opacity = '0';
          blackImg.style.opacity = '1';
          blackImg.style.height = '56px';
          videoHeaderLogo.style.transition = 'transform 0.3s ease-in-out';
          videoHeaderLogo.style.transform = 'scale(1)';
          
          setTimeout(() => {
            // REMOVE white image from DOM (not just hide - CSS has !important that overrides)
            img.remove();
            blackImg.style.position = 'relative';
            state.logoFadeComplete = true;
            state.logoShrinkComplete = true;
            
            // Fade in nav background
            setTimeout(() => {
              nav.style.background = '#FFF3E9';
              nav.style.transition = 'background 0.5s ease-in';
            }, 200);
          }, 650);
        }, 50);
      }
    }
    
    // Keep logo visible and fixed when at top
    if (state.logoReachedTop) {
      videoHeaderLogo.style.position = 'fixed';
      videoHeaderLogo.style.top = `${topPadding}px`;
      videoHeaderLogo.style.left = '15px';
      videoHeaderLogo.style.opacity = '1';
      videoHeaderLogo.style.visibility = 'visible';
      videoHeaderLogo.style.zIndex = '1001';
    }
  }
  
  // Listen for scroll
  window.addEventListener('scroll', checkScroll, { passive: true });
  
  // Initial check
  setTimeout(() => {
    getInitialLogoPosition();
    checkScroll();
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
 * Rotating words animation for hero title
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
  
  // Generate random coordinates for disperse animation
  function getRandomCoordinates() {
    const x = (Math.random() - 0.5) * 1200; // -600px to 600px
    const y = (Math.random() - 0.5) * 1200;
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
  function buildWord(word) {
    rotatingWordEl.innerHTML = '';
    const letters = word.split('');
    const letterElements = [];
    
    // Create all letter elements first
    letters.forEach((char, index) => {
      if (char === ' ') {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        space.style.display = 'inline-block';
        space.style.width = '0.3em';
        rotatingWordEl.appendChild(space);
        letterElements.push(null); // Placeholder for spaces
      } else {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'rotating-word-letter';
        letterSpan.textContent = char;
        letterSpan.style.opacity = '0';
        rotatingWordEl.appendChild(letterSpan);
        letterElements.push(letterSpan);
      }
    });
    
    // Animate letters in random order
    const letterIndices = letterElements
      .map((el, idx) => el ? idx : null)
      .filter(idx => idx !== null);
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
    
    // Disperse current word (teleport - no transition)
    randomOrder.forEach((index, i) => {
      setTimeout(() => {
        const letter = currentLetters[index];
        if (letter) {
          const coords = getRandomCoordinates();
          letter.style.transition = 'none'; // No animation - instant teleport
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
    
    /* Ensure hero label is always visible */
    .hero-label.revealed {
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
 * Logo Click Handler - Scroll to top when logo is clicked
 */
function initLogoClick() {
  // Find all logo elements (video header logo and any at-top logo)
  const logos = document.querySelectorAll('.video-header-logo, .logo-full, .nav-logo');
  
  logos.forEach(logo => {
    logo.style.cursor = 'pointer';
    
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
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
      // Get the first hero step (paragraph section)
      const heroStep = document.querySelector('.hero-step:first-child');
      const wrapper = document.querySelector('.hero-text-pursuit-wrapper');
      
      if (heroStep && wrapper) {
        // Force recalculation of centering
        heroStep.style.minHeight = '100vh';
        
        // Force reflow
        void heroStep.offsetHeight;
        
        // Ensure flexbox centering is applied
        heroStep.style.display = 'flex';
        heroStep.style.alignItems = 'center';
        heroStep.style.justifyContent = 'center';
      }
      
      // Also trigger video header layout check for mobile stacking
      const layoutCheckEvent = new Event('resize');
      window.dispatchEvent(layoutCheckEvent);
    }, 150);
  }
  
  // Listen for window resize
  window.addEventListener('resize', handleResize);
}

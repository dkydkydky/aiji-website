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
  
  initSectionTransitions();
  initLazyScrollReveal();
  initLogoAnimation();
  initVideoHeaderLayout();
  initRotatingWords();
  initScrollEffects();
  initFormHandling();
  initAnimations();
});

/**
 * Section Transitions - Handle snap scrolling and fade effects between sections
 */
function initSectionTransitions() {
  const sections = document.querySelectorAll('.video-header, .hero, .builder-stories, .salary-journey-section, .track-record, .press-quote, .real-people, .urgency, .signup-section, .initiatives, .council, .partners, .footer');
  
  if (sections.length === 0) return;
  
  // Create intersection observer for section visibility
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      
      if (entry.isIntersecting) {
        // Section is entering view
        section.classList.add('section-visible');
        section.classList.remove('section-hidden');
        
        // Special handling for video header
        if (section.classList.contains('video-header')) {
          handleVideoHeaderVisible(section);
        }
      } else {
        // Section is leaving view
        section.classList.add('section-hidden');
        section.classList.remove('section-visible');
        
        // Special handling for video header
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
  
  // Initial state - video header is visible, show without fade
  const videoHeader = document.querySelector('.video-header');
  if (videoHeader) {
    videoHeader.classList.add('section-visible', 'initial-load');
  }
}

/**
 * Handle video header becoming visible
 */
function handleVideoHeaderVisible(videoHeader) {
  const video = videoHeader.querySelector('.video-header-player');
  if (video) {
    video.play().catch(e => console.log('Video play error:', e));
  }
  
  // Ensure content is visible
  const wrapper = videoHeader.querySelector('.video-header-content-wrapper');
  if (wrapper) {
    wrapper.style.opacity = '1';
    wrapper.style.visibility = 'visible';
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
  // Select all elements that should reveal on scroll
  const revealElements = document.querySelectorAll(
    '.hero-image-01, .hero-text-collective, .hero-title-wrapper, .hero-image-02, .hero-text-pursuit, ' +
    '.builder-stories-text, .builder-stories-video, ' +
    '.stat-card, .demo-card, .initiative-card, .council-card, .partner-card, .urgency-card, .investment-card, ' +
    '.quote-block, .signup-card'
  );
  
  if (revealElements.length === 0) return;
  
  // Set initial state for all reveal elements
  revealElements.forEach(el => {
    el.classList.add('reveal-element');
  });
  
  // Create intersection observer for reveal elements
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered delay based on element's position in its parent
        const element = entry.target;
        const siblings = Array.from(element.parentElement.querySelectorAll('.reveal-element'));
        const index = siblings.indexOf(element);
        
        // Stagger the reveal
        setTimeout(() => {
          element.classList.add('revealed');
        }, index * 100); // 100ms stagger between elements
        
        // Stop observing once revealed
        revealObserver.unobserve(element);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all reveal elements
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  // Also handle the hero label separately (always visible when hero is visible)
  const heroLabel = document.querySelector('.hero-label');
  if (heroLabel) {
    heroLabel.classList.add('revealed');
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
      wrapper.classList.remove('stacked');
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
    
    // Reset nav
    nav.style.background = '';
    nav.style.transition = '';
    document.body.classList.remove('logo-at-top');
    nav.classList.add('hidden-on-video');
    nav.classList.remove('logo-at-top');
    
    // Reset phrase position
    if (videoHeaderText) {
      videoHeaderText.style.cssText = '';
    }
  }
  
  // Check scroll position and animate logo
  function checkScroll() {
    // Don't run animation until page has settled
    if (!animationEnabled) return;
    
    const currentScroll = window.scrollY;
    
    // If at top of page, reset everything
    if (currentScroll <= 10) {
      if (state.logoReachedTop) {
        resetLogoToOriginal();
      }
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
      videoHeaderLogo.style.transform = 'scale(1.5)';
      videoHeaderLogo.style.transformOrigin = 'top left';
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
function initRotatingWords() {
  const rotatingWordEl = document.getElementById('rotating-word');
  if (!rotatingWordEl) return;
  
  const words = [
    'AI Workforce',
    'AI-Powered World',
    'a Bright Future',
    'Transformation',
    'Insightful Data',
    'Opportunity',
    'Innovation',
    'a New Beginning',
    'Community',
    'Progress'
  ];
  
  const directions = [
    'direction-left', 'direction-right', 'direction-up', 'direction-down',
    'direction-up-left', 'direction-up-right', 'direction-down-left', 'direction-down-right'
  ];
  
  let currentIndex = 0;
  
  function buildWord(word) {
    rotatingWordEl.innerHTML = '';
    const letters = word.split('');
    
    letters.forEach((char) => {
      if (char === ' ') {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        rotatingWordEl.appendChild(space);
      } else {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'rotating-word-letter';
        letterSpan.textContent = char;
        letterSpan.classList.add(directions[Math.floor(Math.random() * directions.length)]);
        letterSpan.style.animationDelay = '0s';
        rotatingWordEl.appendChild(letterSpan);
        
        requestAnimationFrame(() => {
          letterSpan.classList.add('animate-in');
        });
      }
    });
  }
  
  function rotateWord() {
    rotatingWordEl.style.opacity = '0';
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      rotatingWordEl.style.opacity = '1';
      buildWord(words[currentIndex]);
    }, 300);
  }
  
  rotatingWordEl.style.opacity = '1';
  buildWord(words[0]);
  rotatingWordEl.style.transition = 'opacity 0.3s ease';
  setInterval(rotateWord, 3000);
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

/**
 * AI Jobs Institute - Website JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initFormHandling();
  initAnimations();
  initVideoHeaderLayout();
  initRotatingWords();
  initHeroScrollReveal();
});

/**
 * Navigation functionality
 */
/**
 * Video header layout - stack logo and tagline when they touch
 */
function initVideoHeaderLayout() {
  const wrapper = document.querySelector('.video-header-content-wrapper');
  const logo = document.querySelector('.video-header-logo');
  const text = document.querySelector('.video-header-text');
  
  if (!wrapper || !logo || !text) return;
  
  function checkLayout() {
    // Don't check layout if logo is fixed (has been animated to top)
    // This prevents the phrase from jumping to the left
    if (logo.classList.contains('animating') || logo.classList.contains('at-top')) {
      return;
    }
    
    // Temporarily remove stacked class to check actual positions
    wrapper.classList.remove('stacked');
    
    void wrapper.offsetHeight; // Force a reflow
    
    const logoRect = logo.getBoundingClientRect();
    const textRect = text.getBoundingClientRect();
    
    // Check if logo and text would overlap (with a small buffer)
    const wouldOverlap = logoRect.right + 20 >= textRect.left;
    
    if (wouldOverlap) {
      wrapper.classList.add('stacked');
      
      // Wait for layout to settle, then calculate font size
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Set text to full size first to measure
          text.style.fontSize = '5.5rem';
          void text.offsetWidth; // Force reflow
          
          // Get actual measurements - wait one more frame for accurate layout
          requestAnimationFrame(() => {
            const wrapperRect = wrapper.getBoundingClientRect();
            const textStyles = window.getComputedStyle(text);
            
            const paddingLeft = parseFloat(textStyles.paddingLeft) || 0;
            const paddingRight = parseFloat(textStyles.paddingRight) || 0;
            
            // Available width: wrapper width minus padding, with generous buffer
            const availableWidth = wrapperRect.width - paddingLeft - paddingRight - 10;
            
            // Create a measurement element to get accurate text width
            const measureEl = document.createElement('span');
            measureEl.style.cssText = `
              position: absolute;
              visibility: hidden;
              white-space: nowrap;
              font-family: ${textStyles.fontFamily};
              font-weight: ${textStyles.fontWeight};
              font-size: 5.5rem;
              letter-spacing: ${textStyles.letterSpacing};
            `;
            measureEl.textContent = text.textContent.trim();
            document.body.appendChild(measureEl);
            
            const textContentWidth = measureEl.offsetWidth;
            document.body.removeChild(measureEl);
            
            // Calculate scale if text is too wide
            if (textContentWidth > availableWidth && availableWidth > 0) {
              const scale = availableWidth / textContentWidth;
              const newFontSize = Math.max(2, 5.5 * scale);
              text.style.fontSize = `${newFontSize}rem`;
            } else {
              text.style.fontSize = '5.5rem';
            }
          });
        });
      });
    } else {
      wrapper.classList.remove('stacked');
      text.style.fontSize = '';
    }
  }
  
  // Check on load and resize
  checkLayout();
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      checkLayout();
      setTimeout(checkLayout, 100);
    }, 50);
  });
  
  const logoImg = logo.querySelector('img');
  if (logoImg) {
    logoImg.addEventListener('load', checkLayout);
    if (logoImg.complete) {
      checkLayout();
    }
  }
}

/**
 * Navigation functionality
 */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const videoHeader = document.querySelector('#video-header');
  const videoHeaderLogo = document.querySelector('.video-header-logo');
  const videoHeaderText = document.querySelector('.video-header-text');
  const videoHeaderPlayer = document.querySelector('.video-header-player');
  let videoHeaderHeight = videoHeader ? videoHeader.offsetHeight : window.innerHeight;
  const topPadding = -2; // Logo and nav positioned 2px above viewport top
  
  // Safety check: Ensure only one logo element exists
  if (videoHeaderLogo) {
    const allLogos = document.querySelectorAll('.video-header-logo');
    if (allLogos.length > 1) {
      console.warn('Multiple logo elements found! Removing duplicates.');
      // Keep only the first one, remove the rest
      for (let i = 1; i < allLogos.length; i++) {
        allLogos[i].remove();
      }
    }
  }
  
  // Update video header height on resize
  function updateVideoHeaderHeight() {
    if (videoHeader) {
      videoHeaderHeight = videoHeader.offsetHeight;
    }
  }
  window.addEventListener('resize', updateVideoHeaderHeight);
  window.addEventListener('load', updateVideoHeaderHeight);
  
  // Logo animation state
  let logoReachedTop = false;
  let logoFadeComplete = false;
  let logoShrinkComplete = false;
  let initialLogoTop = null;
  let phraseOffScreen = false;
  let navBackgroundFaded = false;
  let logoMovedToBody = false; // Track if logo has been moved to body to prevent duplicates
  let logoAnimationStarted = false; // Track if logo animation has started to prevent multiple triggers
  
  // Initially hide nav on video header
  nav.classList.add('hidden-on-video');
  
  // Get initial logo position (absolute position in document)
  function getInitialLogoPosition() {
    if (videoHeaderLogo && initialLogoTop === null && window.scrollY === 0) {
      const logoRect = videoHeaderLogo.getBoundingClientRect();
      initialLogoTop = logoRect.top + window.scrollY;
    }
  }
  
  // Scroll effect for nav and logo animation
  let lastScroll = 0;
  function checkScroll() {
    const currentScroll = window.scrollY;
    
    // Video overlay fade: start fading when 70% of video height is off screen
    // Use overlay to hide video with background color instead of fading video itself
    if (videoHeader && videoHeader) {
      const fadeStartPoint = videoHeaderHeight * 0.7; // Start fading at 70% scroll
      const fadeEndPoint = videoHeaderHeight; // Complete fade when fully off screen
      
      // Get or create overlay element
      let overlay = videoHeader.querySelector('.video-header-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'video-header-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #FFF3E9;
          opacity: 0;
          z-index: 2;
          pointer-events: none;
          transition: opacity 0.1s ease-out;
        `;
        videoHeader.appendChild(overlay);
      }
      
      if (currentScroll >= fadeStartPoint) {
        // Calculate opacity: 0 at fadeStartPoint, 1 at fadeEndPoint
        const fadeProgress = (currentScroll - fadeStartPoint) / (fadeEndPoint - fadeStartPoint);
        const opacity = Math.min(1, fadeProgress); // Clamp between 0 and 1
        overlay.style.opacity = opacity;
      } else {
        // Reset to 0 opacity if scrolled back up
        overlay.style.opacity = '0';
      }
    }
    
    // Logo animation
    if (videoHeaderLogo) {
      // Get initial position if not set yet
      if (initialLogoTop === null) {
        getInitialLogoPosition();
        // If we still don't have it and we're scrolled, estimate it
        if (initialLogoTop === null && currentScroll > 0 && videoHeader) {
          // Estimate: logo starts roughly in middle of video header
          initialLogoTop = videoHeader.offsetHeight * 0.5;
        }
      }
      
      if (initialLogoTop !== null) {
        // Calculate where logo should be (natural scroll position)
        const naturalLogoTop = initialLogoTop - currentScroll;
        
        // Get the logo's current bounding box to check if top edge is at viewport top
        const logoRect = videoHeaderLogo.getBoundingClientRect();
        const logoTopInViewport = logoRect.top;
        
        // Check if phrase is off screen
        if (videoHeaderText && !phraseOffScreen) {
          const phraseRect = videoHeaderText.getBoundingClientRect();
          if (phraseRect.bottom < 0) {
            phraseOffScreen = true;
          }
        }
        
        // Phase 1: Logo scrolls up naturally, stops when top edge reaches 0px from top
        // Trigger when the logo's top edge reaches the top of the viewport (0px)
        if ((logoTopInViewport <= topPadding || naturalLogoTop <= topPadding || (currentScroll > videoHeaderHeight * 0.8 && !logoReachedTop)) && !logoReachedTop) {
          logoReachedTop = true;
          videoHeaderLogo.classList.add('animating', 'at-top');
          
          // ROOT CAUSE FIX: Move logo outside transformed parent container
          // The .video-header-content-wrapper has transform: translateY(-50%)
          // which creates a new containing block, making position:fixed relative to it
          // Solution: Move logo to body level when it becomes fixed
          const wrapper = document.querySelector('.video-header-content-wrapper');
          
          // Only move if logo is still in wrapper (hasn't been moved yet) AND hasn't been moved before
          if (wrapper && videoHeaderLogo.parentNode === wrapper && !logoMovedToBody) {
            // Store dimensions before moving (needed for placeholder)
            const logoRect = videoHeaderLogo.getBoundingClientRect();
            const logoWidth = logoRect.width || videoHeaderLogo.offsetWidth || 200;
            const logoHeight = logoRect.height || videoHeaderLogo.offsetHeight || 100;
            const originalNextSibling = videoHeaderLogo.nextSibling;
            
            // Mark as moved BEFORE moving to prevent race conditions
            logoMovedToBody = true;
            
            // Safety check: Ensure logo is not already in body
            if (videoHeaderLogo.parentNode !== document.body) {
              // Move logo to body (outside transformed parent) BEFORE setting fixed position
              document.body.appendChild(videoHeaderLogo);
            } else {
              console.warn('Logo already in body, skipping move');
            }
            
            // Check if placeholder already exists to avoid duplicates
            const existingPlaceholder = wrapper.querySelector('.video-header-logo-placeholder');
            if (!existingPlaceholder) {
              // Add placeholder to maintain flexbox spacing in wrapper
              const placeholder = document.createElement('div');
              placeholder.className = 'video-header-logo-placeholder';
              placeholder.style.cssText = `
                width: ${logoWidth}px;
                height: ${logoHeight}px;
                flex-shrink: 0;
                visibility: hidden;
              `;
              if (originalNextSibling) {
                wrapper.insertBefore(placeholder, originalNextSibling);
              } else {
                wrapper.appendChild(placeholder);
              }
            }
            
            wrapper.classList.remove('stacked');
          }
          
          // Fix position at top (keep same size initially) - white logo stops here
          // Position the logo so its top edge is at the top of viewport (0px)
          // Now that logo is in body, position:fixed will work relative to viewport
          videoHeaderLogo.style.position = 'fixed';
          videoHeaderLogo.style.top = `${topPadding}px`;
          videoHeaderLogo.style.left = '15px';
          videoHeaderLogo.style.transform = 'scale(1.5)';
          videoHeaderLogo.style.transformOrigin = 'top left'; // Changed from 'left center' to 'top left'
          videoHeaderLogo.style.zIndex = '1001';
          videoHeaderLogo.style.opacity = '1';
          videoHeaderLogo.style.visibility = 'visible';
          videoHeaderLogo.style.display = 'block';
          
          // White logo now stays at this position until phrase goes off screen
        }
        
        // Phase 2: Start logo animation and nav loading ONLY after phrase is off screen
        if (logoReachedTop && phraseOffScreen && !logoFadeComplete) {
          // Safety check: Ensure logo is still a single element and in the DOM
          const allLogos = document.querySelectorAll('.video-header-logo');
          if (allLogos.length > 1) {
            console.warn('Multiple logo elements detected during animation! Removing duplicates.');
            // Keep only the first one (should be the one we're working with)
            for (let i = 1; i < allLogos.length; i++) {
              allLogos[i].remove();
            }
            // Re-query to get the correct reference
            const correctLogo = document.querySelector('.video-header-logo');
            if (correctLogo && correctLogo !== videoHeaderLogo) {
              // If we got a different reference, update our variable
              // But actually, we should use the original one that's already in body
              if (videoHeaderLogo.parentNode === document.body) {
                // Keep using videoHeaderLogo
              }
            }
          }
          
          // Start nav elements animation when logo animation begins
          document.body.classList.add('logo-at-top');
          nav.classList.remove('hidden-on-video');
          nav.classList.add('logo-at-top');
          
          // Phase 2: Fade white to black (same size) AND shrink
          const img = videoHeaderLogo.querySelector('img');
          // Check if black image already exists to prevent duplicates
          const existingBlackImg = videoHeaderLogo.querySelector('img[src*="Black"]');
          if (existingBlackImg) {
            console.warn('Black logo image already exists, skipping creation');
            return; // Exit early to prevent duplicate animation
          }
          
          if (img && img.src.includes('White')) {
            // Ensure white image has transition and proper positioning
            img.style.transition = 'opacity 0.6s ease-out';
            img.style.position = 'relative';
            img.style.zIndex = '1';
            
            // Create black logo for fade transition
            const blackImg = document.createElement('img');
            blackImg.src = img.src.replace('White', 'Black');
            blackImg.className = 'logo-full-svg';
            blackImg.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              opacity: 0;
              transition: opacity 0.6s ease-in;
              height: auto;
              width: auto;
              pointer-events: none;
              z-index: 2;
            `;
            videoHeaderLogo.appendChild(blackImg);
            
            // Fade transition AND shrink happen simultaneously
            setTimeout(() => {
              // Set up transitions for both fade and shrink
              blackImg.style.transition = 'opacity 0.6s ease-in, height 0.3s ease-in-out, width 0.3s ease-in-out';
              videoHeaderLogo.style.transition = 'transform 0.3s ease-in-out';
              
              // Start BOTH animations simultaneously:
              // 1. Fade: white fades out, black fades in
              img.style.opacity = '0';
              blackImg.style.opacity = '1';
              
              // 2. Shrink: logo shrinks to 56px at the same time
              blackImg.style.height = '56px';
              blackImg.style.width = 'auto';
              videoHeaderLogo.style.transform = 'scale(1)';
              videoHeaderLogo.style.transformOrigin = 'top left';
              
              // After both animations complete, clean up
              setTimeout(() => {
                // Ensure white is completely gone
                img.style.display = 'none';
                img.remove();
                
                // Finalize black logo position and styling
                blackImg.style.position = 'relative';
                blackImg.style.opacity = '1';
                blackImg.style.pointerEvents = 'auto';
                blackImg.style.zIndex = '';
                logoFadeComplete = true;
                logoShrinkComplete = true;
                
                // Phase 3: Fade in nav background after nav elements are loaded
                // Nav elements take ~0.4s to fully appear (last one at 0.4s delay)
                setTimeout(() => {
                  nav.style.background = '#FFF3E9';
                  nav.style.transition = 'background 0.5s ease-in';
                  navBackgroundFaded = true;
                }, 450); // Wait for nav elements to finish loading (400ms + 50ms buffer)
              }, 650); // Wait for both animations to complete (600ms + 50ms buffer)
            }, 50);
          }
        }
        
        // Keep logo visible and fixed when it's at top (in hero section view)
        if (logoReachedTop) {
          // Ensure logo is in body (outside transformed parent) for proper fixed positioning
          // Only move if it's not already in body AND hasn't been moved before
          if (videoHeaderLogo.parentNode !== document.body && videoHeaderLogo.parentNode && !logoMovedToBody) {
            // Logo should be in body when fixed - move it if it's not
            const wrapper = document.querySelector('.video-header-content-wrapper');
            // Only move if logo is actually in the wrapper (not already moved or in another location)
            if (wrapper && videoHeaderLogo.parentNode === wrapper) {
              // Mark as moved BEFORE moving to prevent race conditions
              logoMovedToBody = true;
              
              // Check if placeholder already exists to avoid duplicates
              const existingPlaceholder = wrapper.querySelector('.video-header-logo-placeholder');
              if (!existingPlaceholder) {
                const logoWidth = videoHeaderLogo.offsetWidth || 200; // fallback
                const logoHeight = videoHeaderLogo.offsetHeight || 100; // fallback
                const originalNextSibling = videoHeaderLogo.nextSibling;
                
                // Safety check: Ensure logo is not already in body
                if (videoHeaderLogo.parentNode !== document.body) {
                  document.body.appendChild(videoHeaderLogo);
                } else {
                  console.warn('Logo already in body (location 2), skipping move');
                }
                
                // Add placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'video-header-logo-placeholder';
                placeholder.style.cssText = `
                  width: ${logoWidth}px;
                  height: ${logoHeight}px;
                  flex-shrink: 0;
                  visibility: hidden;
                `;
                if (originalNextSibling) {
                  wrapper.insertBefore(placeholder, originalNextSibling);
                } else {
                  wrapper.appendChild(placeholder);
                }
              }
            }
          }
          
          // Ensure logo stays fixed at top position - maintain fixed positioning
          videoHeaderLogo.style.position = 'fixed';
          videoHeaderLogo.style.top = `${topPadding}px`;
          videoHeaderLogo.style.left = '15px';
          videoHeaderLogo.style.opacity = '1';
          videoHeaderLogo.style.visibility = 'visible';
          videoHeaderLogo.style.zIndex = '1001';
          
          // Ensure the logo container maintains its fixed position
          // This prevents it from scrolling with the video header
          if (logoShrinkComplete) {
            videoHeaderLogo.style.transform = 'scale(1)';
          }
        }
        
        // Reset if scrolled back to top
        if (currentScroll === 0 && logoReachedTop) {
          logoReachedTop = false;
          logoFadeComplete = false;
          logoShrinkComplete = false;
          phraseOffScreen = false;
          navBackgroundFaded = false;
          logoMovedToBody = false; // Reset flag when scrolling back to top
          logoAnimationStarted = false; // Reset animation flag
          videoHeaderLogo.classList.remove('animating', 'at-top');
          
          // Reset all inline styles to allow CSS to take over
          videoHeaderLogo.style.position = '';
          videoHeaderLogo.style.top = '';
          videoHeaderLogo.style.left = '';
          videoHeaderLogo.style.transform = '';
          videoHeaderLogo.style.transformOrigin = '';
          videoHeaderLogo.style.opacity = '';
          videoHeaderLogo.style.visibility = '';
          videoHeaderLogo.style.zIndex = '';
          videoHeaderLogo.style.display = '';
          
          // ROOT CAUSE FIX: Move logo back to original position in wrapper
          const wrapper = document.querySelector('.video-header-content-wrapper');
          if (wrapper) {
            // Remove placeholder
            const placeholder = wrapper.querySelector('.video-header-logo-placeholder');
            if (placeholder) {
              // Move logo back to wrapper before placeholder
              wrapper.insertBefore(videoHeaderLogo, placeholder);
              placeholder.remove();
            } else if (videoHeaderLogo.parentNode === document.body) {
              // If no placeholder but logo is in body, move it back to wrapper
              // Insert at the beginning of wrapper (before text)
              wrapper.insertBefore(videoHeaderLogo, wrapper.firstChild);
            }
            // Re-enable layout checking
            wrapper.classList.remove('stacked');
          }
          
          // Reset phrase position (shouldn't be needed, but just in case)
          if (videoHeaderText) {
            videoHeaderText.style.position = '';
            videoHeaderText.style.top = '';
            videoHeaderText.style.left = '';
            videoHeaderText.style.right = '';
            videoHeaderText.style.transform = '';
          }
          
          // Remove any black logo and reset to white
          const allImgs = videoHeaderLogo.querySelectorAll('img');
          allImgs.forEach(img => {
            if (img.src.includes('Black')) {
              img.remove();
            } else if (img.src.includes('White')) {
              img.style.opacity = '';
              img.style.height = '';
              img.style.width = '';
              img.style.position = '';
            }
          });
          
          // Reset nav background
          nav.style.background = '';
          nav.style.transition = '';
          
          // Ensure white logo exists
          if (!videoHeaderLogo.querySelector('img[src*="White"]')) {
            const whiteImg = document.createElement('img');
            whiteImg.src = 'assets/images/AIJI_Logo_Full_White.svg';
            whiteImg.className = 'logo-full-svg';
            whiteImg.alt = 'AI Jobs Institute';
            videoHeaderLogo.appendChild(whiteImg);
          }
          
          document.body.classList.remove('logo-at-top');
          nav.classList.add('hidden-on-video');
          nav.classList.remove('logo-at-top');
          initialLogoTop = null;
        }
      }
    }
    
    // Always ensure logo is visible if it exists
    if (videoHeaderLogo) {
      if (!logoReachedTop) {
        // Logo is still on video header - ensure it's visible
        videoHeaderLogo.style.opacity = '1';
        videoHeaderLogo.style.visibility = 'visible';
        videoHeaderLogo.style.display = 'block';
        const logoImg = videoHeaderLogo.querySelector('img');
        if (logoImg) {
          logoImg.style.opacity = '1';
          logoImg.style.visibility = 'visible';
          logoImg.style.display = 'block';
        }
      } else {
        // Logo is at top - ensure it stays fixed and visible
        // First ensure it's in body (outside transformed parent)
        // Only move if it's not already in body AND hasn't been moved before
        if (videoHeaderLogo.parentNode !== document.body && videoHeaderLogo.parentNode && !logoMovedToBody) {
          const wrapper = document.querySelector('.video-header-content-wrapper');
          // Only move if logo is actually in the wrapper (not already moved or in another location)
          if (wrapper && videoHeaderLogo.parentNode === wrapper) {
            // Mark as moved BEFORE moving to prevent race conditions
            logoMovedToBody = true;
            
            // Check if placeholder already exists to avoid duplicates
            const existingPlaceholder = wrapper.querySelector('.video-header-logo-placeholder');
            if (!existingPlaceholder) {
              const logoWidth = videoHeaderLogo.offsetWidth || 200;
              const logoHeight = videoHeaderLogo.offsetHeight || 100;
              const originalNextSibling = videoHeaderLogo.nextSibling;
              
              // Safety check: Ensure logo is not already in body
              if (videoHeaderLogo.parentNode !== document.body) {
                document.body.appendChild(videoHeaderLogo);
              } else {
                console.warn('Logo already in body (location 3), skipping move');
              }
              
              const placeholder = document.createElement('div');
              placeholder.className = 'video-header-logo-placeholder';
              placeholder.style.cssText = `
                width: ${logoWidth}px;
                height: ${logoHeight}px;
                flex-shrink: 0;
                visibility: hidden;
              `;
              if (originalNextSibling) {
                wrapper.insertBefore(placeholder, originalNextSibling);
              } else {
                wrapper.appendChild(placeholder);
              }
            }
          }
        }
        
        videoHeaderLogo.style.position = 'fixed';
        videoHeaderLogo.style.top = `${topPadding}px`;
        videoHeaderLogo.style.left = '15px';
        videoHeaderLogo.style.opacity = '1';
        videoHeaderLogo.style.visibility = 'visible';
        videoHeaderLogo.style.display = 'block';
        videoHeaderLogo.style.zIndex = '1001';
        const logoImg = videoHeaderLogo.querySelector('img');
        if (logoImg) {
          logoImg.style.opacity = '1';
          logoImg.style.visibility = 'visible';
          logoImg.style.display = 'block';
        }
      }
    }
    
    // Add scrolled class for nav styling
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }
  
  window.addEventListener('scroll', checkScroll, { passive: true });
  
  // Ensure logo is visible on page load
  if (videoHeaderLogo) {
    videoHeaderLogo.style.opacity = '1';
    videoHeaderLogo.style.visibility = 'visible';
    videoHeaderLogo.style.display = 'block';
    const logoImg = videoHeaderLogo.querySelector('img');
    if (logoImg) {
      logoImg.style.opacity = '1';
      logoImg.style.visibility = 'visible';
      logoImg.style.display = 'block';
      logoImg.style.width = 'auto';
      logoImg.style.height = 'auto';
    }
  }
  
  // Check on load and after a short delay to ensure DOM is ready
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (videoHeaderLogo) {
        videoHeaderLogo.style.opacity = '1';
        videoHeaderLogo.style.visibility = 'visible';
        videoHeaderLogo.style.display = 'block';
        const logoImg = videoHeaderLogo.querySelector('img');
        if (logoImg) {
          logoImg.style.opacity = '1';
          logoImg.style.visibility = 'visible';
          logoImg.style.display = 'block';
          logoImg.style.width = 'auto';
          logoImg.style.height = 'auto';
        }
      }
      getInitialLogoPosition();
      checkScroll();
    }, 100);
  });
  checkScroll(); // Check on load
  
  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 100; // Account for fixed nav
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Scroll-triggered effects
 */
function initScrollEffects() {
  // Intersection Observer for fade-in animations
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
  
  // Observe sections and cards
  const elementsToAnimate = document.querySelectorAll(
    '.initiative-card, .council-card, .partner-card, .stat-card, .signup-card'
  );
  
  elementsToAnimate.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
  
  // Add visible styles
  const style = document.createElement('style');
  style.textContent = `
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
      
      // Show loading state
      button.innerHTML = '<span>Sending...</span>';
      button.disabled = true;
      
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Success - show thank you message
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
        // Error - reset button
        button.innerHTML = originalContent;
        button.disabled = false;
        
        // Show error message
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Something went wrong. Please try again.';
        errorMsg.style.color = '#ff4444';
        errorMsg.style.fontSize = '0.875rem';
        errorMsg.style.marginTop = '0.5rem';
        form.appendChild(errorMsg);
        
        // Remove error after 3 seconds
        setTimeout(() => errorMsg.remove(), 3000);
      }
    });
  });
}

/**
 * Additional animations
 */
function initAnimations() {
  // Animate stats numbers on scroll
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
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (value - start) * easeOutQuart);
    
    element.textContent = hasPrefix + current.toLocaleString() + hasSuffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = text; // Restore original text with formatting
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Rotating words animation for hero title with building effect
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
  
  function splitIntoLetters(text) {
    return text.split('').map(char => ({ char, isSpace: char === ' ' }));
  }
  
  function buildWord(word) {
    rotatingWordEl.innerHTML = '';
    const letters = splitIntoLetters(word);
    
    letters.forEach((letterData, index) => {
      if (letterData.isSpace) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        rotatingWordEl.appendChild(space);
      } else {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'rotating-word-letter';
        letterSpan.textContent = letterData.char;
        
        // Randomly assign direction for building effect
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        letterSpan.classList.add(randomDirection);
        
        // All letters animate at the same time (no delay)
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
 * Discrete swipe-based navigation system
 * Step 0: Header visible
 * Step 1: Header exits, nav appears, hero section shows three lines
 * Step 2: Reveal "We believe..." text
 * Step 3: Reveal "Pursuit AI Jobs Institute..." text
 * After step 3: Allow scrolling to next section
 */
function initHeroScrollReveal() {
  const videoHeader = document.querySelector('.video-header');
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroTitleWrapper = document.querySelector('.hero-title-wrapper');
  const heroDescription = document.querySelector('.hero-description');
  const descriptionParts = document.querySelectorAll('.hero-description-part');
  const nav = document.querySelector('.nav');
  
  if (!hero || !heroContent || !heroTitleWrapper || !heroDescription || !videoHeader) return;
  
  // State machine: 0 = header, 1 = hero initial, 2 = "We believe", 3 = "Pursuit AI Jobs Institute"
  let currentStep = 0;
  let isTransitioning = false;
  let wheelDelta = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  
  // Calculate hero position - recalculate on load to ensure accuracy
  function getHeroTop() {
    return hero ? hero.offsetTop : 0;
  }
  let heroTop = getHeroTop();
  const viewportHeight = window.innerHeight;
  
  // Recalculate heroTop on window load and resize
  window.addEventListener('load', () => {
    heroTop = getHeroTop();
  });
  window.addEventListener('resize', () => {
    heroTop = getHeroTop();
  });
  
  // Prevent default scrolling behavior during steps
  function preventScroll(e) {
    if (currentStep < 3) {
      e.preventDefault();
      return false;
    }
  }
  
  // Detect swipe/wheel gesture
  function handleWheel(e) {
    if (isTransitioning) return;
    
    // Prevent default scrolling during steps
    if (currentStep < 3) {
      e.preventDefault();
    }
    
    // Only handle downward swipes (scrolling down/forward)
    if (e.deltaY > 0) {
      wheelDelta += e.deltaY;
      
      // Threshold for detecting a full swipe (adjust as needed)
      if (wheelDelta > 50) {
        wheelDelta = 0;
        advanceStep();
      }
    } else if (e.deltaY < 0) {
      // Upward swipe - go back a step
      wheelDelta += e.deltaY;
      if (wheelDelta < -50) {
        wheelDelta = 0;
        goBackStep();
      }
    }
  }
  
  // Touch events for mobile
  function handleTouchStart(e) {
    if (currentStep < 3) {
      e.preventDefault();
    }
    touchStartY = e.touches[0].clientY;
  }
  
  function handleTouchEnd(e) {
    if (isTransitioning) return;
    if (currentStep < 3) {
      e.preventDefault();
    }
    touchEndY = e.changedTouches[0].clientY;
    const swipeDistance = touchStartY - touchEndY;
    
    // Swipe down (forward)
    if (swipeDistance > 50) {
      advanceStep();
    }
    // Swipe up (backward)
    else if (swipeDistance < -50) {
      goBackStep();
    }
  }
  
  // Advance to next step
  function advanceStep() {
    if (isTransitioning || currentStep >= 3) return;
    
    isTransitioning = true;
    currentStep++;
    updateStep();
    
    // Allow transition to complete
    setTimeout(() => {
      isTransitioning = false;
    }, 800); // Increased timeout to allow animations to complete
  }
  
  // Go back a step
  function goBackStep() {
    if (isTransitioning || currentStep <= 0) return;
    
    isTransitioning = true;
    currentStep--;
    updateStep();
    
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }
  
  // Update UI based on current step
  function updateStep() {
    switch (currentStep) {
      case 0:
        // Header visible
        videoHeader.style.transform = 'translateY(0)';
        videoHeader.style.opacity = '1';
        videoHeader.style.pointerEvents = 'auto';
        videoHeader.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        
        // Hide nav
        nav.classList.add('hidden-on-video');
        document.body.classList.remove('logo-at-top');
        nav.classList.remove('logo-at-top');
        
        // Reset hero content
        heroContent.style.top = '50%';
        heroContent.style.transform = 'translate(-50%, -50%)';
        heroTitleWrapper.style.visibility = 'hidden';
        heroTitleWrapper.style.opacity = '0';
        heroDescription.classList.remove('revealed');
        heroDescription.style.opacity = '0';
        heroDescription.style.visibility = 'hidden';
        descriptionParts.forEach(part => {
          part.classList.remove('revealed');
          part.style.opacity = '0';
          part.style.transform = 'translateY(20px)';
          part.style.transition = '';
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
        
      case 1:
        // Header exits, nav appears, hero shows three lines
        videoHeader.style.transform = 'translateY(-100%)';
        videoHeader.style.opacity = '0';
        videoHeader.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        videoHeader.style.pointerEvents = 'none';
        
        // Show nav with animation
        setTimeout(() => {
          document.body.classList.add('logo-at-top');
          nav.classList.remove('hidden-on-video');
          nav.classList.add('logo-at-top');
        }, 300);
        
        // Scroll to hero and show three lines centered on screen
        const targetTop = getHeroTop();
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
        setTimeout(() => {
          // Center entire hero-content container at 50% (middle of screen)
          heroContent.style.top = '50%';
          heroContent.style.left = '50%';
          heroContent.style.transform = 'translate(-50%, -50%)';
          
          // Show title wrapper
          heroTitleWrapper.style.visibility = 'visible';
          heroTitleWrapper.style.opacity = '1';
          
          // Hide description
          heroDescription.classList.remove('revealed');
          heroDescription.style.opacity = '0';
          heroDescription.style.visibility = 'hidden';
          descriptionParts.forEach(part => {
            part.classList.remove('revealed');
            part.style.opacity = '0';
            part.style.transform = 'translateY(20px)';
          });
        }, 400);
        break;
        
      case 2:
        // Move entire unit up and reveal "We believe..." text with lazy scroll animation
        // The entire hero-content container moves up as a unit, keeping it centered
        heroContent.style.top = '45%'; // Move entire unit up
        heroContent.style.left = '50%';
        heroContent.style.transform = 'translate(-50%, -50%)';
        
        // Reveal description container (now part of the unit)
        heroDescription.classList.add('revealed');
        heroDescription.style.opacity = '1';
        heroDescription.style.visibility = 'visible';
        
        // Reveal first part with lazy scroll effect
        if (descriptionParts[0]) {
          descriptionParts[0].style.opacity = '0';
          descriptionParts[0].style.transform = 'translateY(20px)';
          descriptionParts[0].classList.add('revealed');
          // Trigger animation after a brief delay
          setTimeout(() => {
            descriptionParts[0].style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            descriptionParts[0].style.opacity = '1';
            descriptionParts[0].style.transform = 'translateY(0)';
          }, 200);
        }
        // Keep other parts hidden
        if (descriptionParts[1]) {
          descriptionParts[1].classList.remove('revealed');
          descriptionParts[1].style.opacity = '0';
          descriptionParts[1].style.transform = 'translateY(20px)';
        }
        if (descriptionParts[2]) {
          descriptionParts[2].classList.remove('revealed');
          descriptionParts[2].style.opacity = '0';
          descriptionParts[2].style.transform = 'translateY(20px)';
        }
        break;
        
      case 3:
        // Move entire unit up more and reveal rest of sentence with lazy scroll
        // The entire hero-content container (title + description) moves up as a unit
        heroContent.style.top = '40%'; // Move entire unit up further
        heroContent.style.left = '50%';
        heroContent.style.transform = 'translate(-50%, -50%)';
        
        // Reveal remaining parts with lazy scroll animation
        if (descriptionParts[1]) {
          descriptionParts[1].style.opacity = '0';
          descriptionParts[1].style.transform = 'translateY(20px)';
          descriptionParts[1].classList.add('revealed');
          setTimeout(() => {
            descriptionParts[1].style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            descriptionParts[1].style.opacity = '1';
            descriptionParts[1].style.transform = 'translateY(0)';
          }, 200);
        }
        if (descriptionParts[2]) {
          descriptionParts[2].style.opacity = '0';
          descriptionParts[2].style.transform = 'translateY(20px)';
          descriptionParts[2].classList.add('revealed');
          setTimeout(() => {
            descriptionParts[2].style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            descriptionParts[2].style.opacity = '1';
            descriptionParts[2].style.transform = 'translateY(0)';
          }, 400);
        }
        break;
    }
  }
  
  // Initialize - ensure heroTop is calculated
  heroTop = getHeroTop();
  
  // Wait for page to be fully loaded before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      heroTop = getHeroTop();
      updateStep();
    });
  } else {
    updateStep();
  }
  
  // Event listeners
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: false });
  window.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  // Prevent scrolling with arrow keys during steps
  window.addEventListener('keydown', (e) => {
    if (currentStep < 3 && (e.key === 'ArrowDown' || e.key === 'PageDown')) {
      e.preventDefault();
      advanceStep();
    } else if (currentStep > 0 && (e.key === 'ArrowUp' || e.key === 'PageUp')) {
      e.preventDefault();
      goBackStep();
    }
  });
  
  // Handle scroll events to prevent default scrolling during steps
  let scrollLocked = false;
  let lastScrollTop = window.scrollY;
  window.addEventListener('scroll', (e) => {
    if (currentStep < 3 && !scrollLocked) {
      scrollLocked = true;
      const currentScrollTop = window.scrollY;
      
      // Only lock if scroll actually changed
      if (Math.abs(currentScrollTop - lastScrollTop) > 5) {
        // Lock scroll position to current step
        if (currentStep === 0) {
          window.scrollTo({ top: 0, behavior: 'auto' });
          lastScrollTop = 0;
        } else if (currentStep >= 1) {
          const targetTop = getHeroTop();
          window.scrollTo({ top: targetTop, behavior: 'auto' });
          lastScrollTop = targetTop;
        }
      }
      
      setTimeout(() => {
        scrollLocked = false;
      }, 50);
    } else {
      lastScrollTop = window.scrollY;
    }
  }, { passive: true });
}


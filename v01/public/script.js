/**
 * AI Jobs Institute - Website JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initFormHandling();
  initAnimations();
});

/**
 * Navigation functionality
 */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  // Scroll effect for nav
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
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
 * Parallax effect for hero visual
 */
document.addEventListener('mousemove', (e) => {
  const visual = document.querySelector('.hero-visual');
  if (!visual) return;
  
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  
  visual.style.transform = `translateY(-50%) translate(${x}px, ${y}px)`;
});


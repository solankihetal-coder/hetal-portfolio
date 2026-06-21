/* =====================================================
   PORTFOLIO WEBSITE - MAIN JAVASCRIPT
   Structured & Optimized Version
===================================================== */

// =====================================================
// CONFIGURATION & CONSTANTS
// =====================================================
const CONFIG = {
  projectDefaultCategory: 'design',
  typingSpeed: 100,
  erasingSpeed: 50,
  typingPauseDuration: 1500,
  nextPhrasePauseDuration: 500,
  scrollThreshold: 0.15,
  staggerDelay: 150,
  tiltIntensity: 40,
  scrollOffset: 150
};

const TYPING_PHRASES = ['UI/UX Designer', 'Web Developer'];

// =====================================================
// UTILITY FUNCTIONS
// =====================================================
const Utils = {
  /**
   * Smooth scroll to target element
   */
  smoothScrollTo(target) {
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Toggle class on elements
   */
  toggleClass(elements, className, condition) {
    elements.forEach(el => {
      el.classList.toggle(className, condition);
    });
  },

  /**
   * Remove class from all elements
   */
  removeClass(elements, className) {
    elements.forEach(el => el.classList.remove(className));
  },

  /**
   * Add class to element
   */
  addClass(element, className) {
    element?.classList.add(className);
  }
};

// =====================================================
// THEME MANAGER
// =====================================================
const ThemeManager = {
  init() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Apply saved theme
    this.applySavedTheme(themeToggleBtn);

    // Handle theme toggle
    themeToggleBtn.addEventListener('click', () => this.toggleTheme(themeToggleBtn));
  },

  applySavedTheme(button) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      button.innerHTML = '<i class="fas fa-sun"></i>';
    }
  },

  toggleTheme(button) {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');

    button.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
};

// =====================================================
// SMOOTH SCROLL HANDLER
// =====================================================
const SmoothScroll = {
  init() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        Utils.smoothScrollTo(target);
      });
    });
  }
};

// =====================================================
// PROJECT FILTER
// =====================================================
const ProjectFilter = {
  init() {
    this.buttons = document.querySelectorAll('.project-filters .filter-btn');
    this.cards = document.querySelectorAll('.project-grid .project-card');
    
    if (!this.buttons.length || !this.cards.length) return;

    this.setupEventListeners();
    this.setDefaultFilter();
  },

  setupEventListeners() {
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => this.handleFilterClick(btn));
    });
  },

  handleFilterClick(activeBtn) {
    Utils.removeClass(this.buttons, 'active');
    Utils.addClass(activeBtn, 'active');
    this.filterProjects(activeBtn.dataset.category);
  },

  filterProjects(category) {
    this.cards.forEach(card => {
      const shouldShow = category === 'all' || card.dataset.category === category;
      card.style.display = shouldShow ? 'flex' : 'none';
    });
  },

  setDefaultFilter() {
    const defaultBtn = Array.from(this.buttons).find(
      btn => btn.dataset.category === CONFIG.projectDefaultCategory
    );
    
    if (defaultBtn) {
      Utils.addClass(defaultBtn, 'active');
      this.filterProjects(CONFIG.projectDefaultCategory);
    }
  }
};

// =====================================================
// SKILL FILTER WITH ANIMATED PROGRESS BARS
// =====================================================
const SkillFilter = {
  init() {
    this.buttons = document.querySelectorAll('.skill-filter-btn');
    this.cards = document.querySelectorAll('.skill-card');
    
    if (!this.buttons.length || !this.cards.length) return;

    this.setupEventListeners();
    this.triggerDefaultFilter();
  },

  setupEventListeners() {
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => this.handleFilterClick(btn));
    });
  },

  handleFilterClick(activeBtn) {
    Utils.removeClass(this.buttons, 'active');
    Utils.addClass(activeBtn, 'active');

    const category = activeBtn.dataset.category;
    this.filterSkills(category);
    this.animateProgressBars(category);
  },

  filterSkills(category) {
    this.cards.forEach(card => {
      const shouldHide = !card.classList.contains(`${category}-skill`);
      card.classList.toggle('hidden', shouldHide);
    });
  },

  animateProgressBars(category) {
    this.cards.forEach(card => {
      if (card.classList.contains(`${category}-skill`) && !card.classList.contains('hidden')) {
        const bar = card.querySelector('.progress-bar');
        const percentageEl = card.querySelector('.skill-percentage');
        
        if (bar && percentageEl) {
          const percent = parseInt(percentageEl.textContent) || 0;
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = `${percent}%`;
          }, 50);
        }
      }
    });
  },

  triggerDefaultFilter() {
    const activeBtn = document.querySelector('.skill-filter-btn.active');
    activeBtn?.click();
  }
};

// =====================================================
// CONTACT FORM CHARACTER COUNTER
// =====================================================
const CharacterCounter = {
  init() {
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('current-char');

    if (!messageInput || !charCount) return;

    messageInput.addEventListener('input', () => {
      charCount.textContent = messageInput.value.length;
    });
  }
};

// =====================================================
// NAVIGATION SCROLL SPY
// =====================================================
const ScrollSpy = {
  init() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link');

    if (!this.sections.length || !this.navLinks.length) return;

    window.addEventListener('scroll', () => this.updateActiveLink());
  },

  updateActiveLink() {
    let currentSection = '';

    this.sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - CONFIG.scrollOffset) {
        currentSection = section.id;
      }
    });

    this.navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${currentSection}`;
      link.classList.toggle('active', isActive);
    });
  }
};

// =====================================================
// TYPING EFFECT
// =====================================================
const TypingEffect = {
  init() {
    this.textElement = document.querySelector('.typing-text');
    if (!this.textElement) return;

    this.phraseIndex = 0;
    this.charIndex = 0;
    this.phrases = TYPING_PHRASES;

    setTimeout(() => this.type(), CONFIG.nextPhrasePauseDuration);
  },

  type() {
    const phrase = this.phrases[this.phraseIndex];
    
    if (this.charIndex < phrase.length) {
      this.textElement.textContent += phrase.charAt(this.charIndex++);
      setTimeout(() => this.type(), CONFIG.typingSpeed);
    } else {
      setTimeout(() => this.erase(), CONFIG.typingPauseDuration);
    }
  },

  erase() {
    const phrase = this.phrases[this.phraseIndex];
    
    if (this.charIndex > 0) {
      this.textElement.textContent = phrase.substring(0, --this.charIndex);
      setTimeout(() => this.erase(), CONFIG.erasingSpeed);
    } else {
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      setTimeout(() => this.type(), CONFIG.nextPhrasePauseDuration);
    }
  }
};

// =====================================================
// HAMBURGER MENU
// =====================================================
const HamburgerMenu = {
  init() {
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.getElementById('nav-menu');

    if (!this.hamburger || !this.navMenu) return;

    this.navLinks = this.navMenu.querySelectorAll('.nav-link');
    this.setupEventListeners();
  },

  setupEventListeners() {
    this.hamburger.addEventListener('click', () => this.toggleMenu());
    
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
  },

  toggleMenu() {
    this.navMenu.classList.toggle('open');
    this.hamburger.classList.toggle('is-active');
  },

  closeMenu() {
    this.navMenu.classList.remove('open');
    this.hamburger.classList.remove('is-active');
  }
};

// =====================================================
// SECTION REVEAL ANIMATION
// =====================================================
const SectionReveal = {
  init() {
    this.sections = document.querySelectorAll('section, .hero-section');
    if (!this.sections.length) return;

    this.setupObserver();
  },

  setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: CONFIG.scrollThreshold }
    );

    this.sections.forEach(section => {
      section.classList.add('reveal');
      observer.observe(section);
    });
  },

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'active');
        this.staggerChildren(entry.target);
      }
    });
  },

  staggerChildren(element) {
    const staggerElements = element.querySelectorAll('.stagger');
    staggerElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * CONFIG.staggerDelay}ms`;
    });
  }
};

// =====================================================
// JOURNEY TIMELINE — staggered scroll reveal
// =====================================================
const JourneyAnimation = {
  init() {
    this.track = document.querySelector('.journey-track');
    if (!this.track) return;

    this.steps = this.track.querySelectorAll('.journey-step');
    if (!this.steps.length) return;

    this.setupObserver();
  },

  setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries, observer),
      { threshold: 0.3 }
    );
    observer.observe(this.track);
  },

  handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.playSequence();
        observer.unobserve(entry.target); // play once, not every scroll pass
      }
    });
  },

  playSequence() {
    this.track.classList.add('active');

    this.steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('active');
      }, index * 280);
    });
  }
};

// =====================================================
// 3D TILT EFFECT
// =====================================================
const TiltEffect = {
  init() {
    this.cards = document.querySelectorAll('.software-card');
    if (!this.cards.length) return;

    this.setupEventListeners();
  },

  setupEventListeners() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
      card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
    });
  },

  handleMouseMove(event, card) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = (y - rect.height / 2) / CONFIG.tiltIntensity;
    const rotateY = (rect.width / 2 - x) / CONFIG.tiltIntensity;

    card.style.transform = 
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  },

  handleMouseLeave(card) {
    card.style.transform = 
      'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1.02)';
  }
};  

// =====================================================
// STACKED CARD SCROLL EFFECT
// =====================================================
const StackedCardScroll = {
  init() {
    this.cards = document.querySelectorAll('.project-card');
    if (!this.cards.length) return;

    window.addEventListener('scroll', () => this.handleScroll());
  },

  handleScroll() {
    const windowHeight = window.innerHeight;

    this.cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const progress = 1 - rect.top / windowHeight;

      if (progress > 0) {
        this.applyCardTransform(card, index, progress);
      }
    });
  },

  applyCardTransform(card, index, progress) {
    // const translateY = index * 30;

    card.style.transform = `translateY(${translateY}px)`;
    card.style.zIndex = index;
    card.style.opacity = 1;
  }
};

/* ─────────────────────────────────────────────────────────────────
     CERTIFICATE CAROUSEL — auto-scroll ticker (desktop) +
     touch-swipe/snap (mobile, handled natively by CSS overflow-x).
     Target speed: 120 px/s on desktop, scales down on smaller
     desktop/tablet widths. Below 768px the JS hands off entirely
     to native scrolling — see the @media block in style.css that
     sets `transform: none !important` on the track.
  ───────────────────────────────────────────────────────────────── */
const CertificateCarousel = (function () {
  const MOBILE_BREAKPOINT = 768;

  const carousel = document.getElementById('certCarousel');
  const track    = document.getElementById('certTrack');

  let offset    = 0;
  let halfWidth = 0;
  let speed     = 0;
  let lastTime  = null;
  let rafId     = null;
  let isPaused  = false;
  let isMobile  = false;

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  /* ── Pause on hover (desktop only — no-op on touch) ──────────────── */
  function bindHoverPause() {
    carousel.addEventListener('mouseenter', () => { isPaused = true;  });
    carousel.addEventListener('mouseleave', () => { isPaused = false; });
  }

  /* ── Measure real pixel width of ONE card set (visible cards only) ── */
  function measure() {
    const visibleCards = track.querySelectorAll('.certificate-card:not(.is-hidden)');
    let width = 0;
    visibleCards.forEach(card => {
      width += card.getBoundingClientRect().width + 24; // card width + gap
    });
    halfWidth = width / 2;
  }

  /* ── Speed by viewport (px / ms) ───────────────────────────────── */
  function updateSpeed() {
    const w = window.innerWidth;
    let pxPerSec;
    if      (w <= 900)  pxPerSec = 110;
    else if (w <= 1024) pxPerSec = 110;
    else                pxPerSec = 120;
    speed = pxPerSec / 1000;
  }

  /* ── rAF loop (desktop ticker) ───────────────────────────────────── */
  function tick(timestamp) {
    if (lastTime === null) lastTime = timestamp;
    const elapsed = Math.min(timestamp - lastTime, 100);
    lastTime = timestamp;

    if (!isPaused && !isMobile && halfWidth > 0) {
      offset += speed * elapsed;
      if (offset >= halfWidth) {
        offset -= halfWidth;
      }
      track.style.transform = `translateX(${-offset}px)`;
    }

    rafId = requestAnimationFrame(tick);
  }

  /* ── Switch between desktop ticker and mobile native swipe ──────── */
  function syncMode() {
    const nowMobile = isMobileViewport();
    if (nowMobile && !isMobile) {
      // Entering mobile mode: release the ticker, let native scroll take over
      isMobile = true;
      track.style.transform = '';
      offset = 0;
    } else if (!nowMobile && isMobile) {
      // Returning to desktop: resume the ticker
      isMobile = false;
      lastTime = null;
      measure();
    }
  }

  /* ── Resize handler ─────────────────────────────────────────────── */
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      syncMode();
      if (!isMobile) {
        const prevHalf = halfWidth;
        measure();
        updateSpeed();
        if (prevHalf > 0) offset = (offset / prevHalf) * halfWidth;
        lastTime = null;
      }
    }, 150);
  }

  /* ── Public: re-measure after a filter changes which cards show ──── */
  function refresh() {
    offset = 0;
    track.style.transform = isMobile ? '' : 'translateX(0px)';
    if (!isMobile) {
      measure();
      lastTime = null;
    }
  }

  /* ── Boot ───────────────────────────────────────────────────────── */
  function init() {
    if (!carousel || !track) return;
    isMobile = isMobileViewport();
    bindHoverPause();
    updateSpeed();
    if (!isMobile) measure();
    window.addEventListener('resize', handleResize);
    rafId = requestAnimationFrame(tick);
  }

  return { init, refresh };
})();

if (document.readyState === 'complete') {
  CertificateCarousel.init();
} else {
  window.addEventListener('load', () => CertificateCarousel.init());
}

/* =====================================================
// CERTIFICATE SUBTYPE FILTER (All / Development / Design / AI & Workflow)
===================================================== */
const CertificateFilter = {
  init() {
    this.buttons = document.querySelectorAll('.certificate-filters .cert-filter-btn');
    this.cards   = document.querySelectorAll('#certTrack .certificate-card');

    if (!this.buttons.length || !this.cards.length) return;

    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => this.handleFilterClick(btn));
    });
  },

  handleFilterClick(activeBtn) {
    Utils.removeClass(this.buttons, 'active');
    Utils.addClass(activeBtn, 'active');
    this.filterCertificates(activeBtn.dataset.certCategory);
  },

  filterCertificates(category) {
    this.cards.forEach(card => {
      const shouldShow = category === 'all' || card.dataset.certCategory === category;
      card.classList.toggle('is-hidden', !shouldShow);
    });
    CertificateCarousel.refresh();
  }
};

// =====================================================
// APPLICATION INITIALIZATION
// =====================================================
const App = {
  init() {
    // Initialize theme first (can run before DOM ready)
    ThemeManager.init();

    // Initialize all components when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeComponents();
    });
  },

  initializeComponents() {
    // Navigation & Scroll
    SmoothScroll.init();
    ScrollSpy.init();
    HamburgerMenu.init();
     
    ContactForm.init(); 

    // Filters
    ProjectFilter.init();
    SkillFilter.init();
    CertificateFilter.init();

    // Effects & Animations
    TypingEffect.init();
    SectionReveal.init();
    JourneyAnimation.init();
    TiltEffect.init();
    StackedCardScroll.init();

    // Form
    CharacterCounter.init();

    console.log('✅ Portfolio website initialized successfully');
  }
};

// =====================================================
// CONTACT FORM — FETCH SUBMIT
// Add this block to script.js, before App.init()
// =====================================================

const ContactForm = {
  init() {
    const form        = document.getElementById('contact-form');
    const submitBtn   = document.getElementById('submit-btn');
    const successCard = document.getElementById('success-card');
    const errorBanner = document.getElementById('error-banner');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // stop the default page-redirect POST

      // ── 1. Loading state ──────────────────────────────
      submitBtn.disabled    = true;
      submitBtn.innerHTML   = 'Sending… <i class="fas fa-spinner fa-spin"></i>';
      errorBanner.style.display = 'none'; // hide any previous error

      try {
        // ── 2. Send via fetch ─────────────────────────
        const response = await fetch(form.action, {
          method:  'POST',
          body:    new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // ── 3a. SUCCESS — hide form, show card ──────
          form.style.display        = 'none';
          successCard.style.display = 'block';
        } else {
          // ── 3b. Server error (e.g. 422 from Formspree)
          throw new Error('Server responded with ' + response.status);
        }

      } catch (err) {
        // ── 4. Network / unexpected error ────────────
        console.error('Form submission error:', err);
        errorBanner.style.display = 'block';

        // Reset button so user can try again
        submitBtn.disabled  = false;
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      }
    });
  }
};

// ── "Send another message" resets everything ─────────────
function resetContactForm() {
  const form        = document.getElementById('contact-form');
  const successCard = document.getElementById('success-card');
  const errorBanner = document.getElementById('error-banner');
  const submitBtn   = document.getElementById('submit-btn');
  const charCount   = document.getElementById('current-char');

  form.reset();                              // clears all fields
  form.style.display        = 'block';       // show form again
  successCard.style.display = 'none';        // hide success card
  errorBanner.style.display = 'none';        // hide error banner
  submitBtn.disabled        = false;
  submitBtn.innerHTML       = 'Send Message <i class="fas fa-paper-plane"></i>';
  if (charCount) charCount.textContent = '0'; // reset char counter
}


// =====================================================
// START APPLICATION
// =====================================================
App.init();

// Main site behaviors: navigation, cart, user menu, scrolling

// Focus-trap utility for accessibility
const _focusTraps = new Map();

function getFocusableElements(container) {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex="-1"])'
  ];
  return Array.from(container.querySelectorAll(selectors.join(','))).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
}

function enableFocusTrap(container, options = {}) {
  if (!_focusTraps) return () => {};
  if (!container) return () => {};
  const previouslyFocused = document.activeElement;
  const focusable = getFocusableElements(container);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const hadTabindex = container.hasAttribute && container.hasAttribute('tabindex');
  if (!hadTabindex) container.setAttribute('tabindex', '-1');
  (first || container).focus();

  function keyHandler(e) {
    if (e.key === 'Tab') {
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === container) {
          e.preventDefault();
          (last || first).focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          (first || last).focus();
        }
      }
    } else if (e.key === 'Escape' && typeof options.onEscape === 'function') {
      options.onEscape(e);
    }
  }

  document.addEventListener('keydown', keyHandler);

  const restore = () => {
    document.removeEventListener('keydown', keyHandler);
    try { if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus(); } catch (err) {}
    if (!hadTabindex) container.removeAttribute('tabindex');
    _focusTraps.delete(container);
  };

  _focusTraps.set(container, { restore });
  return restore;
}

function disableFocusTrap(container) {
  const entry = _focusTraps.get(container);
  if (entry && typeof entry.restore === 'function') entry.restore();
}

// Scroll animations setup
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Main initialization
document.addEventListener("DOMContentLoaded", () => {
  // Create backdrop for overlays
  const backdrop = document.createElement('div');
  backdrop.className = 'backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);

  // Navigation setup
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  const updateToggleState = (isOpen) => {
    if (!navToggle || !navMenu) return;
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navMenu.classList.toggle("active", isOpen);
    backdrop.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    if (isOpen) {
      enableFocusTrap(navMenu, { onEscape: () => updateToggleState(false) });
    } else {
      disableFocusTrap(navMenu);
    }

    const navSearch = document.querySelector('.nav-search');
    if (navSearch && window.matchMedia('(max-width: 768px)').matches) {
      navSearch.style.display = isOpen ? 'none' : '';
    }
  };

  if (navToggle && navMenu) {
    navToggle.setAttribute("role", "button");
    navToggle.setAttribute("aria-controls", "main-navigation");
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.setAttribute("id", "main-navigation");

    navToggle.addEventListener("click", () => {
      updateToggleState(!navMenu.classList.contains("active"));
    });

    navToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navToggle.click();
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => updateToggleState(false));
    });
  }

  // Cart functionality
  const cartToggle = document.getElementById('cartToggle');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeCart = document.getElementById('closeCart');

  const updateCartState = (isOpen) => {
    if (!cartSidebar) return;
    cartSidebar.classList.toggle('active', isOpen);
    backdrop.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (cartToggle) cartToggle.setAttribute('aria-expanded', String(isOpen));
    
    if (isOpen) {
      enableFocusTrap(cartSidebar, { onEscape: () => updateCartState(false) });
    } else {
      disableFocusTrap(cartSidebar);
    }
  };

  if (cartToggle && cartSidebar) {
    cartToggle.setAttribute('aria-controls', 'cartSidebar');
    cartToggle.setAttribute('aria-expanded', 'false');
    cartToggle.addEventListener('click', () => {
      updateCartState(!cartSidebar.classList.contains('active'));
    });
  }

  if (closeCart) {
    closeCart.addEventListener('click', () => updateCartState(false));
  }

  // Backdrop click handler
  backdrop.addEventListener('click', () => {
    if (navMenu?.classList.contains('active')) {
      updateToggleState(false);
    }
    if (cartSidebar?.classList.contains('active')) {
      updateCartState(false);
    }
  });

  // User menu
  const userToggle = document.querySelector('.user-toggle');
  const dropdown = document.querySelector('.dropdown-menu');
  let dropdownFocusTrapRestore = null;

  const updateDropdownState = (isOpen) => {
    if (!userToggle || !dropdown) return;
    dropdown.classList.toggle('active', isOpen);
    userToggle.setAttribute('aria-expanded', String(isOpen));
    
    if (isOpen) {
      dropdownFocusTrapRestore = enableFocusTrap(dropdown, { 
        onEscape: () => updateDropdownState(false) 
      });
    } else if (dropdownFocusTrapRestore) {
      dropdownFocusTrapRestore();
      dropdownFocusTrapRestore = null;
    }
  };

  if (userToggle && dropdown) {
    userToggle.setAttribute('aria-haspopup', 'true');
    userToggle.setAttribute('aria-expanded', 'false');
    
    userToggle.addEventListener('click', (e) => {
      e.preventDefault();
      updateDropdownState(!dropdown.classList.contains('active'));
    });

    document.addEventListener('click', (e) => {
      if (!userToggle.contains(e.target) && !dropdown.contains(e.target)) {
        updateDropdownState(false);
      }
    });
  }

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Scroll animations
  const elementsToAnimate = document.querySelectorAll(".fade-in");
  if (elementsToAnimate.length) {
    elementsToAnimate.forEach((el) => observer.observe(el));
  }

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY > 100;
      navbar.style.background = scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
    });
  }

  // CTA button pulse
  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    setInterval(() => {
      ctaButton.classList.add("pulse");
      setTimeout(() => ctaButton.classList.remove("pulse"), 2000);
    }, 4000);
  }

  // Scroll to top
  const scrollToTopWrapper = document.querySelector('.scroll-to-top');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  if (scrollToTopWrapper && scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      scrollToTopWrapper.classList.toggle('hidden', window.scrollY <= 300);
    });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.log("TrustStickers website initialized");
});
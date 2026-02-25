/* ============================================================
   NIL RATAN KARMAKAR — PORTFOLIO
   script.js — All Interactions & Functionality
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. THEME (Dark default) ──────────────────────────── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const THEME_KEY   = 'nrk-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem(THEME_KEY, theme);
  }

  // Dark is default
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ── 2. NAVBAR ────────────────────────────────────────── */
  const navbar   = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const drawer   = document.getElementById('mobile-drawer');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  function closeMobileDrawer() {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Close on mobile link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  /* ── 3. DROPDOWNS ────────────────────────────────────── */
  const dropdownItems = document.querySelectorAll('.nav-item[data-dropdown]');

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-link');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      // close all
      dropdownItems.forEach(d => d.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  document.addEventListener('click', () => {
    dropdownItems.forEach(d => d.classList.remove('open'));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach(d => d.classList.remove('open'));
      closeMobileDrawer();
    }
  });

  /* ── 4. ACTIVE NAV LINK ON SCROLL ─────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href]');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(sec => activeObs.observe(sec));

  /* ── 5. SCROLL REVEAL ────────────────────────────────── */
  const revealEls = document.querySelectorAll('.fade-up');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  /* ── 6. SKILL BARS ───────────────────────────────────── */
  const skillSection = document.getElementById('skills-section');
  if (skillSection) {
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
            setTimeout(() => {
              bar.style.width = bar.dataset.w + '%';
            }, i * 120);
          });
          skillObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    skillObs.observe(skillSection);
  }

  /* ── 7. COUNT-UP ANIMATION ───────────────────────────── */
  const statEls = document.querySelectorAll('.count-up');

  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const dec    = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
        let start    = 0;
        const dur    = 1600;
        const step   = 16;
        const inc    = target / (dur / step);

        const timer = setInterval(() => {
          start = Math.min(start + inc, target);
          el.textContent = prefix + (dec ? start.toFixed(dec) : Math.floor(start)) + suffix;
          if (start >= target) {
            el.textContent = prefix + (dec ? target.toFixed(dec) : target) + suffix;
            clearInterval(timer);
          }
        }, step);

        countObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => countObs.observe(el));

  /* ── 8. FAQ ACCORDION ────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 9. BACK TO TOP ──────────────────────────────────── */
  const backTop = document.getElementById('back-top');

  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 450);
  }, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 10. CONTACT FORM ────────────────────────────────── */
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let valid = true;
      inputs.forEach(inp => {
        if (!inp.value.trim()) {
          inp.style.borderColor = '#EF4444';
          valid = false;
          inp.addEventListener('input', () => { inp.style.borderColor = ''; }, { once: true });
        }
      });
      if (!valid) return;

      // Submit state
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '.7';

      // Simulate send
      setTimeout(() => {
        submitBtn.textContent = '✓ Sent! I\'ll reply within 24h.';
        submitBtn.style.opacity = '1';
        submitBtn.style.background = 'var(--green)';
        form.reset();

        setTimeout(() => {
          submitBtn.textContent = 'Send Message →';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 4000);
      }, 1500);
    });
  }

  /* ── 11. SMOOTH SCROLL for all anchor links ──────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 12. TOOLTIP for cert cards ──────────────────────── */
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      // In production, this would open a modal or lightbox
      const name = card.querySelector('.cert-name')?.textContent;
      if (name) console.log('Certificate clicked:', name);
    });
  });

});

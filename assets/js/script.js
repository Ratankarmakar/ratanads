/* ============================================================
   NIL RATAN KARMAKAR — PORTFOLIO
   script.js — Optimized for Performance
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. THEME ─────────────────────────────────────────── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const THEME_KEY   = 'nrk-theme';

  function applyTheme(theme, animate = false) {
    if (animate) {
      document.body.classList.add('theme-transitioning');
      setTimeout(() => document.body.classList.remove('theme-transitioning'), 350);
    }
    html.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem(THEME_KEY, theme);
  }

  applyTheme(localStorage.getItem(THEME_KEY) || 'dark', false);
  themeToggle.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  /* ── 2. MERGED SCROLL HANDLER (RAF throttled) ─────────── */
  const navbar  = document.getElementById('main-nav');
  const backTop = document.getElementById('back-top');
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 20);
      backTop.classList.toggle('show',    y > 450);
      scrollTicking = false;
    });
  }, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 3. MOBILE DRAWER ─────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('mobile-drawer');

  function closeMobileDrawer() {
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link =>
    link.addEventListener('click', closeMobileDrawer));

  /* ── 4. DROPDOWNS ─────────────────────────────────────── */
  const dropdownItems = document.querySelectorAll('.nav-item[data-dropdown]');

  dropdownItems.forEach(item => {
    item.querySelector('.nav-link').addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = item.classList.contains('open');
      dropdownItems.forEach(d => d.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  document.addEventListener('click', () =>
    dropdownItems.forEach(d => d.classList.remove('open')));

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    dropdownItems.forEach(d => d.classList.remove('open'));
    closeMobileDrawer();
  });

  /* ── 5. ACTIVE NAV LINK ───────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-link[href]');
  document.querySelectorAll('section[id]').forEach(sec => {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link =>
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
      });
    }, { rootMargin: '-50% 0px -50% 0px' }).observe(sec);
  });

  /* ── 6. SCROLL REVEAL ─────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => revealObs.observe(el));

  /* ── 7. SKILL BARS ────────────────────────────────────── */
  const skillSection = document.getElementById('skills-section');
  if (skillSection) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      skillSection.querySelectorAll('.skill-fill').forEach((bar, i) =>
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 120));
    }, { threshold: 0.25 }).observe(skillSection);
  }

  /* ── 8. COUNT-UP (RAF-based, no setInterval) ──────────── */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dec    = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
      const start  = performance.now();
      const dur    = 1600;

      const tick = (now) => {
        const progress = Math.min((now - start) / dur, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const val  = target * ease;
        el.textContent = prefix + (dec ? val.toFixed(dec) : Math.floor(val)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + (dec ? target.toFixed(dec) : target) + suffix;
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => countObs.observe(el));

  /* ── 9. FAQ ACCORDION ─────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── 10. SMOOTH SCROLL ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    });
  });

  /* ── 11. BEFORE / AFTER SLIDER (single global handlers) ── */
  let activeSlider  = null;
  let pendingX      = null;
  let sliderTicking = false;

  function applySlider() {
    if (activeSlider && pendingX !== null) {
      const after  = activeSlider.querySelector('.ba-after');
      const handle = activeSlider.querySelector('.ba-handle');
      const rect   = activeSlider.getBoundingClientRect();
      const pct    = Math.min(Math.max(((pendingX - rect.left) / rect.width) * 100, 2), 98);
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left    = `${pct}%`;
      activeSlider.classList.add('interacted');
    }
    sliderTicking = false;
  }

  function requestSliderUpdate(clientX) {
    pendingX = clientX;
    if (!sliderTicking) {
      sliderTicking = true;
      requestAnimationFrame(applySlider);
    }
  }

  document.querySelectorAll('[data-slider]').forEach(slider => {
    slider.addEventListener('mousedown', e => {
      activeSlider = slider;
      slider.classList.add('dragging');
      requestSliderUpdate(e.clientX);
      e.preventDefault();
    });

    slider.addEventListener('touchstart', e => {
      activeSlider = slider;
      slider.classList.add('dragging');
      requestSliderUpdate(e.touches[0].clientX);
    }, { passive: true });

    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', e => {
      const handle  = slider.querySelector('.ba-handle');
      const current = parseFloat(handle.style.left) || 50;
      const rect    = slider.getBoundingClientRect();
      if (e.key === 'ArrowLeft')  { requestSliderUpdate(rect.left + (current - 2) / 100 * rect.width); e.preventDefault(); activeSlider = slider; applySlider(); activeSlider = null; }
      if (e.key === 'ArrowRight') { requestSliderUpdate(rect.left + (current + 2) / 100 * rect.width); e.preventDefault(); activeSlider = slider; applySlider(); activeSlider = null; }
    });
  });

  window.addEventListener('mousemove', e => {
    if (!activeSlider) return;
    requestSliderUpdate(e.clientX);
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (!activeSlider) return;
    requestSliderUpdate(e.touches[0].clientX);
  }, { passive: true });

  const stopSlider = () => {
    if (activeSlider) activeSlider.classList.remove('dragging');
    activeSlider = null;
    pendingX     = null;
  };
  window.addEventListener('mouseup',     stopSlider, { passive: true });
  window.addEventListener('touchend',    stopSlider, { passive: true });
  window.addEventListener('touchcancel', stopSlider, { passive: true });

  /* ── 12. CONTACT FORM (EmailJS) ───────────────────────── */
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Validate
      let valid = true;
      form.querySelectorAll('input[required], textarea[required]').forEach(inp => {
        const empty = !inp.value.trim();
        inp.style.borderColor = empty ? '#EF4444' : '';
        if (empty) {
          valid = false;
          inp.addEventListener('input', () => { inp.style.borderColor = ''; }, { once: true });
        }
      });
      if (!valid) return;

      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending…';
      submitBtn.disabled  = true;

      const sendEmail = () => emailjs.send('service_qhdfuyk', 'template_vmnknzw', {
        name:     document.getElementById('name').value,
        email:    document.getElementById('email').value,
        service:  (document.getElementById('service') || {}).value || '',
        budget:   (document.getElementById('budget')  || {}).value || '',
        message:  document.getElementById('message').value,
        to_email: 'ratankarmakar32@gmail.com',
        reply_to: document.getElementById('email').value
      });

      const onSuccess = () => {
        submitBtn.innerHTML        = '✓ Sent! I\'ll reply within 24h.';
        submitBtn.style.background = 'var(--green)';
        form.reset();
        setTimeout(() => {
          submitBtn.innerHTML        = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled         = false;
        }, 4000);
      };

      const onError = (err) => {
        console.error('EmailJS:', err);
        submitBtn.innerHTML        = '✕ Failed — try emailing me directly';
        submitBtn.style.background = '#EF4444';
        submitBtn.disabled         = false;
        setTimeout(() => {
          submitBtn.innerHTML        = originalHTML;
          submitBtn.style.background = '';
        }, 4000);
      };

      if (typeof emailjs !== 'undefined') {
        sendEmail().then(onSuccess).catch(onError);
      } else {
        // EmailJS still loading — wait up to 3s
        let waited = 0;
        const poll = setInterval(() => {
          waited += 200;
          if (typeof emailjs !== 'undefined') {
            clearInterval(poll);
            sendEmail().then(onSuccess).catch(onError);
          } else if (waited >= 3000) {
            clearInterval(poll);
            onError('EmailJS not loaded');
          }
        }, 200);
      }
    });
  }

});

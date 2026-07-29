'use strict';

  // ─── PAGE ROUTING ──────────────────────────────────────────
  function showPage(id) {
    var target = document.getElementById('page-' + id);
    if (!target) return;

    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    target.classList.add('active');

    // update nav active state
    document.querySelectorAll('.navbar__links a').forEach(function (a) {
      a.classList.toggle('active', a.dataset.page === id);
    });

    closeAllDropdowns();
    closeMobile();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initReveal, 100);
  }

  // ─── NAVIGATION EVENT DELEGATION (replaces inline onclick) ──
  // every element with class "nav-link" and a data-page attribute
  // triggers client-side routing instead of using inline JS handlers,
  // which lets us run a strict Content-Security-Policy with no
  // 'unsafe-inline' for scripts.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('.nav-link');
    if (el) {
      e.preventDefault();
      showPage(el.dataset.page);
    }
  });

  // ─── MOBILE MENU ────────────────────────────────────────────
  var hamburgerBtn = document.getElementById('hamburger');
  hamburgerBtn.addEventListener('click', function () {
    document.getElementById('mobileMenu').classList.toggle('open');
  });

  function closeMobile() {
    document.getElementById('mobileMenu').classList.remove('open');
  }

  // ─── DROPDOWN (POPI) ────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.dropdown-toggle');
    if (toggle) {
      e.preventDefault();
      var menu = toggle.nextElementSibling;
      document.querySelectorAll('.dropdown-menu').forEach(function (m) {
        if (m !== menu) m.style.display = 'none';
      });
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      return;
    }
    if (!e.target.closest('.nav-dropdown')) {
      closeAllDropdowns();
    }
  });

  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(function (m) {
      m.style.display = 'none';
    });
  }

  // ─── SCROLL REVEAL ──────────────────────────────────────────
  function initReveal() {
    var els = document.querySelectorAll('.page.active .reveal');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { observer.observe(el); });
  }

  initReveal();

  // ─── CONTACT FORM VALIDATION ────────────────────────────────
  // client-side validation only improves UX; the form still posts
  // to Formspree, which must independently validate/sanitize on
  // its side. Never rely on client-side checks alone for security.
  var consultForm = document.getElementById('consultForm');
  if (consultForm) {
    var lastSubmitTime = 0;

    consultForm.addEventListener('submit', function (e) {
      // honeypot: if this hidden field has a value, a bot filled it in
      var honeypot = document.getElementById('companyWebsite');
      if (honeypot && honeypot.value.trim() !== '') {
        e.preventDefault();
        return;
      }

      // basic client-side rate limiting to reduce accidental double-submits
      var now = Date.now();
      if (now - lastSubmitTime < 3000) {
        e.preventDefault();
        return;
      }

      var valid = true;
      var fields = [
        { id: 'firstName', errId: 'err-firstName', check: function (v) { return v.trim().length > 0; } },
        { id: 'lastName',  errId: 'err-lastName',  check: function (v) { return v.trim().length > 0; } },
        { id: 'email',     errId: 'err-email',     check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
        { id: 'message',   errId: 'err-message',   check: function (v) { return v.trim().length > 10; } }
      ];

      var phoneEl = document.getElementById('phone');
      var phoneErr = document.getElementById('err-phone');
      if (phoneEl.value.trim() !== '' && !/^[+0-9 ()-]{6,20}$/.test(phoneEl.value.trim())) {
        phoneEl.classList.add('error');
        phoneErr.classList.add('show');
        valid = false;
      } else {
        phoneEl.classList.remove('error');
        phoneErr.classList.remove('show');
      }

      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        var err = document.getElementById(f.errId);
        if (!f.check(el.value)) {
          el.classList.add('error');
          err.classList.add('show');
          valid = false;
        } else {
          el.classList.remove('error');
          err.classList.remove('show');
        }
      });

      if (!valid) {
        e.preventDefault();
        return;
      }

      lastSubmitTime = now;
      // let the form submit normally to Formspree (no preventDefault here)
    });
  }

  // ─── NAVBAR SCROLL SHADOW ───────────────────────────────────
  window.addEventListener('scroll', function () {
    var nav = document.getElementById('navbar');
    nav.style.boxShadow = window.scrollY > 20
      ? '0 4px 24px rgba(0,0,0,.25)'
      : 'none';
  });
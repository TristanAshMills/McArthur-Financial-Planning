'use strict';

  // ─── PAGE ROUTING ──────────────────────────────────────────
  function showPage(id) {
    var target = document.getElementById('page-' + id);
    if (!target) return;

    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    target.classList.add('active');


    document.querySelectorAll('.navbar__links a').forEach(function (a) {
      a.classList.toggle('active', a.dataset.page === id);
    });

    closeAllDropdowns();
    closeMobile();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initReveal, 100);
  }

  // ─── NAVIGATION EVENT DELEGATION ──

  document.addEventListener('click', function (e) {
    var el = e.target.closest('.nav-link');
    if (el) {
      e.preventDefault();
      showPage(el.dataset.page);
    }
  });

  // ─── MOBILE MENU ────────────────────────────────────────────
  var hamburgerBtn = document.getElementById('hamburger');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      var mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu) mobileMenu.classList.toggle('open');
    });
  }

  function closeMobile() {
    var mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) mobileMenu.classList.remove('open');
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
      if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      }
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
  var consultForm = document.getElementById('consultForm');
  if (consultForm) {
    var lastSubmitTime = 0;

    consultForm.addEventListener('submit', function (e) {

      var honeypot = document.getElementById('companyWebsite');
      if (honeypot && honeypot.value.trim() !== '') {
        e.preventDefault();
        return;
      }


      var now = Date.now();
      if (now - lastSubmitTime < 3000) {
        e.preventDefault();
        return;
      }

      // ─── hCaptcha check ────────────────────────────────
      var hCaptchaField = consultForm.querySelector('textarea[name=h-captcha-response]');
      var captchaErr = document.getElementById('err-captcha');
      if (!hCaptchaField || !hCaptchaField.value) {
        e.preventDefault();
        if (captchaErr) captchaErr.classList.add('show');
        return;
      } else {
        if (captchaErr) captchaErr.classList.remove('show');
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
      if (phoneEl && phoneErr) {
        if (phoneEl.value.trim() !== '' && !/^[+0-9 ()-]{6,20}$/.test(phoneEl.value.trim())) {
          phoneEl.classList.add('error');
          phoneErr.classList.add('show');
          valid = false;
        } else {
          phoneEl.classList.remove('error');
          phoneErr.classList.remove('show');
        }
      }

      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        var err = document.getElementById(f.errId);
        if (!el || !err) return;
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

    });
  }

  // ─── NAVBAR SCROLL SHADOW ───────────────────────────────────
  window.addEventListener('scroll', function () {
    var nav = document.getElementById('navbar');
    if (nav) {
      nav.style.boxShadow = window.scrollY > 20
        ? '0 4px 24px rgba(0,0,0,.25)'
        : 'none';
    }
  });
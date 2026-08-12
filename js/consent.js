(function () {
  var STORAGE_KEY = "mcarthur_cookie_consent";
  var WEB3FORMS_SRC = "https://web3forms.com/client/script.js";

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setConsent(partial) {
    var consent = {
      necessary: true,
      functional: !!partial.functional,
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {}
    return consent;
  }

  function loadWeb3Forms() {
    if (document.getElementById("web3formsScript")) return;
    var s = document.createElement("script");
    s.id = "web3formsScript";
    s.src = WEB3FORMS_SRC;
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);
  }

  function loadMapEmbed() {
    var container = document.getElementById("mapEmbed");
    if (!container) return;
    var src = container.getAttribute("data-map-src");
    if (!src) return;
    container.innerHTML =
      '<iframe src="' + src + '" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  }

  function showMapPlaceholder() {
    var container = document.getElementById("mapEmbed");
    if (!container) return;
    container.innerHTML =
      '<div class="map-embed__placeholder">' +
      "<span>Map hidden until functional cookies are enabled.</span>" +
      '<a id="mapEnableLink">Enable functional cookies</a>' +
      "</div>";
    bindMapEnableLink();
  }

  function bindMapEnableLink() {
    var link = document.getElementById("mapEnableLink");
    if (link) link.addEventListener("click", openModal);
  }

  function showFormBlockedNotice() {
    var notice = document.getElementById("formBlockedNotice");
    if (notice) notice.style.display = "flex";
  }

  function hideFormBlockedNotice() {
    var notice = document.getElementById("formBlockedNotice");
    if (notice) notice.style.display = "none";
  }

  function applyConsent(consent) {
    if (consent.functional) {
      loadWeb3Forms();
      loadMapEmbed();
      hideFormBlockedNotice();
    } else {
      showMapPlaceholder();
      showFormBlockedNotice();
    }
  }

  function showBanner() {
    var banner = document.getElementById("cookieBanner");
    if (banner) banner.classList.add("show");
  }

  function hideBanner() {
    var banner = document.getElementById("cookieBanner");
    if (banner) banner.classList.remove("show");
  }

  function openModal() {
    var overlay = document.getElementById("cookieModalOverlay");
    if (overlay) overlay.classList.add("show");
    var existing = getConsent();
    var toggle = document.getElementById("cookieFunctionalToggle");
    if (toggle) toggle.checked = existing ? !!existing.functional : false;
  }

  function closeModal() {
    var overlay = document.getElementById("cookieModalOverlay");
    if (overlay) overlay.classList.remove("show");
  }

  function init() {
    bindMapEnableLink();

    var existing = getConsent();
    if (existing) {
      applyConsent(existing);
    } else {
      showBanner();
    }

    var acceptAll = document.getElementById("cookieAcceptAll");
    var rejectAll = document.getElementById("cookieRejectAll");
    var manage = document.getElementById("cookieManage");
    var savePrefs = document.getElementById("cookieSavePrefs");
    var modalAcceptAll = document.getElementById("cookieModalAcceptAll");
    var overlay = document.getElementById("cookieModalOverlay");
    var formBlockedLink = document.getElementById("formBlockedEnableLink");
    var consultForm = document.getElementById("consultForm");

    if (acceptAll) {
      acceptAll.addEventListener("click", function () {
        var consent = setConsent({ functional: true });
        applyConsent(consent);
        hideBanner();
      });
    }

    if (rejectAll) {
      rejectAll.addEventListener("click", function () {
        var consent = setConsent({ functional: false });
        applyConsent(consent);
        hideBanner();
      });
    }

    if (manage) {
      manage.addEventListener("click", openModal);
    }

    if (savePrefs) {
      savePrefs.addEventListener("click", function () {
        var toggle = document.getElementById("cookieFunctionalToggle");
        var consent = setConsent({ functional: toggle ? toggle.checked : false });
        applyConsent(consent);
        closeModal();
        hideBanner();
      });
    }

    if (modalAcceptAll) {
      modalAcceptAll.addEventListener("click", function () {
        var consent = setConsent({ functional: true });
        applyConsent(consent);
        closeModal();
        hideBanner();
      });
    }

    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeModal();
      });
    }

    if (formBlockedLink) {
      formBlockedLink.addEventListener("click", openModal);
    }

    if (consultForm) {
      consultForm.addEventListener("submit", function (e) {
        var consent = getConsent();
        if (!consent || !consent.functional) {
          e.preventDefault();
          showFormBlockedNotice();
          openModal();
        }
      });
    }

    var settingsLinks = document.querySelectorAll(".cookie-settings-link");
    for (var i = 0; i < settingsLinks.length; i++) {
      settingsLinks[i].addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
# McArthur Financial Planning

## Security Audit Report

This repository contains the McArthur Financial Planning Services website with a comprehensive set of security improvements implemented to address common web application vulnerabilities based on the **OWASP Top 10**.

---

## Security Improvements

### Fix 1 – Content Security Policy (OWASP A05)

A strict Content Security Policy (CSP) has been implemented to significantly reduce the risk of Cross-Site Scripting (XSS) attacks.

* Added CSP support for static deployments.
* Uses a nonce-based approach for inline scripts and styles.
* Replace `REPLACE_SERVER_NONCE_HERE` with a cryptographically secure, random 16-byte Base64 nonce on every server response.
* In production, the CSP should be delivered as an **HTTP response header** rather than a meta tag.

---

### Fixes 2–3 – Security Headers (OWASP A05)

Added:

* `Referrer-Policy: strict-origin-when-cross-origin`

Recommended production headers:

* `X-Content-Type-Options: nosniff`
* `X-Frame-Options: DENY`
* `Strict-Transport-Security (HSTS)`
* `Permissions-Policy`

These headers help protect against clickjacking, MIME sniffing, and unnecessary information disclosure.

---

### Fix 5 – Subresource Integrity (OWASP A06)

Google Fonts were originally loaded from Google's CDN without Subresource Integrity (SRI).

Since Google Fonts are served dynamically and cannot use SRI:

* Self-hosting the font files is recommended.
* This removes the third-party dependency.
* Improves privacy and GDPR compliance.

---

### Fix 7 – Inline Event Handlers (OWASP A03)

All inline JavaScript event handlers such as:

```html
onclick="showPage('home')"
```

were removed.

They have been replaced with:

* `data-page`
* `data-action`

A single event delegation listener now handles all navigation, making the application compatible with a strict CSP.

---

### Fix 10 – Reverse Tabnabbing (OWASP A05)

All links using:

```html
target="_blank"
```

now include:

```html
rel="noopener noreferrer"
```

This prevents malicious pages from accessing `window.opener` and redirecting the original tab.

---

### Fix 11 – Email Address Protection (OWASP A02)

The email address is no longer stored as plain text within the HTML.

Instead:

* It is reconstructed at runtime using `data-*` attributes.
* Inserted using `textContent`.
* The `href` attribute is created with `setAttribute()`.

This helps reduce automated email harvesting by spam bots.

---

### Fix 12 – Sandboxed Google Maps iframe (OWASP A05)

The embedded Google Maps iframe now uses:

```html
sandbox="allow-scripts allow-same-origin"
```

This prevents:

* Form submissions
* Popups
* Top-level navigation
* Pointer lock

while still allowing Google Maps to function correctly.

---

### Fix 13 – CSRF Protection (OWASP A01)

The contact form has been improved by:

* Adding a hidden honeypot (`_gotcha`) field.
* Using JavaScript `fetch()` for submissions.
* Detecting bot activity before sending requests.

For production deployments, server-side CSRF tokens should also be implemented.

---

### Fix 14 – Rate Limiting (OWASP A07)

Client-side protections include:

* 60-second submission cooldown.
* Submit button disabled during requests.
* Double-submit prevention.

Production deployments should also implement server-side rate limiting, such as limiting submissions per IP address.

---

### Fix 15 – Input Validation & Sanitization (OWASP A03)

Validation has been added for every form field.

Examples include:

* Name validation using allowlisted characters.
* RFC 5322-compatible email validation.
* Phone number validation.
* Maximum input lengths.
* Sanitization before submission.
* Service selection validated against an allowlist.

All user-facing messages use `textContent` rather than `innerHTML`.

---

### Fix 16 – Service Validation (OWASP A03)

The service selector now uses machine-readable values rather than display text.

Submitted values are validated against an allowlist before processing.

---

### Fix 17 – Secure Navigation (OWASP A01)

Page navigation now validates requested pages against an approved list:

* Home
* About
* Services
* Process
* Contact

Only approved page identifiers are accepted, preventing unexpected DOM manipulation.

---

### Fix 18 – JavaScript Scope Protection

The application's JavaScript is encapsulated within an Immediately Invoked Function Expression (IIFE):

```javascript
(function () {
    'use strict';
    // Application code
})();
```

Benefits include:

* Prevents global namespace pollution.
* Enables JavaScript strict mode.
* Reduces the risk of variable collisions.
* Improves maintainability and security.

---

## Summary

The application has been strengthened against multiple categories of vulnerabilities identified in the **OWASP Top 10**, including:

* Cross-Site Scripting (XSS)
* Cross-Site Request Forgery (CSRF)
* Reverse Tabnabbing
* Clickjacking
* Information Disclosure
* DOM Injection
* Input Validation Weaknesses
* Brute Force Form Abuse
* Global JavaScript Scope Pollution

While these client-side improvements significantly increase the application's security, additional production safeguards—such as HTTP security headers, server-side CSRF validation, authentication, logging, and rate limiting—should also be implemented for a complete defense-in-depth strategy.

---

Copyright © 2026 Tristan Ashley Mills

All Rights Reserved.

This source code, documentation, and associated files are the exclusive property of Tristan Ashley Mills. Unauthorized copying, reproduction, modification, distribution, or use of this project, in whole or in part, is strictly prohibited without prior written permission.

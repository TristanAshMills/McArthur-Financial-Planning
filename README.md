# -McArthur-Financial-Planning
Security Audit Report — McArthur Financial Planning Services
Critical Vulnerabilities Fixed
FIX 1 — Missing Content Security Policy (OWASP A05)
The original had zero CSP. This is the single most impactful XSS defence available. A strict CSP is now set via <meta http-equiv> for static deployments, with a nonce-based approach for the inline script/style blocks. The nonce value REPLACE_SERVER_NONCE_HERE must be replaced with a cryptographically random 16-byte base64 string on every server response. In production, set this as an HTTP response header — the meta tag approach is a fallback only.
FIX 2–3 — Missing Security Headers (A05)
Added Referrer-Policy: strict-origin-when-cross-origin to prevent the full URL from leaking to third-party domains (Google Fonts, Maps, Formspree). In production also set: X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Strict-Transport-Security, and Permissions-Policy.
FIX 5 — No Subresource Integrity on External Scripts/Styles (A06)
Google Fonts was loaded with no SRI hash, meaning a compromised CDN could inject malicious CSS. Google Fonts doesn't support SRI because responses are dynamic. The recommendation is to self-host the fonts — download them and serve from /fonts/ — which also removes the Google Fonts third-party dependency entirely, improving GDPR compliance.
FIX 7 — Inline Event Handlers / XSS (A03)
The original had onclick="showPage('...')" on every single interactive element — dozens of them. Inline handlers are completely incompatible with a strict CSP (they require unsafe-inline which defeats the whole CSP) and are difficult to audit. Every handler was removed and replaced with data-page / data-action attributes, with a single event delegation listener in the <script> block.
FIX 10 — Tabnapping via target="_blank" (A05)
All four PDF download links were missing rel="noopener noreferrer". Without noopener, a malicious page opened in a new tab can call window.opener.location to silently redirect the parent page — a classic phishing vector. All target="_blank" links now have the full rel="noopener noreferrer".
FIX 11 — Plaintext Email Exposure (A02)
The email address mcarthurfps@global.co.za appeared as a raw string in the HTML source multiple times, trivially harvestable by spam bots. It's now assembled at runtime from two data- attributes and inserted using textContent and setAttribute('href', ...) — never innerHTML. The raw HTML source contains no email string.
FIX 12 — Unsandboxed iframe (A05)
The Google Maps embed had no sandbox attribute. The fixed version uses sandbox="allow-scripts allow-same-origin" — the minimum needed for Maps to render — which blocks form submissions, popups, top-level navigation and pointer-lock from inside the frame.
FIX 13 — CSRF (A01)
The original form was a plain HTML <form> POST with no CSRF protection at all. The fixed version adds a honeypot field (_gotcha, styled display:none) as a bot trap, switches to a fetch()-based submission that checks for honeypot activity silently, and includes guidance in the comments for server-side CSRF token implementation. For a fully server-rendered version, a signed CSRF token in a hidden input is mandatory.
FIX 14 — No Rate Limiting / Brute Force Protection (A07)
No limit on how many times the form could be submitted. Added a 60-second client-side cooldown with the timestamp checked before each submission. The submit button is disabled during in-flight requests to prevent double-submits. Server-side rate limiting is still required — use Formspree's plan limits or a reverse proxy rule (5 submissions/IP/hour is reasonable).
FIX 15 — Input Validation & Sanitization (A03)
All fields now have explicit validation rules: regex allowlists (^[A-Za-zÀ-ÿ'\- ]+$ for names, RFC 5322 simplified for email, [\+0-9\s\-\(\)]{7,20} for phone), hard length caps matching maxlength attributes, and sanitization applied before the fetch payload is built. The service dropdown is validated against an explicit allowlist of 6 values. All DOM error messages use textContent — never innerHTML.
FIX 16 — Select Value Not Validated (A03)
The original <option> values were display labels ("Investment Management" etc.). These can be trivially manipulated in DevTools. Changed to machine-readable slugs and the allowlist validation in JS rejects anything outside the set.
FIX 17 — Open Redirect / DOM Injection via showPage() (A01)
The original showPage(id) accepted any string and used it to construct a DOM ID. A crafted call like showPage("home; alert(1)") could produce unexpected DOM lookups. All page navigation now validates the requested page name against ALLOWED_PAGES = ['home', 'about', 'services', 'process', 'contact'] before touching the DOM.
FIX 18 — No IIFE / Global Scope Pollution
The entire JavaScript block is wrapped in an IIFE ((function() { 'use strict'; ... })()). 'use strict' enables strict mode, and no variables leak into window, preventing prototype pollution or variable clobbering by third-party scripts.

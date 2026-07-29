# McArthur Financial Planning

A secure, responsive financial planning website developed for **McArthur Financial Planning Services**. This project demonstrates modern web development practices with a strong focus on usability, accessibility, and web application security based on the **OWASP Top 10**.

---

## Overview

The website provides clients with information about McArthur Financial Planning Services, including:

* Company information
* Financial planning services
* Client process overview
* Contact and consultation request form
* Mobile responsive navigation
* Interactive user interface with smooth page transitions

The application is built using vanilla HTML, CSS, and JavaScript without external frameworks, making it lightweight and easy to maintain.

---

## Features

* Responsive design for desktop, tablet, and mobile devices
* Single-page application navigation
* Mobile hamburger menu
* Dropdown navigation
* Scroll reveal animations
* Contact form validation
* Interactive user experience
* Clean and modern interface

---

## Security Enhancements

This project was audited and updated to address multiple vulnerabilities identified within the **OWASP Top 10**.

### Implemented Improvements

* Strict Content Security Policy (CSP)
* Removal of inline JavaScript event handlers
* Secure event delegation
* Improved input validation and sanitization
* Protection against Cross-Site Scripting (XSS)
* Reverse tabnabbing protection (`rel="noopener noreferrer"`)
* Email obfuscation to reduce spam harvesting
* Sandboxed Google Maps iframe
* Client-side rate limiting
* Honeypot bot protection
* Secure page routing
* Reduced global JavaScript scope using an IIFE
* Improved security header recommendations
* Service allowlist validation
* Enhanced DOM safety using `textContent`

---

## Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)
* Formspree
* Google Maps Embed

---

## Project Structure

```text
McArthur-Financial-Planning/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
├── documents/
├── README.md
└── LICENSE
```

---

## Contact Form

The contact form includes several layers of client-side protection:

* Required field validation
* Email format validation
* Phone number validation
* Message length validation
* Honeypot spam detection
* Client-side submission cooldown
* Secure DOM updates using `textContent`

> **Note:** Client-side validation improves the user experience but must always be backed by server-side validation and sanitization in production.

---

## Security Recommendations

For production deployments, the following server-side protections are recommended:

* Content Security Policy delivered via HTTP headers
* HTTP Strict Transport Security (HSTS)
* X-Frame-Options
* X-Content-Type-Options
* Permissions-Policy
* Server-side CSRF protection
* Server-side rate limiting
* Logging and monitoring
* Self-hosted web fonts

---

## Installation

Clone the repository:

```bash
git clone https://github.com/TristanAshMills/-McArthur-Financial-Planning.git
```

Open the project folder:

```bash
cd -McArthur-Financial-Planning
```

Launch `index.html` in your preferred browser.

---

## Future Improvements

* Backend integration
* Database support
* User authentication
* Appointment booking system
* Financial calculators
* Client portal
* Dark mode
* Automated security testing

---

## Author

**Tristan Ashley Mills**

GitHub: https://github.com/TristanAshMills

---

## Copyright

Copyright © 2026 Tristan Ashley Mills

All Rights Reserved.

This source code, documentation, and associated files are the exclusive property of Tristan Ashley Mills. Unauthorized copying, reproduction, modification, distribution, or use of this project, in whole or in part, is strictly prohibited without prior written permission.

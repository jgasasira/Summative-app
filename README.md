# Book & Notes Vault - ALU Front-End Summative Project

An accessible, responsive, and secure web application built with semantic HTML5 landmarks, mobile-first CSS layouts, and modular vanilla JavaScript. This application functions as an academic resource tracker with built-in real-time regular expression evaluation filters, storage allocation cap alerts, and data portability settings.

## 🚀 Implemented Core Features
- **Semantic Layout & Structure:** Built entirely with semantic HTML5 tags including `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, and `<footer>` landmarks to satisfy strict document outline rules.
- **Responsive Media Queries:** Designed using fluid layout strategies built with Flexbox responsive across mobile (~360px), tablet (768px), and desktop (1024px) viewports.
- **Dynamic Metrics Dashboard:** Tracks total vault entries, total page volume sums, and top category tags alongside an automated last 7 days trend bar column chart.
- **Form Input Validations:** Built-in form compliance constraints utilizing strict regular expression evaluations to safeguard database integrity with clear error messages.
- **Advanced Backreference Verification:** Integrates an advanced regex engine loop to check for consecutive duplicate word sequences in user entries.
- **Inline Row Editing & Deletion:** Supports complete CRUD behaviors allowing users to delete records with confirmations or pull card entries back into form fields inline for updates while synchronizing `updatedAt` timestamps.
- **Unit Scale Conversions:** Integrated settings module that computes pages-to-chapters or chapters-to-pages configurations dynamically on a standard 20:1 page-to-chapter index ratio.
- **Data Portability:** Auto-saves project states into the browser's persistent `localStorage` cache. Fulfills data backup criteria using clean text block JSON database string import and export controls.
- **Strict Accessibility Compliance (a11y):** Keyboard navigation loops, distinct focus rings, high-contrast text color balance configurations, skip-to-content anchor tags, and real-time screen reader announcements using active `aria-live` containers.

---

## 🔍 Regular Expressions Catalog

| Field Target | Regex Pattern | Purpose & Validation Guard | Match Example | Non-Match Example |
| :--- | :--- | :--- | :--- | :--- |
| **Title / Description** | `/^[^\s](?!.*?\s{2,}).*[^\s]$/` | Forbids leading/trailing spaces and collapses consecutive multi-spaces. | `ALU Software Engineering Notes` | `  Software   Notes ` |
| **Pages / Length** | `/^[1-9]\d{0,3}$/` | Restricts value scales strictly to positive integers between 1 and 9999. | `145` | `-12` or `12.5` |
| **Date Added** | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|\d\|3)$/` | Validates structured historic date strings matching calendar values (`YYYY-MM-DD`). | `2026-10-18` | `2026/10/18` |
| **Classification Tags** | `/^[a-z]+(?:\/[a-z]+)*$/` | Enforces lowercase alphabetic tokens separated cleanly by a singular slash character. | `tech/css` | `Tech/CSS` or `tech css` |
| **Advanced Pattern** | `/\b([A-Za-z]+)\s+\1\b/` | Advanced backreference rule targeting consecutive repeating word phrases inside text. | `double double tokens` | `single normal sequence` |

---

## ⌨️ Accessible Keyboard Mapping

| Key Trigger | UI Target Node Action | Navigation Workflow |
| :--- | :--- | :--- |
| **`Tab`** | Focus Forward | Standard document index loops traversing input forms, hyperlinks, sort triggers, and buttons consecutively. |
| **`Shift + Tab`** | Focus Backward | Reverses standard document focus layout indexes. |
| **`Enter`** / **`Space`** | Activate | Triggers anchor navigation, button subroutines, record deletion confirmations, or inline card edit states. |
| **`Arrow Keys`** | Scroll | Enables screen readers and keyboard-only users to navigate textual lines or grid dashboard contents. |

---

## 🛠️ Testing Instructions (`tests.html`)
To run automated unit verification tests on our regular expression rules:
1. Open the accompanying `tests.html` file inside your web browser window.
2. The testing script evaluates the validation engine across over 10 distinct boundary edge cases.
3. Successful assertions will print clean green verification logs inside the DOM workspace, proving compliance with all core milestone guidelines.

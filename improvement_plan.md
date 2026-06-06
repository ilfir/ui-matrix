# UI Matrix Improvement Plan

## Current State Analysis

The UI Matrix project is a vanilla HTML/CSS/JavaScript 5x5 letter matrix word search application with the following issues:

### Code Quality Issues
1. **All JS in single files** — `js/script.js` (392 lines) and `js/settings.js` (231 lines) are monolithic with mixed concerns
2. **No code organization** — Functions, state management, and DOM manipulation all mixed together
3. **Duplicate code** — `showNotification()` exists in both `script.js` and `settings.js`
4. **No error handling** — Fetch calls lack proper fallbacks, JSON parse errors not handled
5. **Hardcoded values** — Endpoints, matrix size, Russian letters hardcoded throughout
6. **Memory leaks** — Event listeners added on every `DOMContentLoaded` without cleanup

### UI/UX Issues
7. **Outdated styling** — Basic colors, no modern design patterns, flat appearance
8. **Not responsive** — Fixed widths (23%, 300px) don't adapt to different screen sizes
9. **Poor visual feedback** — Limited animation, no loading states, no transitions
10. **Matrix values lost on navigation** — Navigating to settings and back clears all entered letters
11. **No keyboard shortcuts** — Users must click every button
12. **Unclear error messages** — Generic "Error" messages without context
13. **No accessibility** — Missing ARIA labels, no focus indicators, poor contrast

### Technical Debt
14. **Node 14 Docker image** — EOL, security risks
15. **No build process** — No linting, no minification
16. **Inline styles in HTML** — Should be in CSS
17. **Typo in settings.html** — `foro` instead of `for`, `serch-query` instead of `search-query`

---

## Improvement Items

### Priority 1: Preserve Matrix Values (User Request #3)
**Issue:** When user navigates to settings page and returns, all entered matrix values are lost.

**Solution:**
- Save matrix state to `localStorage` on every input change
- Load matrix state from `localStorage` on page load
- Clear stored matrix only on "Clear" button or when explicitly reset

**Files to modify:**
- `js/script.js` — Add save/load matrix state logic

---

### Priority 2: Make UI More Modern (User Request #1)
**Changes needed:**

#### Visual Design
- Modern color palette with CSS custom properties (variables)
- Smooth transitions and animations
- Better typography (system font stack or Google Fonts)
- Glassmorphism or neumorphism effects for matrix cells
- Gradient backgrounds
- Better shadow effects

#### Layout
- Responsive design with media queries
- Flexbox/Grid for better layout control
- Mobile-friendly touch targets
- Proper spacing and visual hierarchy

#### Interactions
- Hover effects on matrix cells
- Animated button transitions
- Loading spinner during API calls
- Smooth result appearance animations
- Cell highlight animations for word positions

**Files to modify:**
- `css/styles.css` — Complete redesign

---

### Priority 3: Dark Mode Styling (User Request #4)
**Changes needed:**

#### Color Scheme
- Use a popular dark mode palette inspired by GitHub Dark / VS Code Dark+ / One Dark Pro
- Primary colors: indigo/violet accent (#818cf8, #6366f1)
- Background: slate grays (#0f172a, #1e293b, #334155)
- Surface cards: slightly lighter slate (#1e293b)
- Text: high contrast whites (#f8fafc, #e2e8f0)
- Secondary text: muted slate (#94a3b8)
- Borders: subtle dark borders (#334155)
- Success: emerald green (#34d399)
- Danger: rose red (#f87171)
- Warning: amber (#fbbf24)

#### Typography
- Use Inter font (popular modern UI font) from Google Fonts
- Fallback stack: Inter, -apple-system, Segoe UI, Roboto, sans-serif
- Monospace for matrix cells: JetBrains Mono or SF Mono
- Proper font weights: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

#### Dark Mode Features
- All backgrounds use dark slate gradients
- Cards/surfaces with subtle borders and shadows
- High contrast text for readability
- Accent colors that pop against dark background
- Smooth transitions between states
- Custom scrollbar styling for dark theme

**Files to modify:**
- `css/styles.css` — Dark mode color scheme

---

### Priority 4: Make UI More User-Friendly (User Request #2)
**Changes needed:**

#### Feedback & Guidance
- Placeholder text in matrix cells showing example letters
- Tooltips explaining each button's function
- Clearer success/error messages with icons
- Word count progress indicator
- Visual indication of which words found/not found

#### Navigation
- Breadcrumb or page indicator
- "Back to Matrix" button on settings page
- Remember scroll position when returning from settings

#### Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators for keyboard users
- Screen reader friendly result announcements

#### Error Handling
- Validate input before API calls
- Show loading state during fetch
- Retry mechanism for failed requests
- Clear error messages with actionable advice

**Files to modify:**
- `css/styles.css` — UX improvements
- `js/script.js` — Better feedback logic
- `index.html` — Add accessibility attributes
- `settings.html` — Fix typos, improve labels

---

### Priority 4: Modularize and Organize JS Code
**Current state:** Two monolithic files with mixed concerns.

**Target structure:**
```
js/
├── modules/
│   ├── storage.js      — localStorage abstraction (get/set/clear)
│   ├── matrix.js       — Matrix state management, input handling
│   ├── api.js          — API communication (fetch wrappers)
│   ├── results.js      — Display results, word highlighting
│   └── utils.js        — Shared utilities (notifications, beep)
├── script.js           — Main entry for index.html
└── settings.js         — Main entry for settings.html
```

**Refactoring principles:**
- Each module has single responsibility
- No direct DOM manipulation in storage/api modules
- Events handled at module boundaries
- Export functions, not global variables
- Use IIFE or ES modules pattern

**Files to create/modify:**
- `js/modules/storage.js` — NEW
- `js/modules/matrix.js` — NEW (extracted from script.js)
- `js/modules/api.js` — NEW (extracted from script.js, settings.js)
- `js/modules/results.js` — NEW (extracted from script.js)
- `js/modules/utils.js` — NEW (extracted duplicates)
- `js/script.js` — REWRITE (thin entry point, use modules)
- `js/settings.js` — REWRITE (thin entry point, use modules)

---

## Implementation Order

1. **Modularize JS first** — Foundation for all other changes
2. **Preserve matrix values** — Built on modularized code
3. **Modern UI** — Visual overhaul
4. **User-friendly improvements** — Polish and accessibility

## Notes

- All changes should preserve existing API contracts
- Existing localStorage keys must remain compatible
- Test Setting functionality should be preserved
- Word search highlighting animation must continue to work

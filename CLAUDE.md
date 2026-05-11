# umd-search

Chat-style search interface for the University of Maryland. A static-file prototype — no build step, no framework.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page — centered search input, common-searches pills |
| `results.html` | Chat results — transcript + featured (pinned) cards + sticky composer |
| `vertex.html` | Vertex AI variant of the landing/search entry |
| `vertex-results.html` | Vertex AI variant of results, non-chat layout with AI summary + citations |

## Structure

```
design-system/   # git submodule — UMD web-components-library (tokens, web components)
images/logos/    # SVG logos (primary-logo-dark.svg, footer-logo.svg)
assets/          # Icons used in the UI (person-icon.svg, chevron-submit.svg, chat-icon.png)
styles/app.css   # All local CSS (single file)
scripts/app.js   # All local JS (single file, ES module)
```

## Design system

The UMD design system is a git submodule at `design-system/`. It is also loaded at runtime via unpkg CDN:

```html
<script src="https://unpkg.com/@universityofmaryland/web-components-library@1.18.2/dist/cdn.js"></script>
```

Web components used: `umd-element-navigation-utility`, `umd-element-card` (with `data-display="list"`), `umd-element-call-to-action`.

CSS utility classes from the DS (inlined in each HTML `<head>` as critical CSS):
- Layout: `umd-layout-space-horizontal-{full|normal|small|smallest}` — centered containers with responsive padding
- Typography: `umd-sans-larger`, `umd-sans-medium`, `umd-sans-smaller`, `umd-sans-min`, `umd-sans-extralarge-uppercase`
- Decorative: `umd-text-line-trailing-light` — eyebrow label with a trailing horizontal rule
- Pill/tag list: `umd-text-cluster-pill`

## Color tokens (CSS custom properties in `styles/app.css`)

```css
--umd-red: #e21833
--umd-red-hover: #c41129
--gray-lightest: #fafafa
--gray-lighter: #f1f1f1
--gray-light: #e6e6e6
--gray-medium: #757575
--black: #000
--bg: #fff
--surface: #fff
--text: #1a1a1a
```

## Chat layout (results.html)

- **`.chat__featured`** — pinned result cards above the transcript, separated by a black border
- **`.chat__transcript`** — scrollable flex column of `.msg` articles; no `aria-live` (announcements are handled by `#transcript-announcer`)
- **`#transcript-announcer`** — visually hidden `aria-live="polite" aria-atomic="true"` div; receives the full plain-text of each completed response so screen readers announce it once, not char-by-char
- **`.msg--user`** — right-aligned gray pill bubble, person icon to the right
- **`.msg--assistant`** — left-aligned, no box, lighter weight, red links
- **`.chat__composer`** — fixed full-width gray strip at the bottom (`z-index: 10`); inner `max-width: 992px` matches `.umd-layout-space-horizontal-small`

## JS (scripts/app.js)

- Reads `?q=` from the URL to pre-populate the user's query.
- `typeAnswer(bubble, segments, charDelay)` — types text/link segments char-by-char with a blinking caret; returns a Promise.
- All replies are currently canned stubs. The form submit handler acknowledges follow-up questions with a stub message ("Backend not wired up yet."). No backend is planned yet; Vertex AI is a possible future integration but not in scope.
- After typing finishes, `revealLoadMoreBtn()` unhides the "See more" button.
- No bundler. The file is loaded as `type="module"`.

## Running locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No npm, no build step.

## Accessibility

All work must meet **WCAG 2.2 Level AA**. This includes but is not limited to:

- Sufficient color contrast (4.5:1 for normal text, 3:1 for large text and UI components)
- All interactive elements reachable and operable by keyboard
- Visible focus indicators on all focusable elements
- ARIA labels on icon-only buttons and landmark regions
- Live regions (`aria-live`) for dynamically injected content — use a dedicated visually-hidden announcer element, not the visible container, to avoid char-by-char noise during typing animations
- No content that relies solely on color to convey meaning

## Key constraints

- **No build tooling** — vanilla HTML/CSS/JS only. Do not introduce a bundler, framework, or package.json.
- **Single CSS file** (`styles/app.css`), single JS file (`scripts/app.js`). Keep it that way unless there is a strong reason to split.
- **Critical CSS is inlined** in each HTML `<head>` — layout containers, typography tokens, and web-component visibility guards. Keep this in sync if tokens change.
- The `design-system/` submodule is read-only reference; do not modify it.
- Cache-busting is done manually via `?v=N` query strings on CSS/JS `<link>`/`<script>` tags — bump when making changes to those files.

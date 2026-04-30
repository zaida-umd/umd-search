# umd-search

Chat-style search interface for UMD. Wide conversational layout with a sticky input at the bottom, and support for **featured results** pinned above the transcript (carried over from the classic search page concept).

This repo is a sibling experiment to [design-system-page-builder](../design-system-page-builder); the original `examples/search.html` there remains the reference for the classic, list-based search UI.

## Structure

```
design-system/   # git submodule — UMD design system (tokens, components)
index.html       # entry point (scaffold)
styles/          # local CSS
scripts/         # local JS
```

The design system is included as a submodule for tokens and the occasional web component, but most of this UI is hand-rolled chat layout.

## Getting started

```bash
git clone --recurse-submodules <repo-url>
cd umd-search
# open index.html in a browser, or serve with any static server
python3 -m http.server 8000
```

## Concepts

- **Transcript**: scrollable list of user/assistant turns.
- **Featured results**: pinned cards rendered above (or at the top of) the transcript. Curated answers that should always show for matching intents.
- **Composer**: sticky input at the bottom of the viewport.

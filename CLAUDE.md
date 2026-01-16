# CLAUDE.md - AI Assistant Context for LinkOff

This file provides context and instructions for Claude (or other AI assistants) when working on the LinkOff codebase.

## Project Overview

**LinkOff** is a browser extension and userscript that filters unwanted content from LinkedIn. It supports Chrome, Firefox, Edge, Brave, Vivaldi, Opera (via extension) and Safari/mobile (via userscript).

**Key Features**:
- Feed filtering (promoted posts, polls, videos, etc.)
- Keyword-based content filtering
- UI customization (dark mode, wide mode)
- Job post filtering
- Bulk message deletion

**Current Version**: 1.10.0
**License**: MIT

## Tech Stack

| Component | Technology |
|-----------|------------|
| Language | JavaScript (ES6 modules) |
| Build | Rollup 4.24.0 |
| CSS | Sass + Bulma |
| Linting | ESLint 7.32.0 + Prettier |
| UI Library | Tagify (for keyword inputs) |
| Dev Tool | web-ext (Firefox testing) |
| CI/CD | GitHub Actions |

## Project Structure

```
src/
├── core/                 # Shared platform-agnostic logic
│   ├── index.js         # Main initialization & orchestration
│   ├── filters/         # Content filtering modules
│   │   ├── feed.js      # Feed post filtering logic
│   │   ├── jobs.js      # Job filtering logic
│   │   ├── misc.js      # Miscellaneous UI filtering
│   │   └── selectors.js # LinkedIn DOM selectors
│   ├── features/        # Feature implementations
│   │   ├── general.js   # Dark mode, wide mode, etc.
│   │   └── message.js   # Message deletion feature
│   ├── settings/        # Settings management
│   │   ├── defaults.js  # Default settings & labels
│   │   └── storage-interface.js
│   └── utils/
│       └── dom.js       # DOM manipulation utilities
├── extension/           # Browser extension wrapper
│   ├── content.js       # Content script entry
│   ├── background.js    # Service worker
│   ├── popup.js         # Popup UI logic
│   ├── storage.js       # Chrome storage adapter
│   ├── manifest.json    # Extension manifest v3
│   └── popup.html       # Popup template
├── userscript/          # Userscript wrapper
│   ├── main.js          # Userscript entry point
│   ├── storage.js       # GM_* storage adapter
│   └── meta.txt         # Userscript metadata block
├── popup/
│   └── popup.scss       # Popup styling (Bulma-based)
├── content/
│   └── content.css      # Content script styles
├── icons/               # Extension icons
└── lib/                 # Vendored libraries (Tagify)

dist/                    # Build output (generated)
├── extension/           # Browser extension build
└── linkoff.user.js      # Userscript build
```

## Common Commands

```bash
# Install dependencies
npm install

# Build everything (extension + userscript)
npm run build

# Development with watch mode
npm run build:watch

# Run in Firefox for testing
npm run dev

# Lint code
npm run lint

# Package for release
npm run package
```

## Build Outputs

- **Extension**: `dist/extension/` - Load as unpacked extension
- **Userscript**: `dist/linkoff.user.js` - Install in Tampermonkey/Violentmonkey

## Coding Conventions

### JavaScript Style

- ES6 modules with named exports
- No semicolons (Prettier handles this)
- Single quotes for strings
- 2-space indentation
- Trailing commas in multiline structures

```javascript
// Good
export function filterPost(post, settings) {
  const { keywords, hidePromoted } = settings
  // ...
}

// Avoid
export function filterPost(post, settings) {
    var keywords = settings.keywords;  // Wrong indent, semicolons, var
}
```

### File Organization

- One module per file with clear, single responsibility
- Group related functions in feature-specific modules
- Keep DOM selectors centralized in `selectors.js`
- Platform-specific code in `extension/` or `userscript/` only

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `feed-filter.js` |
| Functions | camelCase | `shouldHidePost()` |
| Constants | UPPER_SNAKE | `DEFAULT_SETTINGS` |
| Classes | PascalCase | `StorageAdapter` |
| CSS Classes | kebab-case | `.linkoff-hidden` |

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/core/index.js` | Main entry point, orchestrates all filters |
| `src/core/filters/selectors.js` | LinkedIn DOM selectors (update when LinkedIn changes) |
| `src/core/settings/defaults.js` | All settings with defaults and labels |
| `src/extension/manifest.json` | Extension permissions and configuration |
| `rollup.config.js` | Build configuration for all outputs |

## Working with LinkedIn Selectors

LinkedIn frequently changes their DOM structure. When filters break:

1. Inspect the LinkedIn page to find new selectors
2. Update `src/core/filters/selectors.js`
3. Test both extension and userscript builds
4. Document the change in commit message

```javascript
// selectors.js - Keep selectors organized by feature
export const FEED_SELECTORS = {
  post: '.feed-shared-update-v2',
  promotedLabel: '.update-components-actor__description',
  // ...
}
```

## Testing Checklist

When making changes, verify:

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully
- [ ] Extension loads in Chrome (`chrome://extensions` → Load unpacked)
- [ ] Extension loads in Firefox (`npm run dev`)
- [ ] Userscript works in Tampermonkey (install `dist/linkoff.user.js`)
- [ ] Settings persist across page reloads
- [ ] Filters apply correctly on linkedin.com

## Common Pitfalls

### 1. Storage API Differences

Extension uses `chrome.storage.sync`, userscript uses `GM_setValue/GM_getValue`. Always use the storage interface:

```javascript
// Good - use the abstraction
import { getSettings, saveSettings } from './settings/storage-interface.js'

// Bad - direct API calls
chrome.storage.sync.get(...)  // Won't work in userscript
```

### 2. Content Security Policy

LinkedIn has strict CSP. Avoid:
- Inline event handlers (`onclick="..."`)
- `eval()` or `new Function()`
- Loading external scripts

### 3. MutationObserver Performance

LinkedIn is a SPA with constant DOM changes. Keep observers efficient:
- Use specific selectors, not `body`
- Debounce filter operations
- Disconnect observers when not needed

### 4. Manifest V3 Restrictions

Chrome extension uses Manifest V3:
- No `chrome.webRequest` blocking
- Background is a service worker (no persistent state)
- Use `chrome.storage` for persistence

## Quality Standards

This project follows rigorous quality standards as part of an LLM-maintainership experiment. See [LLM-MAINTAINERSHIP.md](./LLM-MAINTAINERSHIP.md) for details.

**Before Committing**:
1. Run `npm run lint` and fix all issues
2. Run `npm run build` and verify success
3. Test the change manually if possible
4. Write clear, descriptive commit messages
5. Keep changes focused and minimal

**Commit Message Format** (Conventional Commits):
```
feat(filters): add support for filtering repost comments
fix(popup): resolve dark mode toggle not persisting
docs(readme): update installation instructions
```

## Debugging Tips

### Extension Debugging
```javascript
// In content.js or popup.js
console.log('[LinkOff]', 'Debug message', data)
```

View logs:
- Content script: LinkedIn page DevTools console
- Popup: Right-click extension icon → Inspect popup
- Background: `chrome://extensions` → Service Worker link

### Userscript Debugging
Logs appear in the page's DevTools console. Use the same `[LinkOff]` prefix.

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [Firefox Extension Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Userscript API (Tampermonkey)](https://www.tampermonkey.net/documentation.php)
- [Rollup Documentation](https://rollupjs.org/)
- [LinkedIn DOM Inspection Guide](https://www.linkedin.com) - Use DevTools

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/nickytonline/LinkOff/issues)
- **Discussions**: Open an issue for questions
- **Contributing**: See CONTRIBUTING.md (if present)

---

*This file helps AI assistants understand the project context. Human contributors may also find it useful as a quick reference.*

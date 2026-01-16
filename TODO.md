# LinkOff Refactor - Next Steps

This document outlines potential follow-up tasks after the extension/userscript refactor.

## High Priority

### CI/CD Setup
- [ ] **Set up GitHub Actions to build distributable plugins**
  - Build on push to main/master
  - Generate `dist/extension/` and `dist/linkoff.user.js` artifacts
  - Optionally auto-publish userscript to GitHub Releases
  - Run linting as part of CI

### Testing
- [ ] **Manual testing of extension build**
  - Load `dist/extension/` in Chrome and verify all features work
  - Load `dist/extension/` in Firefox and verify all features work
  - Test settings persistence across page reloads
  - Test all filter types (feed, jobs, misc)

- [ ] **Manual testing of userscript build**
  - Install `dist/linkoff.user.js` in Tampermonkey (Chrome)
  - Install in Tampermonkey (Firefox)
  - Install in Safari Userscripts app
  - Verify menu commands appear and toggle settings correctly
  - Test filtering functionality

## Medium Priority

### Code Cleanup
- [ ] **Remove old file structure** (after testing confirms new build works)
  - Remove `src/index.js` (replaced by `src/core/index.js`)
  - Remove `src/constants.js` (replaced by `src/core/filters/selectors.js`)
  - Remove `src/utils.js` (replaced by `src/core/utils/dom.js`)
  - Remove `src/features/` directory (replaced by `src/core/filters/` and `src/core/features/`)
  - Remove `src/service_worker.js` (replaced by `src/extension/background.js`)
  - Remove `src/content/content.js` (replaced by `src/extension/content.js`)
  - Update root `manifest.json` or remove it (now in `src/extension/manifest.json`)

- [ ] **Add `type: "module"` to package.json** to eliminate Node.js warning during build

### Build Improvements
- [ ] **Add source maps for development builds**
  - Create separate dev/prod rollup configs or use environment variable
  - Include source maps only in dev builds

- [ ] **Consider adding ESLint to the build process**
  - Update eslint config for ES modules
  - Add `npm run lint` to CI

### Documentation
- [ ] **Publish userscript to Greasy Fork**
  - Create account and publish `dist/linkoff.user.js`
  - Add Greasy Fork link to README

- [ ] **Add CHANGELOG.md** documenting the refactor

## Low Priority / Future Enhancements

### Userscript Improvements
- [ ] **Add a settings UI for userscript** (optional)
  - Create a modal/panel that can be opened via menu command
  - Would provide better UX than individual toggle commands

- [ ] **Implement GM_addValueChangeListener** for cross-tab settings sync
  - Some userscript managers support this
  - Would allow settings changes to apply without page reload

### Build System
- [ ] **Consider using esbuild instead of rollup** for faster builds

- [ ] **Add automated version bumping**
  - Sync version between package.json and manifest.json
  - Update userscript @version automatically

### Code Quality
- [ ] **Add unit tests for core filter functions**
  - Test `shouldHidePost` logic with mock DOM elements
  - Test keyword matching functions

- [ ] **Add TypeScript** (optional, significant effort)
  - Would improve maintainability
  - Could start with just type definitions (.d.ts files)

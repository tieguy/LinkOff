# LinkOff Refactor - Next Steps

This document outlines potential follow-up tasks after the extension/userscript refactor.

See also [LLM-MAINTAINERSHIP.md](./LLM-MAINTAINERSHIP.md) for the broader methodology and quality goals.

## High Priority

### CI/CD Setup
- [ ] **Set up GitHub Actions to build distributable plugins**
  - Build on push to main/master
  - Generate `dist/extension/` and `dist/linkoff.user.js` artifacts
  - Optionally auto-publish userscript to GitHub Releases
  - Run linting as part of CI

### Code Quality Foundation
- [x] **Set up Vitest testing framework**
  - Install vitest and jsdom for DOM testing
  - Configure for ES modules (should work out of the box)
  - Add `npm run test` and `npm run test:coverage` scripts
  - Create initial test structure in `tests/` directory

- [ ] **Integrate SonarQube analysis**
  - Set up SonarCloud (free for open source) or self-hosted SonarQube
  - Add sonar-project.properties configuration
  - Integrate into GitHub Actions CI pipeline
  - Configure quality gates (zero new bugs/vulnerabilities, <5% debt ratio)

- [ ] **Add test coverage reporting**
  - Configure Vitest coverage with v8 or istanbul provider
  - Set coverage thresholds (initial: 40%, target: 80%)
  - Upload coverage reports to SonarQube
  - Add coverage badge to README

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

### Code Quality Improvements
- [ ] **Upgrade ESLint to v9.x with flat config**
  - Migrate from .eslintrc to eslint.config.js
  - Update to modern rule configurations
  - Ensure ES module compatibility

- [ ] **Add security-focused ESLint plugins**
  - Install eslint-plugin-security for security patterns
  - Install eslint-plugin-sonarjs for additional code quality rules
  - Configure rules appropriate for browser extension context

- [ ] **Add pre-commit hooks**
  - Install husky and lint-staged
  - Run ESLint and Prettier on staged files
  - Optionally run tests on commit

- [ ] **Set up Dependabot for dependency scanning**
  - Add .github/dependabot.yml configuration
  - Configure weekly checks for npm dependencies
  - Enable security vulnerability alerts

### Automated Testing
- [ ] **Add Playwright E2E tests for extension**
  - Install Playwright with browser extension support
  - Test extension popup loads and renders correctly
  - Test settings changes persist and apply
  - Test against mock/snapshot LinkedIn pages

- [ ] **Add integration tests for storage adapters**
  - Mock chrome.storage.sync API for extension tests
  - Mock GM_setValue/GM_getValue for userscript tests
  - Test settings persistence and retrieval

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

- [ ] **Add CONTRIBUTING.md**
  - Document development setup and workflow
  - Explain code review process and standards
  - Reference LLM-MAINTAINERSHIP.md for quality expectations
  - Include guidance for first-time contributors

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
- [ ] **Expand unit test coverage** (after Vitest setup in High Priority)
  - Test `shouldHidePost` logic with mock DOM elements
  - Test keyword matching functions
  - Test settings validation and defaults
  - Test DOM utility functions
  - Target: 80% coverage on core/ directory

- [ ] **Add TypeScript** (optional, significant effort)
  - Would improve maintainability
  - Could start with just type definitions (.d.ts files)

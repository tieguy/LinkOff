# LLM-Assisted Open Source Maintainership

This document describes the methodology and best practices being applied to maintain and improve LinkOff using Large Language Models (LLMs), specifically Claude. This project serves as a model for how LLMs can responsibly and effectively maintain abandoned or under-resourced open source projects.

## Philosophy

Open source sustainability is a critical challenge. Many valuable projects become abandoned when maintainers move on, yet communities still depend on them. LLM-assisted maintenance offers a potential path forward—not to replace human maintainers, but to augment maintenance capacity and demonstrate what's possible when AI tools are applied thoughtfully to software engineering.

### Core Principles

1. **Transparency**: All AI-assisted changes are clearly documented and attributable
2. **Quality over Speed**: Rigorous code quality standards take precedence over rapid changes
3. **Conservative Changes**: Prefer minimal, well-tested changes over sweeping refactors
4. **Human Oversight**: Critical decisions and releases require human review
5. **Reproducibility**: All processes should be documented and reproducible

## Code Quality Framework

### Static Analysis with SonarQube

We use SonarQube for comprehensive code quality analysis:

#### Metrics Tracked
- **Reliability**: Bugs and error-prone code patterns
- **Security**: Vulnerabilities and security hotspots
- **Maintainability**: Code smells, technical debt, and complexity
- **Coverage**: Test coverage percentage (target: 80%+)
- **Duplications**: Duplicate code blocks

#### Quality Gates
Before merging any PR, code must pass:
- [ ] Zero new bugs introduced
- [ ] Zero new vulnerabilities
- [ ] Zero new security hotspots (or reviewed and marked safe)
- [ ] Technical debt ratio < 5%
- [ ] Test coverage on new code >= 80%
- [ ] No increase in code duplication

#### Integration
```yaml
# Planned CI integration
- SonarQube analysis runs on every PR
- Quality gate status blocks merge if failed
- Historical metrics tracked for trend analysis
```

### Linting and Formatting

Current tooling:
- **ESLint** (v7.32.0): JavaScript linting with `eslint:recommended` + Prettier integration
- **Prettier** (v2.4.1): Consistent code formatting
- **HTMLHint**: HTML validation

Planned enhancements:
- [ ] Upgrade ESLint to v9.x with flat config
- [ ] Add `eslint-plugin-security` for security-focused rules
- [ ] Add `eslint-plugin-sonarjs` for additional code quality rules
- [ ] Integrate linting into pre-commit hooks

## Testing Strategy

### Current State
No automated tests exist. This is a primary focus area for improvement.

### Testing Pyramid

```
        ┌─────────┐
        │   E2E   │  ← Browser extension testing (Playwright)
        ├─────────┤
        │ Integr. │  ← Component integration tests
        ├─────────┤
        │  Unit   │  ← Core logic, utilities, filters
        └─────────┘
```

### Unit Testing Plan

**Framework**: Vitest (fast, ESM-native, compatible with existing tooling)

**Priority Test Targets**:
1. `src/core/filters/` - Filter logic (shouldHidePost, keyword matching)
2. `src/core/settings/defaults.js` - Settings validation
3. `src/core/utils/dom.js` - DOM utilities (with jsdom)
4. Storage adapters - Mock-based testing for Chrome/GM APIs

**Example Test Structure**:
```javascript
// tests/core/filters/feed.test.js
import { describe, it, expect } from 'vitest'
import { shouldHidePost } from '../../../src/core/filters/feed.js'

describe('shouldHidePost', () => {
  it('should hide posts matching keyword filter', () => {
    // Test implementation
  })
})
```

### Integration Testing

Test interactions between:
- Settings storage and filter behavior
- DOM observation and filter application
- Extension/userscript platform adapters

### End-to-End Testing

**Framework**: Playwright with browser extension support

**Test Scenarios**:
- Extension loads and popup renders
- Settings changes persist and apply
- Feed filtering works on linkedin.com (mock or snapshot-based)
- Userscript variant functions correctly

### Coverage Goals

| Phase | Target | Timeline |
|-------|--------|----------|
| Initial | 40% | First iteration |
| Intermediate | 60% | Second iteration |
| Target | 80% | Ongoing |

## Documentation Standards

### Code Documentation

- **JSDoc comments** for all public functions
- **Inline comments** for complex logic only (code should be self-documenting)
- **Module-level comments** describing purpose and dependencies

### Project Documentation

| Document | Purpose |
|----------|---------|
| README.md | User-facing installation and usage |
| CONTRIBUTING.md | Contributor guidelines |
| CLAUDE.md | AI assistant context and instructions |
| LLM-MAINTAINERSHIP.md | This document - methodology explanation |
| TODO.md | Active roadmap and task tracking |
| CHANGELOG.md | Version history and changes |

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`

## Security Practices

### Vulnerability Management

1. **Dependency Scanning**: Regular `npm audit` and Dependabot alerts
2. **Code Scanning**: SonarQube security hotspot detection
3. **Manual Review**: Security-sensitive changes require explicit review

### Security Considerations for Browser Extensions

- Minimize permissions in manifest.json
- Validate all user inputs
- Sanitize content before DOM injection
- No remote code execution
- Content Security Policy compliance

## Continuous Integration

### Current Workflows

```
.github/workflows/
├── lint.yml        # ESLint on push/PR
├── ci.yml          # Semantic release (weekly/manual)
└── automerge.yml   # Auto-merge configuration
```

### Planned Enhancements

```yaml
# Enhanced CI pipeline
on: [push, pull_request]

jobs:
  lint:
    # ESLint + Prettier check

  test:
    # Vitest unit tests
    # Coverage report generation

  build:
    # Verify extension and userscript build
    # Artifact generation

  sonarqube:
    # Code quality analysis
    # Quality gate check

  e2e:
    # Playwright browser tests (on main branch)
```

## Metrics and Success Criteria

### Quantitative Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Test Coverage | 0% | 80% |
| SonarQube Rating | N/A | A |
| Open Issues | TBD | < 10 |
| CI Pass Rate | ~95% | 99% |
| Build Time | ~10s | < 15s |

### Qualitative Goals

- Codebase is well-documented and understandable
- New contributors can onboard quickly
- Changes are predictable and low-risk
- User issues are addressed promptly

## Transparency and Attribution

### AI-Assisted Changes

All commits made with LLM assistance:
- Use branch naming convention: `claude/<description>-<session-id>`
- Include clear commit messages describing changes
- Are subject to the same quality standards as human contributions

### Disclosure

This project openly documents its use of LLM assistance:
- This document explains the methodology
- The README acknowledges AI-assisted maintenance
- Individual PRs note significant AI involvement

## Contribution Guidelines for LLM Sessions

When Claude (or another LLM) works on this project:

1. **Read First**: Always read existing code before modifying
2. **Understand Context**: Review related files and dependencies
3. **Minimal Changes**: Make the smallest change that solves the problem
4. **Test Thoroughly**: Run existing tests and add new ones for changes
5. **Document Decisions**: Explain non-obvious choices in commit messages
6. **Verify Builds**: Ensure both extension and userscript builds succeed
7. **Check Quality**: Run linting and address all warnings

## Roadmap

### Phase 1: Foundation (Current)
- [x] Document LLM maintainership approach
- [x] Create CLAUDE.md for AI assistant context
- [ ] Set up Vitest testing framework
- [ ] Add initial unit tests for core filters
- [ ] Integrate SonarQube analysis

### Phase 2: Quality Improvement
- [ ] Achieve 40% test coverage
- [ ] Address all SonarQube code smells
- [ ] Upgrade ESLint configuration
- [ ] Add pre-commit hooks
- [ ] Implement E2E tests

### Phase 3: Sustainability
- [ ] Achieve 80% test coverage
- [ ] Comprehensive documentation
- [ ] Automated dependency updates
- [ ] Performance benchmarks
- [ ] Community engagement

## References

- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Browser Extension Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Open Source Maintenance Challenges](https://opensource.guide/best-practices/)

---

*This document is a living guide and will be updated as practices evolve.*

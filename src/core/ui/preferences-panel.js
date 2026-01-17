// Injectable preferences panel for in-page settings
// Works with both extension and userscript via storage adapter

import { DEFAULT_SETTINGS, SETTING_LABELS } from '../settings/defaults.js'

// Settings organized by category for the panel UI
const SETTINGS_CATEGORIES = {
  general: {
    title: 'General',
    settings: ['main-toggle', 'gentle-mode', 'wide-mode', 'dark-mode'],
  },
  feed: {
    title: 'Feed',
    settings: [
      'hide-whole-feed',
      'sort-by-recent',
      'first-degree-only',
      'hide-promoted',
      'hide-suggested',
      'hide-liked',
      'hide-other-reactions',
      'hide-commented-on',
      'hide-followed',
      'hide-shared',
      'hide-polls',
      'hide-videos',
      'hide-images',
      'hide-links',
      'hide-carousels',
      'hide-by-companies',
      'hide-by-people',
    ],
  },
  jobs: {
    title: 'Jobs',
    settings: ['hide-job-guidance', 'hide-ai-button', 'hide-promoted-jobs'],
  },
  misc: {
    title: 'Misc',
    settings: [
      'disable-postcount-prompt',
      'hide-linkedin-learning',
      'hide-advertisements',
      'hide-follow-recommendations',
      'hide-notification-count',
      'hide-profile-counters',
      'hide-community-panel',
      'hide-account-building',
      'hide-network-building',
      'hide-premium',
      'hide-news',
    ],
  },
}

// Panel CSS styles
const PANEL_STYLES = `
  .linkoff-settings-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #0a66c2;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    z-index: 9999;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, background 0.2s;
  }

  .linkoff-settings-btn:hover {
    background: #004182;
    transform: scale(1.1);
  }

  .linkoff-settings-btn svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  .linkoff-panel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 10000;
    display: none;
    align-items: center;
    justify-content: center;
  }

  .linkoff-panel-overlay.open {
    display: flex;
  }

  .linkoff-panel {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  }

  .linkoff-panel-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f9fa;
  }

  .linkoff-panel-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .linkoff-panel-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    line-height: 1;
  }

  .linkoff-panel-close:hover {
    color: #333;
  }

  .linkoff-panel-tabs {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    background: #f8f9fa;
  }

  .linkoff-panel-tab {
    flex: 1;
    padding: 12px 16px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .linkoff-panel-tab:hover {
    background: #e8e8e8;
  }

  .linkoff-panel-tab.active {
    color: #0a66c2;
    border-bottom-color: #0a66c2;
    font-weight: 500;
  }

  .linkoff-panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
  }

  .linkoff-panel-section {
    display: none;
  }

  .linkoff-panel-section.active {
    display: block;
  }

  .linkoff-setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .linkoff-setting-row:last-child {
    border-bottom: none;
  }

  .linkoff-setting-label {
    font-size: 14px;
    color: #333;
    flex: 1;
    padding-right: 12px;
  }

  .linkoff-toggle {
    position: relative;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
  }

  .linkoff-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .linkoff-toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 24px;
  }

  .linkoff-toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  .linkoff-toggle input:checked + .linkoff-toggle-slider {
    background-color: #0a66c2;
  }

  .linkoff-toggle input:checked + .linkoff-toggle-slider:before {
    transform: translateX(20px);
  }

  .linkoff-panel-footer {
    padding: 12px 20px;
    border-top: 1px solid #e0e0e0;
    background: #f8f9fa;
    text-align: center;
    font-size: 12px;
    color: #666;
  }

  .linkoff-panel-footer a {
    color: #0a66c2;
    text-decoration: none;
  }

  .linkoff-panel-footer a:hover {
    text-decoration: underline;
  }

  .linkoff-refresh-notice {
    background: #fff3cd;
    color: #856404;
    padding: 8px 12px;
    font-size: 12px;
    text-align: center;
    display: none;
  }

  .linkoff-refresh-notice.show {
    display: block;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .linkoff-panel {
      background: #1d2226;
    }
    .linkoff-panel-header {
      background: #2d333b;
      border-color: #444;
    }
    .linkoff-panel-header h2 {
      color: #e8e8e8;
    }
    .linkoff-panel-close {
      color: #aaa;
    }
    .linkoff-panel-tabs {
      background: #2d333b;
      border-color: #444;
    }
    .linkoff-panel-tab {
      color: #aaa;
    }
    .linkoff-panel-tab:hover {
      background: #383f46;
    }
    .linkoff-panel-tab.active {
      color: #70b5f9;
      border-bottom-color: #70b5f9;
    }
    .linkoff-panel-content {
      background: #1d2226;
    }
    .linkoff-setting-row {
      border-color: #333;
    }
    .linkoff-setting-label {
      color: #e8e8e8;
    }
    .linkoff-panel-footer {
      background: #2d333b;
      border-color: #444;
      color: #aaa;
    }
    .linkoff-panel-footer a {
      color: #70b5f9;
    }
    .linkoff-refresh-notice {
      background: #5a4a00;
      color: #ffc107;
    }
  }
`

// Gear icon SVG
const GEAR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`

/**
 * Create and inject the preferences panel
 * @param {Object} storage - Storage adapter with get/set methods
 * @param {Object} options - Optional configuration
 * @returns {Object} Panel controller with open/close methods
 */
export function createPreferencesPanel(storage, options = {}) {
  let currentSettings = {}
  let hasChanges = false

  // Inject styles
  const styleEl = document.createElement('style')
  styleEl.textContent = PANEL_STYLES
  document.head.appendChild(styleEl)

  // Create floating button
  const btn = document.createElement('button')
  btn.className = 'linkoff-settings-btn'
  btn.innerHTML = GEAR_ICON
  btn.title = 'LinkOff Settings'
  document.body.appendChild(btn)

  // Create panel overlay
  const overlay = document.createElement('div')
  overlay.className = 'linkoff-panel-overlay'
  overlay.innerHTML = `
    <div class="linkoff-panel">
      <div class="linkoff-panel-header">
        <h2>LinkOff Settings</h2>
        <button class="linkoff-panel-close">&times;</button>
      </div>
      <div class="linkoff-refresh-notice">
        Settings changed. Refresh the page to apply all changes.
      </div>
      <div class="linkoff-panel-tabs">
        ${Object.entries(SETTINGS_CATEGORIES)
          .map(
            ([key, cat], i) =>
              `<button class="linkoff-panel-tab${i === 0 ? ' active' : ''}" data-tab="${key}">${cat.title}</button>`
          )
          .join('')}
      </div>
      <div class="linkoff-panel-content">
        ${Object.entries(SETTINGS_CATEGORIES)
          .map(
            ([key, cat], i) => `
          <div class="linkoff-panel-section${i === 0 ? ' active' : ''}" data-section="${key}">
            ${cat.settings
              .filter((s) => typeof DEFAULT_SETTINGS[s] === 'boolean')
              .map(
                (setting) => `
              <div class="linkoff-setting-row">
                <span class="linkoff-setting-label">${SETTING_LABELS[setting] || setting}</span>
                <label class="linkoff-toggle">
                  <input type="checkbox" data-setting="${setting}">
                  <span class="linkoff-toggle-slider"></span>
                </label>
              </div>
            `
              )
              .join('')}
          </div>
        `
          )
          .join('')}
      </div>
      <div class="linkoff-panel-footer">
        <a href="https://github.com/njelich/LinkOff" target="_blank">LinkOff</a> by Noah Jelich
      </div>
    </div>
  `
  document.body.appendChild(overlay)

  const panel = overlay.querySelector('.linkoff-panel')
  const closeBtn = overlay.querySelector('.linkoff-panel-close')
  const tabs = overlay.querySelectorAll('.linkoff-panel-tab')
  const sections = overlay.querySelectorAll('.linkoff-panel-section')
  const toggles = overlay.querySelectorAll('input[data-setting]')
  const refreshNotice = overlay.querySelector('.linkoff-refresh-notice')

  // Load settings and update toggles
  const loadSettings = async () => {
    const keys = Object.keys(DEFAULT_SETTINGS).filter(
      (k) => typeof DEFAULT_SETTINGS[k] === 'boolean'
    )
    const stored = await storage.get(keys)

    currentSettings = { ...DEFAULT_SETTINGS, ...stored }

    toggles.forEach((toggle) => {
      const setting = toggle.dataset.setting
      toggle.checked = currentSettings[setting] ?? DEFAULT_SETTINGS[setting]
    })
  }

  // Handle toggle changes
  const handleToggle = async (e) => {
    const toggle = e.target
    const setting = toggle.dataset.setting
    const value = toggle.checked

    await storage.set({ [setting]: value })
    currentSettings[setting] = value
    hasChanges = true
    refreshNotice.classList.add('show')

    console.log(`[LinkOff] Setting "${setting}" changed to ${value}`)
  }

  // Handle tab switching
  const switchTab = (tabKey) => {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === tabKey))
    sections.forEach((s) =>
      s.classList.toggle('active', s.dataset.section === tabKey)
    )
  }

  // Open/close panel
  const openPanel = async () => {
    await loadSettings()
    overlay.classList.add('open')
  }

  const closePanel = () => {
    overlay.classList.remove('open')
  }

  // Event listeners
  btn.addEventListener('click', openPanel)
  closeBtn.addEventListener('click', closePanel)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePanel()
  })

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab))
  })

  toggles.forEach((toggle) => {
    toggle.addEventListener('change', handleToggle)
  })

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closePanel()
    }
  })

  return {
    open: openPanel,
    close: closePanel,
    destroy: () => {
      styleEl.remove()
      btn.remove()
      overlay.remove()
    },
  }
}

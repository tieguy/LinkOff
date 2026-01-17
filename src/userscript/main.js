// Userscript entry point
// Initializes LinkOff with GM storage, menu commands, and preferences panel

import { initLinkOff } from '../core/index.js'
import { storage } from './storage.js'
import { DEFAULT_SETTINGS, SETTING_LABELS } from '../core/settings/defaults.js'
import { createPreferencesPanel } from '../core/ui/preferences-panel.js'

// Inject CSS for hide/dim functionality
const injectStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    /* Hide mode */
    .hide[class] {
      display: none !important;
    }

    /* Dim mode */
    .dim:not(:hover) {
      box-shadow: none;
    }

    .dim:not(:hover) > * {
      opacity: 0.05 !important;
      filter: alpha(opacity=5);
    }

    /* Show forbidden icon when dimmed */
    .dim.showIcon:not(:hover)::after {
      content: '';
      position: absolute;
      z-index: 1;
      width: 30px;
      height: 30px;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    /* On hover, increase opacity to 50% */
    .dim:hover > * {
      opacity: 0.5;
      filter: alpha(opacity=50);
    }

    /* Wide mode */
    .wide-mode {
      margin-left: 0rem !important;
      margin-right: 0rem !important;
      padding-left: 2rem !important;
      padding-right: 2rem !important;
      width: 100% !important;
    }
  `
  document.head.appendChild(style)
}

// Register menu commands for toggling boolean settings
const registerMenuCommands = () => {
  for (const [key, defaultValue] of Object.entries(DEFAULT_SETTINGS)) {
    // Only create menu items for boolean settings
    if (typeof defaultValue === 'boolean') {
      const label = SETTING_LABELS[key] || key
      GM_registerMenuCommand(`Toggle: ${label}`, async () => {
        const current = GM_getValue(key, defaultValue)
        GM_setValue(key, !current)
        // Show notification
        const newState = !current ? 'ON' : 'OFF'
        alert(`LinkOff: ${label} is now ${newState}\n\nRefresh the page to apply changes.`)
      })
    }
  }

  // Add reset command
  GM_registerMenuCommand('Reset all settings to defaults', () => {
    if (confirm('Reset all LinkOff settings to defaults?')) {
      for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
        GM_setValue(key, value)
      }
      alert('Settings reset. Refresh the page to apply changes.')
    }
  })

  // Add info command
  GM_registerMenuCommand('About LinkOff', () => {
    alert(
      'LinkOff - LinkedIn Filter and Customizer\n\n' +
        'By Noah Jelich\n' +
        'https://github.com/njelich/LinkOff\n\n' +
        'Use the menu commands above to toggle settings.\n' +
        'Refresh the page after changing settings.'
    )
  })
}

// Initialize
;(function () {
  'use strict'

  // Inject styles
  injectStyles()

  // Register menu commands
  registerMenuCommands()

  // Initialize LinkOff
  initLinkOff(storage)

  // Create preferences panel (floating settings button)
  const prefsPanel = createPreferencesPanel(storage)

  // Add menu command to open settings panel
  GM_registerMenuCommand('Open Settings Panel', () => {
    prefsPanel.open()
  })
})()

// Extension background/service worker
// Sets defaults on install

import { DEFAULT_SETTINGS } from '../core/settings/defaults.js'

// Set defaults on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.get(null, function (res) {
      if (res.initialized !== 'v0.5')
        chrome.storage.local.set({
          initialized: 'v0.5',
          ...DEFAULT_SETTINGS,
        })
    })
  }
})

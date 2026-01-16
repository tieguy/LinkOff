// Extension content script entry point
// Initializes LinkOff with chrome storage adapter

import { initLinkOff } from '../core/index.js'
import { storage } from './storage.js'

// Initialize with extension-specific message handling
initLinkOff(storage, {
  onMessage: (handler) => {
    chrome.runtime.onMessage.addListener(handler)
  },
})

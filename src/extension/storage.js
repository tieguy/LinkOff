// Extension storage adapter using chrome.storage.local

import { createStorageAdapter } from '../core/settings/storage-interface.js'

export const storage = createStorageAdapter({
  async get(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, resolve)
    })
  },
  async set(data) {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, resolve)
    })
  },
  onChanged(callback) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        const simplified = {}
        for (const [key, { newValue }] of Object.entries(changes)) {
          simplified[key] = newValue
        }
        callback(simplified)
      }
    })
  },
})

// Userscript storage adapter using GM_getValue/GM_setValue

import { createStorageAdapter } from '../core/settings/storage-interface.js'

export const storage = createStorageAdapter({
  async get(keys) {
    const result = {}
    for (const key of keys) {
      const val = GM_getValue(key, undefined)
      if (val !== undefined) result[key] = val
    }
    return result
  },
  async set(data) {
    for (const [key, value] of Object.entries(data)) {
      GM_setValue(key, value)
    }
  },
  // GM doesn't support change listeners across tabs
  // Changes only apply after page reload
  onChanged: null,
})

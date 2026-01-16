// Core entry point for LinkOff
// Initializes all filtering modules with the provided storage adapter

import { setupDeleteMessagesButton } from './features/message.js'
import doGenerals from './features/general.js'
import doFeed from './filters/feed.js'
import doMisc, { unfollowAll } from './filters/misc.js'
import doJobs from './filters/jobs.js'
import { DEFAULT_SETTINGS } from './settings/defaults.js'

let oldResponse = {}

/**
 * Main processing function - applies all filters based on settings
 */
const doIt = async (response) => {
  if (JSON.stringify(oldResponse) === JSON.stringify(response)) return

  // checks if filter needs updating, used below
  const getRes = (field, bool) => {
    const changed =
      response[field] !== oldResponse[field] ||
      response['gentle-mode'] !== oldResponse['gentle-mode'] ||
      response['main-toggle'] !== oldResponse['main-toggle']

    if (changed) {
      console.log(`LinkOff: Toggling ${field} to ${response[field]}`)
    }

    return changed && response[field] == bool
  }

  // Set Mode
  let mode = response['gentle-mode'] ? 'dim' : 'hide'

  // Toggle for jobs & feed options
  const enabled = response['main-toggle']

  doGenerals(getRes)
  doFeed(getRes, enabled, mode, response)
  doJobs(getRes, enabled, mode, response)
  doMisc(getRes, enabled, mode)

  oldResponse = response
}

/**
 * Initialize LinkOff with the provided storage adapter
 * @param {Object} storage - Storage adapter with get, set, and onChanged methods
 * @param {Object} options - Optional configuration
 * @param {Function} options.onMessage - Handler for extension messages (for unfollow-all)
 */
export async function initLinkOff(storage, options = {}) {
  const { onMessage } = options

  /**
   * Get settings from storage and apply filters
   */
  const getStorageAndDoIt = async () => {
    const keys = Object.keys(DEFAULT_SETTINGS)
    const storedSettings = await storage.get(keys)
    // Merge defaults with stored settings
    const settings = { ...DEFAULT_SETTINGS, ...storedSettings }
    doIt(settings)
  }

  // Listen for storage changes
  storage.onChanged((changes) => {
    getStorageAndDoIt()
  })

  // Handle extension messages (if handler provided)
  if (onMessage) {
    onMessage(async (req) => {
      if (req['unfollow-all']) {
        if (
          !window.location.href.includes(
            '/mynetwork/network-manager/people-follow'
          )
        ) {
          alert(
            'No messages. Are you on the follows page (/mynetwork/network-manager/people-follow)?\n\nIf not, please navigate to following using the LinkedIn navbar and then click the Unfollow All button again.'
          )
          return
        } else {
          await unfollowAll()
        }
      }
    })
  }

  // Track url changes
  let lastUrl = window.location.href
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href
      oldResponse = {}
      getStorageAndDoIt()
      if (window.location.href.includes('/messaging/'))
        setupDeleteMessagesButton()
    }
  }, 500)

  // On load
  if (document.readyState !== 'loading') {
    getStorageAndDoIt()
    if (window.location.href.includes('/messaging/')) {
      setupDeleteMessagesButton()
    }
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      getStorageAndDoIt()

      if (window.location.href.includes('/messaging/')) {
        setupDeleteMessagesButton()
      }
    })
  }
}

// Re-export for convenience
export { DEFAULT_SETTINGS } from './settings/defaults.js'
export { SETTING_LABELS } from './settings/defaults.js'
export { unfollowAll } from './filters/misc.js'

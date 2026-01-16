// Abstract storage interface - implementations will be injected
// Allows the same core code to work with different storage backends
// (chrome.storage for extension, GM_getValue/GM_setValue for userscript)

/**
 * Creates a storage adapter from platform-specific implementation
 * @param {Object} impl - Implementation object with get, set, and optional onChanged
 * @param {Function} impl.get - Async function that takes array of keys and returns object with values
 * @param {Function} impl.set - Async function that takes object of key-value pairs to store
 * @param {Function} [impl.onChanged] - Optional function that takes a callback for change notifications
 * @returns {Object} Storage adapter with get, set, and onChanged methods
 */
export function createStorageAdapter(impl) {
  return {
    get: impl.get,
    set: impl.set,
    onChanged: impl.onChanged || (() => {}),
  }
}

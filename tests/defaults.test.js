import { describe, it, expect } from 'vitest'
import { DEFAULT_SETTINGS, SETTING_LABELS } from '../src/core/settings/defaults.js'

describe('DEFAULT_SETTINGS', () => {
  it('should have main-toggle enabled by default', () => {
    expect(DEFAULT_SETTINGS['main-toggle']).toBe(true)
  })

  it('should have hide-promoted enabled by default', () => {
    expect(DEFAULT_SETTINGS['hide-promoted']).toBe(true)
  })
})

describe('SETTING_LABELS', () => {
  it('should have a label for every default setting', () => {
    const settingKeys = Object.keys(DEFAULT_SETTINGS)
    const labelKeys = Object.keys(SETTING_LABELS)

    for (const key of settingKeys) {
      expect(labelKeys).toContain(key)
    }
  })
})

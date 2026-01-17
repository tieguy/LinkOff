import { describe, it, expect, beforeEach, vi } from 'vitest'
import { JSDOM } from 'jsdom'
import { getFeedKeywords } from '../src/core/filters/feed.js'
import { SELECTORS } from '../src/core/filters/selectors.js'

describe('Ad Detection', () => {
  describe('getFeedKeywords', () => {
    it('should include Promoted text keyword when hide-promoted is enabled', () => {
      const settings = {
        'feed-keywords': '',
        'hide-by-age': 'disabled',
        'hide-polls': false,
        'hide-videos': false,
        'hide-links': false,
        'hide-images': false,
        'hide-promoted': true,
        'hide-shared': false,
        'hide-followed': false,
        'hide-liked': false,
        'hide-other-reactions': false,
        'hide-commented-on': false,
        'hide-by-companies': false,
        'hide-by-people': false,
        'hide-suggested': false,
        'hide-carousels': false,
      }

      const keywords = getFeedKeywords(settings)

      expect(keywords).toContain(`text::${SELECTORS.FEED_TEXT_PROMOTED}`)
      expect(keywords).toContain('text::Promoted')
    })

    it('should NOT include Promoted keyword when hide-promoted is disabled', () => {
      const settings = {
        'feed-keywords': '',
        'hide-by-age': 'disabled',
        'hide-polls': false,
        'hide-videos': false,
        'hide-links': false,
        'hide-images': false,
        'hide-promoted': false,
        'hide-shared': false,
        'hide-followed': false,
        'hide-liked': false,
        'hide-other-reactions': false,
        'hide-commented-on': false,
        'hide-by-companies': false,
        'hide-by-people': false,
        'hide-suggested': false,
        'hide-carousels': false,
      }

      const keywords = getFeedKeywords(settings)

      expect(keywords).not.toContain(`text::${SELECTORS.FEED_TEXT_PROMOTED}`)
      expect(keywords).not.toContain('text::Promoted')
    })
  })

  describe('SELECTORS', () => {
    it('should have correct promoted text selector', () => {
      expect(SELECTORS.FEED_TEXT_PROMOTED).toBe('Promoted')
    })

    it('should have ad banner selectors defined', () => {
      expect(SELECTORS.MISC_AD_BANNER_CONTAINER).toBe('ad-banner-container')
      expect(SELECTORS.MISC_ADS_CONTAINER).toBe('ads-container')
      expect(SELECTORS.MISC_AD_BANNER).toBe('ad-banner')
      expect(SELECTORS.MISC_AD_RAIL).toBe('pv-right-rail__sticky-ad-banner')
    })
  })

  describe('Promoted Post Detection Logic', () => {
    let dom
    let document

    beforeEach(() => {
      dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
      document = dom.window.document
    })

    // Note: jsdom uses textContent instead of innerText
    // The actual browser code uses innerText, but textContent is equivalent for our tests

    it('should match post containing "Promoted" text', () => {
      const post = document.createElement('div')
      post.setAttribute('data-id', 'urn:li:activity:123')
      post.innerHTML = `
        <div class="update-components-actor__description">
          <span>Promoted</span>
        </div>
        <div class="feed-shared-update-v2__description">
          Some ad content here
        </div>
      `
      document.body.appendChild(post)

      const keyword = `text::${SELECTORS.FEED_TEXT_PROMOTED}`
      const [prefix, text] = keyword.split('::')

      expect(prefix).toBe('text')
      expect(text).toBe('Promoted')
      // Use textContent in tests (equivalent to innerText for text matching)
      expect(post.textContent.indexOf(text)).not.toBe(-1)
    })

    it('should NOT match post without "Promoted" text', () => {
      const post = document.createElement('div')
      post.setAttribute('data-id', 'urn:li:activity:456')
      post.innerHTML = `
        <div class="update-components-actor__description">
          <span>John Doe shared a post</span>
        </div>
        <div class="feed-shared-update-v2__description">
          Regular content here
        </div>
      `
      document.body.appendChild(post)

      const keyword = `text::${SELECTORS.FEED_TEXT_PROMOTED}`
      const [, text] = keyword.split('::')

      expect(post.textContent.indexOf(text)).toBe(-1)
    })

    it('should handle case sensitivity correctly', () => {
      // The current implementation is case-sensitive
      const post = document.createElement('div')
      post.innerHTML = '<span>promoted</span>' // lowercase

      const keyword = `text::${SELECTORS.FEED_TEXT_PROMOTED}` // "Promoted" with capital P
      const [, text] = keyword.split('::')

      // Current implementation would NOT match lowercase "promoted"
      // This might be a bug if LinkedIn uses different casing
      expect(post.textContent.indexOf(text)).toBe(-1)
    })
  })
})

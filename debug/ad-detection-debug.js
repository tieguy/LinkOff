/**
 * LinkOff Ad Detection Debugger
 *
 * Run this script in your browser's DevTools console while on LinkedIn
 * to diagnose why ads might not be getting filtered.
 *
 * Usage:
 * 1. Go to linkedin.com/feed
 * 2. Open DevTools (F12 or Cmd+Option+I)
 * 3. Copy and paste this entire script into the Console tab
 * 4. Press Enter to run
 */

;(function () {
  console.log('='.repeat(60))
  console.log('LinkOff Ad Detection Debugger')
  console.log('='.repeat(60))

  // Current selectors from the codebase
  const SELECTORS = {
    // Feed post containers
    FEED_POST_ACTIVITY: '[data-id*="urn:li:activity"]',
    FEED_POST_AGGREGATE: '[data-id*="urn:li:aggregate"]',

    // Text to detect promoted posts
    FEED_TEXT_PROMOTED: 'Promoted',

    // Sidebar/banner ad class names
    MISC_AD_BANNER_CONTAINER: 'ad-banner-container',
    MISC_ADS_CONTAINER: 'ads-container',
    MISC_AD_BANNER: 'ad-banner',
    MISC_AD_RAIL: 'pv-right-rail__sticky-ad-banner',
  }

  // 1. Check for feed posts
  console.log('\n--- Feed Posts ---')
  const activityPosts = document.querySelectorAll(
    SELECTORS.FEED_POST_ACTIVITY
  )
  const aggregatePosts = document.querySelectorAll(
    SELECTORS.FEED_POST_AGGREGATE
  )
  console.log(`Found ${activityPosts.length} activity posts`)
  console.log(`Found ${aggregatePosts.length} aggregate posts`)

  // 2. Check for "Promoted" text in posts
  console.log('\n--- Promoted Post Detection ---')
  const allPosts = document.querySelectorAll(
    `${SELECTORS.FEED_POST_ACTIVITY}, ${SELECTORS.FEED_POST_AGGREGATE}`
  )

  let promotedPosts = []
  allPosts.forEach((post, index) => {
    const text = post.innerText
    if (text.includes('Promoted')) {
      promotedPosts.push({ index, post, matchedText: 'Promoted' })
    }
  })

  if (promotedPosts.length > 0) {
    console.log(`Found ${promotedPosts.length} posts containing "Promoted":`)
    promotedPosts.forEach(({ index, post }) => {
      console.log(`  Post ${index}:`, post.getAttribute('data-id'))
      console.log(`    Hidden status: ${post.dataset.hidden}`)
      console.log(`    Classes: ${post.className}`)
    })
  } else {
    console.log('No posts found with "Promoted" text')
    console.log('Checking for alternative ad indicators...')

    // Look for other potential ad markers
    const potentialAdMarkers = [
      'Sponsored',
      'sponsored',
      'Promoted',
      'promoted',
      'ad-',
      'ads-',
      'promo',
    ]

    allPosts.forEach((post, index) => {
      const text = post.innerText.substring(0, 500)
      const html = post.innerHTML.substring(0, 2000)

      potentialAdMarkers.forEach((marker) => {
        if (text.toLowerCase().includes(marker.toLowerCase())) {
          console.log(`  Post ${index} contains "${marker}" in text`)
        }
        if (html.toLowerCase().includes(marker.toLowerCase())) {
          console.log(`  Post ${index} contains "${marker}" in HTML`)
        }
      })
    })
  }

  // 3. Check for sidebar/banner ads
  console.log('\n--- Sidebar/Banner Ad Detection ---')
  const adClasses = [
    SELECTORS.MISC_AD_BANNER_CONTAINER,
    SELECTORS.MISC_ADS_CONTAINER,
    SELECTORS.MISC_AD_BANNER,
    SELECTORS.MISC_AD_RAIL,
  ]

  adClasses.forEach((className) => {
    const elements = document.getElementsByClassName(className)
    console.log(`Class "${className}": ${elements.length} element(s) found`)
    if (elements.length > 0) {
      Array.from(elements).forEach((el, i) => {
        console.log(`  Element ${i}:`, el)
        console.log(`    Hidden: ${el.classList.contains('hide')}`)
        console.log(`    Dimmed: ${el.classList.contains('dim')}`)
      })
    }
  })

  // 4. Search for any elements that might be ads
  console.log('\n--- Searching for Potential Ad Elements ---')
  const adPatterns = [
    '[class*="ad-"]',
    '[class*="ads-"]',
    '[class*="banner"]',
    '[class*="promo"]',
    '[class*="sponsored"]',
    '[data-ad-]',
    '[id*="ad-"]',
    '[id*="ads-"]',
  ]

  adPatterns.forEach((pattern) => {
    try {
      const elements = document.querySelectorAll(pattern)
      if (elements.length > 0) {
        console.log(`Pattern "${pattern}": ${elements.length} element(s)`)
        // Show first 3 examples
        Array.from(elements)
          .slice(0, 3)
          .forEach((el, i) => {
            console.log(`  Example ${i}: ${el.tagName}.${el.className}`)
          })
      }
    } catch (e) {
      // Invalid selector, skip
    }
  })

  // 5. Check LinkOff state
  console.log('\n--- LinkOff State ---')
  const hiddenPosts = document.querySelectorAll('[data-hidden="true"]')
  const shownPosts = document.querySelectorAll('[data-hidden="false"]')
  const dimmedElements = document.querySelectorAll('.dim')
  const hiddenElements = document.querySelectorAll('.hide')

  console.log(`Posts marked as hidden: ${hiddenPosts.length}`)
  console.log(`Posts marked as shown: ${shownPosts.length}`)
  console.log(`Elements with .dim class: ${dimmedElements.length}`)
  console.log(`Elements with .hide class: ${hiddenElements.length}`)

  // 6. Check for userscript storage (if Tampermonkey)
  console.log('\n--- Userscript Storage Check ---')
  if (typeof GM_getValue !== 'undefined') {
    console.log('GM_getValue is available')
    try {
      const mainToggle = GM_getValue('main-toggle', 'NOT_SET')
      const hidePromoted = GM_getValue('hide-promoted', 'NOT_SET')
      const hideAds = GM_getValue('hide-advertisements', 'NOT_SET')
      const gentleMode = GM_getValue('gentle-mode', 'NOT_SET')

      console.log(`main-toggle: ${mainToggle}`)
      console.log(`hide-promoted: ${hidePromoted}`)
      console.log(`hide-advertisements: ${hideAds}`)
      console.log(`gentle-mode: ${gentleMode}`)
    } catch (e) {
      console.log(
        'Cannot access GM_getValue from console (this is expected)'
      )
      console.log(
        'Check Tampermonkey dashboard for stored values'
      )
    }
  } else {
    console.log('GM_getValue not available (not running in userscript context)')
    console.log(
      'To check settings: Click Tampermonkey icon → LinkOff → Settings tab'
    )
  }

  // 7. Summary and recommendations
  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY & RECOMMENDATIONS')
  console.log('='.repeat(60))

  if (activityPosts.length === 0 && aggregatePosts.length === 0) {
    console.log(
      '⚠️  No feed posts found. Are you on the LinkedIn feed page?'
    )
  }

  if (promotedPosts.length > 0 && hiddenPosts.length === 0) {
    console.log(
      '⚠️  Promoted posts found but none are hidden.'
    )
    console.log('   Possible causes:')
    console.log('   1. LinkOff main-toggle might be disabled')
    console.log('   2. hide-promoted setting might be disabled')
    console.log('   3. LinkOff script might not be running')
  }

  console.log('\nTo see LinkOff logs, filter console by "LinkOff"')
  console.log('='.repeat(60))
})()

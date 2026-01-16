// Feed filtering logic
// Determines which posts to hide based on settings and keywords

import {
  FEED_SELECTORS,
  SELECTORS,
  AGE_KEYWORDS,
} from './selectors.js'
import {
  getCustomSelectors,
  resetBlockedPosts,
  resetShownPosts,
  waitForSelector,
  waitForSelectorScoped,
} from '../utils/dom.js'

let runs = 0
let feedKeywordInterval
let postCountPrompted = false
let feedKeywords = []
let oldFeedKeywords = []

/**
 * Generate age-based filtering keywords
 */
const handleAgeFiltering = (keywords, age) => {
  const hideByHour = (shouldLoop = true) => {
    if (shouldLoop) {
      for (let x = 2; x <= 24; x++) {
        keywords.push(`text::${x}${AGE_KEYWORDS.hour}`)
      }
    } else {
      keywords.push(`text::${AGE_KEYWORDS.hour}`)
    }

    hideByDay(false)
  }

  const hideByDay = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 30; x++) {
        keywords.push(`text::${x}${AGE_KEYWORDS.day}`)
      }
    } else {
      keywords.push(`text::${AGE_KEYWORDS.day}`)
    }

    hideByWeek(false)
  }

  const hideByWeek = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 4; x++) {
        keywords.push(`text::${x}${AGE_KEYWORDS.week}`)
      }
    } else {
      keywords.push(`text::${AGE_KEYWORDS.week}`)
    }

    hideByMonth(false)
  }

  const hideByMonth = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 12; x++) {
        keywords.push(`text::${x}${AGE_KEYWORDS.month}`)
      }
    } else {
      keywords.push(`text::${AGE_KEYWORDS.month}`)
    }
    hideByYear(false)
  }

  const hideByYear = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 5; x++) {
        keywords.push(`text::${x}${AGE_KEYWORDS.year}`)
      }
    } else {
      keywords.push(`text::${AGE_KEYWORDS.year}`)
    }
  }

  switch (age) {
    case 'hour':
      hideByHour(keywords)
      break

    case 'day':
      hideByDay(keywords)
      break

    case 'week':
      hideByWeek(keywords)
      break

    case 'month':
      hideByMonth(keywords)
      break

    case 'year':
      hideByYear(keywords)
      break
  }
}

/**
 * Build list of keywords to filter based on settings
 */
export const getFeedKeywords = (response) => {
  let keywords =
    response['feed-keywords'] == '' ? [] : response['feed-keywords'].split(',')

  const hideByAge = response['hide-by-age']

  if (hideByAge !== 'disabled') {
    handleAgeFiltering(keywords, hideByAge)
  }

  if (response['hide-polls']) keywords.push(SELECTORS.FEED_POLL)
  if (response['hide-videos'])
    keywords.push(
      SELECTORS.FEED_VIDEO_VJS,
      SELECTORS.FEED_VIDEO_COMPONENTS,
      SELECTORS.FEED_VIDEO_SHARED
    )
  if (response['hide-links']) keywords.push(SELECTORS.FEED_LINK)
  if (response['hide-images']) keywords.push(SELECTORS.FEED_IMAGE)
  if (response['hide-promoted'])
    keywords.push(`text::${SELECTORS.FEED_TEXT_PROMOTED}`)
  if (response['hide-shared']) keywords.push(SELECTORS.FEED_SHARED_POST)
  if (response['hide-followed'])
    keywords.push(`text::${SELECTORS.FEED_TEXT_FOLLOWING}`)
  if (response['hide-liked'])
    keywords.push(
      `text::${SELECTORS.FEED_TEXT_LIKES_THIS}`,
      `text::${SELECTORS.FEED_TEXT_LIKE_THIS}`
    )
  if (response['hide-other-reactions'])
    keywords.push(
      `text::${SELECTORS.FEED_TEXT_LOVES_THIS}`,
      `text::${SELECTORS.FEED_TEXT_INSIGHTFUL}`,
      `text::${SELECTORS.FEED_TEXT_CELEBRATES}`,
      `text::${SELECTORS.FEED_TEXT_CURIOUS}`,
      `text::${SELECTORS.FEED_TEXT_SUPPORTS}`,
      `text::${SELECTORS.FEED_TEXT_FUNNY}`
    )
  if (response['hide-commented-on'])
    keywords.push(`text::${SELECTORS.FEED_TEXT_COMMENTED}`)
  if (response['hide-by-companies']) keywords.push(SELECTORS.FEED_COMPANY_LINK)
  if (response['hide-by-people']) keywords.push(SELECTORS.FEED_PERSON_LINK)
  if (response['hide-suggested'])
    keywords.push(`text::${SELECTORS.FEED_TEXT_SUGGESTED}`)
  if (response['hide-carousels']) keywords.push(SELECTORS.FEED_CAROUSEL)

  console.log('LinkOff: Current feed keywords are', keywords)
  return keywords
}

/**
 * Hide a single post
 */
const hidePost = (post, mode) => {
  post.classList.add(mode, 'showIcon')

  post.onclick = () => {
    post.classList.remove('hide', 'dim', 'showIcon')
    post.dataset.hidden = 'shown'
  }

  // Add attribute to track already hidden posts
  post.dataset.hidden = true
}

/**
 * Main filtering function - processes feed posts
 */
const blockByFeedKeywords = (keywords, mode, disablePostCount) => {
  if (oldFeedKeywords.some((kw) => !keywords.includes(kw))) {
    resetShownPosts()
  }
  oldFeedKeywords = keywords

  let posts

  if (keywords.length)
    feedKeywordInterval = setInterval(() => {
      if (runs % 10 === 0) resetBlockedPosts()
      // Select posts which are not already hidden
      posts = document.querySelectorAll(
        getCustomSelectors(FEED_SELECTORS, 'pristine')
      )

      console.log(`LinkOff: Found ${posts.length} unblocked posts`)

      // Filter only if there are enough posts to load more
      if (posts.length > 5 || mode == 'dim') {
        posts.forEach((post) => {
          let keywordIndex

          const containsKeyword = keywords.some((keyword, index) => {
            keywordIndex = index

            const splitted = keyword.split('::')

            if (splitted.length > 1) {
              return post.innerText.indexOf(splitted[1]) !== -1
            }

            return post.innerHTML.indexOf(splitted[0]) !== -1
          })

          if (containsKeyword) {
            hidePost(post, mode)

            console.log(
              `LinkOff: Blocked post ${post.getAttribute(
                'data-id'
              )} for keyword ${keywords[keywordIndex]}`
            )
          } else {
            post.classList.remove('hide', 'dim', 'showIcon')
            post.dataset.hidden = false
          }
        })
      } else {
        if (!postCountPrompted && !disablePostCount) {
          postCountPrompted = true //Prompt only once when loading linkedin
          alert(
            'Scroll down to start blocking posts (LinkedIn needs at least 10 loaded to load new ones).\n\nTo disable this alert, toggle it under misc in LinkOff settings'
          )
        }
      }

      runs++
    }, 350)
}

/**
 * Toggle entire feed visibility
 */
const toggleFeed = async (shown) => {
  let attempts = 0
  let success = false
  let className = SELECTORS.FEED_CONTAINER
  if (window.location.href != 'https://www.linkedin.com/feed/') {
    // dont hide this element on notifications & jobs page. Only hide on home feed instead.
    return
  }

  while (!success && attempts < 50) {
    await new Promise((resolve) => {
      setTimeout(() => {
        if (shown) {
          document
            .getElementsByClassName(className)
            .item(0)
            .classList.remove('hide')
          console.log(`LinkOff: feed enabled`)
        } else {
          document
            .getElementsByClassName(className)
            .item(0)
            .classList.add('hide')
          console.log(`LinkOff: feed disabled`)
        }
        success = true
        attempts = attempts + 1
        resolve()
      }, 100 + attempts * 10)
    })
  }
}

/**
 * Toggle sort by recent
 */
const handleSortByRecent = async () => {
  if (
    window.location.href !== 'https://www.linkedin.com/feed/' &&
    window.location.href !== 'https://www.linkedin.com/'
  ) {
    return
  }

  const dropdownTrigger = await waitForSelector(
    SELECTORS.FEED_SORT_DROPDOWN_TRIGGER
  )

  const parent = dropdownTrigger.parentElement

  dropdownTrigger.click()

  const recentOption = await waitForSelectorScoped(
    SELECTORS.FEED_SORT_RECENT_OPTION,
    parent
  )
  recentOption.click()
}

const handleToggledOff = () => {
  toggleFeed(true)

  clearInterval(feedKeywordInterval)
  resetBlockedPosts()
  resetShownPosts()
}

const handleHideWholeFeed = () => {
  toggleFeed(false)
  resetBlockedPosts()
  clearInterval(feedKeywordInterval)
}

const handleShowFilteredFeed = (mode, response) => {
  toggleFeed(true)

  resetBlockedPosts()
  clearInterval(feedKeywordInterval)
  blockByFeedKeywords(feedKeywords, mode, response['disable-postcount-prompt'])
}

/**
 * Main feed handler - called on settings change
 */
export default function doFeed(getRes, enabled, mode, response) {
  if (getRes('main-toggle', false)) {
    handleToggledOff()

    return
  }

  if (!enabled) return

  if (getRes('sort-by-recent', true)) handleSortByRecent()

  feedKeywords = getFeedKeywords(response)
  if (getRes('hide-whole-feed', true)) {
    handleHideWholeFeed()
  } else if (feedKeywords !== oldFeedKeywords) {
    handleShowFilteredFeed(mode, response)
  }
}

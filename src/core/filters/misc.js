// Miscellaneous UI element filtering
// Handles hiding of various LinkedIn UI components

import { SELECTORS } from './selectors.js'
import {
  hideAncestorByChildClassName,
  hideByClassName,
  hideByClassNameAndIndex,
  showAncestorByChildClassName,
  showByClassName,
  showByClassNameAndIndex,
} from '../utils/dom.js'

// Show/Hide LinkedIn learning prompts and ads
const showLearning = () => {
  showByClassName(SELECTORS.MISC_LEARNING_TOP)
  showByClassName(SELECTORS.MISC_LEARNING_RECOMMENDATIONS)
}

const handleLearning = (getRes, mode) => {
  if (getRes('hide-linkedin-learning', true)) {
    hideByClassName(SELECTORS.MISC_LEARNING_TOP, mode)
    hideByClassName(SELECTORS.MISC_LEARNING_RECOMMENDATIONS, mode)
  } else {
    showLearning()
  }
}

// Show/Hide ads across linkedin
const showAdvertisement = () => {
  showByClassName(SELECTORS.MISC_AD_BANNER_CONTAINER)
  showByClassName(SELECTORS.MISC_ADS_CONTAINER)
  showByClassName(SELECTORS.MISC_AD_BANNER)
  showByClassName(SELECTORS.MISC_AD_RAIL)
}

const handleAdvertisement = (getRes, mode) => {
  if (getRes('hide-advertisements', true)) {
    hideByClassName(SELECTORS.MISC_AD_BANNER_CONTAINER, mode)
    hideByClassName(SELECTORS.MISC_ADS_CONTAINER, mode)
    hideByClassName(SELECTORS.MISC_AD_BANNER, mode)
    hideByClassName(SELECTORS.MISC_AD_RAIL, mode)
  } else {
    showAdvertisement()
  }
}

// Show/Hide community panels
const showCommunity = () => {
  showByClassName(SELECTORS.MISC_COMMUNITY_PANEL)
}
const handleCommunity = (getRes, mode) => {
  if (getRes('hide-community-panel', true)) {
    hideByClassName(SELECTORS.MISC_COMMUNITY_PANEL, mode)
  } else {
    showCommunity()
  }
}

// Show/Hide follow panels
const showFollow = () => {
  showByClassName(SELECTORS.MISC_FOLLOW_MODULE)
}

const handleFollow = (getRes, mode) => {
  if (getRes('hide-follow-recommendations', true)) {
    hideByClassName(SELECTORS.MISC_FOLLOW_MODULE, mode)
  } else {
    showFollow()
  }
}

// Show/Hide account building prompts
const showAccountBuilding = () => {
  showByClassName(SELECTORS.MISC_ACCOUNT_BUILDING_1)
  showByClassName(SELECTORS.MISC_ACCOUNT_BUILDING_2)
}
const handleAccountBuilding = (getRes, mode) => {
  if (getRes('hide-account-building', true)) {
    hideByClassName(SELECTORS.MISC_ACCOUNT_BUILDING_1, mode)
    hideByClassName(SELECTORS.MISC_ACCOUNT_BUILDING_2, mode)
  } else {
    showAccountBuilding()
  }
}

// Show/Hide network building prompts
const showNetworkBuilding = () => {
  showByClassName(SELECTORS.MISC_NETWORK_ABI)
  showByClassName(SELECTORS.MISC_NETWORK_PYMK)
}

const handleNetworkBuilding = (getRes, mode) => {
  if (getRes('hide-network-building', true)) {
    hideByClassName(SELECTORS.MISC_NETWORK_ABI, mode)
    hideByClassName(SELECTORS.MISC_NETWORK_PYMK, mode)
  } else {
    showNetworkBuilding()
  }
}

// Show/Hide premium upsell prompts
const showPremium = () => {
  showByClassName(SELECTORS.MISC_PREMIUM_UPSELL_LINK)
  showByClassName(SELECTORS.MISC_PREMIUM_PROMO_CARD)
  showByClassName(SELECTORS.MISC_PREMIUM_CARD_PH1)
  showByClassName(SELECTORS.MISC_PREMIUM_ACCENT_BAR)
  showByClassName(SELECTORS.MISC_PREMIUM_UPSELL_CONTAINER)
  showByClassName(SELECTORS.MISC_PREMIUM_BLURRED)
  showByClassNameAndIndex(SELECTORS.MISC_PREMIUM_TAB, 1)
}
const handlePremium = (getRes, mode) => {
  if (getRes('hide-premium', true)) {
    hideByClassName(SELECTORS.MISC_PREMIUM_UPSELL_LINK, mode, false)
    hideByClassName(SELECTORS.MISC_PREMIUM_PROMO_CARD, mode)
    hideByClassName(SELECTORS.MISC_PREMIUM_CARD_PH1, mode, false)
    hideByClassName(SELECTORS.MISC_PREMIUM_UPSELL_CONTAINER, mode, false)
    hideByClassName(SELECTORS.MISC_PREMIUM_BLURRED, mode, false)
    hideByClassName(SELECTORS.MISC_PREMIUM_ACCENT_BAR, mode)
    hideByClassNameAndIndex(SELECTORS.MISC_PREMIUM_TAB, 1, mode, false)
  } else {
    showPremium()
  }
}

// Show/Hide news
const showNews = () => {
  showByClassName(SELECTORS.MISC_NEWS_MODULE)
  showByClassName(SELECTORS.MISC_NEWS_WITH_GAME)
}
const handleNews = (getRes, mode) => {
  if (getRes('hide-news', true)) {
    hideByClassName(SELECTORS.MISC_NEWS_MODULE, mode)
    hideByClassName(SELECTORS.MISC_NEWS_WITH_GAME, mode)
  } else {
    showNews()
  }
}

//  Show/Hide notification count
const showNotifications = () => {
  showByClassName(SELECTORS.MISC_NOTIFICATION_COUNT)
}

const handleNotifications = (getRes) => {
  if (getRes('hide-notification-count', true)) {
    hideByClassName(SELECTORS.MISC_NOTIFICATION_COUNT, 'hide', false)
  } else {
    showNotifications()
  }
}

//  Show/Hide profile counters
const showProfileCounters = () => {
  showAncestorByChildClassName(
    SELECTORS.MISC_PROFILE_COUNTER_CHILD,
    SELECTORS.MISC_PROFILE_COUNTER_PARENT
  )
}

const handleProfileCounters = (getRes, mode) => {
  if (getRes('hide-profile-counters', true)) {
    hideAncestorByChildClassName(
      SELECTORS.MISC_PROFILE_COUNTER_CHILD,
      SELECTORS.MISC_PROFILE_COUNTER_PARENT,
      mode,
      false
    )
  } else {
    showNotifications()
  }
}

const showAll = () => {
  showNews()
  showNotifications()
  showAccountBuilding()
  showNetworkBuilding()
  showAdvertisement()
  showCommunity()
  showFollow()
  showPremium()
  showLearning()
  showProfileCounters()
}

let interval

const handleAll = (getRes, mode) => {
  handleLearning(getRes, mode)
  handleCommunity(getRes, mode)
  handleFollow(getRes, mode)
  handleAccountBuilding(getRes, mode)
  handleNetworkBuilding(getRes, mode)
  handlePremium(getRes, mode)
  handleNews(getRes, mode)
  handleAdvertisement(getRes, mode)
  handleNotifications(getRes)
  handleProfileCounters(getRes, mode)
}

/**
 * Main misc handler - called on settings change
 */
export default function doMisc(getRes, enabled, mode) {
  if (getRes('main-toggle', false)) {
    showAll()
    clearInterval(interval)
  }

  if (!enabled) return

  handleAll(getRes, mode)

  if (interval) clearInterval(interval)

  interval = setInterval(() => {
    handleAll(getRes, mode)
  }, 500)
}

/**
 * Unfollow all followed accounts
 */
export const unfollowAll = async () => {
  let buttons = document.querySelectorAll(SELECTORS.UNFOLLOW_BUTTON) || []

  if (!buttons.length) console.log('LinkOff: Successfully unfollowed all')

  for (let button of buttons) {
    window.scrollTo(0, button.offsetTop - 260)
    button.click()

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  window.scrollTo(0, document.body.scrollHeight)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  buttons = document.querySelectorAll(SELECTORS.UNFOLLOW_BUTTON) || []

  if (buttons.length) unfollowAll()
}

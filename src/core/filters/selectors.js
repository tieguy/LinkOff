// Centralized LinkedIn DOM selectors
// All querySelector strings and class names used to identify LinkedIn elements

export const SELECTORS = {
  // Feed post containers
  FEED_POST_ACTIVITY: '[data-id*="urn:li:activity"]',
  FEED_POST_AGGREGATE: '[data-id*="urn:li:aggregate"]',

  // Job post containers
  JOB_POST_ID: '[data-job-id]',
  JOB_POST_OCCLUDABLE: '[data-occludable-job-id]',
  JOB_LIST_ITEM: '.discovery-templates-vertical-list__list-item',

  // Feed content indicators (used for keyword matching in innerHTML)
  FEED_POLL: 'poll',
  FEED_VIDEO_VJS: 'id="vjs_video_',
  FEED_VIDEO_COMPONENTS: 'update-components-linkedin-video',
  FEED_VIDEO_SHARED: 'feed-shared-linkedin-video',
  FEED_LINK: 'https://lnkd.in/',
  FEED_IMAGE: 'class="update-components-image__image-link',
  FEED_SHARED_POST: 'feed-shared-mini-update-v2',
  FEED_CAROUSEL: 'iframe',
  FEED_COMPANY_LINK: 'href="https://www.linkedin.com/company/',
  FEED_PERSON_LINK: 'href="https://www.linkedin.com/in/',

  // Feed text indicators (used for keyword matching in innerText, prefixed with text::)
  FEED_TEXT_PROMOTED: 'Promoted',
  FEED_TEXT_SUGGESTED: 'Suggested',
  FEED_TEXT_FOLLOWING: 'following',
  FEED_TEXT_LIKES_THIS: 'likes this',
  FEED_TEXT_LIKE_THIS: 'like this',
  FEED_TEXT_LOVES_THIS: 'loves this',
  FEED_TEXT_INSIGHTFUL: 'finds this insightful',
  FEED_TEXT_CELEBRATES: 'celebrates this',
  FEED_TEXT_CURIOUS: 'is curious about this',
  FEED_TEXT_SUPPORTS: 'supports this',
  FEED_TEXT_FUNNY: 'finds this funny',
  FEED_TEXT_COMMENTED: 'commented on this',
  FEED_TEXT_REPOSTED: 'reposted this',

  // Feed container (for hiding whole feed)
  FEED_CONTAINER: 'scaffold-finite-scroll__content',

  // Sort dropdown selectors
  FEED_SORT_DROPDOWN_TRIGGER:
    'button.full-width.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom',
  FEED_SORT_RECENT_OPTION:
    'ul > li:nth-child(2) > div.artdeco-dropdown__item.artdeco-dropdown__item--is-dropdown',

  // Jobs page UI elements
  JOBS_GUIDANCE: 'artdeco-card mb2 pt5',
  JOBS_AI_BUTTON: 'ember-view link-without-hover-state artdeco-button',

  // Misc UI elements (class names)
  MISC_LEARNING_TOP: 'learning-top-courses',
  MISC_LEARNING_RECOMMENDATIONS: 'pv-course-recommendations',
  MISC_AD_BANNER_CONTAINER: 'ad-banner-container',
  MISC_ADS_CONTAINER: 'ads-container',
  MISC_AD_BANNER: 'ad-banner',
  MISC_AD_RAIL: 'pv-right-rail__sticky-ad-banner',
  MISC_COMMUNITY_PANEL: 'community-panel',
  MISC_FOLLOW_MODULE: 'feed-follows-module',
  MISC_ACCOUNT_BUILDING_1: 'artdeco-card ember-view mt2',
  MISC_ACCOUNT_BUILDING_2: 'artdeco-card mb4 overflow-hidden ember-view',
  MISC_NETWORK_ABI: 'mn-abi-form',
  MISC_NETWORK_PYMK: 'pv-profile-pymk__container artdeco-card',
  MISC_PREMIUM_UPSELL_LINK: 'premium-upsell-link',
  MISC_PREMIUM_PROMO_CARD: 'gp-promo-embedded-card-three__card',
  MISC_PREMIUM_CARD_PH1: 'artdeco-card overflow-hidden ph1 mb2',
  MISC_PREMIUM_ACCENT_BAR: 'artdeco-card premium-accent-bar',
  MISC_PREMIUM_UPSELL_CONTAINER: 'pvs-premium-upsell__container',
  MISC_PREMIUM_BLURRED: 'pvs-entity--blurred',
  MISC_PREMIUM_TAB: 'artdeco-tab ember-view',
  MISC_NEWS_MODULE: 'news-module',
  MISC_NEWS_WITH_GAME: 'news-module--with-game',
  MISC_NOTIFICATION_COUNT: 'notification-badge__count',
  MISC_PROFILE_COUNTER_CHILD: 'entity-list-wrapper',
  MISC_PROFILE_COUNTER_PARENT: '.artdeco-card',

  // Unfollow button selector
  UNFOLLOW_BUTTON: 'button[aria-label^="Click to stop"]',

  // Messaging selectors
  MESSAGES_LIST: '.msg-conversations-container__conversations-list',
  MESSAGES_DROPDOWN: '.msg-conversations-container__dropdown-container',
  MESSAGES_DROPDOWN_INNER: '.msg-conversations-container__dropdown-container > div',
  MESSAGES_TITLE_BUTTON:
    '.msg-conversations-container__title-row button.artdeco-dropdown__trigger',
}

// Combined selector arrays (for querySelectorAll)
export const FEED_SELECTORS = [
  SELECTORS.FEED_POST_ACTIVITY,
  SELECTORS.FEED_POST_AGGREGATE,
]

export const JOB_SELECTORS = [
  SELECTORS.JOB_POST_ID,
  SELECTORS.JOB_POST_OCCLUDABLE,
  SELECTORS.JOB_LIST_ITEM,
]

// Pseudo-selectors for tracking hidden/visible state
export const PRISTINE_SELECTOR = ':not([data-hidden])'
export const VISIBLE_SELECTOR = '[data-hidden=false]'
export const BLOCKED_SELECTOR = '[data-hidden=true]'

// Age-based filtering keywords
export const AGE_KEYWORDS = {
  hour: 'h \u2022',
  day: 'd \u2022',
  week: 'w \u2022',
  month: 'mo \u2022',
  year: 'y \u2022',
}

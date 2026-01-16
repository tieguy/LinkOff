// Default settings for LinkOff
// These are used when initializing storage and as fallbacks

export const DEFAULT_SETTINGS = {
  // General settings
  'gentle-mode': true, // Fade instead of hide
  'dark-mode': false,
  'main-toggle': true, // Master on/off switch
  'wide-mode': false,

  // Feed settings
  'hide-whole-feed': false,
  'hide-by-age': 'week',
  'feed-keywords': '',
  'hide-shared': false,
  'hide-videos': false,
  'hide-liked': true, // Hide "liked by connections"
  'hide-suggested': true,
  'hide-other-reactions': false,
  'sort-by-recent': true,
  'hide-carousels': false,
  'hide-by-companies': true,
  'hide-by-people': false,
  'hide-commented-on': false,
  'hide-followed': true, // Hide "following" posts
  'hide-images': false,
  'hide-links': false,
  'hide-polls': true,
  'hide-promoted': true,

  // Misc settings
  'hide-linkedin-learning': true,
  'hide-premium': true,
  'hide-account-building': true,
  'hide-network-building': true,
  'hide-advertisements': true,
  'hide-follow-recommendations': true,
  'hide-news': false,
  'hide-notification-count': false,
  'hide-profile-counters': false,
  'hide-community-panel': true,
  'disable-postcount-prompt': false,

  // Jobs settings
  'job-keywords': '',
  'hide-job-guidance': false,
  'hide-ai-button': false,
  'hide-promoted-jobs': false,
}

// Human-readable labels for settings (used in userscript menu)
export const SETTING_LABELS = {
  'gentle-mode': 'Gentle Mode (Dim Instead of Hide)',
  'dark-mode': 'Dark Mode',
  'main-toggle': 'Enable LinkOff',
  'wide-mode': 'Wide Mode',
  'hide-whole-feed': 'Hide Entire Feed',
  'hide-by-age': 'Hide Posts by Age',
  'feed-keywords': 'Feed Keywords',
  'hide-shared': 'Hide Shared Posts',
  'hide-videos': 'Hide Videos',
  'hide-liked': 'Hide "Liked by" Posts',
  'hide-suggested': 'Hide Suggested Posts',
  'hide-other-reactions': 'Hide Other Reactions',
  'sort-by-recent': 'Sort by Recent',
  'hide-carousels': 'Hide Carousels',
  'hide-by-companies': 'Hide Company Posts',
  'hide-by-people': 'Hide People Posts',
  'hide-commented-on': 'Hide "Commented on" Posts',
  'hide-followed': 'Hide Following Posts',
  'hide-images': 'Hide Images',
  'hide-links': 'Hide Links',
  'hide-polls': 'Hide Polls',
  'hide-promoted': 'Hide Promoted Posts',
  'hide-linkedin-learning': 'Hide LinkedIn Learning',
  'hide-premium': 'Hide Premium Upsells',
  'hide-account-building': 'Hide Account Building',
  'hide-network-building': 'Hide Network Building',
  'hide-advertisements': 'Hide Advertisements',
  'hide-follow-recommendations': 'Hide Follow Recommendations',
  'hide-news': 'Hide News',
  'hide-notification-count': 'Hide Notification Count',
  'hide-profile-counters': 'Hide Profile Counters',
  'hide-community-panel': 'Hide Community Panel',
  'disable-postcount-prompt': 'Disable Post Count Prompt',
  'job-keywords': 'Job Keywords',
  'hide-job-guidance': 'Hide Job Guidance',
  'hide-ai-button': 'Hide AI Button',
  'hide-promoted-jobs': 'Hide Promoted Jobs',
}

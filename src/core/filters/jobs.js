// Jobs page filtering logic

import { JOB_SELECTORS, SELECTORS } from './selectors.js'
import {
  getCustomSelectors,
  hideByClassName,
  resetJobs,
  showByClassName,
} from '../utils/dom.js'

let runs = 0
let jobKeywordInterval
let jobKeywords = []
let oldJobKeywords = []

/**
 * Build list of job keywords based on settings
 */
const getJobKeywords = (response) => {
  let jobKeywords =
    response['job-keywords'] == '' ? [] : response['job-keywords'].split(',')

  if (response['hide-promoted-jobs']) {
    jobKeywords.push('Promoted')
  }

  console.log('LinkOff: Current job keywords are', jobKeywords)
  return jobKeywords
}

/**
 * Filter jobs by keywords
 */
const blockByJobKeywords = (keywords, mode) => {
  if (!window.location.href.startsWith('https://www.linkedin.com/jobs/')) return

  if (oldJobKeywords.some((kw) => !keywords.includes(kw))) {
    resetJobs()
  }

  oldJobKeywords = keywords

  let posts

  if (keywords.length)
    jobKeywordInterval = setInterval(() => {
      if (runs % 10 === 0) resetJobs()

      posts = document.querySelectorAll(
        getCustomSelectors(JOB_SELECTORS, 'all')
      )

      console.log(`LinkOff: Found ${posts.length} unblocked jobs`)

      posts.forEach((post) => {
        let keywordIndex
        if (
          keywords.some((keyword, index) => {
            keywordIndex = index
            return (
              post.innerHTML.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
            )
          })
        ) {
          post.classList.add(mode, 'showIcon')

          console.log(
            `LinkOff: Blocked job ${post.getAttribute(
              'data-occludable-job-id'
            )} for keyword ${keywords[keywordIndex]}`
          )
        } else {
          post.classList.remove('hide', 'dim', 'showIcon')
        }
      })

      runs++
    }, 350)
}

const resetAll = () => {
  clearInterval(jobKeywordInterval)
  resetJobs()
  showJobGuidance()
  showAiButton()
}

// Show/Hide Job Guidance
const showJobGuidance = () => {
  showByClassName(SELECTORS.JOBS_GUIDANCE)
}
const handleJobGuidance = (getRes, mode) => {
  if (getRes('hide-job-guidance', true)) {
    hideByClassName(SELECTORS.JOBS_GUIDANCE, mode)
  } else if (
    getRes('main-toggle', false) ||
    getRes('hide-job-guidance', false)
  ) {
    showJobGuidance()
  }
}

// Show/Hide AI Button
const showAiButton = () => {
  showByClassName(SELECTORS.JOBS_AI_BUTTON)
}

const handleAiButton = (getRes, mode) => {
  if (getRes('hide-ai-button', true)) {
    hideByClassName(SELECTORS.JOBS_AI_BUTTON, mode, false)
  } else if (getRes('main-toggle', false) || getRes('hide-ai-button', false)) {
    showAiButton()
  }
}

/**
 * Main jobs handler - called on settings change
 */
export default function doJobs(getRes, enabled, mode, response) {
  if (getRes('main-toggle', false)) {
    resetAll()

    return
  }

  if (!enabled) return

  jobKeywords = getJobKeywords(response)

  // Hide by keywords
  if (jobKeywords !== oldJobKeywords || jobKeywords.length === 0) {
    resetAll()

    blockByJobKeywords(jobKeywords, mode)
  }

  handleJobGuidance(getRes, mode)

  handleAiButton(getRes, mode)
}

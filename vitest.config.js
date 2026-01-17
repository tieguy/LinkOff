import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/core/**/*.js'],
      exclude: ['src/core/index.js'], // Entry point with side effects
      // Thresholds disabled initially - enable and increase as coverage improves
      // thresholds: {
      //   lines: 40,
      //   functions: 40,
      //   branches: 40,
      //   statements: 40,
      // },
    },
  },
})

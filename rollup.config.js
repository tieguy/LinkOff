import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const userscriptMeta = fs
  .readFileSync('./src/userscript/meta.txt', 'utf8')
  .replace('{{version}}', pkg.version)

export default [
  // Extension content script
  {
    input: 'src/extension/content.js',
    output: {
      file: 'dist/extension/content.js',
      format: 'iife',
    },
    plugins: [resolve()],
  },
  // Extension background script
  {
    input: 'src/extension/background.js',
    output: {
      file: 'dist/extension/background.js',
      format: 'iife',
    },
    plugins: [resolve()],
  },
  // Extension popup script (no bundling needed, just copy)
  {
    input: 'src/extension/popup.js',
    output: {
      file: 'dist/extension/popup.js',
      format: 'iife',
    },
    plugins: [
      resolve(),
      copy({
        targets: [
          { src: 'src/extension/manifest.json', dest: 'dist/extension' },
          { src: 'src/extension/popup.html', dest: 'dist/extension' },
          { src: 'src/content/content.css', dest: 'dist/extension' },
          {
            src: 'src/icons/*',
            dest: 'dist/extension/assets/icons',
          },
          {
            src: 'src/lib/*',
            dest: 'dist/extension/assets/lib',
          },
        ],
        hook: 'writeBundle',
      }),
    ],
  },
  // Userscript
  {
    input: 'src/userscript/main.js',
    output: {
      file: 'dist/linkoff.user.js',
      format: 'iife',
      banner: userscriptMeta,
    },
    plugins: [
      resolve(),
      terser({
        format: {
          comments: false,
          preamble: userscriptMeta,
        },
      }),
    ],
  },
]

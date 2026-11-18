import assert from 'node:assert/strict'
import test from 'node:test'
import { createSearchIndex, searchDocumentation } from '../src/utils/search.js'

const index = createSearchIndex([
  {
    label: 'DDR Public',
    path: '/ddr-public',
    pages: [
      { label: 'Introduction', path: '/ddr-public', content: '# Welcome\n\nFind **approved** screenshots here.' },
      { label: 'Example', path: '/ddr-public/example', content: 'A placeholder.' },
    ],
  },
  {
    label: 'DDR Admin',
    path: '/ddr-admin',
    pages: [{ label: 'Introduction', path: '/ddr-admin', content: 'Admin guidance.' }],
  },
])

test('search finds section, page and Markdown content without case sensitivity', () => {
  assert.deepEqual(searchDocumentation(index, '  APPROVED screenshot  ').flatMap((section) => section.pages.map((page) => page.path)),
    ['/ddr-public'])
  assert.deepEqual(searchDocumentation(index, 'ddr admin').flatMap((section) => section.pages.map((page) => page.path)),
    ['/ddr-admin'])
  assert.deepEqual(searchDocumentation(index, 'example').flatMap((section) => section.pages.map((page) => page.path)),
    ['/ddr-public/example'])
})

test('empty searches show all pages and unmatched searches show no results', () => {
  assert.equal(searchDocumentation(index, '  ').reduce((count, section) => count + section.pages.length, 0), 3)
  assert.deepEqual(searchDocumentation(index, 'no-such-page'), [])
})

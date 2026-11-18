import assert from 'node:assert/strict'
import test from 'node:test'
import { parseHomeContent } from '../src/utils/home.js'

const sections = [{ path: '/first' }, { path: '/second' }]
const markdown = `# Welcome

## Explore

<!-- application-tiles -->
### [First](/first)

First description.

### [Second](/second)

Second description.
<!-- /application-tiles -->

## About

- **Guide**–Instructions.
`

test('home Markdown separates tile content from surrounding sections', () => {
  const result = parseHomeContent(markdown, sections)
  assert.match(result.introduction, /## Explore/)
  assert.deepEqual(result.tiles, [
    { path: '/first', label: 'First', description: 'First description.' },
    { path: '/second', label: 'Second', description: 'Second description.' },
  ])
  assert.match(result.details, /## About/)
})

test('home Markdown rejects missing, duplicate and unknown tile routes', () => {
  assert.throws(() => parseHomeContent('# Welcome', sections), /markers/)
  assert.throws(() => parseHomeContent(markdown.replace('/second', '/first'), sections), /Each home tile/)
  assert.throws(() => parseHomeContent(markdown.replace('/second', '/unknown'), sections), /Each home tile/)
  assert.throws(() => parseHomeContent(markdown, [...sections, { path: '/third' }]), /one tile for each/)
  assert.throws(() => parseHomeContent(markdown.replace('First description.', '**[First](/first)**'), sections), /without links/)
})

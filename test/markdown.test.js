import assert from 'node:assert/strict'
import test from 'node:test'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { figureNumbers, headingIds, imageUrl, pageContents, standaloneLinks } from '../src/utils/markdown.js'

test('contents and rendered heading IDs agree for formatted and duplicate headings', async () => {
  const markdown = '# Title\n\n## **First** step\n\n### Detail\n\n## First step\n\n## Résumé'
  const expected = [
    { id: 'first-step', text: 'First step' },
    { id: 'first-step-1', text: 'First step' },
    { id: 'résumé', text: 'Résumé' },
  ]
  assert.deepEqual(pageContents(markdown), expected)
  const processor = unified().use(remarkParse).use(headingIds)
  const tree = await processor.run(processor.parse(markdown))
  assert.deepEqual(tree.children.filter((node) => node.depth === 2).map((node) => node.data.hProperties.id),
    expected.map((heading) => heading.id))
})

test('heading IDs remain unique across separately rendered home sections', async () => {
  const processor = unified().use(remarkParse).use(headingIds, { precedingMarkdown: '## Details' })
  const tree = await processor.run(processor.parse('## Details'))
  assert.equal(tree.children[0].data.hProperties.id, 'details-1')
})

test('standalone links are marked without changing inline, heading or image links', async () => {
  const markdown = '[Standalone](/first)\n\nText [inline](/second).\n\n- [List link](/third)\n\n## [Heading](/fourth)\n\n[![Image](/image.png)](/fifth)\n\n[Reference][ref]\n\n[ref]: /sixth'
  const processor = unified().use(remarkParse).use(standaloneLinks)
  const tree = await processor.run(processor.parse(markdown))
  assert.equal(tree.children[0].children[0].data.hProperties['data-standalone'], true)
  assert.equal(tree.children[1].children[1].data, undefined)
  assert.equal(tree.children[2].children[0].children[0].children[0].data.hProperties['data-standalone'], true)
  assert.equal(tree.children[3].children[0].data, undefined)
  assert.equal(tree.children[4].children[0].data, undefined)
  assert.equal(tree.children[5].children[0].data.hProperties['data-standalone'], true)
})

test('local screenshot URLs respect the deployed base without changing other URLs', () => {
  assert.equal(imageUrl('/images/ddr-public/example.png', '/ddr-user-evaluation/'), '/ddr-user-evaluation/images/ddr-public/example.png')
  assert.equal(imageUrl('https://example.com/image.png', '/ddr-user-evaluation/'), 'https://example.com/image.png')
})

test('figure numbering includes standalone images and placeholders but not inline images', async () => {
  const markdown = '![First](/images/first.png "First caption")\n\nText ![inline](/inline.png).\n\n```screenshot-placeholder\nSecond caption\n```\n\n![Third](/images/third.png)'
  const processor = unified().use(remarkParse).use(figureNumbers)
  const tree = await processor.run(processor.parse(markdown))
  assert.equal(tree.children[0].children[0].data.hProperties['data-figure-number'], 1)
  assert.equal(tree.children[0].children[0].data.hProperties['data-image-key'], '/images/first.png')
  assert.equal(tree.children[1].children[1].data, undefined)
  assert.equal(tree.children[2].data.hProperties['data-figure-number'], 2)
  assert.equal(tree.children[3].children[0].data.hProperties['data-figure-number'], 3)
})

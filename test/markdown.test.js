import assert from 'node:assert/strict'
import test from 'node:test'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { headingIds, imageUrl, pageContents } from '../src/utils/markdown.js'

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

test('local screenshot URLs respect the deployed base without changing other URLs', () => {
  assert.equal(imageUrl('/images/ddr-public/example.png', '/ddr-user-evaluation/'), '/ddr-user-evaluation/images/ddr-public/example.png')
  assert.equal(imageUrl('https://example.com/image.png', '/ddr-user-evaluation/'), 'https://example.com/image.png')
})

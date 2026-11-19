import assert from 'node:assert/strict'
import test from 'node:test'
import { orderPages } from '../src/utils/navigation.js'

test('troubleshooting is last in each user guide without reordering other pages', () => {
  for (const application of ['ddr-public', 'ddr-admin', 'research-instrument']) {
    const pages = [
      { label: 'Introduction', path: `/${application}` },
      { label: 'Troubleshooting', path: `/${application}/troubleshooting` },
      { label: 'Getting started', path: `/${application}/getting-started` },
      { label: 'Another guide', path: `/${application}/another-guide` },
    ]
    assert.deepEqual(orderPages({ label: 'User guide', pages }).map((page) => page.label),
      ['Introduction', 'Getting started', 'Another guide', 'Troubleshooting'])
    assert.equal(pages[1].label, 'Troubleshooting')
  }
})

test('other content groups retain their original order', () => {
  const pages = [{ label: 'Troubleshooting' }, { label: 'Introduction' }]
  assert.deepEqual(orderPages({ label: 'Evaluation tasks', pages }), pages)
})

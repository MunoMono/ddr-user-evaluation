import assert from 'node:assert/strict'
import test from 'node:test'
import { currentHeading } from '../src/utils/page-contents.js'

test('tracks the section at the reading position and the final section at the bottom', () => {
  const headings = [{ id: 'one', top: 200 }, { id: 'two', top: 500 }, { id: 'three', top: 900 }]
  assert.equal(currentHeading(headings, 100, false), 'one')
  assert.equal(currentHeading(headings, 500, false), 'two')
  assert.equal(currentHeading(headings, 501, true), 'three')
  assert.equal(currentHeading(headings, 501, true, 'two'), 'two')
  assert.equal(currentHeading(headings, 501, true, 'one'), 'three')
  assert.equal(currentHeading([], 100, false), null)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { annotationsForImage } from '../src/utils/annotations.js'

test('annotations preserve labelled marker positions and allow unannotated screenshots', () => {
  const marker = { number: 1, x: 0, y: 100, label: 'The search field' }
  assert.deepEqual(annotationsForImage({ '/image.png': [marker] }, '/image.png'), [marker])
  assert.deepEqual(annotationsForImage({}, '/image.png'), [])
})

test('invalid positions, labels and duplicate marker numbers are rejected', () => {
  const marker = { number: 1, x: 20, y: 50, label: 'Control' }
  for (const entries of [[{ ...marker, x: 101 }], [{ ...marker, y: 0.5 }], [{ ...marker, label: '' }], [marker, marker], 'invalid']) {
    assert.throws(() => annotationsForImage({ '/image.png': entries }, '/image.png'), /annotations|annotation/i)
  }
})

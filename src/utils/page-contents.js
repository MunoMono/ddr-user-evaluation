export function currentHeading(headings, threshold, atBottom, targetId) {
  if (!headings.length) return null
  const target = headings.find((heading) => heading.id === targetId)
  const targetAtTop = target && target.top >= threshold - 72 && target.top <= threshold + 2
  if (atBottom && !targetAtTop) return headings[headings.length - 1].id
  let current = headings[0].id
  for (const heading of headings) {
    if (heading.top > threshold) break
    current = heading.id
  }
  return current
}

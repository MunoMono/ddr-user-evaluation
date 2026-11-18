export function annotationsForImage(registry, key) {
  const annotations = registry[key]
  if (annotations === undefined) return []
  if (!Array.isArray(annotations)) throw new Error(`Annotations for ${key} must be an array.`)

  const numbers = new Set()
  for (const item of annotations) {
    if (!item || !Number.isInteger(item.number) || item.number < 1 ||
        !Number.isInteger(item.x) || item.x < 0 || item.x > 100 ||
        !Number.isInteger(item.y) || item.y < 0 || item.y > 100 ||
        typeof item.label !== 'string' || !item.label.trim() || numbers.has(item.number)) {
      throw new Error(`Invalid annotation for ${key}: use unique positive numbers, a label, and integer x/y percentages from 0 to 100.`)
    }
    numbers.add(item.number)
  }
  return annotations
}

import { toString } from 'mdast-util-to-string'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

function containsLink(node) {
  return node.type === 'link' || node.type === 'linkReference' || (node.children || []).some(containsLink)
}

export function parseHomeContent(markdown, sections) {
  const nodes = unified().use(remarkParse).parse(markdown).children
  const start = nodes.findIndex((node) => node.type === 'html' && node.value === '<!-- application-tiles -->')
  const end = nodes.findIndex((node) => node.type === 'html' && node.value === '<!-- /application-tiles -->')
  if (start < 0 || end <= start) throw new Error('Home Markdown requires application-tiles markers.')

  const tileNodes = nodes.slice(start + 1, end)
  const paths = new Set(sections.map((section) => section.path))
  const tiles = []
  for (let index = 0; index < tileNodes.length; index += 2) {
    const heading = tileNodes[index]
    const paragraph = tileNodes[index + 1]
    const link = heading?.children?.[0]
    if (heading?.type !== 'heading' || heading.depth !== 3 || heading.children.length !== 1 ||
        link?.type !== 'link' || !paths.has(link.url) || !toString(link).trim() ||
        paragraph?.type !== 'paragraph' || containsLink(paragraph) ||
        !toString(paragraph).trim()) {
      throw new Error('Each home tile needs a linked application heading and one non-empty paragraph without links.')
    }
    tiles.push({
      path: link.url,
      label: toString(link),
      description: markdown.slice(paragraph.position.start.offset, paragraph.position.end.offset),
    })
    paths.delete(link.url)
  }
  if (paths.size) throw new Error('Home Markdown must contain one tile for each application.')

  return {
    introduction: markdown.slice(0, nodes[start].position.start.offset),
    tiles,
    details: markdown.slice(nodes[end].position.end.offset),
  }
}

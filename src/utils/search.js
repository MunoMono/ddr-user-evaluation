import remarkParse from 'remark-parse'
import { unified } from 'unified'

const parser = unified().use(remarkParse)

function textFromMarkdown(markdown) {
  const text = []
  function visit(node) {
    if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'code') {
      text.push(node.value)
    } else if (node.type === 'image' && node.alt) {
      text.push(node.alt)
    }
    for (const child of node.children || []) visit(child)
  }
  visit(parser.parse(markdown))
  return text.join(' ')
}

export function createSearchIndex(sections) {
  return sections.map((section) => ({
    ...section,
    pages: section.pages.map((page) => ({
      ...page,
      searchText: `${section.label} ${page.groupLabel || ''} ${page.contentType || ''} ${page.label} ${textFromMarkdown(page.content)}`.toLowerCase(),
    })),
  }))
}

export function searchDocumentation(index, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return index
    .map((section) => ({
      ...section,
      pages: section.pages.filter((page) => terms.every((term) => page.searchText.includes(term))),
    }))
    .filter((section) => section.pages.length > 0)
}

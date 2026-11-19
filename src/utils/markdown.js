import GithubSlugger from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

function visitHeadings(node, callback) {
  if (node.type === 'heading') callback(node)
  for (const child of node.children || []) visitHeadings(child, callback)
}

export function annotateHeadings(tree, slugger = new GithubSlugger()) {
  const contents = []
  visitHeadings(tree, (heading) => {
    const text = toString(heading)
    const id = slugger.slug(text)
    heading.data ||= {}
    heading.data.hProperties = { ...heading.data.hProperties, id }
    if (heading.depth === 2) contents.push({ id, text })
  })
  return contents
}

export function pageContents(markdown) {
  return annotateHeadings(unified().use(remarkParse).parse(markdown))
}

export function headingIds({ precedingMarkdown } = {}) {
  return (tree) => {
    const slugger = new GithubSlugger()
    if (precedingMarkdown) annotateHeadings(unified().use(remarkParse).parse(precedingMarkdown), slugger)
    annotateHeadings(tree, slugger)
  }
}

export function standaloneLinks() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'paragraph') {
        const content = node.children.filter((child) => child.type !== 'text' || child.value.trim())
        const link = content.length === 1 ? content[0] : null
        if ((link?.type === 'link' || link?.type === 'linkReference')
            && !link.children.some((child) => child.type === 'image')) {
          link.data ||= {}
          link.data.hProperties = { ...link.data.hProperties, 'data-standalone': true }
        }
      }
      for (const child of node.children || []) visit(child)
    }
    visit(tree)
  }
}

export function figureNumbers() {
  return (tree) => {
    let number = 0
    function visit(node) {
      if (node.type === 'paragraph' && node.children?.length === 1 && node.children[0].type === 'image') {
        const image = node.children[0]
        image.data ||= {}
        image.data.hProperties = {
          ...image.data.hProperties,
          'data-figure-number': ++number,
          'data-image-key': image.url,
        }
      } else if (node.type === 'code' && node.lang === 'screenshot-placeholder') {
        node.data ||= {}
        node.data.hProperties = { ...node.data.hProperties, 'data-figure-number': ++number }
      }
      for (const child of node.children || []) visit(child)
    }
    visit(tree)
  }
}

export function imageUrl(url, base) {
  return url.startsWith('/images/') ? `${base}${url.slice(1)}` : url
}

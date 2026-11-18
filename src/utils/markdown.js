import GithubSlugger from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

function visitHeadings(node, callback) {
  if (node.type === 'heading') callback(node)
  for (const child of node.children || []) visitHeadings(child, callback)
}

export function annotateHeadings(tree) {
  const slugger = new GithubSlugger()
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

export function headingIds() {
  return (tree) => { annotateHeadings(tree) }
}

export function imageUrl(url, base) {
  return url.startsWith('/images/') ? `${base}${url.slice(1)}` : url
}

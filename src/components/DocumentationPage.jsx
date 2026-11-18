import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from '@carbon/react'
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import { Link, useLocation } from 'react-router-dom'
import { sections } from '../content/navigation.js'
import { headingIds, imageUrl, pageContents } from '../utils/markdown.js'
import { createSearchIndex, searchDocumentation } from '../utils/search.js'

const searchIndex = createSearchIndex(sections)

export default function DocumentationPage({ section, page }) {
  const [query, setQuery] = useState('')
  const readingRef = useRef(null)
  const contents = useMemo(() => pageContents(page.content), [page.content])
  const results = useMemo(() => searchDocumentation(searchIndex, query), [query])
  const resultCount = results.reduce((count, item) => count + item.pages.length, 0)
  const { hash } = useLocation()

  useEffect(() => {
    document.title = `${page.label} | ${section.label} | DDR user evaluation`
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      target?.scrollIntoView()
    } else {
      readingRef.current?.scrollTo(0, 0)
    }
  }, [section.label, page.label, page.path, hash])

  return (
    <div className="documentation-layout">
      <aside className="documentation-sidebar" aria-label="Documentation navigation">
        <div className="documentation-sidebar__header">
          <h2>Table of contents</h2>
          <Search
            id="documentation-search"
            labelText="Search all documentation"
            placeholder="Search all documentation"
            closeButtonLabelText="Clear search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
          />
          {query.trim() && (
            <p className="documentation-search-status" role="status">
              {resultCount === 0
                ? 'No matching pages'
                : `${resultCount} matching ${resultCount === 1 ? 'page' : 'pages'}`}
            </p>
          )}
        </div>
        <nav className="documentation-navigation" aria-label="Table of contents" tabIndex={0}>
          {results.map((item) => (
            <div className="documentation-navigation__section" key={item.path}>
              <h3>{item.label}</h3>
              <ul>
                {item.pages.map((entry) => (
                  <li key={entry.path}>
                    <Link to={entry.path} aria-current={entry.path === page.path ? 'page' : undefined}>
                      {entry.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="documentation-reading" ref={readingRef}
        role="region" aria-label="Documentation page" tabIndex={0}>
        <div className="documentation-body">
          <div className="documentation-main">
            <div className="eyebrow">{section.label} / Documentation</div>
            <article className="markdown">
              <ReactMarkdown
                remarkPlugins={[headingIds]}
                urlTransform={(url) => defaultUrlTransform(imageUrl(url, import.meta.env.BASE_URL))}
                components={{
                  p: ({ node, children }) => {
                    const image = node.children.length === 1 && node.children[0].type === 'element'
                      && node.children[0].tagName === 'img' ? node.children[0] : null
                    return image
                      ? <figure>{children}<figcaption>{image.properties.title || image.properties.alt}</figcaption></figure>
                      : <p>{children}</p>
                  },
                }}
              >
                {page.content}
              </ReactMarkdown>
            </article>
          </div>
          {contents.length > 0 && (
            <aside className="documentation-contents">
              <nav aria-label="On this page">
                <h2>On this page</h2>
                <ul>{contents.map((heading) => (
                  <li key={heading.id}><a href={`#${encodeURIComponent(heading.id)}`}>{heading.text}</a></li>
                ))}</ul>
              </nav>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

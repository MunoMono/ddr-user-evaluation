import { useEffect, useMemo, useRef, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, Search } from '@carbon/react'
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import { Link, useLocation } from 'react-router-dom'
import { contentTypes, sections } from '../content/navigation.js'
import { figureNumbers, headingIds, imageUrl, pageContents } from '../utils/markdown.js'
import { createSearchIndex, searchDocumentation } from '../utils/search.js'
import ScreenshotFigure, { ScreenshotPlaceholder } from './ScreenshotFigure.jsx'

const searchIndex = createSearchIndex(sections)
const resolveUrl = (url) => defaultUrlTransform(imageUrl(url, import.meta.env.BASE_URL))

function DocumentationNavigation({ section, page, results, query }) {
  const [expanded, setExpanded] = useState({ [`${section.path}:${page.groupLabel}`]: true })
  const searching = Boolean(query.trim())

  useEffect(() => {
    const key = `${section.path}:${page.groupLabel}`
    setExpanded((current) => current[key] ? current : { ...current, [key]: true })
  }, [section.path, page.groupLabel])

  return (
    <nav className="documentation-navigation" aria-label="Table of contents" tabIndex={0}>
      {results.map((item) => (
        <div className="documentation-navigation__section" key={item.path}>
          <h3>{item.label}</h3>
          {contentTypes.map((group) => {
            const pages = item.pages.filter((entry) => entry.groupLabel === group)
            if (!pages.length) return null
            const key = `${item.path}:${group}`
            return (
              <details key={key} open={searching || Boolean(expanded[key])}
                onToggle={(event) => {
                  if (searching) return
                  const isOpen = event.currentTarget.open
                  setExpanded((current) => Boolean(current[key]) === isOpen
                    ? current : { ...current, [key]: isOpen })
                }}>
                <summary>{group}</summary>
                <ul>
                  {pages.map((entry) => (
                    <li key={entry.path}>
                      <Link to={entry.path} aria-current={entry.path === page.path ? 'page' : undefined}>
                        {entry.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function PageMetadata({ section, page }) {
  const fields = [
    ['Application', section.label],
    ['Content type', page.contentType],
    ['Page identifier', page.metadata?.id],
    ['Application version', page.metadata?.applicationVersion],
    ['Documentation version', page.metadata?.documentationVersion],
    ['Last reviewed', page.metadata?.lastReviewed],
  ].filter(([, value]) => value)
  return (
    <dl className="documentation-metadata">
      {fields.map(([label, value]) => (
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
      ))}
    </dl>
  )
}

function PageLinks({ section, page }) {
  const pages = section.pages.filter((entry) => entry.groupLabel === page.groupLabel)
  const index = pages.findIndex((entry) => entry.path === page.path)
  const previous = pages[index - 1]
  const next = pages[index + 1]
  if (!previous && !next) return null

  return (
    <nav className="documentation-page-links" aria-label={`More pages in ${page.groupLabel}`}>
      {previous && <Link to={previous.path}><span>Previous</span>{previous.label}</Link>}
      {next && <Link to={next.path}><span>Next</span>{next.label}</Link>}
    </nav>
  )
}

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
        <DocumentationNavigation section={section} page={page} results={results} query={query} />
      </aside>
      <div className="documentation-reading" ref={readingRef}
        role="region" aria-label="Documentation page" tabIndex={0}>
        <div className="documentation-body">
          <div className="documentation-main">
            <Breadcrumb noTrailingSlash className="documentation-breadcrumb">
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={section.path}>{section.label}</Link></BreadcrumbItem>
              <BreadcrumbItem>{page.groupLabel}</BreadcrumbItem>
              <BreadcrumbItem aria-current="page">{page.label}</BreadcrumbItem>
            </Breadcrumb>
            <PageMetadata section={section} page={page} />
            <article className="markdown">
              <ReactMarkdown
                remarkPlugins={[headingIds, figureNumbers]}
                urlTransform={resolveUrl}
                components={{
                  a: ({ href, children, node, ...props }) => (
                    href?.startsWith('/') && !href.startsWith('//') && !href.startsWith(import.meta.env.BASE_URL)
                      ? <Link to={href} {...props}>{children}</Link>
                      : <a href={href} {...props}>{children}</a>
                  ),
                  p: ({ node, children }) => {
                    const image = node.children.length === 1 && node.children[0].type === 'element'
                      && node.children[0].tagName === 'img' ? node.children[0] : null
                    return image
                      ? <ScreenshotFigure src={resolveUrl(image.properties.src)} imageKey={image.properties['data-image-key']}
                          alt={image.properties.alt} caption={image.properties.title}
                          number={image.properties['data-figure-number']} />
                      : <p>{children}</p>
                  },
                  pre: ({ node, children }) => {
                    const code = node.children[0]
                    if (code?.properties?.className?.includes('language-screenshot-placeholder')) {
                      const caption = code.children.map((child) => child.value || '').join('').trim()
                      return <ScreenshotPlaceholder caption={caption} number={code.properties['data-figure-number']} />
                    }
                    return <pre>{children}</pre>
                  },
                }}
              >
                {page.content}
              </ReactMarkdown>
            </article>
            <PageLinks section={section} page={page} />
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

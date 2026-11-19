import { useEffect, useMemo, useRef } from 'react'
import { Breadcrumb, BreadcrumbItem } from '@carbon/react'
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import { Link, useLocation } from 'react-router-dom'
import { figureNumbers, headingIds, imageUrl, pageContents, standaloneLinks } from '../utils/markdown.js'
import DocumentationSidebar from './DocumentationSidebar.jsx'
import MarkdownLink from './MarkdownLink.jsx'
import ScreenshotFigure, { ScreenshotPlaceholder } from './ScreenshotFigure.jsx'
import PageContents from './PageContents.jsx'

const resolveUrl = (url) => defaultUrlTransform(imageUrl(url, import.meta.env.BASE_URL))

function PageMetadata({ page }) {
  const fields = [
    ['Page identifier', page.metadata?.id],
    ['Application version', page.metadata?.applicationVersion],
    ['Documentation version', page.metadata?.documentationVersion],
    ['Last reviewed', page.metadata?.lastReviewed],
  ].filter(([, value]) => value)
  if (!fields.length) return null
  return (
    <dl className="documentation-metadata">
      {fields.map(([label, value]) => (
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
      ))}
    </dl>
  )
}

function PageLinks({ section, page }) {
  const pages = section.pages.filter((entry) => entry.groupLabel === page.groupLabel && !entry.hidden)
  const index = pages.findIndex((entry) => entry.path === page.path)
  if (index === -1) return null
  const previous = pages[index - 1]
  const next = pages[index + 1]
  if (!previous && !next) return null

  return (
    <nav className="documentation-page-links" aria-label={`More pages in ${page.groupLabel}`}>
      {previous && <Link className="documentation-page-links__previous" to={previous.path}>
        <span>Previous</span>{previous.label}
      </Link>}
      {next && <Link className="documentation-page-links__next" to={next.path}>
        <span>Next</span>{next.label}
      </Link>}
    </nav>
  )
}

export default function DocumentationPage({ section, page }) {
  const readingRef = useRef(null)
  const contentRef = useRef(null)
  const contents = useMemo(() => pageContents(page.content), [page.content])
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
      <DocumentationSidebar section={section} page={page} />
      <div className="documentation-reading" ref={readingRef}
        role="region" aria-label="Documentation page" tabIndex={0}>
        <div className="documentation-body">
          <div className="documentation-main" ref={contentRef}>
            <Breadcrumb noTrailingSlash className="documentation-breadcrumb">
              <BreadcrumbItem><Link to="/">Home</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={section.path}>{section.label}</Link></BreadcrumbItem>
              <BreadcrumbItem>{page.groupLabel}</BreadcrumbItem>
              <BreadcrumbItem aria-current="page">{page.label}</BreadcrumbItem>
            </Breadcrumb>
            <PageMetadata page={page} />
            <article className="markdown">
              <ReactMarkdown
                remarkPlugins={[headingIds, figureNumbers, standaloneLinks]}
                urlTransform={resolveUrl}
                components={{
                  a: MarkdownLink,
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
                      const caption = code.children.map((child) => child.value || '').join('').trim().replace(/^Figure:\s*/i, '')
                      return <ScreenshotPlaceholder caption={caption} number={code.properties['data-figure-number']} />
                    }
                    return <pre>{children}</pre>
                  },
                }}
              >
                {page.content}
              </ReactMarkdown>
            </article>
          </div>
          <PageContents headings={contents} contentRef={contentRef} scrollRootRef={readingRef} />
        </div>
        <PageLinks section={section} page={page} />
      </div>
    </div>
  )
}

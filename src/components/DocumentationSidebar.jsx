import { useEffect, useMemo, useState } from 'react'
import { Search } from '@carbon/react'
import { Link } from 'react-router-dom'
import { contentTypes, sections } from '../content/navigation.js'
import { createSearchIndex, searchDocumentation } from '../utils/search.js'

const searchIndex = createSearchIndex(sections)

export default function DocumentationSidebar({ section, page }) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(() => section && page
    ? { [`${section.path}:${page.groupLabel}`]: true } : {})
  const searching = Boolean(query.trim())
  const results = useMemo(() => searchDocumentation(searchIndex, query), [query])
  const resultCount = results.reduce((count, item) => count + item.pages.length, 0)

  useEffect(() => {
    if (!section || !page) return
    const key = `${section.path}:${page.groupLabel}`
    setExpanded((current) => current[key] ? current : { ...current, [key]: true })
  }, [section, page])

  return (
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
        {searching && (
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
                        <Link to={entry.path} aria-current={entry.path === page?.path ? 'page' : undefined}>
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
    </aside>
  )
}

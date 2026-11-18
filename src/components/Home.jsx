import { useEffect, useRef } from 'react'
import { ClickableTile, Column, Grid, ListItem, UnorderedList } from '@carbon/react'
import { ArrowRight } from '@carbon/icons-react'
import ReactMarkdown from 'react-markdown'
import { Link, useLocation } from 'react-router-dom'
import homeContent from '../content/home.md?raw'
import { sections } from '../content/navigation.js'
import { parseHomeContent } from '../utils/home.js'
import { headingIds, pageContents } from '../utils/markdown.js'
import PageContents from './PageContents.jsx'

const { introduction, tiles, details } = parseHomeContent(homeContent, sections)
const contents = pageContents(`${introduction}\n\n${details}`)
const markdownComponents = {
  a: ({ href, children, node, ...props }) => (
    href?.startsWith('/') && !href.startsWith('//')
      ? <Link to={href} {...props}>{children}</Link>
      : <a href={href} {...props}>{children}</a>
  ),
  ul: ({ node, ...props }) => <UnorderedList {...props} />,
  li: ({ node, ...props }) => <ListItem {...props} />,
}

export default function Home() {
  const contentRef = useRef(null)
  const { hash } = useLocation()
  useEffect(() => {
    document.title = 'DDR user evaluation'
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [hash])
  return (
    <div className="home-layout">
      <div className="home-main" ref={contentRef}>
      <div className="home-hero">
        <Grid className="page-grid">
          <Column sm={4} md={7} lg={11}>
            <article className="markdown">
              <ReactMarkdown remarkPlugins={[headingIds]} components={markdownComponents}>{introduction}</ReactMarkdown>
            </article>
          </Column>
        </Grid>
      </div>
      <Grid className="page-grid home-sections">
        {tiles.map((tile, index) => (
          <Column sm={4} md={4} lg={5} key={tile.path}>
            <ClickableTile as={Link} to={tile.path} href={tile.path} className="section-tile">
              <span className="section-tile__number">0{index + 1}</span>
              <h3>{tile.label}</h3>
              <ReactMarkdown>{tile.description}</ReactMarkdown>
              <span className="section-tile__action">View documentation <ArrowRight size={16} aria-hidden="true" /></span>
            </ClickableTile>
          </Column>
        ))}
      </Grid>
      <Grid className="page-grid home-details">
        <Column sm={4} md={7} lg={11}>
          <article className="markdown">
            <ReactMarkdown remarkPlugins={[[headingIds, { precedingMarkdown: introduction }]]}
              components={markdownComponents}>{details}</ReactMarkdown>
          </article>
        </Column>
      </Grid>
      </div>
      <PageContents headings={contents} contentRef={contentRef} />
    </div>
  )
}

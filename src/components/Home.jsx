import { useEffect, useRef } from 'react'
import { ClickableTile, Column, Grid } from '@carbon/react'
import { ArrowRight } from '@carbon/icons-react'
import ReactMarkdown from 'react-markdown'
import { Link, useLocation } from 'react-router-dom'
import homeContent from '../content/home.md?raw'
import { sections } from '../content/navigation.js'
import { parseHomeContent } from '../utils/home.js'
import { headingIds, standaloneLinks } from '../utils/markdown.js'
import DocumentationSidebar from './DocumentationSidebar.jsx'
import MarkdownLink from './MarkdownLink.jsx'

const { introduction, tiles, details } = parseHomeContent(homeContent, sections)
const markdownComponents = {
  a: MarkdownLink,
}

export default function Home() {
  const readingRef = useRef(null)
  const { hash } = useLocation()
  useEffect(() => {
    document.title = 'DDR user evaluation'
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    else readingRef.current?.scrollTo(0, 0)
  }, [hash])
  return (
    <div className="documentation-layout">
      <DocumentationSidebar />
      <div className="documentation-reading" ref={readingRef}
        role="region" aria-label="Home page" tabIndex={0}>
        <div className="home-layout">
          <div className="home-hero">
            <img src={`${import.meta.env.BASE_URL}images/uat_landinghero.jpg`}
              alt="Boxes of Royal College of Art records in the V&A Archive of Art and Design" />
            <Grid className="page-grid home-hero__content">
              <Column sm={4} md={7} lg={11}>
                <ReactMarkdown remarkPlugins={[standaloneLinks]} components={markdownComponents}>{introduction}</ReactMarkdown>
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
                <ReactMarkdown remarkPlugins={[headingIds, standaloneLinks]} components={markdownComponents}>{details}</ReactMarkdown>
              </article>
            </Column>
          </Grid>
        </div>
      </div>
    </div>
  )
}

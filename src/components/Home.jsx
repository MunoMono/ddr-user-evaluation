import { useEffect } from 'react'
import { Button, Column, Grid, Tile } from '@carbon/react'
import { ArrowRight } from '@carbon/icons-react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import homeContent from '../content/home.md?raw'
import { sections } from '../content/navigation.js'

export default function Home() {
  useEffect(() => { document.title = 'DDR user evaluation' }, [])
  return (
    <>
      <div className="home-hero">
        <Grid className="page-grid">
          <Column sm={4} md={7} lg={11}>
            <article className="markdown">
              <ReactMarkdown components={{
                a: ({ href, children, node, ...props }) => (
                  href?.startsWith('/') && !href.startsWith('//')
                    ? <Link to={href} {...props}>{children}</Link>
                    : <a href={href} {...props}>{children}</a>
                ),
              }}>{homeContent}</ReactMarkdown>
            </article>
          </Column>
        </Grid>
      </div>
      <Grid className="page-grid home-sections">
        {sections.map((section, index) => (
          <Column sm={4} md={4} lg={5} key={section.path}>
            <Tile className="section-tile">
              <span className="section-tile__number">0{index + 1}</span>
              <h3>{section.label}</h3>
              <Button as={Link} to={section.path} kind="ghost" renderIcon={ArrowRight}>
                View documentation
              </Button>
            </Tile>
          </Column>
        ))}
      </Grid>
    </>
  )
}

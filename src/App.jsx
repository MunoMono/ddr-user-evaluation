import { lazy, Suspense, useEffect, useState } from 'react'
import { Button, Column, GlobalTheme, Grid, InlineLoading, Tile } from '@carbon/react'
import { ArrowRight } from '@carbon/icons-react'
import { Link, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import { sections } from './content/navigation.js'

const STORAGE_KEY = 'ddr-user-evaluation-theme'
const DocumentationPage = lazy(() => import('./components/DocumentationPage.jsx'))

function initialTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'g10' || stored === 'g90') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'g90' : 'g10'
}

function Home() {
  useEffect(() => { document.title = 'DDR user evaluation' }, [])
  return (
    <>
      <div className="home-hero">
        <Grid className="page-grid">
          <Column sm={4} md={7} lg={11}>
            <p className="eyebrow">Research documentation</p>
            <h1>DDR user evaluation</h1>
            <p className="home-hero__intro">
              A documentation environment for the DDR user evaluation. Explore the sections below
              for guidance as it becomes available.
            </p>
          </Column>
        </Grid>
      </div>
      <Grid className="page-grid home-sections">
        <Column sm={4} md={8} lg={16}>
          <div className="section-heading">
            <div><p className="eyebrow">Explore</p><h2>Documentation sections</h2></div>
            <p>Choose a section to view its documentation.</p>
          </div>
        </Column>
        {sections.map((section, index) => (
          <Column sm={4} md={4} lg={5} key={section.path}>
            <Tile className="section-tile">
              <span className="section-tile__number">0{index + 1}</span>
              <h3>{section.label}</h3>
              <p>{section.description}</p>
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

function NotFound() {
  useEffect(() => { document.title = 'Page not found | DDR user evaluation' }, [])
  return (
    <Grid className="page-grid not-found">
      <Column sm={4} md={8} lg={10}>
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The requested documentation page could not be found.</p>
        <Button as={Link} to="/" renderIcon={ArrowRight}>Return to home</Button>
      </Column>
    </Grid>
  )
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme)
  const toggleTheme = () => {
    const next = theme === 'g10' ? 'g90' : 'g10'
    window.localStorage.setItem(STORAGE_KEY, next)
    setTheme(next)
  }

  return (
    <GlobalTheme theme={theme}>
      <div className={`theme-root cds--${theme}`}>
        <AppShell theme={theme} toggleTheme={toggleTheme}>
          <Routes>
            <Route path="/" element={<Home />} />
            {sections.flatMap((section) => section.pages.map((page) => (
              <Route key={page.path} path={page.path}
                element={
                  <Suspense fallback={<InlineLoading description="Loading documentation" />}>
                    <DocumentationPage section={section} page={page} />
                  </Suspense>
                } />
            )))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </div>
    </GlobalTheme>
  )
}

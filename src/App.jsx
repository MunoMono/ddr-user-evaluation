import { lazy, Suspense, useEffect, useState } from 'react'
import { Button, Column, GlobalTheme, Grid, InlineLoading } from '@carbon/react'
import { ArrowRight } from '@carbon/icons-react'
import { Link, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import { sections } from './content/navigation.js'

const STORAGE_KEY = 'ddr-user-evaluation-theme'
const Home = lazy(() => import('./components/Home.jsx'))
const DocumentationPage = lazy(() => import('./components/DocumentationPage.jsx'))

function initialTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'g10' || stored === 'g90') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'g90' : 'g10'
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
            <Route path="/" element={
              <Suspense fallback={<InlineLoading description="Loading home page" />}>
                <Home />
              </Suspense>
            } />
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

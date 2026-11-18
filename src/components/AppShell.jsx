import { useEffect, useRef, useState } from 'react'
import {
  Content, Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuButton,
  HeaderMenuItem, HeaderName, HeaderNavigation, SideNav, SideNavItems,
  SideNavLink, SkipToContent,
} from '@carbon/react'
import { Light, Moon } from '@carbon/icons-react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { sections } from '../content/navigation.js'

export default function AppShell({ children, theme, toggleTheme }) {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const mainRef = useRef(null)
  const previousPath = useRef(location.pathname)
  const isDocumentation = sections.some((section) =>
    section.pages.some((page) => matchPath({ path: page.path, end: true }, location.pathname)),
  )

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      setExpanded(false)
      mainRef.current?.focus()
      window.scrollTo(0, 0)
      previousPath.current = location.pathname
    }
  }, [location.pathname])

  return (
    <div className={`app-shell${isDocumentation ? ' app-shell--documentation' : ''}`}>
      <SkipToContent href="#main-content" />
      <Header aria-label="Graham Newman RCA PhD">
        <HeaderMenuButton
          aria-label={expanded ? 'Close navigation menu' : 'Open navigation menu'}
          isActive={expanded}
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        />
        <HeaderName as={Link} to="/" prefix="">Graham Newman RCA PhD</HeaderName>
        <HeaderNavigation aria-label="Primary navigation">
          {sections.map((section) => (
            <HeaderMenuItem key={section.path} as={Link} to={section.path}
              isCurrentPage={location.pathname === section.path || location.pathname.startsWith(`${section.path}/`)}>
              {section.label}
            </HeaderMenuItem>
          ))}
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label={theme === 'g90' ? 'Switch to light theme' : 'Switch to dark theme'}
            tooltipAlignment="end"
            onClick={toggleTheme}
          >
            {theme === 'g90' ? <Light size={20} /> : <Moon size={20} />}
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <SideNav aria-label="Mobile navigation" expanded={expanded} isPersistent={false}
        onOverlayClick={() => setExpanded(false)}>
        <SideNavItems>
          {sections.map((section) => (
            <SideNavLink key={section.path} as={Link} to={section.path}
              onClick={() => setExpanded(false)}
              isActive={location.pathname === section.path || location.pathname.startsWith(`${section.path}/`)}>
              {section.label}
            </SideNavLink>
          ))}
        </SideNavItems>
      </SideNav>
      <Content id="main-content" ref={mainRef} tabIndex={-1} className="app-shell__content">
        {children}
      </Content>
      <footer className="site-footer">
        <div>DDR user evaluation <span aria-hidden="true">/</span> Documentation framework</div>
        <div>Public documentation only</div>
      </footer>
    </div>
  )
}

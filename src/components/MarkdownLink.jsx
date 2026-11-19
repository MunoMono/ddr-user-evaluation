import { Link as CarbonLink } from '@carbon/react'
import { ArrowRight } from '@carbon/icons-react'
import { Link as RouterLink } from 'react-router-dom'

export default function MarkdownLink({ href, children, node, ...props }) {
  const standalone = Boolean(node?.properties?.['data-standalone'])
  const opensArchive = href === 'https://ddrarchive.org' || href === 'https://ddrarchive.org/'
  const internal = href?.startsWith('/') && !href.startsWith('//') && !href.startsWith(import.meta.env.BASE_URL)

  return (
    <CarbonLink
      {...props}
      href={href}
      as={internal ? RouterLink : undefined}
      to={internal ? href : undefined}
      inline={!standalone}
      renderIcon={standalone ? ArrowRight : undefined}
      target={opensArchive ? '_blank' : undefined}
      rel={opensArchive ? 'noopener noreferrer' : undefined}
    >
      {children}
      {opensArchive && <span className="cds--visually-hidden"> (opens in a new tab)</span>}
    </CarbonLink>
  )
}

import { useEffect, useState } from 'react'
import { currentHeading } from '../utils/page-contents.js'

export default function PageContents({ headings, contentRef, scrollRootRef }) {
  const [active, setActive] = useState(headings[0]?.id)

  useEffect(() => {
    const content = contentRef.current
    const root = scrollRootRef?.current
    if (!content || !headings.length) return

    let frame
    const update = () => {
      frame = undefined
      const scrollsInside = root && getComputedStyle(root).overflowY !== 'visible'
      const scroller = scrollsInside ? root : document.scrollingElement
      const top = scrollsInside ? root.getBoundingClientRect().top : 48
      const maxScroll = scroller.scrollHeight - scroller.clientHeight
      const positions = headings.flatMap(({ id }) => {
        const element = document.getElementById(id)
        return element && content.contains(element) ? [{ id, top: element.getBoundingClientRect().top }] : []
      })
      const target = positions.find(({ id }) => `#${encodeURIComponent(id)}` === window.location.hash)
      const atBottom = maxScroll > 1 && scroller.scrollTop >= maxScroll - 1
      setActive(currentHeading(positions, top + 64, atBottom, target?.id))
    }
    const schedule = () => {
      if (frame === undefined) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(content)
    if (root) observer.observe(root)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    root?.addEventListener('scroll', schedule, { passive: true })
    schedule()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      root?.removeEventListener('scroll', schedule)
      if (frame !== undefined) cancelAnimationFrame(frame)
    }
  }, [headings, contentRef, scrollRootRef])

  if (!headings.length) return null
  return (
    <aside className="page-contents">
      <nav aria-label="On this page">
        <ul>{headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${encodeURIComponent(heading.id)}`}
              aria-current={active === heading.id ? 'location' : undefined}>
              {heading.text}
            </a>
          </li>
        ))}</ul>
      </nav>
    </aside>
  )
}

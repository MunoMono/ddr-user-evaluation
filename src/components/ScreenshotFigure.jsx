import { useRef, useState } from 'react'
import { Modal } from '@carbon/react'
import { Maximize } from '@carbon/icons-react'
import { screenshotAnnotations } from '../content/screenshot-annotations.js'
import { annotationsForImage } from '../utils/annotations.js'

function ScreenshotImage({ src, alt, annotations, enlarged = false }) {
  return (
    <span className={`screenshot__image${enlarged ? ' screenshot__image--enlarged' : ''}`}>
      <img src={src} alt={alt} />
      {annotations.map((item) => (
        <span key={item.number} aria-hidden="true"
          className={`screenshot__marker screenshot__x-${item.x} screenshot__y-${item.y}`}>
          {item.number}
        </span>
      ))}
    </span>
  )
}

function AnnotationList({ annotations }) {
  if (annotations.length === 0) return null
  return (
    <ol className="screenshot__annotations" aria-label="Screenshot annotations">
      {annotations.map((item) => <li key={item.number} value={item.number}>{item.label}</li>)}
    </ol>
  )
}

export default function ScreenshotFigure({ src, imageKey, alt, caption, number }) {
  const [open, setOpen] = useState(false)
  const launcherRef = useRef(null)
  if (!alt?.trim()) throw new Error(`Screenshot ${imageKey} requires descriptive alternative text.`)
  const annotations = annotationsForImage(screenshotAnnotations, imageKey)
  const title = caption || alt

  return (
    <figure className="screenshot">
      <button ref={launcherRef} type="button" className="screenshot__trigger"
        aria-label={`Enlarge figure ${number}: ${alt}`} onClick={() => setOpen(true)}>
        <ScreenshotImage src={src} alt={alt} annotations={annotations} />
      </button>
      <figcaption>Figure {number}. {title}</figcaption>
      <p className="screenshot__hint"><Maximize size={16} aria-hidden="true" /> Select the image to enlarge it.</p>
      <AnnotationList annotations={annotations} />
      <Modal open={open} onRequestClose={() => setOpen(false)} launcherButtonRef={launcherRef}
        modalHeading={`Figure ${number}. ${title}`} closeButtonLabel="Close enlarged image"
        passiveModal hasScrollingContent size="lg">
        {open && (
          <>
            <div className="screenshot__enlarged" tabIndex={0} role="region"
              aria-label="Enlarged image" data-modal-primary-focus>
              <ScreenshotImage src={src} alt={alt} annotations={annotations} enlarged />
            </div>
            <AnnotationList annotations={annotations} />
          </>
        )}
      </Modal>
    </figure>
  )
}

export function ScreenshotPlaceholder({ caption, number }) {
  return (
    <figure className="screenshot screenshot--placeholder">
      <div className="screenshot__placeholder">Screenshot placeholder</div>
      <figcaption>Figure {number}. {caption}</figcaption>
    </figure>
  )
}

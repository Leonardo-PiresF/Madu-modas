'use client'

import Image from 'next/image'
import { useRef, useState, ViewTransition } from 'react'

export type GalleryPhoto = { src: string; thumb: string; alt: string; focal: string }

/**
 * Galeria da página de produto.
 * Celular: fotos lado a lado com rolagem por arrasto e contador.
 * Computador: foto grande e miniaturas em compartimentos.
 */
export function Gallery({ photos, morphName }: { photos: GalleryPhoto[]; morphName: string }) {
  const [index, setIndex] = useState(0)
  const track = useRef<HTMLDivElement>(null)

  const goTo = (i: number) => {
    setIndex(i)
    const el = track.current
    if (el) el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = track.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== index) setIndex(i)
  }

  if (!photos.length) {
    return (
      <div className="gallery">
        <div className="gallery__frame">
          <div className="photo photo--portrait photo--empty" />
        </div>
      </div>
    )
  }

  return (
    <div className="gallery">
      <div className="gallery__frame">
        <div className="gallery__track" ref={track} onScroll={onScroll} aria-label="Fotos da peça" tabIndex={0}>
          {photos.map((p, i) => {
            const img = (
              <div className="photo photo--portrait">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 900px) 100vw, 640px"
                  style={{ objectFit: 'cover', objectPosition: p.focal }}
                />
              </div>
            )
            return (
              <div className="gallery__slide" key={p.src} aria-hidden={i !== index}>
                {i === 0 ? (
                  <ViewTransition name={morphName} share="morph" default="none">
                    {img}
                  </ViewTransition>
                ) : (
                  img
                )}
              </div>
            )
          })}
        </div>
        {photos.length > 1 ? (
          <span className="gallery__counter" aria-live="polite">
            {index + 1} / {photos.length}
          </span>
        ) : null}
      </div>

      {photos.length > 1 ? (
        <div className="grid gallery__thumbs" style={{ gridTemplateColumns: `repeat(${Math.max(4, photos.length)}, minmax(0, 1fr))` }}>
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              className="gallery__thumb"
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => goTo(i)}
            >
              <span className="photo photo--square">
                <Image src={p.thumb} alt="" fill sizes="140px" style={{ objectFit: 'cover', objectPosition: p.focal }} />
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

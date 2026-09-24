import Image from 'next/image'
import type { Media } from '@/payload-types'

/** Fotos guardadas no próprio site viram caminho relativo (o otimizador do Next não busca no próprio host). */
const toLocal = (url: string) => {
  const origin = process.env.NEXT_PUBLIC_SERVER_URL
  return origin && url.startsWith(origin) ? url.slice(origin.length) : url
}

type Props = {
  media: Media | null
  /** 'square' nas grades de compartimento, 'portrait' na página de produto. */
  shape?: 'square' | 'portrait'
  sizes: string
  priority?: boolean
  label?: string
}

/** Foto da loja. Sem foto cadastrada, mostra o espaço nude reservado. */
export function Photo({ media, shape = 'square', sizes, priority, label }: Props) {
  const className = `photo photo--${shape}`
  if (!media?.url) {
    return (
      <div className={`${className} photo--empty`} aria-hidden={label ? undefined : true}>
        {label ? <span>{label}</span> : null}
      </div>
    )
  }
  const variant = media.sizes?.[shape]
  const src = toLocal(variant?.url || media.url)
  return (
    <div className={className}>
      <Image
        src={src}
        alt={media.alt || ''}
        fill
        sizes={sizes}
        priority={priority}
        style={{
          objectFit: 'cover',
          objectPosition: `${media.focalX ?? 50}% ${media.focalY ?? 50}%`,
        }}
      />
    </div>
  )
}

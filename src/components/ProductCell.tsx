import Link from 'next/link'
import { ViewTransition } from 'react'
import type { Product } from '@/payload-types'
import { coverOf } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { Photo } from './Photo'

type Props = {
  product: Product
  sizes: string
  eyebrow?: string
  /** Liga a transição da foto até a página do produto. Uma vez por produto na página. */
  morph?: boolean
}

export function ProductCell({ product, sizes, eyebrow, morph = true }: Props) {
  const photo = <Photo media={coverOf(product)} sizes={sizes} />
  const colors = new Set((product.variants ?? []).map((v) => v.color).filter(Boolean)).size
  const soldOut = isSoldOut(product)
  return (
    <Link href={`/produto/${product.slug}`} className="cell cell--product">
      {morph ? (
        <ViewTransition name={`produto-${product.id}`} share="morph" default="none">
          {photo}
        </ViewTransition>
      ) : (
        photo
      )}
      {soldOut ? <span className="cell__tag">Esgotado</span> : null}
      {eyebrow ? <span className="cell__eyebrow">{eyebrow}</span> : null}
      <span className="cell__name">{product.name}</span>
      <span className="cell__price">
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <s className="cell__old">{formatPrice(product.compareAtPrice)}</s>
        ) : null}
        {formatPrice(product.price)}
      </span>
      {colors > 1 ? <span className="cell__meta">{colors} cores</span> : null}
    </Link>
  )
}

export const isSoldOut = (product: Product) =>
  product.hasVariants
    ? !(product.variants ?? []).some((v) => (v.stock ?? 0) > 0)
    : (product.stock ?? 0) <= 0

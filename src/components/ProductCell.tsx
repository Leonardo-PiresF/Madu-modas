import Link from 'next/link'
import type { Product } from '@/payload-types'
import { coverOf } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { Photo } from './Photo'

export function ProductCell({ product, sizes, eyebrow }: { product: Product; sizes: string; eyebrow?: string }) {
  return (
    <Link href={`/produto/${product.slug}`} className="cell cell--product">
      <Photo media={coverOf(product)} sizes={sizes} />
      {eyebrow ? <span className="cell__eyebrow">{eyebrow}</span> : null}
      <span className="cell__name">{product.name}</span>
      <span className="cell__price">{formatPrice(product.price)}</span>
    </Link>
  )
}

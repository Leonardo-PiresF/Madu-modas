'use client'

import { cartCount, useCart } from '@/lib/cart'

/** Número de peças na sacola, usado no cabeçalho. */
export function CartCount({ variant }: { variant: 'text' | 'badge' }) {
  const count = cartCount(useCart())
  if (variant === 'badge') {
    return count ? <span className="bag-badge">{count}</span> : null
  }
  return <>{count}</>
}

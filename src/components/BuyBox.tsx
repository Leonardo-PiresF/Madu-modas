'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { addToCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format'

type Variant = { id?: string | null; size?: string | null; color?: string | null; colorHex?: string | null; stock: number }

export type BuyProduct = {
  id: number | string
  slug: string
  name: string
  price: number
  hasVariants: boolean
  variants: Variant[]
  stock: number
  variantLabel?: string | null
  image?: string | null
}

const LOW_STOCK = 3

export function BuyBox({ product, whatsapp }: { product: BuyProduct; whatsapp: string | null }) {
  const colors = useMemo(() => {
    const map = new Map<string, string | null>()
    for (const v of product.variants) if (v.color && !map.has(v.color)) map.set(v.color, v.colorHex ?? null)
    return [...map.entries()].map(([name, hex]) => ({ name, hex }))
  }, [product.variants])

  const firstAvailableColor = colors.find((c) => product.variants.some((v) => v.color === c.name && v.stock > 0))?.name
  const [color, setColor] = useState<string | undefined>(firstAvailableColor ?? colors[0]?.name)
  const [size, setSize] = useState<string | undefined>()
  const [added, setAdded] = useState(false)

  const sizes = useMemo(() => {
    const list = product.variants.filter((v) => v.size && (!colors.length || v.color === color))
    const seen = new Map<string, number>()
    for (const v of list) seen.set(v.size as string, (seen.get(v.size as string) ?? 0) + v.stock)
    return [...seen.entries()].map(([name, stock]) => ({ name, stock }))
  }, [product.variants, color, colors.length])

  const needsSize = product.hasVariants && sizes.length > 0
  const selected = product.hasVariants
    ? product.variants.find((v) => (!colors.length || v.color === color) && (!needsSize || v.size === size))
    : undefined
  const stock = product.hasVariants ? (selected?.stock ?? 0) : product.stock
  const soldOut = product.hasVariants ? !product.variants.some((v) => v.stock > 0) : product.stock <= 0
  const ready = !soldOut && (!product.hasVariants || (selected && selected.stock > 0))

  const label = product.hasVariants
    ? [needsSize ? size : null, colors.length ? color : null].filter(Boolean).join(' · ')
    : product.variantLabel || ''

  const add = () => {
    if (!ready) return
    addToCart({
      key: `${product.id}:${selected?.id ?? 'unico'}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantLabel: label || undefined,
      price: product.price,
      image: product.image,
      maxStock: stock,
    })
    setAdded(true)
  }

  const waText = `Oi, Madu! Tenho uma dúvida sobre ${product.name}${label ? ` (${label})` : ''}.`
  const waHref = whatsapp ? `${whatsapp}?text=${encodeURIComponent(waText)}` : null
  const buttonText = soldOut ? 'Esgotado' : needsSize && !size ? 'Escolha o tamanho' : 'Adicionar à sacola'

  return (
    <div className="buy">
      {colors.length ? (
        <fieldset className="buy__group">
          <legend className="label label--dark">
            Cor: <span className="buy__value">{color}</span>
          </legend>
          <div className="swatches">
            {colors.map((c) => {
              const available = product.variants.some((v) => v.color === c.name && v.stock > 0)
              return (
                <button
                  key={c.name}
                  type="button"
                  className="swatch"
                  aria-label={c.name}
                  aria-pressed={c.name === color}
                  disabled={!available}
                  onClick={() => {
                    setColor(c.name)
                    setSize(undefined)
                    setAdded(false)
                  }}
                >
                  <span style={{ background: c.hex || 'var(--foto-vazia)' }} />
                </button>
              )
            })}
          </div>
        </fieldset>
      ) : null}

      {needsSize ? (
        <fieldset className="buy__group">
          <div className="buy__row">
            <legend className="label label--dark">Tamanho</legend>
            <Link href="/ajuda/medidas" className="buy__link">
              Tabela de medidas
            </Link>
          </div>
          <div className="grid sizes" style={{ gridTemplateColumns: `repeat(${Math.min(Math.max(sizes.length, 4), 6)}, minmax(0, 1fr))` }}>
            {sizes.map((s) => (
              <button
                key={s.name}
                type="button"
                className="size"
                aria-pressed={s.name === size}
                disabled={s.stock <= 0}
                onClick={() => {
                  setSize(s.name)
                  setAdded(false)
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
          {size && stock > 0 && stock < LOW_STOCK ? (
            <p className="buy__note">
              {stock === 1 ? 'Resta 1' : `Restam ${stock}`} no tamanho {size}.
            </p>
          ) : null}
        </fieldset>
      ) : !product.hasVariants && product.variantLabel ? (
        <p className="buy__note">{product.variantLabel}</p>
      ) : null}

      <div className="buy__actions">
        <button type="button" className="btn btn--primary buy__add" onClick={add} disabled={!ready}>
          {buttonText}
        </button>
        {added ? (
          <p className="buy__added" role="status">
            Adicionado à sacola. <Link href="/sacola">Ver sacola</Link>
          </p>
        ) : null}
        {waHref ? (
          <a href={waHref} target="_blank" rel="noopener" className="buy__link">
            Ficou em dúvida no tamanho? Chama a gente no WhatsApp
          </a>
        ) : null}
      </div>

      {/* Barra fixa no celular */}
      <div className="buy__sticky">
        <div className="buy__sticky-info">
          {label ? <span>{label}</span> : null}
          <strong>{formatPrice(product.price)}</strong>
        </div>
        <button type="button" className="btn btn--primary" onClick={add} disabled={!ready}>
          {added ? 'Na sacola' : buttonText}
        </button>
      </div>
    </div>
  )
}

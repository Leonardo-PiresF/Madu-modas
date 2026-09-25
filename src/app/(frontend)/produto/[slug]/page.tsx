import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BuyBox, type BuyProduct } from '@/components/BuyBox'
import { Gallery, type GalleryPhoto } from '@/components/Gallery'
import { ProductCell } from '@/components/ProductCell'
import { asMedia, coverOf, getProductBySlug, getRelated, getSettings } from '@/lib/data'
import { formatPrice, whatsappLink } from '@/lib/format'
import type { Category } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 60

/** Tira a origem do próprio site para o otimizador de imagens do Next. */
const local = (url?: string | null) => {
  if (!url) return ''
  const origin = process.env.NEXT_PUBLIC_SERVER_URL
  return origin && url.startsWith(origin) ? url.slice(origin.length) : url
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const cover = coverOf(product)
  return {
    title: product.name,
    description: product.description?.slice(0, 155) || `${product.name} por ${formatPrice(product.price)} na Madu, Paulo Afonso.`,
    openGraph: cover?.sizes?.portrait?.url ? { images: [cover.sizes.portrait.url] } : undefined,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [settings, related] = await Promise.all([getSettings(), getRelated(product)])

  const category = typeof product.category === 'object' ? (product.category as Category) : null
  const parent = category?.parent && typeof category.parent === 'object' ? (category.parent as Category) : null

  const photos: GalleryPhoto[] = (product.images ?? [])
    .map(asMedia)
    .filter((m) => m !== null)
    .map((m) => ({
      src: local(m.sizes?.portrait?.url || m.url),
      thumb: local(m.sizes?.thumb?.url || m.url),
      alt: m.alt || product.name,
      focal: `${m.focalX ?? 50}% ${m.focalY ?? 50}%`,
    }))

  const buy: BuyProduct = {
    id: product.id,
    slug: product.slug || '',
    name: product.name,
    price: product.price,
    hasVariants: Boolean(product.hasVariants),
    variants: (product.variants ?? []).map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      stock: v.stock ?? 0,
    })),
    stock: product.stock ?? 0,
    variantLabel: product.variantLabel,
    image: photos[0]?.thumb ?? null,
  }

  const conditions = [
    settings.pixDiscount ? `${settings.pixDiscount}% de desconto no Pix` : null,
    settings.maxInstallments ? `até ${settings.maxInstallments}x sem juros` : null,
  ].filter(Boolean)

  const details = [
    { title: 'Sobre a peça', text: product.description, open: true },
    { title: 'Medidas e caimento', text: product.measurements },
    { title: 'Composição e cuidados', text: product.care },
    { title: 'Trocas e devoluções', text: settings.returnsPolicy },
  ].filter((d) => d.text)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    image: photos.map((p) => p.src),
    brand: { '@type': 'Brand', name: 'Madu' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: product.price,
      availability: (
        product.hasVariants ? (product.variants ?? []).some((v) => (v.stock ?? 0) > 0) : (product.stock ?? 0) > 0
      )
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <div className="product">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Você está em" className="breadcrumb product__breadcrumb">
        <span>
          <Link href="/">Início</Link>
        </span>
        {parent ? (
          <span>
            <Link href={`/categoria/${parent.slug}`}>{parent.name}</Link>
          </span>
        ) : null}
        {category ? (
          <span>
            <Link href={`/categoria/${category.slug}`}>{category.name}</Link>
          </span>
        ) : null}
      </nav>

      <div className="product__main">
        <Gallery photos={photos} morphName={`produto-${product.id}`} />

        <div className="product__info">
          <div className="product__title">
            {category ? (
              <span className="label">{parent ? `${parent.name} · ${category.name}` : category.name}</span>
            ) : null}
            <h1 className="h2">{product.name}</h1>
            <p className="product__price">
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <s>{formatPrice(product.compareAtPrice)}</s>
              ) : null}
              {formatPrice(product.price)}
            </p>
            {conditions.length ? <p className="product__conditions">{conditions.join(' · ')}</p> : null}
          </div>

          <BuyBox product={buy} whatsapp={whatsappLink(settings.whatsapp)} />

          <p className="product__pickup">
            O frete é calculado pelo CEP na sacola. Em Paulo Afonso você também pode retirar com a gente.
          </p>

          {details.length ? (
            <div className="details">
              {details.map((d) => (
                <details key={d.title} open={d.open}>
                  <summary>{d.title}</summary>
                  <p>{d.text}</p>
                </details>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="section section--related" aria-labelledby="h-combina">
          <div className="section__head">
            <span className="label">Para completar</span>
            <h2 id="h-combina" className="h3">
              Combina com
            </h2>
          </div>
          <div className="grid grid--four">
            {related.map((p) => {
              const c = typeof p.category === 'object' ? (p.category as Category) : null
              return (
                <ProductCell
                  key={p.id}
                  product={p}
                  sizes="(max-width: 900px) 45vw, 300px"
                  eyebrow={c?.name}
                />
              )
            })}
          </div>
        </section>
      ) : null}
    </div>
  )
}

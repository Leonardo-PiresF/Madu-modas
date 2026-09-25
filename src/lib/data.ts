import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import type { Category, Media, Product, StoreSetting } from '@/payload-types'

export const getClient = cache(async () => getPayload({ config }))

export const getSettings = cache(async (): Promise<StoreSetting> => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'store-settings', depth: 1 })
})

/** Categorias principais, na ordem definida no painel. */
export const getMainCategories = cache(async (): Promise<Category[]> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'categories',
    where: { parent: { exists: false } },
    sort: 'order',
    depth: 1,
    limit: 20,
  })
  return res.docs
})

export const getNewProducts = cache(async (limit = 6): Promise<Product[]> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'products',
    where: { and: [{ active: { equals: true } }, { isNew: { equals: true } }] },
    sort: '-createdAt',
    depth: 1,
    limit,
  })
  return res.docs
})

export const getEstojo = cache(async (): Promise<Product[]> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'products',
    where: { and: [{ active: { equals: true } }, { inEstojo: { equals: true } }] },
    sort: '-updatedAt',
    depth: 1,
    limit: 8,
  })
  return res.docs
})

/** Devolve a foto quando o relacionamento veio populado. */
export const asMedia = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in value ? (value as Media) : null

export const coverOf = (product: Product): Media | null =>
  asMedia(Array.isArray(product.images) ? product.images[0] : null)

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const payload = await getClient()
  const res = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, depth: 1, limit: 1 })
  return res.docs[0] ?? null
})

export const getSubcategories = cache(async (parentId: number | string): Promise<Category[]> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'categories',
    where: { parent: { equals: parentId } },
    sort: 'order',
    depth: 0,
    limit: 50,
  })
  return res.docs
})

export type ListingSort = 'novidades' | 'menor-preco' | 'maior-preco'
export type PriceBand = 'ate-100' | '100-200' | 'acima-200'

export const PRICE_BANDS: Record<PriceBand, { label: string; min?: number; max?: number }> = {
  'ate-100': { label: 'Até R$ 100', max: 100 },
  '100-200': { label: 'R$ 100 a R$ 200', min: 100, max: 200 },
  'acima-200': { label: 'Acima de R$ 200', min: 200 },
}

type ListingArgs = {
  categoryIds?: (number | string)[]
  onlyNew?: boolean
  size?: string
  color?: string
  price?: PriceBand
  sort?: ListingSort
  limit: number
}

/** Produtos visíveis de uma lista de categorias, com filtros vindos da URL. */
export const getListing = async ({ categoryIds, onlyNew, size, color, price, sort, limit }: ListingArgs) => {
  const payload = await getClient()
  const and: Where[] = [{ active: { equals: true } }]
  if (categoryIds?.length) and.push({ category: { in: categoryIds } })
  if (onlyNew) and.push({ isNew: { equals: true } })
  if (size) and.push({ 'variants.size': { equals: size } })
  if (color) and.push({ 'variants.color': { equals: color } })
  const band = price ? PRICE_BANDS[price] : undefined
  if (band?.min !== undefined) and.push({ price: { greater_than_equal: band.min } })
  if (band?.max !== undefined) and.push({ price: { less_than: band.max } })

  const res = await payload.find({
    collection: 'products',
    where: { and },
    sort: sort === 'menor-preco' ? 'price' : sort === 'maior-preco' ? '-price' : '-createdAt',
    depth: 1,
    limit,
  })
  return { docs: res.docs, total: res.totalDocs }
}

/** Tamanhos e cores disponíveis nas peças de uma lista de categorias (para os filtros). */
export const getFacets = cache(async (key: string, categoryIds: (number | string)[]) => {
  void key
  const payload = await getClient()
  const res = await payload.find({
    collection: 'products',
    where: {
      and: [{ active: { equals: true } }, ...(categoryIds.length ? [{ category: { in: categoryIds } }] : [])],
    },
    depth: 0,
    limit: 500,
    select: { variants: true },
  })
  const sizes = new Set<string>()
  const colors = new Set<string>()
  for (const p of res.docs) {
    for (const v of p.variants ?? []) {
      if (v.size) sizes.add(v.size)
      if (v.color) colors.add(v.color)
    }
  }
  return { sizes: sortSizes([...sizes]), colors: [...colors].sort((a, b) => a.localeCompare(b, 'pt-BR')) }
})

const SIZE_ORDER = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'EXG', 'U', 'ÚNICO']
const sortSizes = (list: string[]) =>
  list.sort((a, b) => {
    const na = Number(a)
    const nb = Number(b)
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
    const ia = SIZE_ORDER.indexOf(a.toUpperCase())
    const ib = SIZE_ORDER.indexOf(b.toUpperCase())
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'products',
    where: { and: [{ slug: { equals: slug } }, { active: { equals: true } }] },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
})

/** "Combina com": os escolhidos no painel; se vazio, peças de outras categorias. */
export const getRelated = async (product: Product): Promise<Product[]> => {
  const chosen = (product.related ?? []).filter((r): r is Product => typeof r === 'object' && r !== null && r.active !== false)
  if (chosen.length) return chosen.slice(0, 4)
  const payload = await getClient()
  const categoryId = typeof product.category === 'object' ? product.category.id : product.category
  const res = await payload.find({
    collection: 'products',
    where: { and: [{ active: { equals: true } }, { category: { not_equals: categoryId } }, { id: { not_equals: product.id } }] },
    sort: '-createdAt',
    depth: 1,
    limit: 4,
  })
  return res.docs
}

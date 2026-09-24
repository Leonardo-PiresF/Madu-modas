import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
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

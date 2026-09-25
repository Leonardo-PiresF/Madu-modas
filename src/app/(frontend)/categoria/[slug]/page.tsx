import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Listing, PAGE_SIZE, pageOf, readParams } from '@/components/Listing'
import { getCategoryBySlug, getFacets, getListing, getMainCategories, getSubcategories } from '@/lib/data'
import type { Category } from '@/payload-types'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'todas') return { title: 'Todas as peças' }
  const category = await getCategoryBySlug(slug)
  return category ? { title: category.name } : {}
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const filters = readParams(await searchParams)
  const limit = PAGE_SIZE * pageOf(filters)

  // "Todas": a loja inteira, sem subcategorias
  if (slug === 'todas') {
    const [facets, { docs, total }] = await Promise.all([
      getFacets('todas', []),
      getListing({ size: filters.tamanho, color: filters.cor, price: filters.preco, sort: filters.ordem, limit }),
    ])
    const mains = await getMainCategories()
    return (
      <Listing
        title="Todas as peças"
        basePath="/categoria/todas"
        breadcrumb={[{ label: 'Início', href: '/' }, { label: 'Todas as peças' }]}
        chips={[
          { label: 'Tudo', href: '/categoria/todas', active: true },
          ...mains.map((c) => ({ label: c.name, href: `/categoria/${c.slug}`, active: false })),
        ]}
        facets={facets}
        params={filters}
        products={docs}
        total={total}
      />
    )
  }

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  // Se for subcategoria, a principal é o "pai"; as abas mostram as irmãs.
  const parent = category.parent && typeof category.parent === 'object' ? (category.parent as Category) : null
  const main = parent ?? category
  const subs = await getSubcategories(main.id)
  const categoryIds = parent ? [category.id] : [category.id, ...subs.map((s) => s.id)]

  const [facets, { docs, total }] = await Promise.all([
    getFacets(`cat-${category.id}`, categoryIds),
    getListing({
      categoryIds,
      size: filters.tamanho,
      color: filters.cor,
      price: filters.preco,
      sort: filters.ordem,
      limit,
    }),
  ])

  const breadcrumb = parent
    ? [
        { label: 'Início', href: '/' },
        { label: parent.name, href: `/categoria/${parent.slug}` },
        { label: category.name },
      ]
    : [{ label: 'Início', href: '/' }, { label: category.name }]

  const chips = subs.length
    ? [
        { label: 'Tudo', href: `/categoria/${main.slug}`, active: !parent },
        ...subs.map((s) => ({ label: s.name, href: `/categoria/${s.slug}`, active: s.id === category.id })),
      ]
    : undefined

  return (
    <Listing
      title={parent ? category.name : main.name}
      basePath={`/categoria/${category.slug}`}
      breadcrumb={breadcrumb}
      chips={chips}
      facets={facets}
      params={filters}
      products={docs}
      total={total}
    />
  )
}

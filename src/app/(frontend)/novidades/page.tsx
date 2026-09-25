import type { Metadata } from 'next'
import { Listing, PAGE_SIZE, pageOf, readParams } from '@/components/Listing'
import { getFacets, getListing } from '@/lib/data'

export const metadata: Metadata = { title: 'Novidades' }

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function NovidadesPage({ searchParams }: Props) {
  const filters = readParams(await searchParams)
  const [facets, { docs, total }] = await Promise.all([
    getFacets('novidades', []),
    getListing({
      onlyNew: true,
      size: filters.tamanho,
      color: filters.cor,
      price: filters.preco,
      sort: filters.ordem,
      limit: PAGE_SIZE * pageOf(filters),
    }),
  ])
  return (
    <Listing
      title="Novidades"
      basePath="/novidades"
      breadcrumb={[{ label: 'Início', href: '/' }, { label: 'Novidades' }]}
      facets={facets}
      params={filters}
      products={docs}
      total={total}
    />
  )
}

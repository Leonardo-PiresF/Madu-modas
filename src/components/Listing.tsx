import Link from 'next/link'
import type { Product } from '@/payload-types'
import { PRICE_BANDS, type ListingSort, type PriceBand } from '@/lib/data'
import { ProductCell } from './ProductCell'

export const PAGE_SIZE = 12

export type ListingParams = {
  tamanho?: string
  cor?: string
  preco?: PriceBand
  ordem?: ListingSort
  pagina?: string
}

/** Lê os filtros da URL de forma segura. */
export const readParams = (sp: Record<string, string | string[] | undefined>): ListingParams => {
  const one = (k: string) => (typeof sp[k] === 'string' ? (sp[k] as string) : undefined)
  const preco = one('preco')
  const ordem = one('ordem')
  return {
    tamanho: one('tamanho'),
    cor: one('cor'),
    preco: preco && preco in PRICE_BANDS ? (preco as PriceBand) : undefined,
    ordem: ordem === 'menor-preco' || ordem === 'maior-preco' ? ordem : undefined,
    pagina: one('pagina'),
  }
}

export const pageOf = (p: ListingParams) => Math.max(1, Number(p.pagina) || 1)

const hrefWith = (base: string, params: ListingParams, change: Partial<ListingParams>) => {
  const merged = { ...params, pagina: undefined, ...change }
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, String(v))
  const s = qs.toString()
  return s ? `${base}?${s}` : base
}

type Chip = { label: string; href: string; active: boolean }

type Props = {
  title: string
  basePath: string
  breadcrumb: { label: string; href?: string }[]
  chips?: Chip[]
  facets: { sizes: string[]; colors: string[] }
  params: ListingParams
  products: Product[]
  total: number
}

function FilterMenu({
  label,
  current,
  options,
}: {
  label: string
  current?: string
  options: { label: string; href: string; active: boolean }[]
}) {
  return (
    <details className="filter">
      <summary className={`filter__button${current ? ' filter__button--on' : ''}`}>
        {current ? `${label}: ${current}` : label}
      </summary>
      <div className="filter__panel">
        {options.map((o) => (
          <Link key={o.href} href={o.href} scroll={false} aria-current={o.active ? 'true' : undefined}>
            {o.label}
          </Link>
        ))}
      </div>
    </details>
  )
}

export function Listing({ title, basePath, breadcrumb, chips, facets, params, products, total }: Props) {
  const page = pageOf(params)
  const hasFilters = Boolean(params.tamanho || params.cor || params.preco)
  const sortOptions: { value?: ListingSort; label: string }[] = [
    { value: undefined, label: 'Novidades' },
    { value: 'menor-preco', label: 'Menor preço' },
    { value: 'maior-preco', label: 'Maior preço' },
  ]
  const sortLabel = sortOptions.find((o) => o.value === params.ordem)?.label ?? 'Novidades'

  return (
    <div className="listing">
      <nav aria-label="Você está em" className="breadcrumb">
        {breadcrumb.map((b, i) => (
          <span key={i}>
            {b.href ? <Link href={b.href}>{b.label}</Link> : <span aria-current="page">{b.label}</span>}
          </span>
        ))}
      </nav>

      <div className="listing__head">
        <h1 className="display">{title}</h1>
        <span className="listing__count">
          {total} {total === 1 ? 'peça' : 'peças'}
        </span>
      </div>

      {chips?.length ? (
        <nav aria-label="Subcategorias" className="chips">
          {chips.map((c) => (
            <Link key={c.href} href={c.href} className="chip" aria-current={c.active ? 'page' : undefined}>
              {c.label}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="toolbar">
        <div className="toolbar__filters">
          {facets.sizes.length ? (
            <FilterMenu
              label="Tamanho"
              current={params.tamanho}
              options={[
                { label: 'Todos', href: hrefWith(basePath, params, { tamanho: undefined }), active: !params.tamanho },
                ...facets.sizes.map((s) => ({
                  label: s,
                  href: hrefWith(basePath, params, { tamanho: s }),
                  active: params.tamanho === s,
                })),
              ]}
            />
          ) : null}
          {facets.colors.length ? (
            <FilterMenu
              label="Cor"
              current={params.cor}
              options={[
                { label: 'Todas', href: hrefWith(basePath, params, { cor: undefined }), active: !params.cor },
                ...facets.colors.map((c) => ({
                  label: c,
                  href: hrefWith(basePath, params, { cor: c }),
                  active: params.cor === c,
                })),
              ]}
            />
          ) : null}
          <FilterMenu
            label="Preço"
            current={params.preco ? PRICE_BANDS[params.preco].label : undefined}
            options={[
              { label: 'Todos', href: hrefWith(basePath, params, { preco: undefined }), active: !params.preco },
              ...(Object.keys(PRICE_BANDS) as PriceBand[]).map((k) => ({
                label: PRICE_BANDS[k].label,
                href: hrefWith(basePath, params, { preco: k }),
                active: params.preco === k,
              })),
            ]}
          />
          {hasFilters ? (
            <Link href={hrefWith(basePath, params, { tamanho: undefined, cor: undefined, preco: undefined })} className="toolbar__clear">
              Limpar filtros
            </Link>
          ) : null}
        </div>
        <FilterMenu
          label={`Ordenar: ${sortLabel}`}
          options={sortOptions.map((o) => ({
            label: o.label,
            href: hrefWith(basePath, params, { ordem: o.value }),
            active: params.ordem === o.value,
          }))}
        />
      </div>

      {products.length ? (
        <>
          <div className="grid grid--listing">
            {products.map((p) => (
              <ProductCell key={p.id} product={p} sizes="(max-width: 900px) 45vw, 300px" />
            ))}
          </div>
          <div className="listing__more">
            <span>
              Mostrando {products.length} de {total} {total === 1 ? 'peça' : 'peças'}
            </span>
            {products.length < total ? (
              <Link href={hrefWith(basePath, params, { pagina: String(page + 1) })} scroll={false} className="btn btn--outline">
                Ver mais peças
              </Link>
            ) : null}
          </div>
        </>
      ) : (
        <div className="listing__empty">
          <p className="lead">Nenhuma peça por aqui com esses filtros.</p>
          {hasFilters ? (
            <Link href={basePath} className="btn btn--outline btn--small">
              Ver tudo
            </Link>
          ) : null}
        </div>
      )}
    </div>
  )
}

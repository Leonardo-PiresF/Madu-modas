'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Item = { id: number | string; name: string; slug?: string | null }

/** Menu de categorias do cabeçalho, marcando a categoria aberta. */
export function HeaderNav({ items }: { items: Item[] }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Categorias" className="header__nav">
      {items.map((c) => {
        const href = `/categoria/${c.slug}`
        const active = pathname === href || pathname.startsWith(`${href}-`)
        return (
          <Link key={c.id} href={href} aria-current={active ? 'page' : undefined}>
            {c.name}
          </Link>
        )
      })}
    </nav>
  )
}

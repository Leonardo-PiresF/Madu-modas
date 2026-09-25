import Link from 'next/link'
import type { Category } from '@/payload-types'
import { CartCount } from './CartCount'
import { HeaderNav } from './HeaderNav'

export function SiteHeader({ categories }: { categories: Category[] }) {
  return (
    <>
      <p className="topbar">
        <span className="topbar__long">Entrega e retirada em Paulo Afonso, BA · Envio para todo o Brasil</span>
        <span className="topbar__short">Paulo Afonso, BA · Envio para o Brasil</span>
      </p>
      <header className="header">
        <button
          type="button"
          className="header__icon header__menu-btn"
          popoverTarget="menu"
          aria-label="Abrir menu"
        >
          <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
            <path d="M1 1h20M1 7h20M1 13h20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" className="header__logo" aria-label="Madu, página inicial">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/madu-logo-principal-rosa.svg" alt="Madu" width={104} height={52} />
        </Link>

        <HeaderNav items={categories} />

        <div className="header__actions">
          <Link href="/busca" className="header__text-link">
            Buscar
          </Link>
          <Link href="/sacola" className="header__text-link">
            Sacola (<CartCount variant="text" />)
          </Link>
          <Link href="/sacola" className="header__icon header__bag" aria-label="Sacola">
            <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
              <path d="M2 7h16l-1.2 14H3.2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M6.5 7V5a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <CartCount variant="badge" />
          </Link>
        </div>
      </header>

      <div id="menu" popover="auto" className="menu">
        <button type="button" className="menu__close" popoverTarget="menu" popoverTargetAction="hide" aria-label="Fechar menu">
          Fechar
        </button>
        <nav aria-label="Categorias">
          {categories.map((c) => (
            <Link key={c.id} href={`/categoria/${c.slug}`}>
              {c.name}
            </Link>
          ))}
          <Link href="/busca">Buscar</Link>
        </nav>
      </div>
    </>
  )
}

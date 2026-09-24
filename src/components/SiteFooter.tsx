import Link from 'next/link'
import type { Category, StoreSetting } from '@/payload-types'
import { whatsappLink } from '@/lib/format'

export function SiteFooter({ categories, settings }: { categories: Category[]; settings: StoreSetting }) {
  const wa = whatsappLink(settings.whatsapp, 'Oi, Madu! Vim pelo site.')
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer__top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/madu-logo-principal-nude.svg" alt="Madu" className="footer__logo" width={150} height={75} />
        <div className="footer__cols">
          <div className="footer__col">
            <span className="label label--light">Loja</span>
            {categories.map((c) => (
              <Link key={c.id} href={`/categoria/${c.slug}`}>
                {c.name}
              </Link>
            ))}
          </div>
          <div className="footer__col">
            <span className="label label--light">Ajuda</span>
            <Link href="/ajuda/trocas">Trocas e devoluções</Link>
            <Link href="/ajuda/entrega">Entrega e retirada</Link>
            <Link href="/ajuda/pagamento">Pagamento</Link>
            <Link href="/ajuda/medidas">Tabela de medidas</Link>
          </div>
          <div className="footer__col">
            <span className="label label--light">Contato</span>
            {wa ? (
              <a href={wa} target="_blank" rel="noopener">
                WhatsApp
              </a>
            ) : null}
            {settings.instagram ? (
              <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener">
                Instagram @{settings.instagram}
              </a>
            ) : null}
            <span>Paulo Afonso, Bahia</span>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {year} Madu · Paulo Afonso, BA</span>
        <span>Loja de família</span>
      </div>
    </footer>
  )
}

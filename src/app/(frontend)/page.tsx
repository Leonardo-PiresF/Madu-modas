import Link from 'next/link'
import { Photo } from '@/components/Photo'
import { ProductCell } from '@/components/ProductCell'
import { asMedia, getEstojo, getMainCategories, getNewProducts, getSettings } from '@/lib/data'
import { whatsappLink } from '@/lib/format'

export const revalidate = 60

const HERO_LABELS = [
  'close · brinco',
  'textura · linho',
  'close · anel',
  'frasco · body splash',
  'close · colar',
  'detalhe · sandália',
  'textura · tricô',
  'close · pulseira',
]

export default async function HomePage() {
  const [settings, categories, novidades, estojo] = await Promise.all([
    getSettings(),
    getMainCategories(),
    getNewProducts(6),
    getEstojo(),
  ])

  const tiles = Array.from({ length: 8 }, (_, i) => settings.heroTiles?.[i] ?? null)
  const semijoias = categories.find((c) => c.slug === 'semijoias')
  const feminino = categories.find((c) => c.slug === 'feminino')
  const wa = whatsappLink(settings.whatsapp, 'Oi, Madu! Fiquei com uma dúvida sobre tamanho.')

  const conditions = [
    settings.pixDiscount ? `${settings.pixDiscount}% de desconto no Pix` : null,
    settings.maxInstallments ? `até ${settings.maxInstallments}x sem juros no cartão` : null,
    settings.freeShippingFrom
      ? `frete grátis acima de ${settings.freeShippingFrom.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
      : null,
  ].filter(Boolean)

  return (
    <>
      {/* Primeira tela: a bandeja */}
      <section className="hero">
        <div className="tray" aria-label="Destaques da loja">
          <div className="tray__grid">
            {tiles.map((tile, i) => {
              const cell = (
                <Photo
                  media={asMedia(tile?.image)}
                  sizes="(max-width: 900px) 30vw, 230px"
                  priority={i < 3}
                  label={HERO_LABELS[i]}
                />
              )
              const node = tile?.link ? (
                <Link key={i} href={tile.link} className="tray__cell">
                  {cell}
                </Link>
              ) : (
                <div key={i} className="tray__cell">
                  {cell}
                </div>
              )
              // O logo ocupa a casa do meio (posição 5 de 9).
              return i === 4
                ? [
                    <div key="logo" className="tray__cell tray__cell--logo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/brand/madu-logo-principal-nude.svg" alt="" width={150} height={75} />
                    </div>,
                    node,
                  ]
                : node
            })}
          </div>
        </div>

        <div className="hero__text">
          <span className="label">Paulo Afonso · Bahia</span>
          <h1 className="display">Cada coisa no seu lugar</h1>
          <p className="lead">Moda, semijoias e cheiro bom, escolhidos pela nossa família em Paulo Afonso.</p>
          <div className="hero__actions">
            {semijoias ? (
              <Link href={`/categoria/${semijoias.slug}`} className="btn btn--primary">
                Ver semijoias
              </Link>
            ) : null}
            {feminino ? (
              <Link href={`/categoria/${feminino.slug}`} className="btn btn--outline">
                Ver moda feminina
              </Link>
            ) : null}
          </div>
          {conditions.length ? <p className="hero__conditions">{conditions.join(' · ')}</p> : null}
        </div>
      </section>

      {/* Categorias */}
      {categories.length ? (
        <section className="section section--categories" aria-labelledby="h-categorias">
          <div className="section__head">
            <span className="label">Categorias</span>
            <h2 id="h-categorias" className="h2">
              Abra o estojo
            </h2>
          </div>
          <div className="grid grid--categories">
            {categories.map((c) => (
              <Link key={c.id} href={`/categoria/${c.slug}`} className="cell cell--category">
                <Photo media={asMedia(c.image)} sizes="(max-width: 900px) 45vw, 240px" />
                <span className="cell__title">{c.name}</span>
              </Link>
            ))}
            <Link href="/categoria/todas" className="cell cell--all">
              <span className="cell__title">Ver tudo</span>
            </Link>
          </div>
        </section>
      ) : null}

      {/* Novidades */}
      {novidades.length ? (
        <section className="section section--novidades" aria-labelledby="h-novidades">
          <div className="section__head section__head--row">
            <h2 id="h-novidades" className="h3">
              Novidades
            </h2>
            <Link href="/novidades" className="text-link">
              Ver tudo
            </Link>
          </div>
          <div className="grid grid--six">
            {novidades.map((p) => (
              <ProductCell key={p.id} product={p} sizes="(max-width: 900px) 45vw, 200px" />
            ))}
          </div>
        </section>
      ) : null}

      {/* Estojo da semana */}
      {estojo.length ? (
        <section className="section section--estojo" aria-labelledby="h-estojo">
          <div className="estojo__intro">
            <span className="label">Semijoias</span>
            <h2 id="h-estojo" className="h2">
              O estojo da semana
            </h2>
            <p>
              Brincos, colares, anéis e pulseiras para usar todo dia e para dar de presente. Toda semana a gente
              separa até oito peças para este estojo.
            </p>
            {semijoias ? (
              <Link href={`/categoria/${semijoias.slug}`} className="text-link">
                Ver todas as semijoias
              </Link>
            ) : null}
          </div>
          <div className="grid grid--four">
            {estojo.map((p) => (
              <ProductCell
                key={p.id}
                product={p}
                sizes="(max-width: 900px) 45vw, 200px"
                morph={!novidades.some((n) => n.id === p.id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Sobre */}
      <section className="section section--sobre" aria-labelledby="h-sobre">
        <div className="sobre__photo">
          <Photo
            media={asMedia(settings.aboutImage)}
            shape="portrait"
            sizes="(max-width: 900px) 90vw, 480px"
            label="foto · a família separando as peças"
          />
        </div>
        <div className="sobre__text">
          <span className="label">Quem escolhe</span>
          <h2 id="h-sobre" className="h2">
            Uma loja de família
          </h2>
          <p className="lead">
            A Madu nasceu em casa. É uma loja de família, com nome de filha caçula, onde cada peça passa pelas nossas
            mãos antes de chegar nas suas.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/madu-logo-principal-rosa.svg" alt="" width={140} height={70} className="sobre__sign" />
        </div>
      </section>

      {/* Entrega, pagamento e ajuda */}
      <section className="section section--info" aria-label="Entrega, pagamento e ajuda">
        <div className="grid grid--info">
          <div className="info">
            <h3 className="info__title">Entrega</h3>
            <p>
              Entrega e retirada em Paulo Afonso, BA, e envio para todo o Brasil. O frete é calculado pelo CEP na
              sacola.
            </p>
          </div>
          <div className="info">
            <h3 className="info__title">Pagamento</h3>
            <p>Pix e cartão de crédito.{conditions.length ? ` ${conditions.join(', ')}.` : ''}</p>
          </div>
          <div className="info">
            <h3 className="info__title">Ajuda</h3>
            <p>Ficou em dúvida no tamanho? Chama a gente no WhatsApp.</p>
            {wa ? (
              <a href={wa} target="_blank" rel="noopener" className="btn btn--outline btn--small">
                Chamar no WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

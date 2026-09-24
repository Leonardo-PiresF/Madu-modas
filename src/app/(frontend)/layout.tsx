import type { Metadata, Viewport } from 'next'
import React from 'react'
import '@fontsource/marcellus/400.css'
import '@fontsource-variable/figtree/wght.css'
import './styles.css'

import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getMainCategories, getSettings } from '@/lib/data'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'Madu · Moda, semijoias e body splash em Paulo Afonso',
    template: '%s · Madu',
  },
  description:
    'Moda feminina e masculina, semijoias, calçados e body splash escolhidos pela nossa família em Paulo Afonso, BA. Entrega e retirada na cidade e envio para todo o Brasil.',
}

export const viewport: Viewport = {
  themeColor: '#FBF6F1',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([getMainCategories(), getSettings()])

  return (
    <html lang="pt-BR">
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <SiteHeader categories={categories} />
        <main id="conteudo">{children}</main>
        <SiteFooter categories={categories} settings={settings} />
      </body>
    </html>
  )
}

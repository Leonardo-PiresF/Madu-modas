/**
 * Cria as categorias da loja. Pode rodar mais de uma vez: o que já existe é mantido.
 *   npm run seed
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const MAIN = [
  { name: 'Feminino', slug: 'feminino', order: 1, subs: ['Vestidos', 'Blusas', 'Saias', 'Calças', 'Conjuntos'] },
  { name: 'Semijoias', slug: 'semijoias', order: 2, subs: ['Brincos', 'Colares', 'Anéis', 'Pulseiras'] },
  { name: 'Masculino', slug: 'masculino', order: 3, subs: ['Camisas', 'Camisetas', 'Bermudas', 'Calças'] },
  { name: 'Calçados', slug: 'calcados', order: 4, subs: ['Femininos', 'Masculinos'] },
  { name: 'Body splash', slug: 'body-splash', order: 5, subs: [] },
]

const payload = await getPayload({ config })

for (const main of MAIN) {
  const found = await payload.find({ collection: 'categories', where: { slug: { equals: main.slug } }, limit: 1 })
  const parent =
    found.docs[0] ??
    (await payload.create({
      collection: 'categories',
      data: { name: main.name, slug: main.slug, order: main.order },
    }))

  for (const [i, sub] of main.subs.entries()) {
    const slug = `${main.slug}-${sub
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()}`
    const exists = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
    if (!exists.docs.length) {
      await payload.create({
        collection: 'categories',
        data: { name: sub, slug, parent: parent.id, order: i + 1 },
      })
    }
  }
  payload.logger.info(`Categoria pronta: ${main.name}`)
}

payload.logger.info('Categorias criadas.')
process.exit(0)

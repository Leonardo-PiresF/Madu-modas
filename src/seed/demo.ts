/**
 * Produtos de EXEMPLO para ver o site preenchido enquanto as fotos reais não chegam.
 * Todos têm "[exemplo]" no nome. Apague pelo painel antes de lançar.
 *   npm run seed:demo   (rode depois do npm run seed)
 */
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '@payload-config'

const payload = await getPayload({ config })

const TONES = ['#E2CDBD', '#E6D3C4', '#DCC6B5', '#E4CFC0', '#E0CABA', '#D9C1AF']

const makePhoto = async (i: number, alt: string) => {
  const data = await sharp({
    create: { width: 1200, height: 1500, channels: 3, background: TONES[i % TONES.length] },
  })
    .jpeg({ quality: 80 })
    .toBuffer()
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/jpeg', name: `exemplo-${i}.jpg`, size: data.length },
  })
}

const catId = async (slug: string) => {
  const res = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  if (!res.docs[0]) throw new Error(`Categoria ${slug} não existe. Rode npm run seed antes.`)
  return res.docs[0].id
}

const ITEMS = [
  { name: 'Vestido midi de alça', cat: 'feminino-vestidos', price: 189.9, sizes: ['P', 'M', 'G', 'GG'] },
  { name: 'Blusa de linho', cat: 'feminino-blusas', price: 119.9, sizes: ['P', 'M', 'G'] },
  { name: 'Camisa de linho', cat: 'masculino-camisas', price: 149.9, sizes: ['P', 'M', 'G', 'GG'] },
  { name: 'Rasteira trançada', cat: 'calcados-femininos', price: 99.9, sizes: ['34', '35', '36', '37', '38'] },
  { name: 'Body splash floral', cat: 'body-splash', price: 69.9, label: '200 ml' },
  { name: 'Argola média', cat: 'semijoias-brincos', price: 79.9, label: 'Dourada', estojo: true },
  { name: 'Colar de elos', cat: 'semijoias-colares', price: 99.9, label: 'Dourado', estojo: true },
  { name: 'Anel solitário', cat: 'semijoias-aneis', price: 69.9, label: 'Dourado', estojo: true },
  { name: 'Pulseira riviera', cat: 'semijoias-pulseiras', price: 89.9, label: 'Dourada', estojo: true },
]

for (const [i, item] of ITEMS.entries()) {
  const name = `${item.name} [exemplo]`
  const exists = await payload.find({ collection: 'products', where: { name: { equals: name } }, limit: 1 })
  if (exists.docs.length) continue
  const photo = await makePhoto(i, item.name)
  await payload.create({
    collection: 'products',
    data: {
      name,
      price: item.price,
      category: await catId(item.cat),
      images: [photo.id],
      hasVariants: Boolean(item.sizes),
      variants: item.sizes?.map((size) => ({ size, color: 'Terracota', colorHex: '#B8643F', stock: 3 })),
      stock: item.sizes ? undefined : 5,
      variantLabel: item.label,
      isNew: !item.estojo,
      inEstojo: Boolean(item.estojo),
      active: true,
    },
  })
  payload.logger.info(`Exemplo criado: ${name}`)
}

process.exit(0)

import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Foto', plural: 'Fotos' },
  admin: {
    group: 'Loja',
    description:
      'Fotos em 4:5 (vertical), fundo nude, luz de janela. O site recorta em quadrado nas grades e usa a foto inteira na página do produto.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Descrição da foto',
      type: 'text',
      required: true,
      admin: {
        description: 'Ex.: "Vestido midi terracota, visto de frente". Ajuda quem usa leitor de tela e o Google.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 240, height: 240, position: 'centre' },
      { name: 'square', width: 720, height: 720, position: 'centre' },
      { name: 'portrait', width: 1200, height: 1500, position: 'centre' },
    ],
    adminThumbnail: 'thumb',
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
}

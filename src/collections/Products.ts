import type { CollectionConfig } from 'payload'
import { slugFrom } from '../lib/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produto', plural: 'Produtos' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'active', 'updatedAt'],
    group: 'Loja',
    listSearchableFields: ['name', 'slug'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { active: { equals: true } }),
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nome da peça', type: 'text', required: true, admin: { width: '60%' } },
        {
          name: 'price',
          label: 'Preço (R$)',
          type: 'number',
          required: true,
          min: 0,
          admin: { width: '20%', step: 0.01, description: 'Ex.: 129,90' },
        },
        {
          name: 'compareAtPrice',
          label: 'Preço antigo (R$)',
          type: 'number',
          min: 0,
          admin: { width: '20%', step: 0.01, description: 'Opcional, para mostrar desconto.' },
        },
      ],
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { description: 'Escolha a subcategoria quando existir (ex.: Vestidos).' },
    },
    {
      name: 'images',
      label: 'Fotos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 8,
      admin: { description: 'A primeira foto é a capa. Ideal: frente, costas, detalhe e uma em uso.' },
    },
    {
      name: 'hasVariants',
      label: 'Tem tamanhos ou cores',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Desmarque para semijoias, body splash e peças de tamanho único.' },
    },
    {
      name: 'variants',
      label: 'Variações',
      type: 'array',
      labels: { singular: 'Variação', plural: 'Variações' },
      admin: {
        condition: (data) => Boolean(data?.hasVariants),
        description: 'Uma linha para cada combinação de tamanho e cor, com o estoque de cada uma.',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'size', label: 'Tamanho', type: 'text', admin: { width: '20%', placeholder: 'P, M, G, 36...' } },
            { name: 'color', label: 'Cor', type: 'text', admin: { width: '30%', placeholder: 'Terracota' } },
            {
              name: 'colorHex',
              label: 'Cor (código)',
              type: 'text',
              admin: { width: '20%', placeholder: '#B8643F', description: 'Opcional.' },
            },
            { name: 'stock', label: 'Estoque', type: 'number', min: 0, defaultValue: 0, required: true, admin: { width: '15%' } },
            { name: 'sku', label: 'Código', type: 'text', admin: { width: '15%' } },
          ],
        },
      ],
    },
    {
      name: 'stock',
      label: 'Estoque',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: { condition: (data) => !data?.hasVariants },
    },
    {
      name: 'variantLabel',
      label: 'Detalhe da peça',
      type: 'text',
      admin: {
        condition: (data) => !data?.hasVariants,
        description: 'Opcional. Ex.: "Dourada", "200 ml".',
      },
    },
    {
      type: 'collapsible',
      label: 'Textos da página do produto',
      fields: [
        { name: 'description', label: 'Sobre a peça', type: 'textarea', admin: { description: 'Tecido, caimento e como usar.' } },
        { name: 'measurements', label: 'Medidas e caimento', type: 'textarea' },
        { name: 'care', label: 'Composição e cuidados', type: 'textarea' },
      ],
    },
    {
      name: 'slug',
      label: 'Endereço',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Gerado sozinho a partir do nome.' },
      hooks: { beforeValidate: [slugFrom('name')] },
    },
    {
      name: 'active',
      label: 'Visível na loja',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isNew',
      label: 'Mostrar em Novidades',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'inEstojo',
      label: 'No estojo da semana',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Semijoias que aparecem em destaque na página inicial (até 8).' },
    },
    {
      name: 'related',
      label: 'Combina com',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 4,
      admin: { position: 'sidebar', description: 'Até 4 peças de outras categorias.' },
    },
  ],
}

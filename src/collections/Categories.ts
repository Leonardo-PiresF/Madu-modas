import type { CollectionConfig } from 'payload'
import { slugFrom } from '../lib/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoria', plural: 'Categorias' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'order'],
    group: 'Loja',
    description:
      'As cinco categorias principais (Feminino, Semijoias, Masculino, Calçados, Body splash) e as subcategorias de cada uma (ex.: Vestidos dentro de Feminino).',
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true },
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
      name: 'parent',
      label: 'Faz parte de',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
        description: 'Deixe vazio para categoria principal. Para subcategoria, escolha a principal.',
      },
    },
    {
      name: 'image',
      label: 'Foto da categoria',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Aparece no "Abra o estojo" da página inicial.' },
    },
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Menor aparece primeiro.' },
    },
  ],
}

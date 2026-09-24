import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pessoa da equipe', plural: 'Equipe' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
    group: 'Configurações',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      required: true,
    },
  ],
}

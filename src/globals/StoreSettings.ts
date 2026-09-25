import type { GlobalConfig } from 'payload'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  label: 'Dados da loja',
  admin: { group: 'Configurações' },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contato',
          fields: [
            {
              name: 'whatsapp',
              label: 'WhatsApp da loja',
              type: 'text',
              admin: { description: 'Só números, com DDD. Ex.: 75900000000' },
            },
            { name: 'instagram', label: 'Instagram', type: 'text', admin: { description: 'Sem o @. Ex.: madumodas' } },
            { name: 'pickupAddress', label: 'Endereço de retirada', type: 'textarea' },
            { name: 'pickupHours', label: 'Horário de retirada', type: 'text' },
          ],
        },
        {
          label: 'Pagamento e frete',
          fields: [
            {
              name: 'pixDiscount',
              label: 'Desconto no Pix (%)',
              type: 'number',
              min: 0,
              max: 50,
              admin: { description: 'Deixe vazio se não houver desconto.' },
            },
            {
              name: 'maxInstallments',
              label: 'Parcelas sem juros no cartão',
              type: 'number',
              min: 1,
              max: 12,
              admin: { description: 'Deixe vazio enquanto não estiver definido.' },
            },
            {
              name: 'freeShippingFrom',
              label: 'Frete grátis a partir de (R$)',
              type: 'number',
              min: 0,
              admin: { description: 'Deixe vazio se não houver frete grátis.' },
            },
            { name: 'localDeliveryFee', label: 'Taxa de entrega em Paulo Afonso (R$)', type: 'number', min: 0 },
          ],
        },
        {
          label: 'Textos de ajuda',
          fields: [
            {
              name: 'returnsPolicy',
              label: 'Trocas e devoluções',
              type: 'textarea',
              admin: { description: 'Aparece em todas as páginas de produto e na página de ajuda.' },
            },
          ],
        },
        {
          label: 'Página inicial',
          fields: [
            {
              name: 'heroTiles',
              label: 'Fotos da bandeja do topo',
              type: 'array',
              maxRows: 8,
              labels: { singular: 'Foto', plural: 'Fotos' },
              admin: {
                description: 'Oito closes para as casas da bandeja (o logo fica sempre no meio). Cada uma pode levar para uma página.',
              },
              fields: [
                { name: 'image', label: 'Foto', type: 'upload', relationTo: 'media', required: true },
                { name: 'link', label: 'Leva para', type: 'text', admin: { placeholder: '/categoria/semijoias' } },
              ],
            },
            {
              name: 'aboutImage',
              label: 'Foto do "Uma loja de família"',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
}

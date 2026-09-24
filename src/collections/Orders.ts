import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Pedido', plural: 'Pedidos' },
  admin: {
    useAsTitle: 'number',
    defaultColumns: ['number', 'customerName', 'total', 'status', 'createdAt'],
    group: 'Vendas',
  },
  access: {
    // Pedidos só são criados pelo servidor (checkout) e lidos pela equipe.
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'number', label: 'Número', type: 'text', required: true, unique: true, admin: { readOnly: true, width: '30%' } },
        {
          name: 'status',
          label: 'Situação',
          type: 'select',
          required: true,
          defaultValue: 'aguardando',
          admin: { width: '35%' },
          options: [
            { label: 'Aguardando pagamento', value: 'aguardando' },
            { label: 'Pago', value: 'pago' },
            { label: 'Separando', value: 'separando' },
            { label: 'Enviado', value: 'enviado' },
            { label: 'Pronto para retirar', value: 'retirada' },
            { label: 'Entregue', value: 'entregue' },
            { label: 'Cancelado', value: 'cancelado' },
          ],
        },
        { name: 'total', label: 'Total (R$)', type: 'number', required: true, admin: { readOnly: true, width: '35%' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Cliente',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'customerName', label: 'Nome', type: 'text', required: true },
            { name: 'customerEmail', label: 'E-mail', type: 'email', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'customerWhatsapp', label: 'WhatsApp', type: 'text', required: true },
            { name: 'customerCpf', label: 'CPF', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'items',
      label: 'Peças',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { readOnly: true },
      fields: [
        { name: 'product', label: 'Produto', type: 'relationship', relationTo: 'products' },
        { name: 'name', label: 'Nome', type: 'text', required: true },
        { name: 'variant', label: 'Variação', type: 'text' },
        { name: 'quantity', label: 'Qtd.', type: 'number', required: true, min: 1 },
        { name: 'unitPrice', label: 'Preço unitário', type: 'number', required: true },
      ],
    },
    {
      type: 'collapsible',
      label: 'Entrega',
      fields: [
        {
          name: 'deliveryMethod',
          label: 'Forma de entrega',
          type: 'select',
          required: true,
          options: [
            { label: 'Retirada em Paulo Afonso', value: 'retirada' },
            { label: 'Entrega em Paulo Afonso', value: 'local' },
            { label: 'Envio para outra cidade', value: 'envio' },
          ],
        },
        { name: 'deliveryCost', label: 'Valor da entrega (R$)', type: 'number', defaultValue: 0 },
        { name: 'cep', label: 'CEP', type: 'text' },
        { name: 'address', label: 'Endereço', type: 'textarea' },
        { name: 'trackingCode', label: 'Código de rastreio', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Pagamento',
      fields: [
        {
          name: 'paymentMethod',
          label: 'Forma de pagamento',
          type: 'select',
          required: true,
          options: [
            { label: 'Pix', value: 'pix' },
            { label: 'Cartão de crédito', value: 'cartao' },
          ],
        },
        { name: 'installments', label: 'Parcelas', type: 'number', defaultValue: 1 },
        { name: 'paymentProvider', label: 'Serviço de pagamento', type: 'text', admin: { readOnly: true } },
        { name: 'paymentReference', label: 'Referência do pagamento', type: 'text', admin: { readOnly: true } },
      ],
    },
    { name: 'notes', label: 'Observações internas', type: 'textarea' },
  ],
}

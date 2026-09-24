const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatPrice = (value?: number | null): string =>
  typeof value === 'number' ? brl.format(value) : ''

/** Link do WhatsApp com mensagem pronta. Número só com dígitos, com DDD. */
export const whatsappLink = (number?: string | null, text?: string): string | null => {
  const digits = (number || '').replace(/\D/g, '')
  if (!digits) return null
  const full = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${full}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

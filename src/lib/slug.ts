import type { FieldHook } from 'payload'

export const toSlug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Preenche o slug a partir de outro campo quando ele vier vazio. */
export const slugFrom =
  (source: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.trim()) return toSlug(value)
    const base = data?.[source]
    return typeof base === 'string' ? toSlug(base) : value
  }

'use client'

import { useSyncExternalStore } from 'react'

/** Sacola guardada no navegador da cliente. Os preços são conferidos de novo no servidor ao finalizar. */
export type CartItem = {
  key: string // produto + variação
  productId: number | string
  slug: string
  name: string
  variantLabel?: string
  price: number
  image?: string | null
  quantity: number
  maxStock: number
}

const STORAGE_KEY = 'madu-sacola'
const EMPTY: CartItem[] = []
let cache: CartItem[] | null = null
const listeners = new Set<() => void>()

const read = (): CartItem[] => {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cache = raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    cache = []
  }
  return cache
}

const write = (items: CartItem[]) => {
  cache = items
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* navegador sem armazenamento: a sacola dura só esta visita */
  }
  listeners.forEach((l) => l())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export const useCart = () => useSyncExternalStore(subscribe, read, () => EMPTY)

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0)

export const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
  const items = read()
  const found = items.find((i) => i.key === item.key)
  const next = found
    ? items.map((i) => (i.key === item.key ? { ...i, ...item, quantity: Math.min(i.quantity + quantity, item.maxStock) } : i))
    : [...items, { ...item, quantity: Math.min(quantity, item.maxStock) }]
  write(next)
}

export const setQuantity = (key: string, quantity: number) => {
  const items = read()
  write(
    quantity <= 0
      ? items.filter((i) => i.key !== key)
      : items.map((i) => (i.key === key ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i)),
  )
}

export const removeFromCart = (key: string) => write(read().filter((i) => i.key !== key))

export const clearCart = () => write([])

import { InvoiceItem, UnitOfMeasure } from './types'

export function debounce<T extends (id: number, field: keyof InvoiceItem, value: string | number | UnitOfMeasure) => void>(
  func: T,
  wait: number
): (id: number, field: keyof InvoiceItem, value: string | number | UnitOfMeasure) => void {
  let timeout: NodeJS.Timeout | null = null
  return (id: number, field: keyof InvoiceItem, value: string | number | UnitOfMeasure) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      timeout = null
      func(id, field, value)
    }, wait)
  }
}

export function generateInvoiceNumber(series: { nextNumber: number }, sequenceNumber?: number): string {
  const number = sequenceNumber || series.nextNumber
  return `${number}`
}

export function calculateItemTotals(item: InvoiceItem): InvoiceItem {
  const subtotal = Number((item.quantity * item.price * (1 - item.discountPercentage / 100)).toFixed(2))
  const vatAmount = Number((subtotal * (item.vatRate / 100)).toFixed(2))
  const total = Number((subtotal + vatAmount).toFixed(2))

  return {
    ...item,
    vatAmount,
    total
  }
}

export function calculateInvoiceTotals(items: InvoiceItem[]) {
  const subtotal = Number(items.reduce((sum, item) => 
    sum + item.quantity * item.price * (1 - item.discountPercentage / 100), 0
  ).toFixed(2))

  const totalVat = Number(items.reduce((sum, item) => sum + item.vatAmount, 0).toFixed(2))
  const total = Number((subtotal + totalVat).toFixed(2))

  return { subtotal, totalVat, total }
}
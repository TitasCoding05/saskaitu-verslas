export interface InvoiceSeries {
  id: string
  name: string
  description: string
  nextNumber: number
  isDefault: boolean
}

export interface UnitOfMeasure {
  id: string
  name: string
  isCustom: boolean
}

export interface VatRate {
  id: string
  name: string
  rate: number
  isCustom: boolean
}

export interface InvoiceItem {
  id: number
  name: string
  unitOfMeasure: UnitOfMeasure
  quantity: number
  price: number
  discountPercentage: number
  vatRate: number
  vatAmount: number
  total: number
  customUnitOfMeasure?: string
}

export interface Client {
  id: string
  name: string
  address: string
  country: string
  language: string
  type: 'physical' | 'legal'
  code: string
  vatCode: string
  additionalInfo: string
  phone: string
  email: string
  additionalEmails?: string[]
  bankAccounts?: BankAccount[]
}

export interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  swiftCode?: string
  bankCode?: string
  description?: string
  isDefault?: boolean
  invoiceSeries?: string[] // IDs of invoice series associated with this bank account
}

export interface InvoiceData {
  number: string
  date: string
  dueDate: string
  paymentTerms: string
  notes: string
  language: string
}
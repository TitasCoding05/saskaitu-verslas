import { 
  InvoiceSeries, 
  Client, 
  UnitOfMeasure, 
  VatRate,
  BankAccount
} from "./types"

export const DEFAULT_INVOICE_SERIES: InvoiceSeries[] = [
  {
    id: "series1",
    name: "2024 PAGRINDINĖ",
    description: "Pagrindinė sąskaitų serija 2024 metams",
    nextNumber: 1,
    isDefault: true
  },
  {
    id: "series2",
    name: "2024 PAPILDOMA",
    description: "Papildoma sąskaitų serija 2024 metams",
    nextNumber: 1,
    isDefault: false
  }
]

export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "1",
    bankName: "SEB bankas",
    accountNumber: "LT123456789012345678",
    swiftCode: "CBVILT2X",
    bankCode: "70440",
    description: "Pagrindinė atsiskaitomoji sąskaita",
    isDefault: true,
    invoiceSeries: ["series1"]
  },
  {
    id: "2", 
    bankName: "Swedbank",
    accountNumber: "LT987654321098765432",
    swiftCode: "HABALT22",
    bankCode: "73068",
    description: "Papildoma sąskaita",
    isDefault: false,
    invoiceSeries: ["series2"]
  },
  {
    id: "3",
    bankName: "DNB bankas",
    accountNumber: "LT567890123456789012",
    swiftCode: "AGBLLT2X",
    bankCode: "40100",
    description: "Verslo sąskaita",
    isDefault: false,
    invoiceSeries: []
  }
]

export const DEFAULT_CLIENTS: Client[] = [
  {
    id: "client1",
    name: "UAB Pavyzdinė Įmonė",
    address: "Gedimino pr. 1, Vilnius",
    country: "Lietuva",
    language: "lt",
    type: "legal",
    code: "123456789",
    vatCode: "LT123456789",
    additionalInfo: "Pagrindinė klientų įmonė",
    phone: "+370 5 123 4567",
    email: "info@pavyzdys.lt",
    additionalEmails: ["buhalterija@pavyzdys.lt"]
  },
  {
    id: "client2",
    name: "Vardenis Pavardenis",
    address: "Laisvės al. 10, Kaunas",
    country: "Lietuva",
    language: "lt",
    type: "physical",
    code: "45678901",
    vatCode: "",
    additionalInfo: "Individualus klientas",
    phone: "+370 612 34567",
    email: "vardenis.pavardenis@email.com"
  }
]

export const DEFAULT_UNIT_OF_MEASURES: UnitOfMeasure[] = [
  { id: "unit1", name: "vnt.", isCustom: false },
  { id: "unit2", name: "kg", isCustom: false },
  { id: "unit3", name: "val.", isCustom: false },
  { id: "unit4", name: "m²", isCustom: false }
]

export const DEFAULT_VAT_RATES: VatRate[] = [
  { id: "vat1", name: "PVM 21%", rate: 21, isCustom: false },
  { id: "vat2", name: "PVM 9%", rate: 9, isCustom: false },
  { id: "vat3", name: "PVM 0%", rate: 0, isCustom: false }
]
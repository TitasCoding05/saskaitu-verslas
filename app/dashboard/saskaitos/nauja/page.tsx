"use client"

import { useState, useEffect, useCallback } from "react"

import { InvoiceHeader } from "./components/invoice-header"
import { ClientSelection } from "./components/client-selection"
import { SellerSelection } from "./components/seller-selection"
import { InvoiceItems } from "./components/invoice-items"
import { AdditionalInfo } from "./components/additional-info"
import { InvoiceSummary } from "./components/invoice-summary"

import {
  InvoiceSeries,
  Client,
  InvoiceItem,
  UnitOfMeasure,
  VatRate,
  InvoiceData
} from "./types"
import {
  DEFAULT_INVOICE_SERIES,
  DEFAULT_CLIENTS,
  DEFAULT_UNIT_OF_MEASURES,
  DEFAULT_VAT_RATES
} from "./constants"
import { 
  generateInvoiceNumber, 
  calculateItemTotals, 
  calculateInvoiceTotals 
} from "./utils"

export default function NewInvoicePage() {
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>(DEFAULT_UNIT_OF_MEASURES)
  const [vatRates, setVatRates] = useState<VatRate[]>(DEFAULT_VAT_RATES)
  const [invoiceSeries, setInvoiceSeries] = useState<InvoiceSeries[]>(DEFAULT_INVOICE_SERIES)
  const [selectedSeries, setSelectedSeries] = useState(DEFAULT_INVOICE_SERIES[0])
  const [isInvoiceNumberLocked, setIsInvoiceNumberLocked] = useState(true)

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    number: generateInvoiceNumber(selectedSeries),
    date: new Date().toISOString().split("T")[0],
    dueDate: "2024-02-06",
    paymentTerms: "14",
    notes: "",
    language: "lt",
  })

  const [clients, setClients] = useState<Client[]>(DEFAULT_CLIENTS)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const [sellers, setSellers] = useState<Client[]>(DEFAULT_CLIENTS)
  const [selectedSeller, setSelectedSeller] = useState<Client | null>(null)

  const addNewSeller = (name: string, description: string) => {
    const newSeller: Client = {
      id: Date.now().toString(),
      name: name,
      code: '',
      email: '',
      type: 'legal',
      country: 'Lietuva',
      language: 'lt',
      address: '',
      vatCode: '',
      phone: '',
      additionalInfo: description
    }
    setSellers((prev) => [...prev, newSeller])
    setSelectedSeller(newSeller)
  }

  // Seller methods mirroring client methods

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      name: "",
      unitOfMeasure: unitOfMeasures[0],
      quantity: 1,
      price: 0,
      discountPercentage: 0,
      vatRate: 21,
      vatAmount: 0,
      total: 0,
      customUnitOfMeasure: undefined
    },
  ])

  // Removed unused addCustomUnitOfMeasure function

  const addItem = useCallback(() => {
    const newId = Math.max(...items.map((item) => item.id)) + 1
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        unitOfMeasure: unitOfMeasures[0],
        quantity: 1,
        price: 0,
        discountPercentage: 0,
        vatRate: 21,
        vatAmount: 0,
        total: 0
      },
    ])
  }, [items, unitOfMeasures])

  const removeItem = useCallback(
    (id: number) => {
      if (items.length > 1) {
        setItems((prev) => prev.filter((item) => item.id !== id))
      }
    },
    [items.length],
  )

  const updateItem = useCallback(
    (id: number, field: keyof InvoiceItem, value: string | number | UnitOfMeasure) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const updated = { ...item, [field]: value }
            const calculatedItem = calculateItemTotals(updated)
            return calculatedItem
          }
          return item
        }),
      )
    },
    [],
  )

  const { subtotal, totalVat, total } = calculateInvoiceTotals(items)

  const handleSeriesChange = (seriesId: string) => {
    const series = invoiceSeries.find((s) => s.id === seriesId)
    if (series) {
      setSelectedSeries(series)
      setInvoiceData((prev) => ({
        ...prev,
        number: generateInvoiceNumber(series),
      }))
    }
  }

  const addCustomUnitOfMeasure = useCallback((customUnit: string): UnitOfMeasure => {
    const newUnit: UnitOfMeasure = {
      id: Date.now().toString(),
      name: customUnit,
      isCustom: true
    }
    setUnitOfMeasures(prev => [...prev, newUnit])
    return newUnit
  }, [])

  const removeUnitOfMeasure = useCallback((unitId: string) => {
    setUnitOfMeasures(prev => prev.filter(unit => unit.id !== unitId))
  }, [])

  const reorderUnits = useCallback((newUnits: UnitOfMeasure[]) => {
    setUnitOfMeasures(newUnits)
  }, [])

  const addCustomVatRate = useCallback((customRate: { name: string; rate: number }): VatRate => {
    const newVatRate: VatRate = {
      id: Date.now().toString(),
      name: customRate.name,
      rate: customRate.rate,
      isCustom: true
    }
    setVatRates(prev => [...prev, newVatRate])
    return newVatRate
  }, [])

  const removeVatRate = useCallback((vatRateId: string) => {
    setVatRates(prev => prev.filter(rate => rate.id !== vatRateId))
  }, [])

  const reorderVatRates = useCallback((newVatRates: VatRate[]) => {
    setVatRates(newVatRates)
  }, [])

  const addNewSeries = (name: string, description: string) => {
    const newSeries = {
      id: Date.now().toString(),
      name: name.toUpperCase(),
      description: description,
      nextNumber: 1,
      isDefault: false,
    }
    setInvoiceSeries((prev) => [...prev, newSeries])
    setSelectedSeries(newSeries)
    setInvoiceData((prev) => ({
      ...prev,
      number: generateInvoiceNumber(newSeries),
    }))
  }

  const toggleInvoiceNumberLock = () => {
    setIsInvoiceNumberLocked(!isInvoiceNumberLocked)
  }

  useEffect(() => {
    const currentDate = new Date()
    const dueDate = new Date(currentDate)
    dueDate.setDate(currentDate.getDate() + Number.parseInt(invoiceData.paymentTerms))

    setInvoiceData((prev) => ({
      ...prev,
      dueDate: dueDate.toISOString().split("T")[0],
    }))
  }, [invoiceData.paymentTerms])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Buyer and Seller Sections */}
              
              {/* Invoice Header */}
              <InvoiceHeader
                invoiceSeries={invoiceSeries}
                selectedSeries={selectedSeries}
                invoiceData={invoiceData}
                isInvoiceNumberLocked={isInvoiceNumberLocked}
                onSeriesChange={handleSeriesChange}
                onInvoiceDataChange={(data) => setInvoiceData(prev => ({ ...prev, ...data }))}
                onToggleInvoiceNumberLock={toggleInvoiceNumberLock}
                onAddNewSeries={addNewSeries}
              />

              <div className="grid grid-cols-2 gap-6">
                {/* Buyer Section */}
                <ClientSelection
                  clients={clients}
                  selectedClient={selectedClient}
                  onClientSelect={setSelectedClient}
                  onCreateNewClient={(newClient) => {
                    setClients(prev => [...prev, newClient as Client])
                  }}
                />

                {/* Seller Section */}
                <SellerSelection
                  sellers={sellers}
                  invoiceSeries={invoiceSeries}
                  selectedSeller={selectedSeller}
                  onSellerSelect={setSelectedSeller}
                  onCreateNewSeller={(newSeller) => {
                    setSellers(prev => [...prev, newSeller as Client])
                  }}
                  onAddNewSeries={addNewSeller}
                />
              </div>

              {/* Invoice Items */}
              <InvoiceItems
                items={items}
                unitOfMeasures={unitOfMeasures}
                vatRates={vatRates}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onUpdateItem={updateItem}
                onAddCustomUnitOfMeasure={addCustomUnitOfMeasure}
                onRemoveUnitOfMeasure={removeUnitOfMeasure}
                onReorderUnits={reorderUnits}
                onAddCustomVatRate={addCustomVatRate}
                onRemoveVatRate={removeVatRate}
                onReorderVatRates={reorderVatRates}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">

              {/* Additional Information */}
              <AdditionalInfo
                notes={invoiceData.notes}
                onNotesChange={(notes) => setInvoiceData(prev => ({ ...prev, notes }))}
              />

              {/* Invoice Summary */}
              <InvoiceSummary
                subtotal={subtotal}
                totalVat={totalVat}
                total={total}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

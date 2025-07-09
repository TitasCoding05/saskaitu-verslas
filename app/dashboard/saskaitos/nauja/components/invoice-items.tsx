"use client"

import { useCallback, useState } from "react"
import "./drag-drop-styles.css"
import { Button } from "@/components/ui/button"
import { useDragDrop } from "./use-drag-drop"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, GripVertical, Plus, Trash2 } from "lucide-react"

import { InvoiceItem, UnitOfMeasure, VatRate } from "../types"
import { calculateItemTotals } from "../utils"
import { UnitsManagementModal } from "./units-management-modal"
import { VatRatesManagementModal } from "./vat-rates-management-modal"

interface InvoiceItemsProps {
  items: InvoiceItem[]
  unitOfMeasures: UnitOfMeasure[]
  vatRates: VatRate[]
  onAddItem: () => void
  onRemoveItem: (id: number) => void
  onUpdateItem: (id: number, field: keyof InvoiceItem, value: string | number | UnitOfMeasure) => void
  onAddCustomUnitOfMeasure: (customUnit: string) => UnitOfMeasure
  onRemoveUnitOfMeasure?: (unitId: string) => void
  onReorderUnits?: (units: UnitOfMeasure[]) => void
  onAddCustomVatRate: (customRate: { name: string; rate: number }) => VatRate
  onRemoveVatRate?: (vatRateId: string) => void
  onReorderVatRates?: (vatRates: VatRate[]) => void
  onReorderItems?: (items: InvoiceItem[]) => void
}

export function InvoiceItems({
  items,
  unitOfMeasures,
  vatRates,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onAddCustomUnitOfMeasure,
  onRemoveUnitOfMeasure,
  onReorderUnits,
  onAddCustomVatRate,
  onRemoveVatRate,
  onReorderVatRates,
  onReorderItems,
}: InvoiceItemsProps) {
  // Ensure onReorderItems is always a function
  const handleReorderItems = onReorderItems || (() => {})
  const [isUnitsModalOpen, setIsUnitsModalOpen] = useState(false)
  const [isVatRatesModalOpen, setIsVatRatesModalOpen] = useState(false)

  const {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useDragDrop(items, handleReorderItems)

  const handleUpdateItem = useCallback((id: number, field: keyof InvoiceItem, value: string | number | UnitOfMeasure) => {
    const currentItem = items.find(item => item.id === id)
    if (!currentItem) return

    const updatedItem: InvoiceItem = calculateItemTotals({
      ...currentItem,
      [field]: value
    })

    // Create a type-safe way to compare and update fields
    const keys: Array<keyof InvoiceItem> = [
      'name', 'unitOfMeasure', 'quantity', 'price',
      'discountPercentage', 'vatRate', 'vatAmount', 'total',
      'customUnitOfMeasure'
    ]

    keys.forEach(key => {
      const newValue = updatedItem[key]
      const currentValue = currentItem[key]

      // Type-safe comparison and update
      if (newValue !== undefined && newValue !== currentValue) {
        onUpdateItem(id, key, newValue)
      }
    })
  }, [items, onUpdateItem])

  return (
    <>
       <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Prekės ir paslaugos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg bg-card ${draggedIndex === index ? 'opacity-50' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDragEnter={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="flex items-center justify-center gap-4">
                {items.length > 1 && (
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  </div>
                )}
                
                <div className="flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`name-${item.id}`}>Pavadinimas</Label>
                    <Input
                      id={`name-${item.id}`}
                      placeholder="Prekės ar paslaugos pavadinimas"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`unit-${item.id}`}>Matas</Label>
                      </div>
                      <Select
                        value={item.unitOfMeasure.id}
                        onValueChange={(value) => {
                          if (value === 'edit_units') {
                            setIsUnitsModalOpen(true)
                            return
                          }
                          const selected = unitOfMeasures.find(u => u.id === value)
                          if (selected) handleUpdateItem(item.id, 'unitOfMeasure', selected)
                        }}
                      >
                        <SelectTrigger id={`unit-${item.id}`} className="w-full">
                          <SelectValue placeholder="Pasirinkite matą">
                            {item.unitOfMeasure.name} ({item.customUnitOfMeasure || item.unitOfMeasure.id})
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {unitOfMeasures.map(u => (
                            <SelectItem key={u.id} value={u.id}>
                              <div className="flex flex-col">
                                <span>{u.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {u.isCustom ? 'Pasirinktinis' : u.id}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                          <SelectItem value="edit_units" className="text-primary font-semibold">
                            Redaguoti matų sąrašą
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`quantity-${item.id}`}>Kiekis</Label>
                      <Input
                        id={`quantity-${item.id}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`price-${item.id}`}>Kaina (€)</Label>
                      <Input
                        id={`price-${item.id}`}
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`discount-${item.id}`}>Nuolaida (%)</Label>
                      <Input
                        id={`discount-${item.id}`}
                        type="number"
                        step="0.01"
                        value={item.discountPercentage}
                        onChange={(e) => handleUpdateItem(item.id, 'discountPercentage', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`vat-${item.id}`}>PVM (%)</Label>
                      </div>
                      <Select
                        value={item.vatRate.toString()}
                        onValueChange={(value) => {
                          if (value === 'edit_vat_rates') {
                            setIsVatRatesModalOpen(true)
                            return
                          }
                          handleUpdateItem(item.id, 'vatRate', parseInt(value))
                        }}
                      >
                        <SelectTrigger id={`vat-${item.id}`} className="w-full">
                          <SelectValue placeholder="Pasirinkite PVM tarifą">
                            {vatRates.find(r => r.rate === item.vatRate)?.name} ({item.vatRate}%)
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {vatRates.map(rate => (
                            <SelectItem key={rate.id} value={rate.rate.toString()}>
                              <div className="flex flex-col">
                                <span>{rate.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {rate.rate}% {rate.isCustom ? '(Pasirinktinis)' : ''}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                          <SelectItem value="edit_vat_rates" className="text-primary font-semibold">
                            Redaguoti PVM tarifų sąrašą
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`vat-amount-${item.id}`}>PVM suma (€)</Label>
                      <Input
                        id={`vat-amount-${item.id}`}
                        type="number"
                        value={item.vatAmount.toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`total-${item.id}`}>Iš viso (€)</Label>
                      <Input
                        id={`total-${item.id}`}
                        type="number"
                        value={item.total.toFixed(2)}
                        readOnly
                        className="bg-muted font-medium"
                      />
                    </div>
                  </div>
                </div>
                
                {items.length > 1 && (
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Ar tikrai norite TRINTI šią prekę/paslaugą?')) {
                          onRemoveItem(item.id)
                        }
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onAddItem} className="gap-2">
            <Plus className="h-4 w-4" />
            Pridėti prekę/paslaugą
          </Button>
        </div>
      </CardContent>

      <UnitsManagementModal
        unitOfMeasures={unitOfMeasures}
        isOpen={isUnitsModalOpen}
        onClose={() => setIsUnitsModalOpen(false)}
        onAddCustomUnitOfMeasure={onAddCustomUnitOfMeasure}
        onRemoveUnitOfMeasure={onRemoveUnitOfMeasure}
        onReorderUnits={onReorderUnits}
      />

      <VatRatesManagementModal
        vatRates={vatRates}
        isOpen={isVatRatesModalOpen}
        onClose={() => setIsVatRatesModalOpen(false)}
        onAddCustomVatRate={onAddCustomVatRate}
        onRemoveVatRate={onRemoveVatRate}
        onReorderVatRates={onReorderVatRates}
      />
    </Card> 

    </>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus } from "lucide-react"

import { InvoiceSeries, InvoiceData } from "../types"

interface InvoiceHeaderProps {
  invoiceSeries: InvoiceSeries[]
  selectedSeries: InvoiceSeries
  invoiceData: InvoiceData
  isInvoiceNumberLocked: boolean
  onSeriesChange: (seriesId: string) => void
  onInvoiceDataChange: (data: Partial<InvoiceData>) => void
  onToggleInvoiceNumberLock: () => void
  onAddNewSeries: (name: string, description: string) => void
}

export function InvoiceHeader({
  invoiceSeries,
  selectedSeries,
  invoiceData,
  isInvoiceNumberLocked,
  onSeriesChange,
  onInvoiceDataChange,
  onToggleInvoiceNumberLock,
  onAddNewSeries,
}: InvoiceHeaderProps) {
  const [showNewSeriesForm, setShowNewSeriesForm] = useState(false)
  const [newSeriesName, setNewSeriesName] = useState("")
  const [newSeriesDescription, setNewSeriesDescription] = useState("")

  const addNewSeries = () => {
    if (newSeriesName.trim()) {
      onAddNewSeries(
        newSeriesName.toUpperCase(), 
        newSeriesDescription || `${newSeriesName} serija`
      )
      setNewSeriesName("")
      setNewSeriesDescription("")
      setShowNewSeriesForm(false)
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mono-shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-black dark:text-white text-lg">
          <FileText className="w-5 h-5 mr-2" />
          Sąskaitos informacija
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label className="text-black dark:text-white font-medium">Sąskaitos serija</Label>
            <div className="flex gap-2 mt-1">
              <Select value={selectedSeries.id} onValueChange={onSeriesChange}>
                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {invoiceSeries.map((series) => (
                    <SelectItem key={series.id} value={series.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{series.name}</span>
                          <span className="text-xs text-gray-500">{series.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewSeriesForm(!showNewSeriesForm)}
                  className="border-gray-200 dark:border-gray-800 px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {showNewSeriesForm && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                <div>
                  <Label className="text-xs text-gray-500 dark:text-gray-400">
                    Serijos pavadinimas (2-4 raidės)
                  </Label>
                  <Input
                    value={newSeriesName}
                    onChange={(e) => setNewSeriesName(e.target.value.toUpperCase())}
                    placeholder="pvz. KS, PF"
                    maxLength={4}
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Aprašymas (neprivalomas)</Label>
                  <Input
                    value={newSeriesDescription}
                    onChange={(e) => setNewSeriesDescription(e.target.value)}
                    placeholder="pvz. Kredito sąskaitos"
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={addNewSeries}
                    className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                  >
                    Pridėti
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewSeriesForm(false)}
                    className="border-gray-200 dark:border-gray-800"
                  >
                    Atšaukti
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <Label className="text-black dark:text-white font-medium">Sąskaitos numeris</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                {!isInvoiceNumberLocked && (
                  <button
                    onClick={() => {
                      const currentNumber = parseInt(invoiceData.number)
                      if (currentNumber > 1) {
                        onInvoiceDataChange({ number: (currentNumber - 1).toString() })
                      }
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={parseInt(invoiceData.number) <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left w-5 h-5">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                  </button>
                )}
                <Input
                  value={invoiceData.number}
                  onChange={(e) => {
                    if (!isInvoiceNumberLocked) {
                      onInvoiceDataChange({ number: e.target.value })
                    }
                  }}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1 flex-1"
                  readOnly={isInvoiceNumberLocked}
                />
                {!isInvoiceNumberLocked && (
                  <button
                    onClick={() => {
                      const currentNumber = parseInt(invoiceData.number)
                      onInvoiceDataChange({ number: (currentNumber + 1).toString() })
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-5 h-5">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={onToggleInvoiceNumberLock}
                className="mt-1 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isInvoiceNumberLocked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-5 h-5">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-unlock w-5 h-5">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sąskaita: {selectedSeries.name}-{(parseInt(invoiceData.number)).toString().padStart(4, "0")}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Label className="text-black dark:text-white font-medium">Išrašymo data</Label>
            <Input
              type="date"
              value={invoiceData.date}
              onChange={(e) => onInvoiceDataChange({ date: e.target.value })}
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
            />
          </div>
          <div className="flex-1">
            <Label className="text-black dark:text-white font-medium">Apmokėjimo terminas</Label>
            <Input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => onInvoiceDataChange({ dueDate: e.target.value })}
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Label className="text-black dark:text-white font-medium">Mokėjimo sąlygos</Label>
            <Select
              value={invoiceData.paymentTerms}
              onValueChange={(value) => onInvoiceDataChange({ paymentTerms: value })}
            >
              <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dienos</SelectItem>
                <SelectItem value="14">14 dienų</SelectItem>
                <SelectItem value="30">30 dienų</SelectItem>
                <SelectItem value="60">60 dienų</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">{/* tuščias div balanso palaikymui */}</div>
        </div>
      </CardContent>
    </Card>
  )
}
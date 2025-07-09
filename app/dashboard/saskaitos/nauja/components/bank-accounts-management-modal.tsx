"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Trash2, GripVertical } from "lucide-react"
import { BankAccount, InvoiceSeries } from "../types"
import { DEFAULT_BANK_ACCOUNTS, DEFAULT_INVOICE_SERIES } from "../constants"
import { useDragDrop } from "./use-drag-drop"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"

interface BankAccountsManagementModalProps {
  bankAccounts: BankAccount[]
  invoiceSeries: InvoiceSeries[]
  isOpen: boolean
  onClose: () => void
  onAddBankAccount: (bankAccount: BankAccount) => void
  onRemoveBankAccount?: (bankAccountId: string) => void
  onReorderBankAccounts?: (bankAccounts: BankAccount[]) => void
}

export function BankAccountsManagementModal({
  bankAccounts = DEFAULT_BANK_ACCOUNTS,
  invoiceSeries = DEFAULT_INVOICE_SERIES,
  isOpen,
  onClose,
  onAddBankAccount,
  onRemoveBankAccount,
  onReorderBankAccounts
}: BankAccountsManagementModalProps) {
  const [newBankAccount, setNewBankAccount] = useState<Partial<BankAccount>>({
    bankName: "",
    accountNumber: "",
    swiftCode: "",
    bankCode: "",
    description: "",
    invoiceSeries: []
  })

  const [isDefaultAccount, setIsDefaultAccount] = useState(true)

  const {
    draggedIndex,
    dragOverIndex,
    dragPlaceholderIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useDragDrop(bankAccounts, onReorderBankAccounts)

  const handleAddNewBankAccount = () => {
    if (newBankAccount.bankName && newBankAccount.accountNumber) {
      const bankAccountToAdd: BankAccount = {
        id: Date.now().toString(),
        bankName: newBankAccount.bankName,
        accountNumber: newBankAccount.accountNumber,
        swiftCode: newBankAccount.swiftCode,
        bankCode: newBankAccount.bankCode,
        description: newBankAccount.description,
        invoiceSeries: newBankAccount.invoiceSeries || [],
        isDefault: isDefaultAccount
      }

      onAddBankAccount(bankAccountToAdd)
      
      // Reset form
      setNewBankAccount({
        bankName: "",
        accountNumber: "",
        swiftCode: "",
        bankCode: "",
        description: "",
        invoiceSeries: []
      })
      setIsDefaultAccount(true)
    }
  }

  const handleDeleteBankAccount = (bankAccountId: string) => {
    if (onRemoveBankAccount) {
      const confirmDelete = window.confirm("Ar tikrai norite ištrinti šią banko sąskaitą?")
      if (confirmDelete) {
        onRemoveBankAccount(bankAccountId)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Banko sąskaitos
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Existing Bank Accounts List */}
        <div className="space-y-2 mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Esamos banko sąskaitos:
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto drag-list drag-container">
            {bankAccounts.map((account, index) => (
              <div key={account.id}>
                {dragPlaceholderIndex === index && draggedIndex !== null && (
                  <div className="h-2 bg-blue-400 dark:bg-blue-600 rounded-full mx-2 mb-2 drag-placeholder" />
                )}
                
                <div
                  draggable
                  data-bank-drag-item
                  data-bank-drag-index={index}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={(e) => handleTouchMove(e, 'data-bank-drag-item', 'data-bank-drag-index')}
                  onTouchEnd={() => handleTouchEnd(bankAccounts, onReorderBankAccounts)}
                  className={`flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 drag-item ${
                    draggedIndex === index ? 'drag-item-dragging opacity-60 scale-98 shadow-lg z-10' : ''
                  } ${
                    dragOverIndex === index && draggedIndex !== index ? 'drag-item-over border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-102' : ''
                  }`}
                  style={{
                    touchAction: 'none'
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white font-medium">
                        {account.bankName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                      {account.accountNumber}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleDeleteBankAccount(account.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {dragPlaceholderIndex === bankAccounts.length && index === bankAccounts.length - 1 && draggedIndex !== null && (
                  <div className="h-2 bg-blue-400 dark:bg-blue-600 rounded-full mx-2 mt-2 drag-placeholder" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Bank Account */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pridėti naują banko sąskaitą:
          </Label>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Banko pavadinimas *</Label>
                <Input
                  placeholder="Įveskite banko pavadinimą"
                  value={newBankAccount.bankName || ""}
                  onChange={(e) => setNewBankAccount(prev => ({ ...prev, bankName: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Sąskaitos numeris *</Label>
                <Input
                  placeholder="Įveskite sąskaitos numerį"
                  value={newBankAccount.accountNumber || ""}
                  onChange={(e) => setNewBankAccount(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">SWIFT kodas</Label>
                <Input
                  placeholder="Įveskite SWIFT kodą"
                  value={newBankAccount.swiftCode || ""}
                  onChange={(e) => setNewBankAccount(prev => ({ ...prev, swiftCode: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Banko kodas</Label>
                <Input
                  placeholder="Įveskite banko kodą"
                  value={newBankAccount.bankCode || ""}
                  onChange={(e) => setNewBankAccount(prev => ({ ...prev, bankCode: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Banko sąskaitos aprašymas</Label>
                <Input
                  placeholder="Įveskite sąskaitos aprašymą"
                  value={newBankAccount.description || ""}
                  onChange={(e) => setNewBankAccount(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Susietos serijos</Label>
                <Select
                  value={newBankAccount.invoiceSeries?.[0] || ""}
                  onValueChange={(selectedSeries) => {
                    setNewBankAccount(prev => ({
                      ...prev,
                      invoiceSeries: selectedSeries ? [selectedSeries] : []
                    }))
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pasirinkite seriją" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {invoiceSeries.map((series) => (
                        <SelectItem key={series.id} value={series.id}>
                          {series.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="default-account"
                  checked={isDefaultAccount}
                  onCheckedChange={setIsDefaultAccount}
                />
                <Label htmlFor="default-account" className="text-xs text-gray-600 dark:text-gray-400">
                  Pagal nutylėjimą pridėti prie sąskaitos
                </Label>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleAddNewBankAccount}
                disabled={!newBankAccount.bankName || !newBankAccount.accountNumber}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Pridėti sąskaitą
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
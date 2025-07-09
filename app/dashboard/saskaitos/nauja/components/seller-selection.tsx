"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, CreditCard, Plus } from "lucide-react"

import { Client, BankAccount, InvoiceSeries } from "../types"
import { BankAccountsManagementModal } from "./bank-accounts-management-modal"

interface SellerSelectionProps {
  sellers: Client[]
  invoiceSeries: InvoiceSeries[]
  selectedSeller: Client | null
  onSellerSelect: (seller: Client | null) => void
  onCreateNewSeller?: (sellerData: Client) => void
  onAddNewSeries?: (name: string, description: string) => void
  onUpdateSeller?: (updatedSeller: Client) => void
}

export function SellerSelection({
  sellers,
  invoiceSeries,
  selectedSeller,
  onSellerSelect,
  onCreateNewSeller,
  onAddNewSeries,
  onUpdateSeller
}: SellerSelectionProps) {
  const [isBankAccountModalOpen, setIsBankAccountModalOpen] = useState(false)
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null)

  // Automatically select the first seller by default when component mounts
  useEffect(() => {
    if (sellers.length > 0 && !selectedSeller) {
      const firstSeller = sellers[0]
      onSellerSelect(firstSeller)
      
      // Select first bank account if available
      if (firstSeller.bankAccounts && firstSeller.bankAccounts.length > 0) {
        setSelectedBankAccount(firstSeller.bankAccounts[0])
      }
      
      // Minimal usage of optional props to satisfy type requirements
      if (onAddNewSeries) {
        onAddNewSeries(firstSeller.name, firstSeller.additionalInfo || '')
      }
    }
  }, [sellers, selectedSeller, onSellerSelect, onAddNewSeries])

  const handleAddBankAccount = (newBankAccount: BankAccount) => {
    if (selectedSeller) {
      const updatedSeller: Client = {
        ...selectedSeller,
        bankAccounts: [...(selectedSeller.bankAccounts || []), newBankAccount]
      }
      
      // Update seller with new bank account
      if (onUpdateSeller) {
        onUpdateSeller(updatedSeller)
      }
      
      // If onCreateNewSeller is provided, use it to update the seller
      if (onCreateNewSeller) {
        onCreateNewSeller(updatedSeller)
      }
      
      // Select the newly added bank account
      setSelectedBankAccount(newBankAccount)
      setIsBankAccountModalOpen(false)
    }
  }

  const handleRemoveBankAccount = (bankAccountId: string) => {
    if (selectedSeller) {
      const updatedSeller: Client = {
        ...selectedSeller,
        bankAccounts: (selectedSeller.bankAccounts || []).filter(account => account.id !== bankAccountId)
      }
      
      // Update seller, removing the bank account
      if (onUpdateSeller) {
        onUpdateSeller(updatedSeller)
      }
      
      // If onCreateNewSeller is provided, use it to update the seller
      if (onCreateNewSeller) {
        onCreateNewSeller(updatedSeller)
      }
      
      // Clear selected bank account if it was the removed one
      if (selectedBankAccount?.id === bankAccountId) {
        setSelectedBankAccount(null)
      }
    }
  }

  return (
    <>
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mono-shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-black dark:text-white text-lg">
            <span className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Pardavėjas
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Seller Details */}
          {selectedSeller && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-black dark:text-white">{selectedSeller.name}</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Įm. kodas:</span>
                  <span>{selectedSeller.code}</span>
                </div>
                {selectedSeller.vatCode && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">PVM kodas:</span>
                    <span>{selectedSeller.vatCode}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="font-medium">El. paštas:</span>
                  <span className="break-all">{selectedSeller.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Telefonas:</span>
                  <span>{selectedSeller.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Adresas:</span>
                  <span>{selectedSeller.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Šalis:</span>
                  <span>{selectedSeller.country}</span>
                </div>
                {selectedSeller.additionalInfo && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Papildomi duom.:</span>
                    <span>{selectedSeller.additionalInfo}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bank Account Section */}
          <div className="bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-black dark:text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Banko sąskaita
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsBankAccountModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Pridėti
              </Button>
            </div>

            {/* Selected Bank Account Details */}
            {selectedBankAccount ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Bankas:</span>
                    <span>{selectedBankAccount.bankName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Sąskaitos nr.:</span>
                    <span>{selectedBankAccount.accountNumber}</span>
                  </div>
                  {selectedBankAccount.swiftCode && (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">SWIFT:</span>
                      <span>{selectedBankAccount.swiftCode}</span>
                    </div>
                  )}
                  {selectedBankAccount.bankCode && (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Banko kodas:</span>
                      <span>{selectedBankAccount.bankCode}</span>
                    </div>
                  )}
                  {selectedBankAccount.description && (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Aprašymas:</span>
                      <span>{selectedBankAccount.description}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
                Nepasirinkta banko sąskaita
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bank Accounts Management Modal */}
      {isBankAccountModalOpen && (
        <BankAccountsManagementModal
          bankAccounts={selectedSeller?.bankAccounts || []}
          invoiceSeries={invoiceSeries}
          isOpen={isBankAccountModalOpen}
          onClose={() => setIsBankAccountModalOpen(false)}
          onAddBankAccount={handleAddBankAccount}
          onRemoveBankAccount={handleRemoveBankAccount}
        />
      )}
    </>
  )
}
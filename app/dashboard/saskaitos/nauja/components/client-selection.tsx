"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Search, Plus, Pencil, Save } from "lucide-react"

import { Client } from "../types"

interface ClientSelectionProps {
  clients: Client[]
  selectedClient: Client | null
  onClientSelect: (client: Client | null) => void
  onCreateNewClient: (clientData: Client) => void
}

export function ClientSelection({
  clients,
  selectedClient,
  onClientSelect,
  onCreateNewClient,
}: ClientSelectionProps) {
  const [clientSearchQuery, setClientSearchQuery] = useState("")
  const [isClientSearching, setIsClientSearching] = useState(false)
  const [clientSearchResults, setClientSearchResults] = useState<Client[]>([])
  const [showClientResults, setShowClientResults] = useState(false)
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [newClientData, setNewClientData] = useState({
    name: "",
    address: "",
    country: "Lietuva",
    language: "lt",
    type: "legal" as 'physical' | 'legal',
    code: "",
    vatCode: "",
    additionalInfo: "",
    phone: "",
    email: "",
  })

  const searchClients = useCallback((query: string) => {
    if (!query.trim() || query.length < 2) {
      setClientSearchResults([])
      setShowClientResults(false)
      return
    }

    setIsClientSearching(true)

    // Simulate API delay
    setTimeout(() => {
      const results = clients.filter(
        (client) => client.name.toLowerCase().includes(query.toLowerCase()) || client.code.includes(query),
      )

      setClientSearchResults(results)
      setShowClientResults(true)
      setIsClientSearching(false)
    }, 300)
  }, [clients])

  const handleClientSearchChange = (value: string) => {
    setClientSearchQuery(value)
    searchClients(value)

    // Reset selected client if search changes
    if (selectedClient && !value.includes(selectedClient.name)) {
      onClientSelect(null)
    }
  }

  const selectClientFromSearch = (client: Client) => {
    onClientSelect(client)
    setClientSearchQuery(client.name)
    setShowClientResults(false)
    setShowNewClientForm(false)
  }

  const handleCreateNewClient = () => {
    setShowNewClientForm(true)
    setShowClientResults(false)
    setNewClientData({
      ...newClientData,
      name: clientSearchQuery,
    })
  }

  const saveNewClient = () => {
    if (newClientData.name && newClientData.code && newClientData.email) {
      const newClient: Client = {
        id: Date.now().toString(),
        name: newClientData.name,
        address: newClientData.address,
        country: newClientData.country,
        language: newClientData.language,
        type: newClientData.type,
        code: newClientData.code,
        vatCode: newClientData.vatCode,
        additionalInfo: newClientData.additionalInfo,
        phone: newClientData.phone,
        email: newClientData.email,
      }

      onCreateNewClient(newClient)
      onClientSelect(newClient)
      
      // Reset new client form
      setNewClientData({
        name: "",
        address: "",
        country: "Lietuva",
        language: "lt",
        type: "legal",
        code: "",
        vatCode: "",
        additionalInfo: "",
        phone: "",
        email: "",
      })
      setShowNewClientForm(false)
      setClientSearchQuery(newClient.name)
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mono-shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-black dark:text-white text-lg">
          <span className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Pirkėjas
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={clientSearchQuery}
              onChange={(e) => handleClientSearchChange(e.target.value)}
              placeholder="Ieškoti kliento pagal pavadinimą arba kodą..."
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
            {isClientSearching && (
              <div className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
            )}
          </div>

          {/* Search Results */}
          {showClientResults && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {clientSearchResults.length > 0 ? (
                <>
                  {clientSearchResults.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => selectClientFromSearch(client)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-black dark:text-white">{client.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Kodas: {client.code}
                            {client.vatCode && ` • PVM: ${client.vatCode}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{client.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={handleCreateNewClient}
                    className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Sukurti naują klientą &quot;{clientSearchQuery}&quot;</span>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  onClick={handleCreateNewClient}
                  className="p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                >
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Sukurti naują klientą &quot;{clientSearchQuery}&quot;</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Klientas nerastas. Spustelėkite, kad sukurtumėte naują.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* New Client Form */}
        {showNewClientForm && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-black dark:text-white">Naujo kliento duomenys</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewClientForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Pavadinimas *</Label>
                <Input
                  value={newClientData.name}
                  onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                  placeholder="UAB Naujas klientas"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Įmonės kodas *</Label>
                <Input
                  value={newClientData.code}
                  onChange={(e) => setNewClientData({ ...newClientData, code: e.target.value })}
                  placeholder="123456789"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">PVM kodas</Label>
                <Input
                  value={newClientData.vatCode}
                  onChange={(e) => setNewClientData({ ...newClientData, vatCode: e.target.value })}
                  placeholder="LT123456789"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">El. paštas *</Label>
                <Input
                  type="email"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                  placeholder="info@klientas.lt"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Telefonas</Label>
                <Input
                  value={newClientData.phone}
                  onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                  placeholder="+370 600 12345"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600 dark:text-gray-400">Adresas</Label>
                <Input
                  value={newClientData.address}
                  onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                  placeholder="Vilniaus g. 1, Vilnius"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={saveNewClient}
                disabled={!newClientData.name || !newClientData.code || !newClientData.email}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Save className="w-4 h-4 mr-1" />
                Išsaugoti klientą
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewClientForm(false)}
                size="sm"
                className="border-gray-200 dark:border-gray-800"
              >
                Atšaukti
              </Button>
            </div>
          </div>
        )}

        {/* Selected Client Details */}
        {selectedClient && !showNewClientForm && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-black dark:text-white">{selectedClient.name}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Trigger client editing mode
                  setShowNewClientForm(true)
                  setNewClientData({
                    name: selectedClient.name,
                    address: selectedClient.address,
                    country: selectedClient.country,
                    language: selectedClient.language,
                    type: selectedClient.type,
                    code: selectedClient.code,
                    vatCode: selectedClient.vatCode || '',
                    additionalInfo: selectedClient.additionalInfo || '',
                    phone: selectedClient.phone || '',
                    email: selectedClient.email,
                  })
                }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Įm. kodas:</span>
                <span>{selectedClient.code}</span>
              </div>
              {selectedClient.vatCode && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">PVM kodas:</span>
                  <span>{selectedClient.vatCode}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="font-medium">El. paštas:</span>
                <span className="break-all">{selectedClient.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Telefono nr.:</span>
                <span>{selectedClient.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Adresas:</span>
                <span>{selectedClient.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Šalis:</span>
                <span>{selectedClient.country}</span>
              </div>
              {selectedClient.additionalInfo && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Papildomi duom.:</span>
                  <span>{selectedClient.additionalInfo}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
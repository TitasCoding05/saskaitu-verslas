"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Plus, Building, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ClientsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // New state for product inputs
  const [productUnit, setProductUnit] = useState("vnt.")
  const [productQuantity, setProductQuantity] = useState(1)
  const [productPrice, setProductPrice] = useState(4.14)
  const [productDiscount, setProductDiscount] = useState(0)
  const [vatRate, setVatRate] = useState("21%")
  const [productName, setProductName] = useState("") // New state for product name

  // Calculation functions
  const calculateVatAmount = () => {
    const baseAmount = productQuantity * productPrice * (1 - productDiscount / 100)
    const vatPercentage = parseFloat(vatRate) / 100
    return Number((baseAmount * vatPercentage).toFixed(2))
  }

  const calculateTotalWithoutVat = () => {
    return Number((productQuantity * productPrice * (1 - productDiscount / 100)).toFixed(2))
  }

  const clients = [
    {
      id: 1,
      name: "UAB Technologijos",
      code: "123456789",
      vatCode: "LT123456789",
      email: "info@technologijos.lt",
      phone: "+370 600 12345",
      address: "Vilniaus g. 1, Vilnius",
      invoiceCount: 12,
      totalAmount: "15,420.00",
      status: "Aktyvus",
      lastInvoice: "2024-01-15",
    },
    {
      id: 2,
      name: "MB Konsultacijos",
      code: "987654321",
      vatCode: "LT987654321",
      email: "kontaktai@konsultacijos.lt",
      phone: "+370 600 54321",
      address: "Kauno g. 15, Kaunas",
      invoiceCount: 8,
      totalAmount: "8,750.00",
      status: "Aktyvus",
      lastInvoice: "2024-01-18",
    },
    {
      id: 3,
      name: "IĮ Dizainas",
      code: "456789123",
      vatCode: "",
      email: "hello@dizainas.lt",
      phone: "+370 600 98765",
      address: "Klaipėdos g. 8, Šiauliai",
      invoiceCount: 3,
      totalAmount: "2,100.00",
      status: "Neaktyvus",
      lastInvoice: "2023-12-20",
    },
  ]

  const getStatusColor = (status: string) => {
    return status === "Aktyvus"
      ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
      : "bg-gray-400 text-white border-gray-400 dark:bg-gray-600 dark:text-white dark:border-gray-600"
  }

  // Pagination calculations
  const totalItems = clients.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentClients = clients.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Klientai</h1>
          <p className="text-gray-600 dark:text-gray-400">Valdykite savo klientų duomenis ir istoriją</p>
        </div>
        <Link href="/dashboard/klientai/naujas">
          <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Pridėti klientą
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Ieškoti klientų..."
                className="pl-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full lg:w-48 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Statusas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visi statusai</SelectItem>
                <SelectItem value="active">Aktyvus</SelectItem>
                <SelectItem value="inactive">Neaktyvus</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Rodyti:</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Iš viso klientų</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-black dark:text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aktyvūs</p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {clients.filter((c) => c.status === "Aktyvus").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-white dark:text-black" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Neaktyvūs</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {clients.filter((c) => c.status === "Neaktyvus").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Klientų sąrašas ({totalItems})
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rodoma {startIndex + 1}-{Math.min(endIndex, totalItems)} iš {totalItems} klientų
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                      <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kodas: {client.code}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {client.email} • {client.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">€{client.totalAmount}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sąskaitų: {client.invoiceCount}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Puslapis {currentPage} iš {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-200 dark:border-gray-800"
            >
              Ankstesnis
            </Button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber
                if (totalPages <= 5) {
                  pageNumber = i + 1
                } else if (currentPage <= 3) {
                  pageNumber = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i
                } else {
                  pageNumber = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-8 h-8 p-0 ${
                      currentPage === pageNumber
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    {pageNumber}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-200 dark:border-gray-800"
            >
              Kitas
            </Button>
          </div>
        </div>
      )}

      {/* New Product Input Section */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Produkto Įvedimas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Produkto Pavadinimas</label>
              <Input
                type="text"
                placeholder="Įveskite produkto pavadinimą"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Matas</label>
              <Select
                value={productUnit}
                onValueChange={setProductUnit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pasirinkti vienetą" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vnt.">vnt.</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="l">l</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Kiekis</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={productQuantity}
                onChange={(e) => setProductQuantity(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Kaina (€)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Nuolaida (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={productDiscount}
                onChange={(e) => setProductDiscount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">PVM %</label>
              <Select
                value={vatRate}
                onValueChange={setVatRate}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pasirinkti PVM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="21%">21%</SelectItem>
                  <SelectItem value="9%">9%</SelectItem>
                  <SelectItem value="0%">0%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Be PVM (€)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={calculateTotalWithoutVat()}
                  readOnly
                  className="mt-1"
                />
              </div>
            </div>
            
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                const vatAmount = calculateVatAmount()
                const totalWithoutVat = calculateTotalWithoutVat()
                console.log(`VAT Amount: ${vatAmount}, Total Without VAT: ${totalWithoutVat}`)
              }}
              variant="outline"
            >
              Skaičiuoti
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

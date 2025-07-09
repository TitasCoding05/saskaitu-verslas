"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Building,
  Search,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  CreditCard,
} from "lucide-react"
import Link from "next/link"

interface ClientData {
  name: string
  code: string
  vatCode: string
  address: string
  email: string
  phone: string
  website: string
  isVatPayer: boolean
  paymentTerms: string
}

interface CompanySearchResult {
  name: string
  code: string
  vatCode?: string
  address: string
  status: string
  founded?: string
}

export default function NewClientPage() {
  const [clientData, setClientData] = useState<ClientData>({
    name: "",
    code: "",
    vatCode: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    isVatPayer: false,
    paymentTerms: "14",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Mock company database - in real app this would be an API call
  const mockCompanyDatabase: CompanySearchResult[] = [
    {
      name: "UAB Technologijos",
      code: "123456789",
      vatCode: "LT123456789",
      address: "Vilniaus g. 1, LT-01234 Vilnius",
      status: "Aktyvus",
      founded: "2020",
    },
    {
      name: "MB Konsultacijos",
      code: "987654321",
      vatCode: "LT987654321",
      address: "Kauno g. 15, LT-44444 Kaunas",
      status: "Aktyvus",
      founded: "2018",
    },
    {
      name: "IĮ Dizainas",
      code: "456789123",
      address: "Klaipėdos g. 8, LT-92222 Šiauliai",
      status: "Aktyvus",
      founded: "2021",
    },
    {
      name: "UAB Statyba Plus",
      code: "789123456",
      vatCode: "LT789123456",
      address: "Gedimino pr. 50, LT-01110 Vilnius",
      status: "Aktyvus",
      founded: "2015",
    },
    {
      name: "MB IT Sprendimai",
      code: "321654987",
      vatCode: "LT321654987",
      address: "Laisvės al. 25, LT-44444 Kaunas",
      status: "Aktyvus",
      founded: "2019",
    },
  ]

  const searchCompany = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)

    // Simulate API delay
    setTimeout(() => {
      const results = mockCompanyDatabase.filter(
        (company) =>
          company.name.toLowerCase().includes(query.toLowerCase()) ||
          company.code.includes(query) ||
          (company.vatCode && company.vatCode.includes(query)),
      )

      setSearchResults(results)
      setShowResults(true)
      setIsSearching(false)
    }, 500)
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    searchCompany(value)
  }

  const selectCompany = (company: CompanySearchResult) => {
    setClientData({
      ...clientData,
      name: company.name,
      code: company.code,
      vatCode: company.vatCode || "",
      address: company.address,
      isVatPayer: !!company.vatCode,
    })
    setSearchQuery(company.name)
    setShowResults(false)
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false)
      // Redirect to clients page
      window.location.href = "/dashboard/klientai"
    }, 1500)
  }

  const isFormValid = () => {
    return clientData.name && clientData.code && clientData.email
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Link href="/dashboard/klientai">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-900">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-black dark:text-white">Naujas klientas</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Pridėkite naują klientą į savo duomenų bazę</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!isFormValid() || isSaving}
          className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Išsaugoma...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Išsaugoti klientą
            </>
          )}
        </Button>
      </div>

      {/* Company Search */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mono-shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-black dark:text-white">
            <Search className="w-5 h-5 mr-2" />
            Įmonės paieška
          </CardTitle>
          <CardDescription>
            Įveskite įmonės pavadinimą arba kodą, kad automatiškai užpildytumėte duomenis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Ieškoti pagal pavadinimą, kodą arba PVM kodą..."
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
              )}
            </div>

            {/* Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((company, index) => (
                  <div
                    key={index}
                    onClick={() => selectCompany(company)}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-black dark:text-white">{company.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Kodas: {company.code}
                          {company.vatCode && ` • PVM: ${company.vatCode}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{company.address}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {company.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showResults && searchResults.length === 0 && searchQuery.length >= 3 && !isSearching && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-4">
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Įmonė nerasta. Užpildykite duomenis rankiniu būdu.</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mono-shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-black dark:text-white">
            <Building className="w-5 h-5 mr-2" />
            Įmonės duomenys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name" className="text-black dark:text-white font-medium">
                Įmonės pavadinimas *
              </Label>
              <Input
                id="company-name"
                value={clientData.name}
                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                placeholder="UAB Mano Klientas"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="company-code" className="text-black dark:text-white font-medium">
                Įmonės kodas *
              </Label>
              <Input
                id="company-code"
                value={clientData.code}
                onChange={(e) => setClientData({ ...clientData, code: e.target.value })}
                placeholder="123456789"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="vat-code" className="text-black dark:text-white font-medium">
                  PVM mokėtojo kodas
                </Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="is-vat-payer" className="text-sm text-gray-600 dark:text-gray-400">
                    PVM mokėtojas
                  </Label>
                  <Switch
                    id="is-vat-payer"
                    checked={clientData.isVatPayer}
                    onCheckedChange={(checked) => setClientData({ ...clientData, isVatPayer: checked })}
                  />
                </div>
              </div>
              <Input
                id="vat-code"
                value={clientData.vatCode}
                onChange={(e) => setClientData({ ...clientData, vatCode: e.target.value })}
                placeholder="LT123456789"
                disabled={!clientData.isVatPayer}
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-black dark:text-white font-medium">
                Svetainė
              </Label>
              <Input
                id="website"
                value={clientData.website}
                onChange={(e) => setClientData({ ...clientData, website: e.target.value })}
                placeholder="https://www.klientas.lt"
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-black dark:text-white font-medium">
              Adresas
            </Label>
            <Textarea
              id="address"
              value={clientData.address}
              onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
              placeholder="Vilniaus g. 1, LT-01234 Vilnius"
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
              rows={2}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-black dark:text-white font-medium">
                El. paštas *
              </Label>
              <div className="relative mt-1">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                  placeholder="info@klientas.lt"
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-black dark:text-white font-medium">
                Telefonas
              </Label>
              <div className="relative mt-1">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="phone"
                  value={clientData.phone}
                  onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                  placeholder="+370 600 12345"
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment & Additional Info */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mono-shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-black dark:text-white">
            <CreditCard className="w-5 h-5 mr-2" />
            Mokėjimo informacija
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="payment-terms" className="text-black dark:text-white font-medium">
              Mokėjimo terminas (dienos)
            </Label>
            <Input
              id="payment-terms"
              type="number"
              value={clientData.paymentTerms}
              onChange={(e) => setClientData({ ...clientData, paymentTerms: e.target.value })}
              placeholder="14"
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Validation Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-2">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Privalomi laukai</p>
            <p>Užpildykite įmonės pavadinimą, kodą ir el. paštą, kad galėtumėte išsaugoti klientą.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

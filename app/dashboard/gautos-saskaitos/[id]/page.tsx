"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Building,
  Hash,
  User
} from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'

interface ProcessedDocument {
  id: string
  originalName: string
  fileType: string
  compressedUrl: string
  originalUrl?: string
  extractedData: {
    serija_ir_numeris?: string
    isdavimo_data?: string
    bendra_kaina?: string
    pvm_suma?: string
    suma_be_pvm?: string
    pardavejas?: {
      pardavejo_imones_pavadinimas?: string
      pardavejo_imones_kodas?: string
      pardavejo_pvm_kodas?: string
      pardavejo_adresas?: string
      pardavejo_telefonas?: string
      pardavejo_el_pastas?: string
    }
    pirkejas?: {
      pirkejo_imones_pavadinimas?: string
      pirkejo_imones_kodas?: string
      pirkejo_pvm_kodas?: string
      pirkejo_adresas?: string
    }
    prekes?: Array<{
      pavadinimas?: string
      kiekis?: string
      vieneto_kaina?: string
      suma?: string
      pvm_tarifas?: string
    }>
  }
  coordinates: Record<string, unknown>
  status: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

export default function InvoiceViewPage() {
  const params = useParams()
  const [document, setDocument] = useState<ProcessedDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchDocument(params.id as string)
    }
  }, [params.id])

  const fetchDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/processed-documents/${id}/view`)
      if (response.ok) {
        const data = await response.json()
        setDocument(data.document)
      } else {
        setError('Sąskaita nerasta')
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      setError('Klaida kraunant sąskaitą')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('lt-LT')
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: string | undefined) => {
    if (!amount) return '€0.00'
    return `€${parseFloat(amount).toFixed(2)}`
  }

  const downloadDocument = () => {
    if (document?.compressedUrl) {
      const link = window.document.createElement('a')
      link.href = document.compressedUrl
      link.download = document.originalName
      link.click()
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/gautos-saskaitos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Grįžti
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {error || 'Sąskaita nerasta'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sąskaita, kurią bandote peržiūrėti, neegzistuoja arba buvo ištrinta.
            </p>
            <Link href="/dashboard/gautos-saskaitos">
              <Button>
                Grįžti į sąskaitų sąrašą
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/gautos-saskaitos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Grįžti
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {document.extractedData.serija_ir_numeris || 'Sąskaita faktūra'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {document.extractedData.pardavejas?.pardavejo_imones_pavadinimas || 'Nežinomas pardavėjas'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            className={`${
              document.status === 'CONFIRMED' 
                ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800'
                : document.status === 'REJECTED'
                ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800'
                : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800'
            }`}
          >
            {document.status === 'CONFIRMED' ? 'Patvirtinta' : 
             document.status === 'REJECTED' ? 'Atmesta' : 'Laukia patvirtinimo'}
          </Badge>
          
          {/* Check for invalid invoice */}
          {(!document.extractedData.pardavejas?.pardavejo_imones_kodas || !document.extractedData.serija_ir_numeris) && (
            <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800">
              Neatpažinta sąskaita
            </Badge>
          )}
          
          <Button onClick={downloadDocument} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Atsisiųsti
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="w-5 h-5" />
                <span>Pagrindinė informacija</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Serija ir numeris</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {document.extractedData.serija_ir_numeris || 'Nenurodyta'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Išdavimo data</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {document.extractedData.isdavimo_data ? formatDate(document.extractedData.isdavimo_data) : 'Nenurodyta'}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bendra suma</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(document.extractedData.bendra_kaina)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Suma be PVM</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(document.extractedData.suma_be_pvm)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">PVM suma</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(document.extractedData.pvm_suma)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Information */}
          {document.extractedData.pardavejas && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Pardavėjas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Įmonės pavadinimas</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {document.extractedData.pardavejas.pardavejo_imones_pavadinimas || 'Nenurodyta'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Įmonės kodas</p>
                    <p className="text-gray-900 dark:text-white">
                      {document.extractedData.pardavejas.pardavejo_imones_kodas || 'Nenurodyta'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">PVM kodas</p>
                    <p className="text-gray-900 dark:text-white">
                      {document.extractedData.pardavejas.pardavejo_pvm_kodas || 'Nenurodyta'}
                    </p>
                  </div>
                </div>
                {document.extractedData.pardavejas.pardavejo_adresas && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresas</p>
                    <p className="text-gray-900 dark:text-white">
                      {document.extractedData.pardavejas.pardavejo_adresas}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {document.extractedData.pardavejas.pardavejo_telefonas && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefonas</p>
                      <p className="text-gray-900 dark:text-white">
                        {document.extractedData.pardavejas.pardavejo_telefonas}
                      </p>
                    </div>
                  )}
                  {document.extractedData.pardavejas.pardavejo_el_pastas && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">El. paštas</p>
                      <p className="text-gray-900 dark:text-white">
                        {document.extractedData.pardavejas.pardavejo_el_pastas}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Buyer Information */}
          {document.extractedData.pirkejas && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Pirkėjas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Įmonės pavadinimas</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {document.extractedData.pirkejas.pirkejo_imones_pavadinimas || 'Nenurodyta'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Įmonės kodas</p>
                    <p className="text-gray-900 dark:text-white">
                      {document.extractedData.pirkejas.pirkejo_imones_kodas || 'Nenurodyta'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">PVM kodas</p>
                    <p className="text-gray-900 dark:text-white">
                      {document.extractedData.pirkejas.pirkejo_pvm_kodas || 'Nenurodyta'}
                    </p>
                  </div>
                </div>
                {document.extractedData.pirkejas.pirkejo_adresas && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresas</p>
                    <p className="text-gray-900 dark:text-white">
                      {document.extractedData.pirkejas.pirkejo_adresas}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Items */}
          {document.extractedData.prekes && document.extractedData.prekes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prekės/Paslaugos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {document.extractedData.prekes.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="col-span-2 lg:col-span-1">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pavadinimas</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.pavadinimas || 'Nenurodyta'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Kiekis</p>
                          <p className="text-gray-900 dark:text-white">
                            {item.kiekis || 'Nenurodyta'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vieneto kaina</p>
                          <p className="text-gray-900 dark:text-white">
                            {item.vieneto_kaina ? formatCurrency(item.vieneto_kaina) : 'Nenurodyta'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Suma</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.suma ? formatCurrency(item.suma) : 'Nenurodyta'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Document Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Dokumento peržiūra</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {document.compressedUrl ? (
                <div className="relative">
                  <Image
                    src={document.compressedUrl}
                    alt={document.originalName}
                    width={600}
                    height={800}
                    className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Dokumento peržiūra nepasiekiama</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Information */}
          <Card>
            <CardHeader>
              <CardTitle>Failo informacija</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failo pavadinimas</p>
                <p className="text-gray-900 dark:text-white">{document.originalName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failo tipas</p>
                <Badge variant="outline">
                  {document.fileType.includes('pdf') ? 'PDF' : 'Vaizdas'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Įkelta</p>
                <p className="text-gray-900 dark:text-white">{formatDate(document.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paskutinį kartą atnaujinta</p>
                <p className="text-gray-900 dark:text-white">{formatDate(document.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
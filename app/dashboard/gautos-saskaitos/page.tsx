"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Search,
  Eye,
  Download,
  Plus,
  MoreHorizontal,
  Trash2
} from "lucide-react"
import Link from 'next/link'

interface ProcessedDocument {
  id: string
  originalName: string
  fileType: string
  compressedUrl: string
  extractedData: {
    ar_dokumentas_yra_saskaita?: string
    serija_ir_numeris?: string
    isdavimo_data?: string
    bendra_kaina?: string
    pardavejas?: {
      pardavejo_imones_pavadinimas?: string
      pardavejo_imones_kodas?: string
    }
    pirkejas?: {
      pirkejo_imones_pavadinimas?: string
    }
  }
  createdAt: string
  isDuplicate?: boolean
  isInvalidInvoice?: boolean
}

export default function ProcessedInvoicesPage() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<ProcessedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchDocuments()
    }
  }, [session])

  const checkForDuplicates = async (docs: ProcessedDocument[]) => {
    if (!session?.user?.id) {
      return docs
    }

    const updatedDocs = await Promise.all(
      docs.map(async (doc) => {
        // Check if it's a valid invoice (has required fields)
        const hasSellerCode = doc.extractedData.pardavejas?.pardavejo_imones_kodas
        const hasInvoiceNumber = doc.extractedData.serija_ir_numeris
        const isDocumentInvoice = doc.extractedData.ar_dokumentas_yra_saskaita
        
        // Mark as invalid if missing required fields or AI says it's not an invoice
        if (!hasSellerCode || !hasInvoiceNumber ||
            isDocumentInvoice === 'Nerasta' ||
            isDocumentInvoice === 'Ne' ||
            isDocumentInvoice === 'false' ||
            isDocumentInvoice === 'No') {
          return { ...doc, isInvalidInvoice: true }
        }

        // Check for duplicates
        try {
          const response = await fetch('/api/check-duplicate-invoice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sellerCode: hasSellerCode,
              invoiceNumber: hasInvoiceNumber,
              userId: session.user.id
            }),
          })

          if (response.ok) {
            const data = await response.json()
            // Only mark as duplicate if there's another invoice (not the same one)
            const isDuplicate = data.isDuplicate && data.duplicateInvoice?.id !== doc.id
            return { ...doc, isDuplicate }
          }
        } catch (error) {
          console.error('Error checking duplicate:', error)
        }

        return doc
      })
    )
    return updatedDocs
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/processed-documents')
      if (response.ok) {
        const data = await response.json()
        const docs = data.documents || []
        const docsWithDuplicateCheck = await checkForDuplicates(docs)
        setDocuments(docsWithDuplicateCheck)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDocument = async (id: string) => {
    if (!confirm('Ar tikrai norite ištrinti šį dokumentą?')) {
      return
    }

    setDeleting(id)
    try {
      const response = await fetch(`/api/processed-documents/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== id))
      } else {
        console.error('Failed to delete document')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    } finally {
      setDeleting(null)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    // Exclude documents that are not recognized as invoices
    const isDocumentInvoice = doc.extractedData.ar_dokumentas_yra_saskaita
    
    // Debug log to see what values we're getting
    if (isDocumentInvoice) {
      console.log('Document invoice status:', isDocumentInvoice, 'for document:', doc.originalName)
    }
    
    // Check for various forms of "not found" or "no" (case insensitive)
    if (isDocumentInvoice && typeof isDocumentInvoice === 'string') {
      const lowerValue = isDocumentInvoice.toLowerCase().trim()
      if (lowerValue === 'nerasta' ||
          lowerValue === 'ne' ||
          lowerValue === 'false' ||
          lowerValue === 'no' ||
          lowerValue === 'not found' ||
          lowerValue === 'nėra' ||
          lowerValue === 'nera' ||
          lowerValue.includes('nerasta') ||
          lowerValue.includes('not found')) {
        console.log('Filtering out document:', doc.originalName, 'with status:', isDocumentInvoice)
        return false // Don't show these documents in the list at all
      }
    }

    const matchesSearch = !searchTerm ||
      doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.extractedData.serija_ir_numeris?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.extractedData.pardavejas?.pardavejo_imones_pavadinimas?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDate = !dateFilter ||
      doc.extractedData.isdavimo_data?.includes(dateFilter)
    
    return matchesSearch && matchesDate
  })

  // Pagination calculations
  const totalItems = filteredDocuments.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('lt-LT')
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: string) => {
    return `€${parseFloat(amount || '0').toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gautos sąskaitos</h1>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gautos sąskaitos</h1>
          <p className="text-gray-600 dark:text-gray-400">Valdykite ir stebėkite gautos sąskaitas</p>
        </div>
        <Link href="/dashboard/gautos-saskaitos/ikelti">
          <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Įkelti naują sąskaitą
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
                placeholder="Ieškoti sąskaitų..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full lg:w-48 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
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
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Sąskaitų sąrašas ({totalItems})
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rodoma {startIndex + 1}-{Math.min(endIndex, totalItems)} iš {totalItems} sąskaitų
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nėra apdorotų dokumentų
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Pradėkite įkeldami savo pirmą sąskaitos faktūros dokumentą
              </p>
              <Link href="/dashboard/gautos-saskaitos/ikelti">
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Įkelti sąskaitą
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {currentDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/dashboard/gautos-saskaitos/${doc.id}`}
                  className="block"
                >
                  <div className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
                    doc.isDuplicate || doc.isInvalidInvoice
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                    <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.isDuplicate || doc.isInvalidInvoice
                        ? 'bg-red-600 dark:bg-red-500'
                        : 'bg-black dark:bg-white'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        doc.isDuplicate || doc.isInvalidInvoice
                          ? 'text-white'
                          : 'text-white dark:text-black'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className={`font-medium ${
                          doc.isDuplicate || doc.isInvalidInvoice
                            ? 'text-red-900 dark:text-red-200'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {doc.extractedData.serija_ir_numeris || doc.originalName}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {doc.fileType.includes('pdf') ? 'PDF' : 'IMG'}
                        </Badge>
                        {doc.isDuplicate && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800 text-xs">
                            Dublikatas
                          </Badge>
                        )}
                        {doc.isInvalidInvoice && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800 text-xs">
                            Neatpažinta sąskaita
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${
                        doc.isDuplicate || doc.isInvalidInvoice
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {doc.extractedData.pardavejas?.pardavejo_imones_pavadinimas || 'Nežinomas pardavėjas'}
                      </p>
                      <p className={`text-xs ${
                        doc.isDuplicate || doc.isInvalidInvoice
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        Sukurta: {formatDate(doc.createdAt)}
                        {doc.extractedData.isdavimo_data && ` • Išdavimo data: ${formatDate(doc.extractedData.isdavimo_data)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {doc.extractedData.bendra_kaina ? formatCurrency(doc.extractedData.bendra_kaina) : '€0.00'}
                      </p>
                      <Badge className="bg-black text-white border-black dark:bg-white dark:text-black dark:border-white">
                        Apdorota
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          window.open(`/dashboard/gautos-saskaitos/${doc.id}`, '_blank')
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          if (doc.compressedUrl) {
                            const link = window.document.createElement('a')
                            link.href = doc.compressedUrl
                            link.download = doc.originalName
                            link.click()
                          }
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          deleteDocument(doc.id)
                        }}
                        disabled={deleting === doc.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* View Invoices Button */}
          {currentDocuments.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href={`/dashboard/gautos-saskaitos/${currentDocuments[0].id}`}>
                <Button className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                  <Eye className="w-4 h-4 mr-2" />
                  Peržiūrėti sąskaitas
                </Button>
              </Link>
            </div>
          )}
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
    </div>
  )
}
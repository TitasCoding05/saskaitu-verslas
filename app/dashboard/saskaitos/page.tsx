"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Plus, Eye, Download, Send, MoreHorizontal, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function InvoicesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const invoices = [
    {
      id: "SF-2024-001",
      client: "UAB Technologijos",
      amount: "1,250.00",
      status: "Apmokėta",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      sent: true,
      opened: true,
    },
    {
      id: "SF-2024-002",
      client: "MB Konsultacijos",
      amount: "850.00",
      status: "Išsiųsta",
      date: "2024-01-18",
      dueDate: "2024-02-02",
      sent: true,
      opened: false,
    },
    {
      id: "SF-2024-003",
      client: "IĮ Dizainas",
      amount: "2,100.00",
      status: "Juodraštis",
      date: "2024-01-20",
      dueDate: "2024-02-05",
      sent: false,
      opened: false,
    },
    {
      id: "SF-2024-004",
      client: "UAB Statyba",
      amount: "3,200.00",
      status: "Pradelstas",
      date: "2024-01-10",
      dueDate: "2024-01-25",
      sent: true,
      opened: true,
    },
    {
      id: "SF-2024-005",
      client: "UAB Logistika",
      amount: "1,750.00",
      status: "Apmokėta",
      date: "2024-01-22",
      dueDate: "2024-02-06",
      sent: true,
      opened: true,
    },
    {
      id: "SF-2024-006",
      client: "MB Reklama",
      amount: "950.00",
      status: "Išsiųsta",
      date: "2024-01-25",
      dueDate: "2024-02-09",
      sent: true,
      opened: false,
    },
    {
      id: "SF-2024-007",
      client: "IĮ Fotografija",
      amount: "650.00",
      status: "Juodraštis",
      date: "2024-01-28",
      dueDate: "2024-02-12",
      sent: false,
      opened: false,
    },
    {
      id: "SF-2024-008",
      client: "UAB Prekyba",
      amount: "2,800.00",
      status: "Apmokėta",
      date: "2024-01-30",
      dueDate: "2024-02-14",
      sent: true,
      opened: true,
    },
    {
      id: "SF-2024-009",
      client: "MB Konsultacijos",
      amount: "1,200.00",
      status: "Išsiųsta",
      date: "2024-02-01",
      dueDate: "2024-02-16",
      sent: true,
      opened: true,
    },
    {
      id: "SF-2024-010",
      client: "UAB Technologijos",
      amount: "1,500.00",
      status: "Pradelstas",
      date: "2024-01-05",
      dueDate: "2024-01-20",
      sent: true,
      opened: true,
    },
    {
      id: "SF-2024-011",
      client: "IĮ Dizainas",
      amount: "890.00",
      status: "Apmokėta",
      date: "2024-02-03",
      dueDate: "2024-02-18",
      sent: true,
      opened: true,
    },
    {
      id: "SF-2024-012",
      client: "UAB Statyba",
      amount: "4,200.00",
      status: "Išsiųsta",
      date: "2024-02-05",
      dueDate: "2024-02-20",
      sent: true,
      opened: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Apmokėta":
        return "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
      case "Išsiųsta":
        return "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-black dark:border-gray-200"
      case "Juodraštis":
        return "bg-gray-400 text-white border-gray-400 dark:bg-gray-600 dark:text-white dark:border-gray-600"
      case "Pradelstas":
        return "bg-gray-600 text-white border-gray-600 dark:bg-gray-400 dark:text-black dark:border-gray-400"
      default:
        return "bg-gray-400 text-white border-gray-400 dark:bg-gray-600 dark:text-white dark:border-gray-600"
    }
  }

  // Pagination calculations
  const totalItems = invoices.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = invoices.slice(startIndex, endIndex)

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sąskaitos faktūros</h1>
          <p className="text-gray-600 dark:text-gray-400">Valdykite ir stebėkite savo sąskaitas faktūras</p>
        </div>
        <Link href="/dashboard/saskaitos/nauja">
          <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Nauja sąskaita
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
                className="pl-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full lg:w-48 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Statusas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visi statusai</SelectItem>
                <SelectItem value="paid">Apmokėta</SelectItem>
                <SelectItem value="sent">Išsiųsta</SelectItem>
                <SelectItem value="draft">Juodraštis</SelectItem>
                <SelectItem value="overdue">Pradelstas</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full lg:w-48 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Klientas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visi klientai</SelectItem>
                <SelectItem value="tech">UAB Technologijos</SelectItem>
                <SelectItem value="consult">MB Konsultacijos</SelectItem>
                <SelectItem value="design">IĮ Dizainas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <Calendar className="w-4 h-4 mr-2" />
              Data
            </Button>
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

      {/* Invoices List */}
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
          <div className="space-y-4">
            {currentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 dark:text-white">{invoice.id}</p>
                      {invoice.sent && (
                        <Badge variant="outline" className="text-xs">
                          {invoice.opened ? "Atidaryta" : "Išsiųsta"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.client}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Sukurta: {invoice.date} • Terminas: {invoice.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">€{invoice.amount}</p>
                    <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    {invoice.status === "Juodraštis" && (
                      <Button variant="ghost" size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    {invoice.status === "Išsiųsta" && (
                      <Button variant="ghost" size="sm" className="text-black dark:text-white">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
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
    </div>
  )
}

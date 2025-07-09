"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Send, Download } from "lucide-react"

interface InvoiceSummaryProps {
  subtotal: number
  totalVat: number
  total: number
}

export function InvoiceSummary({ 
  subtotal, 
  totalVat, 
  total 
}: InvoiceSummaryProps) {
  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mono-shadow-lg">
      <CardHeader>
        <CardTitle className="text-black dark:text-white text-lg">Sąskaitos suvestinė</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Totals */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Suma be PVM:</span>
            <span className="font-medium text-black dark:text-white">€{subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">PVM suma:</span>
            <span className="font-medium text-black dark:text-white">€{totalVat.toFixed(2).replace('.', ',')}</span>
          </div>
          <Separator className="bg-gray-200 dark:bg-gray-800" />
          <div className="flex justify-between text-lg font-bold">
            <span className="text-black dark:text-white">Iš viso:</span>
            <span className="text-black dark:text-white">€{total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-4 py-2">
            Juodraštis
          </Badge>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Sąskaita bus išsaugota kaip juodraštis
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
            <Send className="w-4 h-4 mr-2" />
            Išsiųsti klientui
          </Button>
          <Button variant="outline" className="w-full border-gray-200 dark:border-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Atsisiųsti PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
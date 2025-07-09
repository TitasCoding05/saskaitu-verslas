"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import DocumentHighlighter from '@/components/document-highlighter'
import { ProcessedInvoice } from "../types"

interface DocumentViewerProps {
  processedInvoice: ProcessedInvoice
  onDownload: () => void
}

export default function DocumentViewer({
  processedInvoice,
  onDownload
}: DocumentViewerProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Originalus dokumentas
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {processedInvoice.originalFile.name}
            </p>
          </div>
          <Button onClick={onDownload} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Atsisiųsti
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DocumentHighlighter
          documentUrl={processedInvoice.originalFile.dataUrl}
          coordinates={processedInvoice.coordinates || {}}
          hoveredField={null}
          className="w-full h-[800px]"
        />
      </CardContent>
    </Card>
  )
}
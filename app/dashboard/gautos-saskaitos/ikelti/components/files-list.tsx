"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, FileText, Trash2, Play, CheckCircle2 } from "lucide-react"
import { UploadedFile } from "../types"

interface FilesListProps {
  uploadedFiles: UploadedFile[]
  selectedFileId: string | null
  isAnalyzing: boolean
  onSelectFile: (fileId: string) => void
  onRemoveFile: (fileId: string) => void
  onAnalyzeAllFiles: () => void
  onUploadAllInvoices: () => void
  onMarkAsInvoice: (fileId: string) => void
  onMoveInvoiceToList: (fileId: string) => void
}

export default function FilesList({
  uploadedFiles,
  selectedFileId,
  isAnalyzing,
  onSelectFile,
  onRemoveFile,
  onAnalyzeAllFiles,
  onUploadAllInvoices,
  onMarkAsInvoice,
  onMoveInvoiceToList
}: FilesListProps) {
  // Helper function to check if a file is a valid invoice
  const isValidInvoice = (file: UploadedFile) => {
    if (!file.result?.data?.ar_dokumentas_yra_saskaita) return true // If not processed yet, assume valid
    const invoiceStatus = file.result.data.ar_dokumentas_yra_saskaita.toLowerCase().trim()
    return !(invoiceStatus === 'nerasta' ||
             invoiceStatus === 'ne' ||
             invoiceStatus === 'false' ||
             invoiceStatus === 'no' ||
             invoiceStatus === 'not found' ||
             invoiceStatus === 'nėra' ||
             invoiceStatus === 'nera' ||
             invoiceStatus.includes('nerasta') ||
             invoiceStatus.includes('not found'))
  }

  // Filter out non-invoice files from counts
  const validInvoiceFiles = uploadedFiles.filter(isValidInvoice)
  const pendingFilesCount = validInvoiceFiles.filter(f => f.status === 'pending').length
  const processingFilesCount = validInvoiceFiles.filter(f => f.status === 'processing').length
  const completedFilesCount = validInvoiceFiles.filter(f => f.status === 'completed').length
  const totalFiles = validInvoiceFiles.length
  const overallProgress = totalFiles > 0 ? (completedFilesCount / totalFiles) * 100 : 0
  
  // Calculate estimated time for overall progress
  const processingFiles = uploadedFiles.filter(f => f.status === 'processing')
  const averageTimeRemaining = processingFiles.length > 0
    ? processingFiles.reduce((sum, file) => sum + file.estimatedTime, 0) / processingFiles.length
    : 0
  const estimatedTimeForPending = pendingFilesCount * 15 // 15 seconds per file estimate
  const totalEstimatedTime = Math.round(averageTimeRemaining + estimatedTimeForPending)

  if (uploadedFiles.length === 0) {
    return null
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-black dark:text-white">
            Įkelti failai ({validInvoiceFiles.length})
          </CardTitle>
          {pendingFilesCount > 0 && (
            <Button
              onClick={onAnalyzeAllFiles}
              disabled={isAnalyzing}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analizuojama...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Analizuoti sąskaitas ({pendingFilesCount})
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Overall Progress */}
        {totalFiles > 0 && (processingFilesCount > 0 || completedFilesCount > 0) && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-black dark:text-gray-400">
              <span>Bendras progresas</span>
              <span>{Math.round(overallProgress)}% • {completedFilesCount} iš {totalFiles} baigta</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-black dark:bg-white h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            {totalEstimatedTime > 0 && (
              <div className="text-xs text-black dark:text-gray-400 text-center">
                Liko ~{totalEstimatedTime}s iki visiško apdorojimo
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {uploadedFiles.map((fileData) => {
            const isInvalidInvoice = !isValidInvoice(fileData)
            
            return (
              <div
                key={fileData.id}
                className={`p-4 border rounded-lg transition-all cursor-pointer ${
                  isInvalidInvoice
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                    : selectedFileId === fileData.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              onClick={() => {
                if (!isInvalidInvoice) {
                  onSelectFile(fileData.id)
                }
              }}
              style={{ cursor: isInvalidInvoice ? 'not-allowed' : 'pointer' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {fileData.file.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Status indicator */}
                  {fileData.status === 'pending' && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">Laukia</span>
                  )}
                  {fileData.status === 'processing' && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 text-black animate-spin" />
                      <span className="text-sm text-black dark:text-white">
                        {Math.round(fileData.progress)}% • ~{fileData.estimatedTime}s liko
                      </span>
                    </div>
                  )}
                  {fileData.status === 'completed' && !isInvalidInvoice && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          onMoveInvoiceToList(fileData.id)
                        }}
                        size="sm"
                        variant="outline"
                        className="text-xs h-6 px-2 bg-black text-white hover:bg-black hover:text-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
                      >
                        Perkelti į sąrašą
                      </Button>
                    </div>
                  )}
                  {fileData.status === 'completed' && isInvalidInvoice && (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded dark:bg-red-900 dark:text-red-200">
                        Ne sąskaita
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          onMarkAsInvoice(fileData.id)
                        }}
                        size="sm"
                        variant="outline"
                        className="text-xs h-6 px-2 bg-black text-white border border-green-500 hover:border-green-600 hover:bg-green-500 hover:text-white dark:bg-white dark:text-black dark:border-green-400 dark:hover:border-green-500 dark:hover:bg-green-300 dark:hover:text-black"
                      >
                        Pažymėti kaip sąskaitą
                      </Button>
                    </div>
                  )}
                  {fileData.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFile(fileData.id)
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Progress bar for processing files */}
              {fileData.status === 'processing' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${fileData.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-black dark:text-gray-400 text-center mt-1">
                    {fileData.progress < 30 && 'Skaitomas dokumentas...'}
                    {fileData.progress >= 30 && fileData.progress < 70 && 'AI analizuoja turinį...'}
                    {fileData.progress >= 70 && fileData.progress < 90 && 'Ištraukiama informacija...'}
                    {fileData.progress >= 90 && 'Baigiama apdoroti...'}
                  </div>
                </div>
              )}
              
              {/* Error message */}
              {fileData.status === 'error' && fileData.error && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                  <p className="text-sm text-red-800 dark:text-red-300">{fileData.error}</p>
                </div>
              )}
            </div>
            )
          })}
        </div>
        
        {/* Move All to List Button */}
        {completedFilesCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={onUploadAllInvoices}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Perkelti visas į sąrašą ({completedFilesCount})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
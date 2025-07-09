"use client"

import { Button } from "@/components/ui/button"
import { useDropzone } from 'react-dropzone'
import { ChevronLeft, ChevronRight, Upload, CheckCircle2 } from "lucide-react"
import { useUploadLogic } from './hooks/use-upload-logic'
import UploadArea from './components/upload-area'
import FilesList from './components/files-list'
import InvoiceDetails from './components/invoice-details'
import DocumentViewer from './components/document-viewer'

export default function UploadInvoicePage() {
  const {
    uploadedFiles,
    isAnalyzing,
    selectedFileId,
    isEditing,
    editedData,
    isSaving,
    // Removed showPreview
    onDrop,
    removeFile,
    analyzeAllFiles,
    resetUpload,
    selectFile,
    startEditing,
    cancelEditing,
    saveChanges,
    updateEditedField,
    downloadPDF,
    navigateToFile,
    uploadCurrentInvoice,
    uploadAllInvoices,
    markAsInvoice,
    selectedFile,
    currentFileIndex,
    totalFiles
  } = useUploadLogic()

  const { isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    disabled: isAnalyzing
  })

  return (
    <div className="space-y-6 max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Įkelti sąskaitas</h1>
          <p className="text-black dark:text-gray-400">Įkelkite sąskaitų faktūrų failus AI apdorojimui</p>
        </div>
        <div className="flex gap-2">
          {uploadedFiles.length > 0 && (
            <Button onClick={resetUpload} className="bg-black hover:bg-gray-800 text-white border-black">
              Išvalyti visus
            </Button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <UploadArea 
        onDrop={onDrop}
        isDragActive={isDragActive}
        isAnalyzing={isAnalyzing}
      />

      {/* Files List */}
      <FilesList
        uploadedFiles={uploadedFiles}
        selectedFileId={selectedFileId}
        isAnalyzing={isAnalyzing}
        onSelectFile={selectFile}
        onRemoveFile={removeFile}
        onAnalyzeAllFiles={analyzeAllFiles}
        onUploadAllInvoices={uploadAllInvoices}
        onMarkAsInvoice={markAsInvoice}
        onMoveInvoiceToList={uploadCurrentInvoice}
      />

      {/* Selected File Details */}
      {selectedFile && (
        <div className="space-y-4">
          {/* Navigation and Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
              {/* Navigation arrows */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigateToFile('prev')}
                  variant="outline"
                  size="sm"
                  disabled={totalFiles <= 1}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-black dark:text-white px-3">
                  {currentFileIndex + 1} / {totalFiles}
                </span>
                <Button
                  onClick={() => navigateToFile('next')}
                  variant="outline"
                  size="sm"
                  disabled={totalFiles <= 1}
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Document info */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-black dark:text-white">
                  {selectedFile.file.name}
                </span>
                {selectedFile.status === 'completed' && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
                {selectedFile.status === 'pending' && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Laukia analizės
                  </span>
                )}
                {selectedFile.status === 'processing' && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Analizuojama
                  </span>
                )}
                {selectedFile.status === 'error' && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Klaida
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Preview toggle */}
              {null}

              {/* Upload current invoice */}
              {selectedFile.status === 'completed' && (
                <Button
                  onClick={uploadCurrentInvoice}
                  className="bg-black hover:bg-gray-800 text-white"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Perkelti į sąrašą
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          {selectedFile.result && selectedFile.status === 'completed' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-none">
              {/* AI Extracted Information - Left Side */}
              <InvoiceDetails
                invoiceData={selectedFile.result.data}
                isEditing={isEditing}
                editedData={editedData}
                isSaving={isSaving}
                onStartEditing={startEditing}
                onCancelEditing={cancelEditing}
                onSaveChanges={saveChanges}
                onUpdateField={updateEditedField}
              />

              {/* Original File - Right Side */}
              <DocumentViewer
                processedInvoice={selectedFile.result}
                onDownload={downloadPDF}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}